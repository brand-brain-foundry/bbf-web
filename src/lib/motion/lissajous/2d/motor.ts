/**
 * BBF Lissajous 2D Motor — Wave 11.8-B
 *
 * Class-based motor SVG-rendered. Transparent default per D-BBF-WEB-QQ.
 * NO background hardcoded — surface debajo se ve directo.
 *
 * Source ported from: public/assets/documents/efecto-3/bbf-motor.js
 * Refactored: ES module + TypeScript + class-based + start/stop lifecycle.
 */

import { lissajous2DPath } from '../math';
import { LISSAJOUS_2D_DEFAULTS } from './config';
import type { LissajousPreset2D, LissajousRuntimeOptions } from '../types';

const SVG_NS = 'http://www.w3.org/2000/svg';

export interface Lissajous2DMotorOptions extends LissajousRuntimeOptions {
  preset: LissajousPreset2D;
  container: HTMLElement;
  animation?: 'traveling' | 'static' | 'point-center';
}

export class Lissajous2DMotor {
  private container: HTMLElement;
  private preset: LissajousPreset2D;
  private speed: number;
  private radius: number;
  private resolution: number;

  private svg: SVGSVGElement | null = null;
  private pathEl: SVGPathElement | null = null;
  private rafId: number | null = null;
  private startTime: number = 0;
  private isPaused: boolean = false;
  private animation: 'traveling' | 'static' | 'point-center';

  constructor(options: Lissajous2DMotorOptions) {
    this.container = options.container;
    this.preset = options.preset;
    this.speed = options.speed ?? LISSAJOUS_2D_DEFAULTS.speed;
    this.radius = options.scale ?? LISSAJOUS_2D_DEFAULTS.radius;
    this.resolution = LISSAJOUS_2D_DEFAULTS.resolution;
    this.animation = options.animation ?? 'traveling';
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

  private buildSVG(): void {
    const viewBox = LISSAJOUS_2D_DEFAULTS.radius * 2 + 60;
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

    const group = document.createElementNS(SVG_NS, 'g');
    group.setAttribute('transform', `translate(${center}, ${center})`);

    this.pathEl = document.createElementNS(SVG_NS, 'path') as SVGPathElement;
    this.pathEl.setAttribute('fill', 'none');
    this.pathEl.setAttribute('stroke', 'currentColor');
    this.pathEl.style.strokeWidth = 'var(--bbf-lissajous-stroke-default, 1.5)';
    this.pathEl.setAttribute('stroke-linecap', 'round');
    this.pathEl.setAttribute('stroke-linejoin', 'round');

    group.appendChild(this.pathEl);
    this.svg.appendChild(group);
    this.container.appendChild(this.svg);
  }

  private appendCenterDot(): void {
    if (!this.svg) return;
    const group = this.svg.querySelector('g');
    if (!group) return;
    const dot = document.createElementNS(SVG_NS, 'circle');
    dot.setAttribute('cx', '0');
    dot.setAttribute('cy', '0');
    dot.setAttribute('r', '6');
    dot.setAttribute('fill', 'currentColor');
    group.appendChild(dot);
  }

  private tick = (): void => {
    if (!this.isPaused && this.pathEl) {
      const elapsed = (performance.now() - this.startTime) / 1000;
      const delta = elapsed * this.speed * Math.PI * 2;
      const pathD = lissajous2DPath(this.preset, this.radius, this.resolution, delta);
      this.pathEl.setAttribute('d', pathD);
    }
    this.rafId = requestAnimationFrame(this.tick);
  };
}
