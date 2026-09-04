/**
 * brand-gradient/engine.ts — motor WebGL2 puro (D-SBWEB-BLOB-BRAND-01)
 *
 * Migración del `<script>` inline del asset madre (`public/assets/blob/
 * background-back/SB Blobs Background.html`, líneas 237-338: boilerplate de
 * shaders/programas/FBOs/loop) a módulo TS importable. Misma API mínima que
 * pide el despacho (`init`≈factory, `resize()`, `destroy()`) más
 * `pause()`/`resume()` — mismo contrato conceptual que `window.BlobScene`
 * (`BlobBackground.tsx`), API propia (motor distinto, A-01, no se fusionan).
 *
 * Bundleado directo (no `<script>` global): el motor pesa ~14KB fuente,
 * sin dependencia externa pesada (no hay Three.js aquí) que justifique
 * carga diferida vía script tag.
 *
 * Diferencia deliberada vs. el asset standalone: el asset dimensionaba el
 * canvas a `window.innerWidth/innerHeight` (asumía página fullscreen). Este
 * motor es un atom reutilizable que puede vivir en un contenedor que NO sea
 * pantalla completa (agnóstico, despacho decisión 5) — `resize()` mide el
 * propio canvas (`getBoundingClientRect`) en vez del viewport. La lógica de
 * render (shaders, espacio isotrópico responsive) es idéntica; solo cambia
 * QUÉ tamaño en px se le pide renderizar.
 */

import { BRAND_GRADIENT_DEFAULTS, type BrandGradientConfig } from './config';
import { buildBaseFragmentGLSL, buildBlurFragmentGLSL, buildFinalFragmentGLSL } from './shaders';

export interface BrandGradientEngine {
  /** Re-mide el canvas (`getBoundingClientRect`) y redimensiona los render targets. */
  resize(): void;
  /** Detiene el loop `requestAnimationFrame` (sin destruir el contexto WebGL). */
  pause(): void;
  /** Reanuda el loop. */
  resume(): void;
  /** Detiene el loop + libera el contexto WebGL (GPU memory). Instancia no reusable después. */
  destroy(): void;
}

const VERT = `#version 300 es
void main(){
  vec2 p = vec2((gl_VertexID<<1)&2, gl_VertexID&2);
  gl_Position = vec4(p*2.0-1.0, 0.0, 1.0);
}`;

interface RenderTarget {
  tex: WebGLTexture;
  fbo: WebGLFramebuffer;
  w: number;
  h: number;
}

/**
 * Crea el motor sobre un canvas dado. Devuelve `null` si WebGL2 no está
 * soportado (el atom consumidor decide el fallback — F-d).
 */
