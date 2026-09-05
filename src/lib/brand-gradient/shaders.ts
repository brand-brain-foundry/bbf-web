/**
 * brand-gradient/shaders.ts — GLSL puro, sin estado (D-SBWEB-BLOB-BRAND-01)
 *
 * Genera el source de los 3 programas del asset madre (`FRAG_BASE`,
 * `FRAG_BLUR`, `FRAG_FINAL`) a partir de `BRAND_GRADIENT_DEFAULTS`. La
 * LÓGICA de render (SDF de elipses, `smin`, blend 4-color `g4()`, gaussiano
 * separable, fading-zoom, grade, noise) es una migración SIN CAMBIOS del
 * asset (`public/assets/blob/background-back/SB Blobs Background.html`,
 * líneas 46-235) — solo los NÚMEROS antes hardcodeados en el template string
 * ahora vienen de `config`/`tokens`. Con `BRAND_GRADIENT_DEFAULTS` el string
 * generado es equivalente al del asset (mismos valores, formateo GLSL).
 */

import { BRAND_TOKENS, type BrandToken } from './tokens';
import type { BrandGradientConfig, GradientStop, SinusoidTerm } from './config';

// ── helpers de formato GLSL ──────────────────────────────────────────────

/** Literal float GLSL — siempre con punto decimal (`150` → `150.0`). */
function f(n: number): string {
  return Number.isInteger(n) ? `${n}.0` : `${n}`;
}

/** Suma de senoidales — reconstruye `sin(t*0.42)*150.0 + sin(t*0.19)*80.0`. */
function driftExpr(terms: readonly SinusoidTerm[]): string {
  return terms.map((t) => `${t.fn}(t*${f(t.freq)})*${f(t.amp)}`).join(' + ');
}

function vec3Token(token: BrandToken): string {
  const [r, g, b] = BRAND_TOKENS[token].rgb;
  return `vec3(${f(r)}, ${f(g)}, ${f(b)})`;
}

/** `g4(q, anchor(p1), c1, anchor(p2), c2, anchor(p3), c3, anchor(p4), c4)` */
function g4Call(qExpr: string, stops: readonly GradientStop[]): string {
  const args = stops
    .map((s) => `anchor(vec2(${f(s.point.x)}, ${f(s.point.y)})), ${vec3Token(s.token)}`)
    .join(',\n    ');
  return `g4(${qExpr},\n    ${args})`;
}

// ── COMMON — helpers compartidos por los 3 programas ─────────────────────
// Migración sin cambios del asset (líneas 54-93): espacio responsive
// isotrópico (`P`/`uw`/`anchor`/`coverK`), blend 4-color AE (`g4`), `luma`.

function buildCommonGLSL(): string {
  return `
precision highp float;
uniform vec2 uComp;      // 1920,1080
uniform vec2 uRes;       // render target size in px
uniform float uTime;

/* Responsive space. Everything is authored in AE comp px but evaluated in a
   width-normalised ISOTROPIC space: x spans 0..1 across the viewport, y spans
   0..(H/W). Points anchor to viewport FRACTIONS (so the composition holds on
   any aspect) while lengths stay circular (no stretching). coverK grows the
   lobes on tall screens so they still fill and merge.                       */
vec2 P(vec2 frag){
  vec2 uv = frag / uRes;
  return vec2(uv.x, (1.0 - uv.y) * (uRes.y / uRes.x));
}
float uw(float compPx){ return compPx / uComp.x; }          // length -> width units
vec2 anchor(vec2 compPt){                                    // point -> viewport fraction
  return vec2(compPt.x / uComp.x,
              (compPt.y / uComp.y) * (uRes.y / uRes.x));
}
float coverK(){
  float h = uRes.y / uRes.x;                 // viewport height in width units
  float base = uComp.y / uComp.x;            // 0.5625 for the 16:9 comp
  return pow(max(1.0, h / base), 0.7);
}
vec3 g4(vec2 q, vec2 p1, vec3 c1, vec2 p2, vec3 c2, vec2 p3, vec3 c3, vec2 p4, vec3 c4){
  // NOTE: epsilon is in normalised (width) units squared — matching the 1.0 the
  // comp-pixel version used, so the inverse-square falloff still shapes the
  // blend instead of flattening it to a four-colour average.
  const float E = 1e-6;
  vec2 d1=q-p1, d2=q-p2, d3=q-p3, d4=q-p4;
  float w1=1.0/(dot(d1,d1)+E);
  float w2=1.0/(dot(d2,d2)+E);
  float w3=1.0/(dot(d3,d3)+E);
  float w4=1.0/(dot(d4,d4)+E);
  float s=w1+w2+w3+w4;
  return (c1*w1 + c2*w2 + c3*w3 + c4*w4)/s;
}
float luma(vec3 c){ return dot(c, vec3(0.2126, 0.7152, 0.0722)); }
`;
}

