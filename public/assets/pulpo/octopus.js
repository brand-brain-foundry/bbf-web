/*!
 * Pulpo Pixel — mascota de página en pixel-art (JavaScript vanilla, sin dependencias)
 * ---------------------------------------------------------------------------------
 * Un pequeño pulpo que nada por los huecos vacíos de la pantalla, rodea el contenido
 * (nunca pasa por encima de texto/imágenes), sigue el cursor/touch manteniendo una
 * distancia respetuosa (jamás tapa el elemento que vas a pulsar) y suelta tinta al clic.
 *
 * D-BBF-PULPO — motor portado ÍNTEGRO desde tmp/pulpo-pixel/octopus.js (A-02: sin
 * reescribir lógica). Colores por defecto mapeados a tokens canon BBF (R-BBF-DS-03 —
 * Canvas 2D no puede leer CSS vars, hex documentado con su equivalencia). Params
 * puramente numéricos de comportamiento (gap/margin/scale/speed/dpr/intervalo) NO
 * llevan token — mismo criterio que blob-intents.ts (src/lib/blob/blob-intents.ts).
 * Montado vía src/components/atoms/PulpoPixel/PulpoPixel.tsx (gate de capacidad +
 * defer post-LCP ahí, no aquí — este archivo es el motor agnóstico).
 *
 * Uso rápido:
 *   <script src="octopus.js" data-auto data-accent="#255ff1"></script>
 * o por código:
 *   const pet = OctopusPet.init({ accent: '#255ff1', speed: 1 });
 *
 * Marca los elementos que NO debe pisar con el atributo  data-oct-obstacle.
 * Consulta INSTRUCCIONES.md (tmp/pulpo-pixel/) para la API completa y buenas prácticas.
 */
