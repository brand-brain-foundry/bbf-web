/**
 * BBF Lissajous 3D Motor — Wave 11.8-B
 *
 * Class-based motor Three.js. Transparent background default per D-BBF-WEB-QQ.
 * NO starfield ni background hardcoded — adopta surface canvas.
 *
 * Source ported from: public/assets/documents/BBF-Lissajous-3D/bbf-3d-motor.js
 * Refactored: ES module + TypeScript + class-based + start/stop lifecycle.
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import { lissajousPosition3D, lissajousColor } from '../math';
import { LISSAJOUS_3D_DEFAULTS } from './config';
import type { LissajousPreset3D, LissajousRuntimeOptions } from '../types';

export interface Lissajous3DMotorOptions extends LissajousRuntimeOptions {
  preset: LissajousPreset3D;
  container: HTMLElement;
}

export class Lissajous3DMotor {
  private container: HTMLElement;
  private preset: LissajousPreset3D;
  private speed: number;
  private scale: number;
  private numNodes: number;
  private nodeSize: number;
  private showCurve: boolean;
  private autoRotate: boolean;
  private bloom: boolean;

  private renderer: THREE.WebGLRenderer | null = null;
  private scene: THREE.Scene | null = null;
  private camera: THREE.PerspectiveCamera | null = null;
  private controls: OrbitControls | null = null;
  private nodeGroup: THREE.Group | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private resizeObserver: ResizeObserver | null = null;

  private rafId: number | null = null;
  private virtualT: number = 0;
  private lastTime: number = 0;
  private isPaused: boolean = false;

  constructor(options: Lissajous3DMotorOptions) {
    this.container = options.container;
    this.preset = options.preset;
    this.speed = options.speed ?? LISSAJOUS_3D_DEFAULTS.speed;
    this.scale = options.scale ?? LISSAJOUS_3D_DEFAULTS.scale;
    this.numNodes = options.numNodes ?? LISSAJOUS_3D_DEFAULTS.numNodes;
    this.nodeSize = options.nodeSize ?? LISSAJOUS_3D_DEFAULTS.nodeSize;
    this.showCurve = options.showCurve ?? LISSAJOUS_3D_DEFAULTS.showCurve;
    this.autoRotate = options.autoRotate ?? LISSAJOUS_3D_DEFAULTS.autoRotate;
    this.bloom = options.bloom ?? LISSAJOUS_3D_DEFAULTS.bloom;
  }

  public start(): void {
    this.buildScene();
    this.lastTime = performance.now();
    this.tick();
  }

  public stop(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
    if (this.renderer) {
      this.renderer.dispose();
    }
    if (this.canvas && this.canvas.parentElement) {
      this.canvas.parentElement.removeChild(this.canvas);
    }
    this.scene = null;
    this.camera = null;
    this.controls = null;
    this.nodeGroup = null;
    this.canvas = null;
    this.renderer = null;
  }

  public pause(): void {
    this.isPaused = true;
  }

  public resume(): void {
    this.isPaused = false;
    this.lastTime = performance.now();
  }

  // ─── private ────────────────────────────────────────────────────────────

  private buildScene(): void {
    this.canvas = document.createElement('canvas');
    this.canvas.style.cssText = `
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      display: block;
    `;
    this.container.appendChild(this.canvas);

    // alpha: true → transparent canon D-BBF-WEB-QQ
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
    });
    this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
    this.renderer.setClearColor(0x000000, 0); // fully transparent
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;

    // NO scene.background — transparent canon
    this.scene = new THREE.Scene();

    const { offsetWidth, offsetHeight } = this.container;
    this.camera = new THREE.PerspectiveCamera(48, offsetWidth / offsetHeight, 0.1, 100);
    this.camera.position.set(8, 6, 11);

    this.renderer.setSize(offsetWidth, offsetHeight);

    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.06;
    this.controls.autoRotate = this.autoRotate;
    this.controls.autoRotateSpeed = 0.65;
    this.controls.minDistance = 5;
    this.controls.maxDistance = 28;
    this.controls.enableZoom = false;

    // Lighting
    this.scene.add(new THREE.AmbientLight(0x303040, 0.55));
    this.scene.add(new THREE.HemisphereLight(0x88aaff, 0x331144, 0.45));
    const key = new THREE.DirectionalLight(0xffffff, 0.85);
    key.position.set(6, 12, 6);
    this.scene.add(key);
    const rim1 = new THREE.PointLight(0x66ccff, 1.2, 35);
    rim1.position.set(-7, -3, -6);
    this.scene.add(rim1);
    const rim2 = new THREE.PointLight(0xff9966, 1.0, 35);
    rim2.position.set(7, 0, -5);
    this.scene.add(rim2);

    // Curva guía
    if (this.showCurve) {
      const N = 1200;
      const curvePts: THREE.Vector3[] = [];
      const curveCols: number[] = [];
      for (let i = 0; i <= N; i++) {
        const t = (i / N) * 2 * Math.PI;
        const [x, y, z] = lissajousPosition3D(t, this.preset, this.scale);
        curvePts.push(new THREE.Vector3(x, y, z));
        const c = lissajousColor(i / N);
        const color = new THREE.Color().setHSL(c.h, c.s, c.l);
        curveCols.push(color.r, color.g, color.b);
      }
      const geomCurva = new THREE.BufferGeometry().setFromPoints(curvePts);
      geomCurva.setAttribute('color', new THREE.Float32BufferAttribute(curveCols, 3));
      const curva = new THREE.Line(
        geomCurva,
        new THREE.LineBasicMaterial({
          vertexColors: true,
          transparent: true,
          opacity: LISSAJOUS_3D_DEFAULTS.curveOpacity,
        }),
      );
      this.scene.add(curva);

      if (this.bloom) {
        const bloomLine = new THREE.Line(
          geomCurva.clone(),
          new THREE.LineBasicMaterial({
            vertexColors: true,
            transparent: true,
            opacity: LISSAJOUS_3D_DEFAULTS.bloomOpacity,
          }),
        );
        bloomLine.scale.set(1.001, 1.001, 1.001);
        this.scene.add(bloomLine);
      }
    }

    // Nodos
    this.nodeGroup = new THREE.Group();
    const sphereGeom = new THREE.SphereGeometry(this.nodeSize, 28, 18);
    for (let i = 0; i < this.numNodes; i++) {
      const c = lissajousColor(i / this.numNodes);
      const color = new THREE.Color().setHSL(c.h, c.s, c.l);
      const mat = new THREE.MeshStandardMaterial({
        color,
        metalness: 0.35,
        roughness: 0.22,
        emissive: color.clone().multiplyScalar(0.85),
        emissiveIntensity: 0.55,
      });
      const m = new THREE.Mesh(sphereGeom, mat);
      if (this.bloom) {
        const halo = new THREE.Mesh(
          new THREE.SphereGeometry(this.nodeSize * 2.0, 16, 12),
          new THREE.MeshBasicMaterial({
            color,
            transparent: true,
            opacity: 0.1,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
          }),
        );
        m.add(halo);
      }
      this.nodeGroup.add(m);
    }
    this.scene.add(this.nodeGroup);

    this.resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (this.camera && this.renderer) {
          this.camera.aspect = width / height;
          this.camera.updateProjectionMatrix();
          this.renderer.setSize(width, height);
        }
      }
    });
    this.resizeObserver.observe(this.container);
  }

  private tick = (): void => {
    this.rafId = requestAnimationFrame(this.tick);

    if (!this.scene || !this.camera || !this.renderer || !this.controls || !this.nodeGroup) {
      return;
    }

    const now = performance.now();
    const dt = Math.min(0.05, (now - this.lastTime) / 1000);
    this.lastTime = now;

    if (!this.isPaused) {
      this.virtualT += dt * this.speed;
    }

    const n = this.nodeGroup.children.length;
    for (let i = 0; i < n; i++) {
      const offset = (i / n) * 2 * Math.PI;
      const [x, y, z] = lissajousPosition3D(this.virtualT + offset, this.preset, this.scale);
      this.nodeGroup.children[i].position.set(x, y, z);
    }

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  };
}