export function createBrandGradientEngine(
  canvas: HTMLCanvasElement,
  config: BrandGradientConfig = BRAND_GRADIENT_DEFAULTS,
): BrandGradientEngine | null {
  const glOrNull = canvas.getContext('webgl2', { antialias: false, alpha: false });
  if (!glOrNull) return null;
  // Re-bind: el narrowing de control-flow de `if (!x) return` no cruza closures
  // anidadas (`compile`/`resize`/`renderFrame` abajo) — `gl` declarado aquí ya
  // nace tipado `WebGL2RenderingContext` (no `| null`), sin ese problema.
  const gl: WebGL2RenderingContext = glOrNull;

  function compile(type: number, src: string): WebGLShader {
    const s = gl.createShader(type) as WebGLShader;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(s), src);
    }
    return s;
  }
  function program(fragSrc: string): WebGLProgram {
    const p = gl.createProgram() as WebGLProgram;
    gl.attachShader(p, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(p, compile(gl.FRAGMENT_SHADER, fragSrc));
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(p));
    }
    return p;
  }

  const pBase = program(buildBaseFragmentGLSL(config));
  const pBlur = program(buildBlurFragmentGLSL());
  const pFinal = program(buildFinalFragmentGLSL(config));
  const vao = gl.createVertexArray();

  function makeTarget(): RenderTarget {
    const tex = gl.createTexture() as WebGLTexture;
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    const fbo = gl.createFramebuffer() as WebGLFramebuffer;
    return { tex, fbo, w: 0, h: 0 };
  }
  function sizeTarget(t: RenderTarget, w: number, h: number): void {
    if (t.w === w && t.h === h) return;
    t.w = w;
    t.h = h;
    gl.bindTexture(gl.TEXTURE_2D, t.tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, t.fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, t.tex, 0);
  }

  const A = makeTarget();
  const B = makeTarget();

  const CW = config.comp.width;
  const CH = config.comp.height;
  const SCALE = config.scale;
  let W = 0;
  let H = 0;
  let bw = 0;
  let bh = 0;

  function resize(): void {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, config.dprClamp);
    W = Math.max(1, Math.round(rect.width * dpr));
    H = Math.max(1, Math.round(rect.height * dpr));
    canvas.width = W;
    canvas.height = H;
    bw = Math.max(2, Math.round(W * SCALE));
    bh = Math.max(2, Math.round(H * SCALE));
    sizeTarget(A, bw, bh);
    sizeTarget(B, bw, bh);
  }
  resize();

  function setCommon(p: WebGLProgram, w: number, h: number, time: number): void {
    gl.uniform2f(gl.getUniformLocation(p, 'uComp'), CW, CH);
    gl.uniform2f(gl.getUniformLocation(p, 'uRes'), w, h);
    gl.uniform1f(gl.getUniformLocation(p, 'uTime'), time);
  }

  const t0 = performance.now();
  let rafId: number | null = null;

  function renderFrame(): void {
    const time = (performance.now() - t0) / 1000;
    gl.bindVertexArray(vao);

    // 1 · blob layer
    gl.bindFramebuffer(gl.FRAMEBUFFER, A.fbo);
    gl.viewport(0, 0, bw, bh);
    gl.useProgram(pBase);
    setCommon(pBase, bw, bh, time);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    // 2/3 · gaussian (comp px) -> render-target px
    const sigma = Math.max(1.0, config.blur.sigma * (bw / CW));
    const blurPass = (src: RenderTarget, dst: RenderTarget, dx: number, dy: number) => {
      gl.bindFramebuffer(gl.FRAMEBUFFER, dst.fbo);
      gl.viewport(0, 0, bw, bh);
      gl.useProgram(pBlur);
      setCommon(pBlur, bw, bh, time);
      gl.uniform2f(gl.getUniformLocation(pBlur, 'uDir'), dx, dy);
      gl.uniform1f(gl.getUniformLocation(pBlur, 'uSigma'), sigma);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, src.tex);
      gl.uniform1i(gl.getUniformLocation(pBlur, 'uTex'), 0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    blurPass(A, B, 1, 0);
    blurPass(B, A, 0, 1);

    // 4 · fading zoom + composite + grade + noise
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, W, H);
    gl.useProgram(pFinal);
    setCommon(pFinal, W, H, time);
    gl.uniform2f(
      gl.getUniformLocation(pFinal, 'uBlurCenter'),
      config.radialBlur.center.x,
      config.radialBlur.center.y,
    );
    gl.uniform1f(gl.getUniformLocation(pFinal, 'uAmount'), config.radialBlur.amount);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, A.tex);
    gl.uniform1i(gl.getUniformLocation(pFinal, 'uTex'), 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  function tick(): void {
    renderFrame();
    rafId = requestAnimationFrame(tick);
  }
  function start(): void {
    if (rafId === null) rafId = requestAnimationFrame(tick);
  }
  function stop(): void {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }
  start();

  return {
    resize,
    pause: stop,
    resume: start,
    destroy() {
      // No `WEBGL_lose_context.loseContext()` aquí: un <canvas> solo puede
      // bindear UN contexto en su vida entera — `getContext('webgl2')`
      // siempre devuelve el MISMO objeto, incluso ya perdido. React
      // StrictMode (dev) monta→limpia→monta sobre el mismo nodo canvas (no
      // lo recrea); forzar loseContext() aquí deja ese contexto muerto para
      // el remount siguiente → getShaderInfoLog=null en todos los shaders
      // (contexto perdido, no error de GLSL). Detener el rAF loop basta: el
      // contexto real se libera solo cuando el canvas se remueve del DOM.
      stop();
    },
  };
}
