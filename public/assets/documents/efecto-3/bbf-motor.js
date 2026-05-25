// bbf-motor.js
(function() {
    const estilosAura = document.createElement('style');
    estilosAura.innerHTML = `
        .bbf-aura-fondo {
            position: absolute; inset: 0; width: 100%; height: 100%;
            background-color: var(--bbf-color-fondo);
            border-radius: inherit; overflow: hidden;
            -webkit-mask-image: radial-gradient(circle at center, black 30%, transparent 65%);
            mask-image: radial-gradient(circle at center, black 30%, transparent 65%);
        }
        .bbf-aura-capa { position: absolute; border-radius: 50%; mix-blend-mode: multiply; }
        .bbf-c1 { top: 20%; left: 20%; width: 45%; height: 45%; background: radial-gradient(circle, var(--bbf-c1) 0%, transparent 70%); filter: blur(35px); transform-origin: 60% 40%; animation: bbf-orbita-1 15s linear infinite; }
        .bbf-c2 { top: 25%; right: 25%; width: 35%; height: 35%; background: radial-gradient(circle, var(--bbf-c2) 0%, transparent 65%); filter: blur(25px); transform-origin: 40% 60%; animation: bbf-orbita-2 12s linear infinite reverse; }
        .bbf-c3 { top: 30%; left: 30%; width: 40%; height: 40%; background: radial-gradient(circle, var(--bbf-c3) 0%, transparent 70%); filter: blur(30px); transform-origin: 50% 30%; animation: bbf-orbita-3 20s linear infinite; }
        .bbf-c4 { bottom: 20%; left: 25%; width: 40%; height: 40%; background: radial-gradient(circle, var(--bbf-c4) 0%, transparent 70%); filter: blur(35px); transform-origin: 30% 50%; animation: bbf-orbita-1 18s linear infinite reverse; }
        .bbf-textura {
            position: absolute; top: -50%; left: -50%; width: 200%; height: 200%;
            z-index: 10; pointer-events: none; mix-blend-mode: overlay;
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
            -webkit-mask-image: radial-gradient(circle at center, black 20%, transparent 55%);
            mask-image: radial-gradient(circle at center, black 20%, transparent 55%);
            animation: bbf-ruido 0.4s steps(10) infinite;
        }
        @keyframes bbf-orbita-1 { 0% { transform: rotate(0deg) scale(1); } 33% { transform: rotate(120deg) scale(1.05); } 66% { transform: rotate(240deg) scale(0.95); } 100% { transform: rotate(360deg) scale(1); } }
        @keyframes bbf-orbita-2 { 0% { transform: rotate(0deg) scale(1); } 33% { transform: rotate(120deg) scale(0.95); } 66% { transform: rotate(240deg) scale(1.05); } 100% { transform: rotate(360deg) scale(1); } }
        @keyframes bbf-orbita-3 { 0% { transform: rotate(0deg) scale(1); } 50% { transform: rotate(180deg) scale(1.02); } 100% { transform: rotate(360deg) scale(1); } }
        @keyframes bbf-ruido { 0%, 100% { transform: translate(0, 0); } 10% { transform: translate(-1%, -1%); } 20% { transform: translate(-2%, 1%); } 30% { transform: translate(1%, -2%); } 40% { transform: translate(-1%, 3%); } 50% { transform: translate(-2%, 1%); } 60% { transform: translate(3%, 0); } 70% { transform: translate(0, 3%); } 80% { transform: translate(1%, 4%); } 90% { transform: translate(-2%, 2%); } }
    `;
    document.head.appendChild(estilosAura);

    const bbfAnimaciones = [];
    const bbfTiempoInicio = performance.now();
    const SVG_NS = 'http://www.w3.org/2000/svg';

    function bbfLoop(now) {
        const elapsed = (now - bbfTiempoInicio) / 1000;
        const R = window.BBFConfig.dimensiones.radioCurva;
        const res = window.BBFConfig.matematicas.resolucion;
        const puntos = window.BBFConfig.matematicas.puntosBase;
        const areaFlotacion = window.BBFConfig.dimensiones.areaFlotacion;

        for (const anim of bbfAnimaciones) {
            // 1. Animar la curva Lissajous
            const delta = (elapsed * anim.rate + anim.offset) * Math.PI * 2;
            let pathD = '';
            for (let i = 0; i <= res; i++) {
                const t = puntos[i];
                const x = Math.sin(anim.a * t + delta) * R;
                const y = Math.sin(anim.b * t) * R;
                pathD += (i === 0 ? 'M' : 'L') + x.toFixed(2) + ',' + y.toFixed(2);
            }
            anim.pathLinea.setAttribute('d', pathD);
            anim.pathBrillo.setAttribute('d', pathD);

            // 2. Animar el punto flotante (Si está activado)
            if (anim.circulo) {
                // Generamos un movimiento orgánico usando sus propiedades aleatorias únicas
                const cx = Math.sin(elapsed * anim.float.velX + anim.float.offX) * areaFlotacion;
                const cy = Math.cos(elapsed * anim.float.velY + anim.float.offY) * areaFlotacion;
                
                anim.circulo.setAttribute('cx', cx.toFixed(2));
                anim.circulo.setAttribute('cy', cy.toFixed(2));
            }
        }
        requestAnimationFrame(bbfLoop);
    }
    requestAnimationFrame(bbfLoop);

    window.bbfCrearModulo = function(contenedorId, opciones) {
        const contenedor = document.getElementById(contenedorId);
        if (!contenedor) return;

        contenedor.style.position = 'relative';

        const viewBox = window.BBFConfig.dimensiones.viewBox;
        const center = viewBox / 2;
        const R = window.BBFConfig.dimensiones.radioCurva;
        const configFondo = window.BBFConfig.fondos[opciones.fondoId];

        if (configFondo && configFondo.tipo === 'aura') {
            const auraDiv = document.createElement('div');
            auraDiv.className = 'bbf-aura-fondo';
            auraDiv.style.setProperty('--bbf-color-fondo', configFondo.colores.fondo);
            auraDiv.style.setProperty('--bbf-c1', configFondo.colores.capa1);
            auraDiv.style.setProperty('--bbf-c2', configFondo.colores.capa2);
            auraDiv.style.setProperty('--bbf-c3', configFondo.colores.capa3);
            auraDiv.style.setProperty('--bbf-c4', configFondo.colores.capa4);
            auraDiv.innerHTML = `
                <div class="bbf-aura-capa bbf-c1"></div>
                <div class="bbf-aura-capa bbf-c2"></div>
                <div class="bbf-aura-capa bbf-c3"></div>
                <div class="bbf-aura-capa bbf-c4"></div>
                <div class="bbf-textura" style="opacity: ${configFondo.texturaOpacidad}"></div>
            `;
            contenedor.appendChild(auraDiv);
        }

        const svg = document.createElementNS(SVG_NS, 'svg');
        svg.setAttribute('viewBox', `0 0 ${viewBox} ${viewBox}`);
        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        svg.style.position = 'absolute'; svg.style.inset = '0';
        svg.style.width = '100%'; svg.style.height = '100%';
        svg.style.zIndex = '20'; svg.style.display = 'block';

        const grupo = document.createElementNS(SVG_NS, 'g');
        grupo.setAttribute('transform', `translate(${center}, ${center})`);

        if (configFondo && configFondo.tipo === 'imagen') {
            const tamanoFondo = viewBox * (configFondo.escala || 1);
            const offsetCentro = -tamanoFondo / 2;
            const imagen = document.createElementNS(SVG_NS, 'image');
            imagen.setAttribute('href', configFondo.url);
            imagen.setAttribute('x', offsetCentro); imagen.setAttribute('y', offsetCentro);
            imagen.setAttribute('width', tamanoFondo); imagen.setAttribute('height', tamanoFondo);
            imagen.setAttribute('preserveAspectRatio', 'xMidYMid slice');
            if (configFondo.opacidad !== undefined) imagen.setAttribute('opacity', configFondo.opacidad);
            grupo.appendChild(imagen);
        }

        const caja = document.createElementNS(SVG_NS, 'rect');
        caja.setAttribute('x', -R - 30); caja.setAttribute('y', -R - 30);
        caja.setAttribute('width', (R + 30) * 2); caja.setAttribute('height', (R + 30) * 2);
        caja.setAttribute('fill', 'none'); caja.setAttribute('stroke', window.BBFConfig.estilos.colorBorde);
        grupo.appendChild(caja);

        const guiaH = document.createElementNS(SVG_NS, 'line');
        guiaH.setAttribute('x1', -R - 10); guiaH.setAttribute('y1', 0); guiaH.setAttribute('x2', R + 10); guiaH.setAttribute('y2', 0);
        guiaH.setAttribute('stroke', window.BBFConfig.estilos.colorGuia); guiaH.setAttribute('stroke-dasharray', '2 8');
        grupo.appendChild(guiaH);

        const guiaV = document.createElementNS(SVG_NS, 'line');
        guiaV.setAttribute('x1', 0); guiaV.setAttribute('y1', -R - 10); guiaV.setAttribute('x2', 0); guiaV.setAttribute('y2', R + 10);
        guiaV.setAttribute('stroke', window.BBFConfig.estilos.colorGuia); guiaV.setAttribute('stroke-dasharray', '2 8');
        grupo.appendChild(guiaV);

        const pathBrillo = document.createElementNS(SVG_NS, 'path');
        pathBrillo.setAttribute('fill', 'none'); pathBrillo.setAttribute('stroke', window.BBFConfig.estilos.colorBrillo);
        pathBrillo.setAttribute('stroke-width', window.BBFConfig.estilos.grosorBrillo); pathBrillo.setAttribute('stroke-linecap', 'round');
        grupo.appendChild(pathBrillo);

        const pathLinea = document.createElementNS(SVG_NS, 'path');
        pathLinea.setAttribute('fill', 'none'); pathLinea.setAttribute('stroke', window.BBFConfig.estilos.colorCurva);
        pathLinea.setAttribute('stroke-width', window.BBFConfig.estilos.grosorCurva); pathLinea.setAttribute('stroke-linecap', 'round');
        grupo.appendChild(pathLinea);

        // NUEVO: Creación del Punto Flotante
        let circulo = null;
        if (opciones.puntoFlotante) {
            circulo = document.createElementNS(SVG_NS, 'circle');
            circulo.setAttribute('r', window.BBFConfig.dimensiones.radioPuntoFlotante);
            circulo.setAttribute('fill', window.BBFConfig.estilos.colorPuntoFlotante);
            grupo.appendChild(circulo);
        }

        svg.appendChild(grupo);
        contenedor.appendChild(svg);

        // Registrar la animación y la matemática de flotación aleatoria
        bbfAnimaciones.push({
            a: opciones.a, b: opciones.b, rate: opciones.rate, offset: opciones.offset,
            pathLinea: pathLinea, pathBrillo: pathBrillo,
            circulo: circulo,
            float: {
                // Velocidad entre 0.3 y 0.7 para que se vea lento y orgánico
                velX: 0.3 + Math.random() * 0.4, 
                velY: 0.3 + Math.random() * 0.4,
                // Offset inicial para que no empiecen en el mismo lugar
                offX: Math.random() * Math.PI * 2,
                offY: Math.random() * Math.PI * 2
            }
        });
    };
})();