// ── Pass 1 · blob layer (SDF x 4-color gradient) ──────────────────────────

export function buildBaseFragmentGLSL(config: BrandGradientConfig): string {
  const [l0, l1, l2, l3] = config.lobes;
  const { br, br2 } = config.breatheSignals;

  return `#version 300 es
${buildCommonGLSL()}
out vec4 O;

// ellipse SDF in comp px (approximate, adequate for soft blobs)
float sdEllipse(vec2 q, vec2 c, vec2 r){
  vec2 d = (q - c) / r;
  return (length(d) - 1.0) * min(r.x, r.y);
}
float smin(float a, float b, float k){
  float h = clamp(0.5 + 0.5*(b-a)/k, 0.0, 1.0);
  return mix(b, a, h) - k*h*(1.0-h);
}

void main(){
  vec2 q = P(gl_FragCoord.xy);
  float t = uTime;
  float k = coverK();

  // Shape Layer 3 — four large lobes; the dark channels are the gaps between
  // them. Centres drift slowly so the background breathes.
  // lobes anchored to viewport fractions; drift is isotropic (width units)
  vec2 c1 = anchor(vec2(${f(l0.anchor.x)}, ${f(l0.anchor.y)})) + vec2(uw(${driftExpr(l0.drift.x)}), uw(${driftExpr(l0.drift.y)}));
  vec2 c2 = anchor(vec2(${f(l1.anchor.x)}, ${f(l1.anchor.y)})) + vec2(uw(${driftExpr(l1.drift.x)}), uw(${driftExpr(l1.drift.y)}));
  vec2 c3 = anchor(vec2(${f(l2.anchor.x)}, ${f(l2.anchor.y)})) + vec2(uw(${driftExpr(l2.drift.x)}), uw(${driftExpr(l2.drift.y)}));
  vec2 c4 = anchor(vec2(${f(l3.anchor.x)}, ${f(l3.anchor.y)})) + vec2(uw(${driftExpr(l3.drift.x)}), uw(${driftExpr(l3.drift.y)}));

  // radii breathe too, so the lobes swell and shrink as they drift
  float br  = k * (1.0 + ${f(br.amp)} * ${br.fn}(t * ${f(br.freq)}));
  float br2 = k * (1.0 + ${f(br2.amp)} * ${br2.fn}(t * ${f(br2.freq)}));

  float d = sdEllipse(q, c1, vec2(uw(${f(l0.radius.x)}), uw(${f(l0.radius.y)})) * ${l0.breathe});
  d = smin(d, sdEllipse(q, c2, vec2(uw(${f(l1.radius.x)}), uw(${f(l1.radius.y)})) * ${l1.breathe}), uw(${f(l1.smoothK as number)})*k);
  d = smin(d, sdEllipse(q, c3, vec2(uw(${f(l2.radius.x)}), uw(${f(l2.radius.y)})) * ${l2.breathe}), uw(${f(l2.smoothK as number)})*k);
  d = smin(d, sdEllipse(q, c4, vec2(uw(${f(l3.radius.x)}), uw(${f(l3.radius.y)})) * ${l3.breathe}), uw(${f(l3.smoothK as number)})*k);

  // soft edge, but tight enough that the lobe boundaries still read as forms
  float a = smoothstep(uw(${f(config.edgeSoft.inner)})*k, uw(${f(config.edgeSoft.outer)})*k, d);

  vec3 col = ${g4Call('q', config.stops.shape)};

  O = vec4(col * a, a);   // premultiplied, so blurs stay halo-free
}`;
}

