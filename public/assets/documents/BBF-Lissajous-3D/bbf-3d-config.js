// bbf-3d-config.js
(function() {
    window.BBF3DConfig = {
        // Configuraciones base (si no se pasan en el módulo, se usan estas)
        porDefecto: {
            preset: "trefoil",
            numNodes: 28,
            speed: 0.55,
            nodeSize: 0.2,
            scale: 2.5,
            showCurve: true,
            autoRotate: true,
            bloom: true
        },
        
        // Catálogo de Matemáticas (Lissajous 3D)
        presets: {
            trefoil:  { a: 3, b: 2, c: 1, dx: Math.PI/2, dy: Math.PI/3, dz: 0 },
            pretzel:  { a: 5, b: 3, c: 2, dx: Math.PI/4, dy: Math.PI/2, dz: 0 },
            toroidal: { a: 4, b: 3, c: 2, dx: Math.PI/3, dy: Math.PI/2, dz: Math.PI/4 },
            wave:     { a: 1, b: 2, c: 3, dx: 0,         dy: Math.PI/2, dz: 0 },
            ring:     { a: 1, b: 1, c: 1, dx: 0,         dy: Math.PI/2, dz: Math.PI/4 },
            dense:    { a: 7, b: 5, c: 3, dx: Math.PI/6, dy: Math.PI/3, dz: Math.PI/2 },
        },

        // Estilos Estéticos Globales
        estilos: {
            fondo: 0x04040c,
            fogCerca: 14,
            fogLejos: 40,
            curvaOpacidad: 0.55,
            bloomOpacidad: 0.15,
            estrellasOpacidad: 0.7,
            estrellasCantidad: 700
        }
    };
})();