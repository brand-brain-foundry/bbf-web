/**
 * BBF Lissajous 2D Motor — Wave 11.8-B
 *
 * Class-based motor SVG-rendered. Transparent default per D-BBF-WEB-QQ.
 * NO background hardcoded — surface debajo se ve directo.
 *
 * Source ported from: public/assets/documents/efecto-3/bbf-motor.js
 * Refactored: ES module + TypeScript + class-based + start/stop lifecycle.
 */

import { lissajous2DPath, lissajousPosition2D } from '../math';
import { LISSAJOUS_2D_DEFAULTS } from './config';
import type { LissajousPreset2D, LissajousRuntimeOptions } from '../types';

const SVG_NS = 'http://www.w3.org/2000/svg';

export interface Lissajous2DMotorOptions extends LissajousRuntimeOptions {
  preset: LissajousPreset2D;
  container: HTMLElement;
  animation?: 'traveling' | 'static' | 'point-center' | 'traveling-dot';
}

export class Lissajous2DMotor {
  private container: HTMLElement;
  private preset: LissajousPreset2D;
  private speed: number;
  private radius: number;
  private resolution: number;
  private curveWidth: number;
  private dotRadius: number;
  private colorMode: 'surface' | 'gradient-primary';

  private readonly gradientId: string;
  private svg: SVGSVGElement | null = null;
  private pathEl: SVGPathElement | null = null;
  private dotEl: SVGCircleElement | null = null;
  private gradientEl: SVGLinearGradientElement | null = null;
  private rafId: number | null = null;
  private startTime: number = 0;
  private isPaused: boolean = false;
  private animation: 'traveling' | 'static' | 'point-center' | 'traveling-dot';

  constructor(options: Lissajous2DMotorOptions) {
    this.container = options.container;
    this.preset = options.preset;
    this.speed = options.speed ?? LISSAJOUS_2D_DEFAULTS.speed;
    this.radius = options.scale ?? LISSAJOUS_2D_DEFAULTS.radius;
    this.resolution = LISSAJOUS_2D_DEFAULTS.resolution;
    this.curveWidth = LISSAJOUS_2D_DEFAULTS.curveWidth;
    this.dotRadius = LISSAJOUS_2D_DEFAULTS.dotRadius;
    this.colorMode = options.colorMode ?? LISSAJOUS_2D_DEFAULTS.colorMode;
    this.animation = options.animation ?? 'traveling';
    this.gradientId = `bbf-lis-g-${Math.random().toString(36).slice(2, 9)}`;
  }

  /**
   * Inicializa SVG + arranca loop.
   */
  public start(): void {
    this.buildSVG();
    if (this.animation === 'static' || this.animation === 'point-center') {
      const pathD = lissajous2DPath(this.preset, this.radius, this.resolution, 0);
      this.pathEl?.setAttribute('d', pathD);
      if (this.animation === 'point-center') {
        this.appendCenterDot();
      }
      return;
    }
    if (this.animation === 'traveling-dot') {
      this.appendTravelingDot();
    }
    this.startTime = performance.now();
    this.tick();
  }

  /**
   * Detiene loop + remueve SVG del DOM.
   */
  public stop(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    if (this.svg && this.svg.parentElement) {
      this.svg.parentElement.removeChild(this.svg);
    }
    this.svg = null;
    this.pathEl = null;
    this.dotEl = null;
    this.gradientEl = null;
  }

  /**
   * Pausa loop (preserva estado).
   */
  public pause(): void {
    this.isPaused = true;
  }

  /**
   * Reanuda loop.
   */
  public resume(): void {
    this.isPaused = false;
  }

  // ─── private ────────────────────────────────────────────────────────────

  /**
   * SVG linearGradient SSOT: mismos tokens que --bbf-gradient-primary (semantic/gradients.css).
   * Usa --bbf-color-blue-accent / --bbf-color-blue-accent-deep (Tier-1, colors-dark.css).
   * Rotación animada en tick() a 45°/s (8s por vuelta ≈ bbf-motion-duration-gradient-slow).
   */
  private buildGradient(): void {
    if (!this.svg) return;
    const vb = LISSAJOUS_2D_DEFAULTS.radius * 2 + LISSAJOUS_2D_DEFAULTS.viewBoxPad; // 340
    const cy = vb / 2; // 170 — centro vertical del viewBox

    const defs = document.createElementNS(SVG_NS, 'defs');
    const grad = document.createElementNS(SVG_NS, 'linearGradient') as SVGLinearGradientElement;
    grad.id = this.gradientId;
    grad.setAttribute('gradientUnits', 'userSpaceOnUse');
    grad.setAttribute('x1', '0');
    grad.setAttribute('y1', String(cy));
    grad.setAttribute('x2', String(vb));
    grad.setAttribute('y2', String(cy));

    const stops: [string, string][] = [
      ['0%', 'var(--bbf-color-blue-accent)'],
      ['50%', 'var(--bbf-color-blue-accent-deep)'],
      ['100%', 'var(--bbf-color-blue-accent)'],
    ];
    for (const [offset, color] of stops) {
      const stop = document.createElementNS(SVG_NS, 'stop');
      stop.setAttribute('offset', offset);
      stop.style.stopColor = color;
      grad.appendChild(stop);
    }

    defs.appendChild(grad);
    this.svg.insertBefore(defs, this.svg.firstChild);
    this.gradientEl = grad;
  }

