/**
 * verify-webgl2-fail.js — simula el fallo de cliente exacto del incidente
 * PR#24 (HAL-SBWEB-CLIENT-COMPONENT-NO-BOUNDARY-01).
 *
 * El motor real de un componente WebGL2 típicamente hace un pre-check SIN
 * opciones (`getContext('webgl2')`) y luego, si pasa, el motor real pide
 * el contexto CON opciones (ej. `getContext('webgl2', { antialias: false,
 * alpha: false })`). En navegadores/GPUs donde WebGL2-con-opciones falla
 * pero WebGL2-sin-opciones no (el caso real que crasheó producción en
 * Safari/móvil/GPUs limitadas — invisible en Chrome desktop, por eso no
 * se cazó antes de merge), el pre-check pasa y el motor real lanza. Ese
 * es el hueco exacto.
 *
 * Este snippet parchea `HTMLCanvasElement.prototype.getContext` para
 * lanzar SOLO cuando se piden opciones — reproduce el hueco sin depender
 * del hardware/navegador real que falló. curl y Docker NUNCA cazan esto:
 * es un fallo 100% de cliente (browser), el servidor nunca ejecuta WebGL2.
 *
 * Reutilizable para cualquier componente WebGL/canvas futuro — no
 * depende del componente específico del blob (BrandGradientBackground
 * vive en `preview/blob-hero-fix`, no en `main`).
 *
 * Uso — consola del navegador (manual):
 *   1. Levantar el server real: ./scripts/verify-prod-build.sh (o Docker,
 *      ver docs/verify-prod-build.md).
 *   2. Abrir la URL servida en un navegador real.
 *   3. Pegar este archivo completo en la consola ANTES de que el
 *      componente WebGL monte, luego recargar la página (F5) para que
 *      el parche esté activo desde el primer render.
 *   4. Confirmar: el componente degrada (fallback visible, sin crash de
 *      página) en vez de tumbar todo — eso es lo que un Error Boundary +
 *      try/catch en el motor deben garantizar (HAL siguiente, no
 *      resuelto por esta herramienta).
 *
 * Uso — automatizado (Playwright/Puppeteer):
 *   await page.addInitScript({ path: 'scripts/verify-webgl2-fail.js' });
 *   // addInitScript corre ANTES que cualquier script de la página —
 *   // necesario para que el parche esté activo desde el primer render.
 */
(function () {
  const originalGetContext = HTMLCanvasElement.prototype.getContext;

  HTMLCanvasElement.prototype.getContext = function (type, options) {
    if (type === 'webgl2' && options !== undefined) {
      // eslint-disable-next-line no-console
      console.warn(
        '[verify-webgl2-fail] simulando fallo: getContext("webgl2", <options>) lanza — hueco HAL-SBWEB-CLIENT-COMPONENT-NO-BOUNDARY-01',
      );
      throw new Error('[verify-webgl2-fail] WebGL2 con opciones simulado como no soportado');
    }
    return originalGetContext.call(this, type, options);
  };

  // eslint-disable-next-line no-console
  console.info(
    '[verify-webgl2-fail] parche activo — getContext("webgl2", <options>) lanzará en este documento',
  );
})();