// ── Pass 2/3 · separable gaussian (AE Blurriness, repeat edge pixels) ────
// Migración sin cambios (asset líneas 144-167) — uSigma llega como uniform
// (computado en engine.ts desde `config.blur.sigma`), no hay número que
// cablear aquí.

export function buildBlurFragmentGLSL(): string {
  return `#version 300 es
${buildCommonGLSL()}
uniform sampler2D uTex;
uniform vec2 uDir;       // (1,0) or (0,1)
uniform float uSigma;    // in render-target px
out vec4 O;

void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 texel = 1.0 / uRes;
  vec4 sum = texture(uTex, uv);
  float wsum = 1.0;
  // 8 linear-sampled taps per side
  for(int i=1;i<=8;i++){
    float o = float(i) * 1.5;
    float w = exp(-0.5 * (o*o) / (uSigma*uSigma));
    vec2 off = uDir * texel * o * uSigma * 0.5;
    sum += texture(uTex, uv + off) * w;
    sum += texture(uTex, uv - off) * w;
    wsum += 2.0 * w;
  }
  O = sum / wsum;
}`;
}

// ── Pass 4 · CC Radial Blur (Fading Zoom) + composite + grade + noise ────

export function buildFinalFragmentGLSL(config: BrandGradientConfig): string {
  return `#version 300 es
${buildCommonGLSL()}
uniform sampler2D uTex;
uniform vec2 uBlurCenter;   // comp px
uniform float uAmount;      // normalised zoom reach
out vec4 O;

float hash(vec3 p){
  p = fract(p * 0.1031);
  p += dot(p, p.zyx + 31.32);
  return fract((p.x + p.y) * p.z);
}

void main(){
  vec2 frag = gl_FragCoord.xy;
  vec2 uv = frag / uRes;
  vec2 q = P(frag);

  // centre of the zoom as a viewport fraction -> same relative spot everywhere
  vec2 cuv = vec2(uBlurCenter.x / uComp.x, 1.0 - uBlurCenter.y / uComp.y);

  // Fading Zoom: samples march back toward the centre, their weight fading
  // with distance travelled -> streaks that dissolve outward.
  const int TAPS = ${Math.trunc(config.radialBlur.taps)};
  vec4 acc = vec4(0.0);
  float wsum = 0.0;
  for(int i=0;i<TAPS;i++){
    float t = float(i) / float(TAPS-1);
    float scale = 1.0 - t * uAmount;
    vec2 suv = cuv + (uv - cuv) * scale;
    float w = 1.0 - t * ${f(config.radialBlur.fade)};                  // the "fading" part
    acc += texture(uTex, suv) * w;
    wsum += w;
  }
  vec4 blob = acc / wsum;

  // ── Layer "Blob 2": background 4-colour gradient (blue / black / navy) ──
  vec3 bg = ${g4Call('q', config.stops.background)};

  vec3 col = bg * (1.0 - blob.a) + blob.rgb;          // premultiplied over

  // ── Adjustment Layer 1: 4-colour gradient, applied as a colour grade ────
  vec3 adj = ${g4Call('q', config.stops.adjustment)};

  float lb = luma(col), la = max(luma(adj), 0.001);
  vec3 graded = clamp(adj * (lb / la), 0.0, 1.0);
  col = mix(col, graded, ${f(config.grade.mix)});

  // ── Noise, colour noise, clip result values ─────────────────────────────
  float tq = floor(uTime * ${f(config.noise.rate)});
  vec3 n = vec3(
    hash(vec3(frag, tq)),
    hash(vec3(frag + 137.31, tq + 57.0)),
    hash(vec3(frag + 311.7, tq + 113.0)));
  col = clamp(col + (n - 0.5) * ${f(config.noise.amount)}, 0.0, 1.0);

  O = vec4(col, 1.0);
}`;
}