(function () {
  'use strict';

  var HEAD = [
    "...BBBBBBBBB...",
    "..BBBBBBBBBBB..",
    ".BBBBBBBBBBBBB.",
    "BBBBBBBBBBBBBBB",
    "BBBBBBBBBBBBBBB",
    "BBBEEBBBBBEEBBB",
    "BBBEEBBBBBEEBBB",
    "BBBBBBBBBBBBBBB",
    "BBBBBBBBBBBBBBB",
    ".BBBBBBBBBBBBB.",
    "..BBBBBBBBBBB.."
  ];
  var HW = 15, HH = 11, HCX = 7, HCY = 5;

  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }

  function OctopusPet(opts) {
    opts = opts || {};
    this.accent = opts.accent || '#255ff1';        // --bbf-accent-blue (canon blue post-rebrand, D-REBRAND-01) — color del cuerpo
    this.eyeColor = opts.eyeColor || '#ebe3d4';    // --bbf-color-sand-deep-shade — color de los ojos
    this.inkColor = opts.inkColor || '#1a1a1a';    // --bbf-color-black-600 (D1: Opción A) — tinta
    this.inkColor2 = opts.inkColor2 || '#1a1a1a';  // --bbf-color-black-600 (D1: Opción A) — tinta variante
    this.speed = (opts.speed == null) ? 1 : opts.speed;   // comportamiento — no token (D2, ver blob-intents.ts)
    this.scale = opts.scale || 1;                  // comportamiento — no token (D2) — tamaño del sprite (1 ≈ ~120px)
    this.obstacleSelector = opts.obstacleSelector || '[data-oct-obstacle]';
    this.zIndex = (opts.zIndex == null) ? 9999 : opts.zIndex; // --bbf-z-max (coincidencia exacta)
    this.gap = (opts.gap == null) ? 68 : opts.gap; // comportamiento — no token (D2) — distancia al cursor al seguirlo
    this.followTouch = opts.followTouch !== false;

    this.cell = 2.7 * this.scale;
    this.R = 40 * this.scale;
    this.margin = (opts.margin == null) ? 22 : opts.margin; // comportamiento — no token (D2)

    // respetar preferencia del sistema
    this.reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (this.reduced) this.speed *= 0.5;

    this._build();
  }

  OctopusPet.prototype._build = function () {
    var c = document.createElement('canvas');
    c.setAttribute('aria-hidden', 'true');
    c.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:' + this.zIndex + ';';
    (opts_parent(this) || document.body).appendChild(c);
    this.canvas = c;
    this.ctx = c.getContext('2d');

    this.pos = { x: 120, y: 160 };
    this.vel = { x: 30, y: 10 };
    this.fx = 120; this.fy = 160;
    this.cursor = { x: 0, y: 0, active: false };
    this.wander = { x: 200, y: 200, next: 0 };
    this.jet = 0; this.jetV = 0; this.jetNext = 1.6;
    this.stretch = 1; this.lean = 0;
    this.blinkNext = 2.2; this.blinking = false; this.blinkStart = 0;
    this.ink = [];
    this.obstacles = [];
    this._scrollQueued = false;

    var self = this;
    this._move = function (e) { self.cursor.x = e.clientX; self.cursor.y = e.clientY; self.cursor.active = true; clearTimeout(self._idle); self._idle = setTimeout(function () { self.cursor.active = false; }, 2600); };
    this._down = function () { self.spawnInk(); };
    this._resize = function () { self.resize(); };
    this._scroll = function () { if (!self._scrollQueued) { self._scrollQueued = true; requestAnimationFrame(function () { self._scrollQueued = false; self.refreshObstacles(); }); } };

    window.addEventListener('pointermove', this._move, { passive: true });
    window.addEventListener('pointerdown', this._down, { passive: true });
    window.addEventListener('resize', this._resize);
    window.addEventListener('scroll', this._scroll, { passive: true });
    this._obsTimer = setInterval(function () { self.refreshObstacles(); }, 900); // comportamiento — no token (D2)

    this.resize();
    this.refreshObstacles();
    this.pickWander(0);
    this.t0 = performance.now(); this.last = this.t0;
    this._tick = this.tick.bind(this);
    try { this.step(0, 0.016); this.render(0); } catch (e) { }
    this.raf = requestAnimationFrame(this._tick);
  };

  OctopusPet.prototype.destroy = function () {
    cancelAnimationFrame(this.raf); clearInterval(this._obsTimer);
    window.removeEventListener('pointermove', this._move);
    window.removeEventListener('pointerdown', this._down);
    window.removeEventListener('resize', this._resize);
    window.removeEventListener('scroll', this._scroll);
    if (this.canvas && this.canvas.parentNode) this.canvas.parentNode.removeChild(this.canvas);
  };

  // vuelve a leer las posiciones del contenido (llámalo tras cambios grandes de DOM)
  OctopusPet.prototype.refresh = function () { this.refreshObstacles(); };

  OctopusPet.prototype.resize = function () {
    var dpr = Math.min(1.75, window.devicePixelRatio || 1); // comportamiento — no token (D2)
    this.W = window.innerWidth; this.H = window.innerHeight;
    this.canvas.width = Math.round(this.W * dpr);
    this.canvas.height = Math.round(this.H * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.ready = true;
  };

  OctopusPet.prototype.refreshObstacles = function () {
    var els = document.querySelectorAll(this.obstacleSelector);
    var arr = [];
    for (var i = 0; i < els.length; i++) {
      var r = els[i].getBoundingClientRect();
      if (r.width > 2 && r.height > 2 && r.bottom > 0 && r.top < this.H) arr.push({ x: r.left, y: r.top, w: r.width, h: r.height });
    }
    this.obstacles = arr;
  };

  OctopusPet.prototype.inFree = function (x, y, pad) {
    if (x < pad || y < pad || x > this.W - pad || y > this.H - pad) return false;
    for (var i = 0; i < this.obstacles.length; i++) {
      var o = this.obstacles[i];
      if (x > o.x - pad && x < o.x + o.w + pad && y > o.y - pad && y < o.y + o.h + pad) return false;
    }
    return true;
  };

  OctopusPet.prototype.pickWander = function (t) {
    for (var i = 0; i < 24; i++) {
      var x = 40 + Math.random() * (this.W - 80);
      var y = 40 + Math.random() * (this.H - 80);
      if (this.inFree(x, y, this.R + 10)) { this.wander.x = x; this.wander.y = y; this.wander.next = t + 2.6 + Math.random() * 3.4; return; }
    }
    this.wander.x = this.W / 2; this.wander.y = this.H / 2; this.wander.next = t + 2;
  };

  OctopusPet.prototype.spawnInk = function () {
    for (var i = 0; i < 20; i++) {
      var a = Math.random() * 6.28, sp = 20 + Math.random() * 90;
      this.ink.push({ x: this.pos.x, y: this.pos.y + 8, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 30, life: 1, r: 3 + Math.random() * 7, hue: Math.random() < 0.5 });
    }
  };

  OctopusPet.prototype.avoidance = function (x, y, weight) {
    var fx = 0, fy = 0, M = this.margin, R = this.R;
    for (var i = 0; i < this.obstacles.length; i++) {
      var o = this.obstacles[i];
      var mx = o.x - M, my = o.y - M, mw = o.w + 2 * M, mh = o.h + 2 * M;
      var cxp = clamp(x, mx, mx + mw), cyp = clamp(y, my, my + mh);
      var dx = x - cxp, dy = y - cyp, d = Math.hypot(dx, dy);
      if (d < 0.001) {
        var dl = x - mx, dr = mx + mw - x, dt = y - my, db = my + mh - y;
        var m = Math.min(dl, dr, dt, db);
        if (m === dl) { dx = -1; dy = 0; } else if (m === dr) { dx = 1; dy = 0; } else if (m === dt) { dx = 0; dy = -1; } else { dx = 0; dy = 1; }
        fx += dx * 900; fy += dy * 900;
      } else if (d < R) {
        var f = (1 - d / R);
        fx += (dx / d) * f * 900; fy += (dy / d) * f * 900;
      }
    }
    var pad = this.R;
    if (x < pad) fx += (pad - x) * 12;
    if (x > this.W - pad) fx -= (x - (this.W - pad)) * 12;
    if (y < pad) fy += (pad - y) * 12;
    if (y > this.H - pad) fy -= (y - (this.H - pad)) * 12;
    return { fx: fx * weight, fy: fy * weight };
  };

  OctopusPet.prototype.step = function (t, dt) {
    var mut = this.speed;
    var following = this.cursor.active;

    var tx, ty, seekK;
    if (following) {
      this.fx += (this.cursor.x - this.fx) * Math.min(1, dt * 6.5);
      this.fy += (this.cursor.y - this.fy) * Math.min(1, dt * 6.5);
      var D = this.gap;
      var vx = this.pos.x - this.fx, vy = this.pos.y - this.fy;
      var dd = Math.hypot(vx, vy) || 1;
      var nx = vx / dd, ny = vy / dd;
      var tanx = -ny, tany = nx;
      var orbit = Math.sin(t * 1.15) * 0.34;
      tx = this.fx + (nx + tanx * orbit) * D;
      ty = this.fy + (ny + tany * orbit) * D;
      seekK = 2.3;
    } else {
      if (t > this.wander.next || Math.hypot(this.wander.x - this.pos.x, this.wander.y - this.pos.y) < 46) this.pickWander(t);
      tx = this.wander.x; ty = this.wander.y; seekK = 1.5;
    }

    var ax = (tx - this.pos.x) * seekK - this.vel.x * 2.7;
    var ay = (ty - this.pos.y) * seekK - this.vel.y * 2.7;

    var av = this.avoidance(this.pos.x, this.pos.y, following ? 0.9 : 1.35);
    ax += av.fx; ay += av.fy;

    this.jetNext -= dt * mut;
    if (this.jetNext <= 0 && !following) { this.jetV -= 5.5; this.jetNext = 2.8 + Math.random() * 2.6; }
    this.jetV += (-this.jet) * 34 * dt - this.jetV * 5 * dt; this.jet += this.jetV * dt; if (this.jet < 0) this.jet = 0;

    this.vel.x += ax * dt * mut; this.vel.y += ay * dt * mut;
    var maxV = following ? 720 : 420;
    var spv = Math.hypot(this.vel.x, this.vel.y);
    if (spv > maxV) { this.vel.x *= maxV / spv; this.vel.y *= maxV / spv; }

    this.pos.x += this.vel.x * dt; this.pos.y += this.vel.y * dt;
    this.pos.x = clamp(this.pos.x, 6, this.W - 6); this.pos.y = clamp(this.pos.y, 6, this.H - 6);

    this.lean += (clamp(this.vel.x / 500, -0.55, 0.55) - this.lean) * Math.min(1, dt * 8);
    this.stretch += ((1 + this.jet * 0.45 + clamp(this.vel.y / 900, -0.2, 0.35)) - this.stretch) * Math.min(1, dt * 10);

    if (this.blinking) { if (t - this.blinkStart > 0.12) { this.blinking = false; this.blinkNext = t + 2 + Math.random() * 3; } }
    else if (t > this.blinkNext) { this.blinking = true; this.blinkStart = t; }

    for (var i = 0; i < this.ink.length; i++) { var p = this.ink[i]; p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 30 * dt; p.vx *= 0.97; p.life -= dt * 0.5; p.r *= (1 + dt * 0.9); }
    if (this.ink.length) this.ink = this.ink.filter(function (q) { return q.life > 0; });
  };

  OctopusPet.prototype.cellPx = function (lc, lr, color, alpha) {
    var cell = this.cell, ctx = this.ctx, g = cell * 0.06;
    if (alpha != null) ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.fillRect(this.pos.x + lc * cell + g, this.pos.y + lr * cell + g, cell - 2 * g, cell - 2 * g);
    if (alpha != null) ctx.globalAlpha = 1;
  };

  OctopusPet.prototype.render = function (t) {
    var ctx = this.ctx, mut = this.speed;
    var Bc = this.accent, Ec = this.eyeColor, Pc = '#0a0a0a', ink = this.inkColor, ink2 = this.inkColor2;
    ctx.clearRect(0, 0, this.W, this.H);

    for (var i = 0; i < this.ink.length; i++) {
      var p = this.ink[i];
      ctx.globalAlpha = Math.max(0, Math.min(0.8, p.life * 0.85));
      ctx.fillStyle = p.hue ? ink2 : ink;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.2832); ctx.fill();
    }
    ctx.globalAlpha = 1;

    var sy = clamp(this.stretch, 0.74, 1.38), sx = 1 / Math.pow(sy, 0.6), lean = this.lean;

    var eyes = [];
    for (var r = 0; r < HH; r++) {
      var line = HEAD[r];
      for (var c = 0; c < HW; c++) {
        var ch = line[c]; if (ch === '.') continue;
        var dx = (c - HCX), dy = (r - HCY);
        var lc = dx * sx + dy * lean, lr = dy * sy;
        if (ch === 'E') eyes.push({ c: c, lc: lc, lr: lr });
        this.cellPx(lc, lr, Bc);
      }
    }

    if (!this.blinking) {
      var gx = this.cursor.active ? this.cursor.x : this.pos.x + this.vel.x * 0.2;
      var gy = this.cursor.active ? this.cursor.y : this.pos.y + this.vel.y * 0.2 + 40;
      var grpL = [], grpR = [];
      for (var e2 = 0; e2 < eyes.length; e2++) (eyes[e2].c < HCX ? grpL : grpR).push(eyes[e2]);
      var groups = [grpL, grpR];
      for (var gi = 0; gi < 2; gi++) {
        var g = groups[gi]; if (!g.length) continue;
        var mlc = 0, mlr = 0; for (var k = 0; k < g.length; k++) { mlc += g[k].lc; mlr += g[k].lr; } mlc /= g.length; mlr /= g.length;
        var exPx = this.pos.x + mlc * this.cell, eyPx = this.pos.y + mlr * this.cell;
        var ang = Math.atan2(gy - eyPx, gx - exPx);
        for (var k2 = 0; k2 < g.length; k2++) this.cellPx(g[k2].lc, g[k2].lr, Ec);
        this.cellPx(mlc + Math.cos(ang) * 0.7, mlr + Math.sin(ang) * 0.7, Pc);
      }
    }

    var NARM = 8, SEG = 12, legLen = 9.5;
    var baseLR = (HH - HCY - 1.5) * sy;
    var following = this.cursor.active;
    var reach = following ? 1 : 0.3;
    var curLC = following ? (this.cursor.x - this.pos.x) / this.cell : 0;
    var curLR = following ? (this.cursor.y - this.pos.y) / this.cell : 8;
    for (var ai = 0; ai < NARM; ai++) {
      var f = (ai / (NARM - 1)) - 0.5;
      var baseLC = f * (HW * 0.62) * sx;
      var dir = f >= 0 ? 1 : -1;
      var towardC = curLC - baseLC, towardR = curLR - baseLR;
      var sidef = reach * (towardC * dir > 0 ? 1 : 0.35);
      for (var s = 1; s <= SEG; s++) {
        var u = s / SEG;
        var wave = Math.sin(u * 3.4 - t * 4.2 * mut + ai * 0.8) * (1.1 + u * 2.6) * mut;
        var curl = (0.5 - this.jet * 0.6) * Math.sin(u * 2.2 + ai);
        var lcc = baseLC + f * 5.5 * u + wave + curl + towardC * u * u * 0.45 * sidef + lean * u * 4;
        var lrr = baseLR + u * legLen * (0.9 + this.jet * 0.15) + towardR * u * u * 0.24 * sidef + Math.cos(u * 3 - t * 4.2 * mut + ai) * 0.4;
        this.cellPx(lcc, lrr, Bc);
        if (u < 0.34) this.cellPx(lcc + dir, lrr, Bc);
      }
    }
  };

  OctopusPet.prototype.tick = function (now) {
    if (!this.ready) this.resize();
    var dt = Math.min(0.05, (now - this.last) / 1000); this.last = now;
    var t = (now - this.t0) / 1000;
    try { this.step(t, dt); this.render(t); } catch (e) { }
    this.raf = requestAnimationFrame(this._tick);
  };

  // permite montar el canvas dentro de un contenedor concreto (opts.parent)
  function opts_parent(inst) { return inst._parent || null; }

  // ---- API pública + auto-init ----
  var api = {
    init: function (options) {
      var inst = Object.create(OctopusPet.prototype);
      inst._parent = (options && options.parent) || null;
      OctopusPet.call(inst, options || {});
      return inst;
    },
    Class: OctopusPet
  };
  if (typeof window !== 'undefined') window.OctopusPet = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;

  // <script src="octopus.js" data-auto data-accent="#255ff1" data-speed="1">
  var cs = document.currentScript;
  if (cs && cs.hasAttribute('data-auto')) {
    var o = {};
    if (cs.getAttribute('data-accent')) o.accent = cs.getAttribute('data-accent');
    if (cs.getAttribute('data-speed')) o.speed = parseFloat(cs.getAttribute('data-speed'));
    if (cs.getAttribute('data-scale')) o.scale = parseFloat(cs.getAttribute('data-scale'));
    if (cs.getAttribute('data-selector')) o.obstacleSelector = cs.getAttribute('data-selector');
    var start = function () { api.init(o); };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
    else start();
  }
})();