  private buildSVG(): void {
    const viewBox = LISSAJOUS_2D_DEFAULTS.radius * 2 + LISSAJOUS_2D_DEFAULTS.viewBoxPad;
    const center = viewBox / 2;

    this.svg = document.createElementNS(SVG_NS, 'svg') as SVGSVGElement;
    this.svg.setAttribute('viewBox', `0 0 ${viewBox} ${viewBox}`);
    this.svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    this.svg.style.cssText = `
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      display: block;
    `;

    if (this.colorMode === 'gradient-primary') {
      this.buildGradient();
    }

    const group = document.createElementNS(SVG_NS, 'g');
    group.setAttribute('transform', `translate(${center}, ${center})`);

    this.pathEl = document.createElementNS(SVG_NS, 'path') as SVGPathElement;
    this.pathEl.setAttribute('fill', 'none');
    this.pathEl.setAttribute(
      'stroke',
      this.colorMode === 'gradient-primary' ? `url(#${this.gradientId})` : 'currentColor',
    );
    this.pathEl.setAttribute('stroke-width', String(this.curveWidth));
    this.pathEl.setAttribute('stroke-linecap', 'round');
    this.pathEl.setAttribute('stroke-linejoin', 'round');

    group.appendChild(this.pathEl);
    this.svg.appendChild(group);
    this.container.appendChild(this.svg);
  }

  private appendTravelingDot(): void {
    if (!this.svg) return;
    const group = this.svg.querySelector('g');
    if (!group) return;
    const dot = document.createElementNS(SVG_NS, 'circle');
    dot.setAttribute('cx', '0');
    dot.setAttribute('cy', '0');
    dot.setAttribute('r', String(this.dotRadius));
    if (this.colorMode === 'gradient-primary') {
      dot.style.fill = 'var(--bbf-color-blue-accent)';
    } else {
      dot.setAttribute('fill', 'currentColor');
    }
    this.dotEl = dot as SVGCircleElement;
    group.appendChild(dot);
  }

  private appendCenterDot(): void {
    if (!this.svg) return;
    const group = this.svg.querySelector('g');
    if (!group) return;
    const dot = document.createElementNS(SVG_NS, 'circle');
    dot.setAttribute('cx', '0');
    dot.setAttribute('cy', '0');
    dot.setAttribute('r', String(this.dotRadius));
    if (this.colorMode === 'gradient-primary') {
      dot.style.fill = 'var(--bbf-color-blue-accent)';
    } else {
      dot.setAttribute('fill', 'currentColor');
    }
    group.appendChild(dot);
  }

  private tick = (): void => {
    if (!this.isPaused && this.pathEl) {
      const elapsed = (performance.now() - this.startTime) / 1000;
      const delta = elapsed * this.speed * Math.PI * 2;
      const pathD = lissajous2DPath(this.preset, this.radius, this.resolution, delta);
      this.pathEl.setAttribute('d', pathD);
      if (this.animation === 'traveling-dot' && this.dotEl) {
        const [x, y] = lissajousPosition2D(delta % (Math.PI * 2), this.preset, this.radius, 0);
        this.dotEl.setAttribute('cx', x.toFixed(2));
        this.dotEl.setAttribute('cy', y.toFixed(2));
      }
      if (this.colorMode === 'gradient-primary' && this.gradientEl) {
        const vb = LISSAJOUS_2D_DEFAULTS.radius * 2 + LISSAJOUS_2D_DEFAULTS.viewBoxPad;
        const cx = vb / 2; // 170
        const angleDeg = (elapsed * 45) % 360; // 45°/s → 8s por vuelta completa
        this.gradientEl.setAttribute(
          'gradientTransform',
          `rotate(${angleDeg.toFixed(1)}, ${cx}, ${cx})`,
        );
      }
    }
    this.rafId = requestAnimationFrame(this.tick);
  };
}
