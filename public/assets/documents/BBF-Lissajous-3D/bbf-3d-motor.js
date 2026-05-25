// bbf-3d-motor.js
(function() {
    const modulosActivos = [];
    let pausado = false;
    let tiempoAnterior = performance.now();

    // Pausar/Reanudar global con la barra espaciadora
    window.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            e.preventDefault();
            pausado = !pausado;
        }
    });

    // Función matemática para generar la gradiente (cálido a frío)
    function obtenerColor(f) {
        const hue = (0.08 + ((f * 0.6) % 1)) % 1;
        const lig = 0.55 + 0.10 * Math.sin(f * 2 * Math.PI);
        return new THREE.Color().setHSL(hue, 0.75, lig);
    }

    // Calcular posición Lissajous 3D
    function posicionLissajous(t, p, scale) {
        return new THREE.Vector3(
            scale * Math.sin(p.a * t + p.dx),
            scale * Math.sin(p.b * t + p.dy),
            scale * Math.sin(p.c * t + p.dz)
        );
    }

    // Ciclo de animación principal
    function bbf3DLoop() {
        requestAnimationFrame(bbf3DLoop);
        const ahora = performance.now();
        const dt = Math.min(0.05, (ahora - tiempoAnterior) / 1000);
        tiempoAnterior = ahora;

        for (const mod of modulosActivos) {
            if (!pausado) mod.virtualT += dt * mod.config.speed;

            const n = mod.nodoGrupo.children.length;
            for (let i = 0; i < n; i++) {
                const offset = (i / n) * 2 * Math.PI;
                const pos = posicionLissajous(mod.virtualT + offset, mod.preset, mod.config.scale);
                mod.nodoGrupo.children[i].position.copy(pos);
            }

            mod.controles.update();
            mod.renderer.render(mod.scene, mod.camera);
        }
    }
    requestAnimationFrame(bbf3DLoop);

    // Constructor del Módulo
    window.bbfCrearModulo3D = function(contenedorId, opcionesUsuario = {}) {
        const contenedor = document.getElementById(contenedorId);
        if (!contenedor) return;

        // Combinar configuración por defecto con la del usuario
        const config = { ...window.BBF3DConfig.porDefecto, ...opcionesUsuario };
        const presetMatematico = window.BBF3DConfig.presets[config.preset] || window.BBF3DConfig.presets['trefoil'];
        const est = window.BBF3DConfig.estilos;

        // 1. Inicializar Three.js
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
        renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.15;
        contenedor.appendChild(renderer.domElement);

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(est.fondo);
        scene.fog = new THREE.Fog(est.fondo, est.fogCerca, est.fogLejos);

        const rect = contenedor.getBoundingClientRect();
        const camera = new THREE.PerspectiveCamera(48, rect.width / rect.height, 0.1, 100);
        camera.position.set(8, 6, 11);

        const controles = new THREE.OrbitControls(camera, renderer.domElement);
        controles.enableDamping = true;
        controles.dampingFactor = 0.06;
        controles.autoRotate = config.autoRotate;
        controles.autoRotateSpeed = 0.65;
        controles.minDistance = 5;
        controles.maxDistance = 28;

        // 2. Iluminación
        scene.add(new THREE.AmbientLight(0x303040, 0.55));
        scene.add(new THREE.HemisphereLight(0x88aaff, 0x331144, 0.45));
        const key = new THREE.DirectionalLight(0xffffff, 0.85); key.position.set(6, 12, 6); scene.add(key);
        const rim1 = new THREE.PointLight(0x66ccff, 1.2, 35); rim1.position.set(-7, -3, -6); scene.add(rim1);
        const rim2 = new THREE.PointLight(0xff9966, 1.0, 35); rim2.position.set(7, 0, -5); scene.add(rim2);

        // 3. Estrellas de fondo
        const starsGeom = new THREE.BufferGeometry();
        const pts = [], cols = [];
        for (let i = 0; i < est.estrellasCantidad; i++) {
            const u = Math.random(), v = Math.random();
            const theta = u * 2 * Math.PI, phi = Math.acos(2 * v - 1);
            const r = 28 * (0.6 + 0.4 * Math.random());
            pts.push(r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), r * Math.cos(phi));
            const b = 0.4 + 0.5 * Math.random();
            cols.push(b, b, b);
        }
        starsGeom.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
        starsGeom.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3));
        scene.add(new THREE.Points(starsGeom, new THREE.PointsMaterial({ size: 0.04, vertexColors: true, transparent: true, opacity: est.estrellasOpacidad })));

        // 4. Curva Guía
        if (config.showCurve) {
            const N = 1200; const curvePts = [], curveCols = [];
            for (let i = 0; i <= N; i++) {
                curvePts.push(posicionLissajous((i / N) * 2 * Math.PI, presetMatematico, config.scale));
                const c = obtenerColor(i / N);
                curveCols.push(c.r, c.g, c.b);
            }
            const geomCurva = new THREE.BufferGeometry().setFromPoints(curvePts);
            geomCurva.setAttribute('color', new THREE.Float32BufferAttribute(curveCols, 3));
            
            scene.add(new THREE.Line(geomCurva, new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: est.curvaOpacidad })));
            
            if (config.bloom) {
                const bloom = new THREE.Line(geomCurva.clone(), new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: est.bloomOpacidad }));
                bloom.scale.set(1.001, 1.001, 1.001);
                scene.add(bloom);
            }
        }

        // 5. Nodos (Esferas)
        const nodoGrupo = new THREE.Group();
        const sphereGeom = new THREE.SphereGeometry(config.nodeSize, 28, 18);
        for (let i = 0; i < config.numNodes; i++) {
            const col = obtenerColor(i / config.numNodes);
            const mat = new THREE.MeshStandardMaterial({ color: col, metalness: 0.35, roughness: 0.22, emissive: col.clone().multiplyScalar(0.85), emissiveIntensity: 0.55 });
            const m = new THREE.Mesh(sphereGeom, mat);
            if (config.bloom) {
                const halo = new THREE.Mesh(new THREE.SphereGeometry(config.nodeSize * 2.0, 16, 12), new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.10, depthWrite: false, blending: THREE.AdditiveBlending }));
                m.add(halo);
            }
            nodoGrupo.add(m);
        }
        scene.add(nodoGrupo);

        // 6. Resize Observer (Responsividad modular)
        const observer = new ResizeObserver(entradas => {
            for (let entrada of entradas) {
                const { width, height } = entrada.contentRect;
                camera.aspect = width / height;
                camera.updateProjectionMatrix();
                renderer.setSize(width, height);
            }
        });
        observer.observe(contenedor);

        // Registrar en el motor
        modulosActivos.push({
            renderer, scene, camera, controles, nodoGrupo, config, preset: presetMatematico, virtualT: 0
        });
    };
})();