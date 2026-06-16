/* blob-scene.js — Liquid black-mercury METABALLS (raymarched SDF, Three.js).
   Multiple glossy droplets that float, merge and separate via smooth-union.
   Exposes window.BlobScene with init(canvas), setTweaks(obj), morph(),
   pause(), resume(), destroy(). The React Tweaks panel pushes values via
   setTweaks; the render loop reads from the internal `cfg` object every frame.
   v38: pause/resume/destroy API; maxDpr + morphDur extracted to cfg;
        setTweaks no longer touches document.body.
   v39: assetBase + bindInput extracted to cfg; pointer handler refs stored
        for complete cleanup in destroy().
   v40: matcap-c moved from CDN to local assetBase (matcap-c.png).
   v41: trackPointer(nx,ny) — exposes cursor-to-light from React (bindInput:false mode). */
(function () {
  'use strict';

  const BlobScene = {};
  window.BlobScene = BlobScene;

  const N = 12; // number of metaball droplets

  // ── live config (mirrors Tweaks panel) ──────────────────────────────────
  const cfg = {
    glowColor: '#fdf5ed',
    lightIntensity: 75, // %  single light brightness
    speed: 100,         // %
    deform: 55,         // %  (drift + merge gooeyness)
    bgColor: '#000000',
    matcap: 'b',        // which matcap texture (a | b | c)
    camera: true,       // orbit camera around the blobs
    maxDpr: 1.75,       // devicePixelRatio cap
    morphDur: 1800,     // ms — morph transition duration
    assetBase: '',      // base path for local matcaps ('' = relative, '/assets/blob/' = prod)
    bindInput: true,    // set false from React — React handles pointer events instead
  };

  const matcaps = {}; // loaded THREE textures by key

  let renderer, scene, camera, quad, mat, clock;
  let raf = 0, simTime = 0, camTime = 0;

  const mouse = { x: 0, y: 0 };  const lightSmooth = { x: -0.35, y: 0.55 };
  const boundHandlers = { move: null, down: null }; // stored for destroy() cleanup
  const lightTarget = { x: -0.35, y: 0.55 };
  let hasPointer = false;

  // per-droplet animation state
  const blob = [];
  let morphAnim = null; // {start,dur}

  // ── shader ────────────────────────────────────────────────────────────────
  const VERT = `
    varying vec2 vUv;
    void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`;

  const FRAG = `
    precision highp float;
    varying vec2 vUv;
    uniform vec2  uRes;
    uniform float uTime;
    uniform float uK;          // smooth-union radius (gooeyness)
    uniform vec4  uBlobs[${N}]; // xyz = center, w = radius
    uniform vec3  uGlow;       // light/reflection tint
    uniform float uIntensity;  // reflection brightness
    uniform vec3  uBg;
    uniform vec2  uLightOff;    // cursor-driven rotation of the shared studio
    uniform sampler2D uMatcap;  // real matcap texture
    uniform vec2  uCam;         // orbit camera yaw, pitch

    float smin(float a, float b, float k){
      float h = clamp(0.5 + 0.5*(b-a)/k, 0.0, 1.0);
      return mix(b, a, h) - k*h*(1.0-h);
    }
    float map(vec3 p){
      float d = 1e9;
      for(int i=0;i<${N};i++){
        float di = length(p - uBlobs[i].xyz) - uBlobs[i].w;
        d = smin(d, di, uK);
      }
      return d;
    }
    vec3 calcNormal(vec3 p){
      vec2 e = vec2(0.0008, 0.0);
      return normalize(vec3(
        map(p+e.xyy)-map(p-e.xyy),
        map(p+e.yxy)-map(p-e.yxy),
        map(p+e.yyx)-map(p-e.yyx)));
    }

    vec3 rotY(vec3 p, float a){ float c=cos(a), s=sin(a); return vec3(c*p.x+s*p.z, p.y, -s*p.x+c*p.z); }
    vec3 rotX(vec3 p, float a){ float c=cos(a), s=sin(a); return vec3(p.x, c*p.y-s*p.z, s*p.y+c*p.z); }

    // A shared STUDIO environment sampled by the WORLD reflection vector. Because
    // every drop reflects this same world-space studio (not a screen-space
    // matcap), the reflections sit at real geometric spots and read as one
    // ambient environment lighting the whole scene — like real glass/chrome.
    vec3 envColor(vec3 d){
      float y = clamp(d.y, -1.0, 1.0);
      // big bright soft sky concentrated near the TOP; black through the middle
      float sky = smoothstep(0.25, 0.95, y);
      vec3 c = mix(vec3(0.005), vec3(0.72), pow(sky, 1.8));
      // broad hot core right at the top -> the main glossy reflection
      vec3 k = normalize(vec3(-0.22, 0.93, 0.20));
      c += smoothstep(0.62, 1.0, max(dot(d, k), 0.0)) * vec3(0.5);
      // bright floor crescent down low -> the crisp lower-edge reflection
      c += smoothstep(-0.45, -0.92, y) * vec3(0.68);
      return c;
    }

    void main(){
      vec2 uv = (gl_FragCoord.xy - 0.5*uRes) / uRes.y;
      // orbit camera around the blobs (uCam = yaw, pitch)
      float cy = uCam.x, cp = uCam.y;
      vec3 ro = vec3(sin(cy)*cos(cp), sin(cp), cos(cy)*cos(cp)) * 6.0;
      vec3 fwd = normalize(-ro);
      vec3 rgt = normalize(cross(fwd, vec3(0.0, 1.0, 0.0)));
      vec3 upv = cross(rgt, fwd);
      vec3 rd = normalize(uv.x * 1.35 * rgt + uv.y * 1.35 * upv + 2.2 * fwd);

      float t = 0.0;
      float hit = 0.0;
      vec3 p;
      for(int i=0;i<80;i++){
        p = ro + rd*t;
        float d = map(p);
        if(d < 0.001){ hit = 1.0; break; }
        t += d;
        if(t > 14.0) break;
      }

      vec3 col = uBg;
      if(hit > 0.5){
        vec3 N = calcNormal(p);
        vec3 V = normalize(ro - p);
        float ndv = max(dot(N, V), 0.0);

        // ===== real MATCAP material as a WORLD-FIXED studio =====
        // Sample by the world-space reflection vector so the studio stays fixed
        // in the world: orbiting the camera slides the reflections across the
        // glass and reveals different lit sides (a real light, not screen-locked).
        vec3 rfl = reflect(-V, N);
        float a = uLightOff.x * 0.5;
        mat2 Rm = mat2(cos(a), -sin(a), sin(a), cos(a));
        vec2 mn = Rm * rfl.xy + vec2(0.0, uLightOff.y * 0.12);
        vec2 muv = clamp(mn * 0.5 + 0.5, 0.001, 0.999);
        // sample + sRGB->linear decode so the matcap reads faithfully after gamma
        vec3 mc = pow(texture2D(uMatcap, muv).rgb, vec3(2.2));
        float bright = uIntensity * 1.3;   // matcap intensity (0 = black)
        col = mc * uGlow * bright;

        // glossy specular wet pop on top (dims with intensity, never fully gone)
        vec3 k = normalize(vec3(-0.22, 0.93, 0.20));
        vec3 H = normalize(k + V);
        col += pow(max(dot(N, H), 0.0), 220.0) * vec3(0.55) * (0.35 + 0.65 * clamp(uIntensity, 0.0, 1.2));

        // -- Fresnel #1: warm #FFDFD7 inner tint, subtle --
        float f1 = clamp(-0.05 + 0.30 * pow(1.0 - ndv, 2.5), 0.0, 1.0);
        col += f1 * 0.04 * vec3(1.0, 0.875, 0.843);

        // -- Glass core: keep a little extra depth toward the center --
        col *= mix(1.0, 0.88, smoothstep(0.0, 0.55, ndv));
      }

      col = clamp(col, 0.0, 1.0);
      gl_FragColor = vec4(pow(col, vec3(1.0/2.2)), 1.0);
    }`;

  // ── helpers ───────────────────────────────────────────────────────────────
  function hexToRGB(hex) {
    const h = hex.replace('#', '');
    const n = parseInt(h.length === 3 ? h.replace(/./g, c => c + c) : h, 16);
    return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
  }
  const lerp = (a, b, t) => a + (b - a) * t;
  const easeInOut = t => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  const rand = (a, b) => a + Math.random() * (b - a);
  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function makeTargets() {
    // CONCENTRATED central cluster so drops sit close and influence/merge,
    // with breathing room around the edges of the canvas
    const slots = shuffle([
      { x: -0.95, y: 0.55 }, { x: -0.10, y: 0.92 }, { x: 0.80, y: 0.58 },
      { x: 1.05, y: -0.18 }, { x: -1.05, y: -0.25 }, { x: -0.38, y: 0.02 },
      { x: 0.40, y: -0.55 }, { x: 0.95, y: -0.80 }, { x: -0.62, y: -0.78 },
    ]);
    const t = [];
    for (let i = 0; i < 9; i++) {
      const s = slots[i];
      const big = i < 2, mid = i >= 2 && i < 5;
      t.push({
        x: s.x + rand(-0.16, 0.16),
        y: s.y + rand(-0.16, 0.16),
        z: rand(-0.35, 0.35),
        r: big ? rand(0.46, 0.58) : mid ? rand(0.30, 0.42) : rand(0.17, 0.28),
      });
    }
    // 3 partner droplets that overlap a primary -> organic peanut fusions
    for (let k = 0; k < 3; k++) {
      const base = t[k];
      const ang = rand(0, Math.PI * 2);
      const off = base.r * 0.92;
      t.push({
        x: base.x + Math.cos(ang) * off,
        y: base.y + Math.sin(ang) * off,
        z: base.z + rand(-0.1, 0.1),
        r: base.r * rand(0.58, 0.82),
      });
    }
    return t;
  }

  function seedBlobs() {
    const tg = makeTargets();
    for (let i = 0; i < N; i++) {
      blob[i] = {
        // current = target on first seed
        cx: tg[i].x, cy: tg[i].y, cz: tg[i].z, cr: tg[i].r,
        fromX: tg[i].x, fromY: tg[i].y, fromZ: tg[i].z, fromR: tg[i].r,
        toX: tg[i].x, toY: tg[i].y, toZ: tg[i].z, toR: tg[i].r,
        // independent orbit for idle floating
        ax: rand(0.10, 0.30), ay: rand(0.10, 0.30), az: rand(0.04, 0.14),
        fx: rand(0.18, 0.5), fy: rand(0.18, 0.5), fz: rand(0.12, 0.4),
        px: rand(0, 6.28), py: rand(0, 6.28), pz: rand(0, 6.28),
      };
    }
  }

  // ── public API ─────────────────────────────────────────────────────────────
  BlobScene.setTweaks = function (t) {
    Object.assign(cfg, t);
    if (renderer) renderer.setClearColor(cfg.bgColor, 1);
    if (mat) mat.uniforms.uBg.value.set(...hexToRGB(cfg.bgColor));
    if (mat && matcaps[cfg.matcap]) mat.uniforms.uMatcap.value = matcaps[cfg.matcap];
  };

  BlobScene.morph = function () {
    const tg = makeTargets();
    for (let i = 0; i < N; i++) {
      const b = blob[i];
      b.fromX = b.cx; b.fromY = b.cy; b.fromZ = b.cz; b.fromR = b.cr;
      b.toX = tg[i].x; b.toY = tg[i].y; b.toZ = tg[i].z; b.toR = tg[i].r;
    }
    morphAnim = { start: performance.now(), dur: cfg.morphDur };
  };

  BlobScene.pause = function () {
    cancelAnimationFrame(raf);
    raf = 0;
  };

  BlobScene.resume = function () {
    if (!raf && renderer) loop();
  };

  BlobScene.destroy = function () {
    BlobScene.pause();
    window.removeEventListener('resize', resize);
    if (boundHandlers.move) { window.removeEventListener('pointermove', boundHandlers.move); boundHandlers.move = null; }
    if (boundHandlers.down) { window.removeEventListener('pointerdown', boundHandlers.down); boundHandlers.down = null; }
    if (mat) { mat.dispose(); mat = null; }
    if (renderer) { renderer.dispose(); renderer = null; }
    scene = null;
    camera = null;
    quad = null;
  };

  // Exposes cursor coordinates from React when bindInput:false.
  // React owns pointermove; calls this each frame so the studio light follows the cursor.
  BlobScene.trackPointer = function (nx, ny) {
    mouse.x = nx;
    mouse.y = ny;
    hasPointer = true;
  };

  BlobScene.init = function (canvas) {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, cfg.maxDpr));
    THREE.ColorManagement.enabled = false;
    renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
    renderer.setClearColor(cfg.bgColor, 1);

    scene = new THREE.Scene();
    camera = new THREE.Camera();

    const blobArr = [];
    for (let i = 0; i < N; i++) blobArr.push(new THREE.Vector4(0, 0, 0, 0.5));

    // real matcap textures (swappable via Tweaks)
    const texLoader = new THREE.TextureLoader();
    texLoader.setCrossOrigin('anonymous');
    function loadMatcap(url) {
      const t = texLoader.load(url);
      t.colorSpace = THREE.NoColorSpace;
      t.minFilter = THREE.LinearFilter;
      t.magFilter = THREE.LinearFilter;
      t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
      return t;
    }
    matcaps.a = loadMatcap(cfg.assetBase + 'matcap-a.png');
    matcaps.b = loadMatcap(cfg.assetBase + 'matcap-b.png');
    matcaps.c = loadMatcap(cfg.assetBase + 'matcap-c.png');
    matcaps.d = loadMatcap('https://raw.githubusercontent.com/nidorx/matcaps/master/1024/2D2D2F_C6C2C5_727176_94949B.png');
    matcaps.e = loadMatcap('https://raw.githubusercontent.com/nidorx/matcaps/master/1024/2A2A2A_DBDBDB_6A6A6A_949494.png');
    matcaps.f = loadMatcap('https://raw.githubusercontent.com/nidorx/matcaps/master/1024/2A2A2A_B3B3B3_6D6D6D_848C8C.png');
    const matcap = matcaps[cfg.matcap] || matcaps.b;

    mat = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      uniforms: {
        uRes: { value: new THREE.Vector2(1, 1) },
        uTime: { value: 0 },
        uK: { value: 0.5 },
        uBlobs: { value: blobArr },
        uGlow: { value: new THREE.Vector3(...hexToRGB(cfg.glowColor)) },
        uIntensity: { value: cfg.lightIntensity / 100 },
        uBg: { value: new THREE.Vector3(...hexToRGB(cfg.bgColor)) },
        uLightOff: { value: new THREE.Vector2(-0.18, 0.12) },
        uMatcap: { value: matcap },
        uCam: { value: new THREE.Vector2(0, 0) },
      },
    });

    quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat);
    quad.frustumCulled = false;
    scene.add(quad);

    seedBlobs();
    clock = new THREE.Clock();
    resize();
    window.addEventListener('resize', resize);
    if (cfg.bindInput) bindPointer();
    loop();
  };

  function bindPointer() {
    boundHandlers.move = (e) => {
      const px = (e.touches ? e.touches[0].clientX : e.clientX);
      const py = (e.touches ? e.touches[0].clientY : e.clientY);
      mouse.x = (px / window.innerWidth) * 2 - 1;
      mouse.y = -((py / window.innerHeight) * 2 - 1);
      hasPointer = true;
    };
    boundHandlers.down = (e) => {
      if (e.target && e.target.closest && e.target.closest('[data-omelette-chrome]')) return;
      BlobScene.morph();
    };
    window.addEventListener('pointermove', boundHandlers.move, { passive: true });
    window.addEventListener('pointerdown', boundHandlers.down);
  }

  function resize() {
    const w = window.innerWidth, h = window.innerHeight;
    renderer.setSize(w, h, false);
    const pr = renderer.getPixelRatio();
    mat.uniforms.uRes.value.set(w * pr, h * pr);
  }

  function loop() {
    raf = requestAnimationFrame(loop);
    const dt = Math.min(clock.getDelta(), 0.05);
    const sp = cfg.speed / 100;
    simTime += dt * sp;

    const u = mat.uniforms;
    u.uTime.value = simTime;

    // gooeyness from deform
    const dz = cfg.deform / 100;
    u.uK.value = lerp(u.uK.value, 0.16 + dz * 0.52, 0.06);

    // intensity / light-color smoothing
    u.uIntensity.value += ((cfg.lightIntensity / 100) - u.uIntensity.value) * 0.1;
    const [gr, gg, gb] = hexToRGB(cfg.glowColor);
    u.uGlow.value.x += (gr - u.uGlow.value.x) * 0.1;
    u.uGlow.value.y += (gg - u.uGlow.value.y) * 0.1;
    u.uGlow.value.z += (gb - u.uGlow.value.z) * 0.1;

    // morph easing of base targets
    let mk = 1;
    if (morphAnim) {
      mk = (performance.now() - morphAnim.start) / morphAnim.dur;
      if (mk >= 1) { mk = 1; morphAnim = null; }
      else mk = easeInOut(mk);
    }

    const drift = 0.35 + dz * 0.7; // idle float amplitude scales with deform
    for (let i = 0; i < N; i++) {
      const b = blob[i];
      const bx = lerp(b.fromX, b.toX, mk);
      const by = lerp(b.fromY, b.toY, mk);
      const bz = lerp(b.fromZ, b.toZ, mk);
      const br = lerp(b.fromR, b.toR, mk);
      b.cx = bx + Math.sin(simTime * b.fx + b.px) * b.ax * drift;
      b.cy = by + Math.sin(simTime * b.fy + b.py) * b.ay * drift;
      b.cz = bz + Math.sin(simTime * b.fz + b.pz) * b.az * drift;
      b.cr = br * (1.0 + 0.05 * Math.sin(simTime * 0.6 + b.px));
      u.uBlobs.value[i].set(b.cx, b.cy, b.cz, b.cr);
    }

    // ONE studio environment (the matcaps); the cursor shifts it so the
    // reflections glide across every drop coherently — a single ambient source.
    if (hasPointer) { lightTarget.x = mouse.x; lightTarget.y = mouse.y; }
    else {
      lightTarget.x = Math.sin(simTime * 0.20) * 0.6;
      lightTarget.y = 0.25 + Math.cos(simTime * 0.15) * 0.35;
    }
    lightSmooth.x = lerp(lightSmooth.x, lightTarget.x, 0.05);
    lightSmooth.y = lerp(lightSmooth.y, lightTarget.y, 0.05);
    // shift/rotate the shared studio with the cursor (light glides for all drops)
    u.uLightOff.value.set(lightSmooth.x, lightSmooth.y);

    // orbit camera: gentle pseudo-random wander (sum of incommensurate sines)
    if (cfg.camera) camTime += dt * 0.6;
    const yaw = Math.sin(camTime * 0.27) * 0.85 + Math.sin(camTime * 0.13) * 0.55;
    const pitch = Math.sin(camTime * 0.19) * 0.30 + Math.sin(camTime * 0.11) * 0.16;
    u.uCam.value.set(yaw, pitch);

    renderer.render(scene, camera);
  }
})();
