// bbf-config.js
(function() {
    const resolucion = 720;
    const puntosBase = new Float32Array(resolucion + 1);
    for (let i = 0; i <= resolucion; i++) {
        puntosBase[i] = (i / resolucion) * Math.PI * 2;
    }

    window.BBFConfig = {
        matematicas: {
            puntosBase: puntosBase,
            resolucion: resolucion
        },
        estilos: {
            colorCurva: '#000000',
            grosorCurva: '2.2',
            colorBrillo: '#000000',
            grosorBrillo: '2',
            colorBorde: '#00000000',
            colorGuia: '#000000',
            
            // NUEVO: Color del punto flotante
            colorPuntoFlotante: '#000000' 
        },
        dimensiones: {
            viewBox: 400,
            radioCurva: 140,
            
            // NUEVO: Configuraciones del punto central
            radioPuntoFlotante: 30, // Tamaño del círculo
            areaFlotacion: 35       // Distancia máxima que puede alejarse del centro (0,0)
        },
        fondos: {
            "fondo-1": {
                tipo: "imagen",
                url: "BBF-illustration-back-1.png",
                escala: 1.0,
                opacidad: 0.9
            },
            "fondo-2": {
                tipo: "aura",
                colores: {
                    fondo: "#fff",
                    capa1: "#cfa8f3",
                    capa2: "#fa9d68",
                    capa3: "#fdf5ed",
                    capa4: "#f78da0"
                },
                texturaOpacidad: 0.55
            }
        }
    };
})();