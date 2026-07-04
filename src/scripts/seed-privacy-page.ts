/**
 * Seed Pages "privacy" ES+EN — D-BBF-PRIVACY Fase 3 (B-BBF-WEB-PRIVACY-PAGE-02)
 *
 * Fuente: bbf-docs/04-strategic/web-public/Content/Final/SB_PrivacyPolicy_ES-EN.md
 * (ya ajustado Paso 1: entidad Sivar Films + cookies a realidad, H-556 opción a).
 *
 * layout (blocks, localized:true) NO sufre el bug L-BBF-256 (arrays con
 * sub-fields localized) — cada locale es su propio set de filas vía columna
 * _locale en pages_blocks_rich_text, no un side-table _locales compartido.
 * Por eso basta con 2 llamadas Payload API (create ES, update EN), sin SQL raw.
 *
 * Usage:
 *   set -a && source .env.local && set +a && pnpm tsx src/scripts/seed-privacy-page.ts
 */

import { getPayload } from 'payload';
import { editorConfigFactory, convertMarkdownToLexical } from '@payloadcms/richtext-lexical';
import config from '../payload.config';

try {
  process.loadEnvFile('.env.local');
} catch {
  // vars expected from shell environment
}

// ── Contenido (copiado de SB_PrivacyPolicy_ES-EN.md tras el ajuste Paso 1) ──

const BODY_MD_ES = `## Introducción

Sivar Brains (“Sivar Brains”, “nosotros” o “nuestro”) respeta tu privacidad y se compromete a protegerla. Esta Política de Privacidad explica cómo recopilamos, usamos, divulgamos y protegemos la información cuando visitas o interactúas con nuestro sitio web público, incluyendo sivarbrains.com y cualquier otro sitio que enlace a esta Política (en conjunto, el “Sitio Web”).

Esta Política de Privacidad aplica únicamente a nuestro Sitio Web y a las interacciones públicas. No aplica a los cerebros de marca ni a los sistemas operativos que construimos para nuestros clientes, que se rigen por los acuerdos y condiciones establecidos con cada cliente.

Al acceder o usar el Sitio Web, aceptas las prácticas descritas en esta Política de Privacidad.

El Sitio Web opera bajo la marca comercial “Sivar Brains”, un proyecto de SIVAR FILMS, SOCIEDAD ANÓNIMA DE CAPITAL VARIABLE (“Sivar Films”), responsable legal del tratamiento de los datos descritos en esta Política.

## Alcance

Esta política aplica a:

- Visitantes de nuestro Sitio Web.
- Personas que interactúan con nosotros a través de formularios, suscripciones o páginas de contacto.

Esta política no aplica a:

- Datos procesados dentro de los sistemas que construimos para clientes.
- Servicios de terceros que no controlamos.

## Información que recopilamos

**Información que tú proporcionas.** Podemos recopilar información que nos entregas directamente, por ejemplo cuando:

- Solicitas una conversación, una propuesta o una demostración.
- Te suscribes a comunicaciones o newsletters.
- Envías formularios de contacto o correos electrónicos.

La información que proporcionas puede incluir tu nombre y datos de contacto, información profesional (empresa, cargo), el contenido de tu mensaje, y cualquier otra información que decidas compartir.

**Información recopilada automáticamente.** El Sitio Web utiliza únicamente cookies estrictamente necesarias para su funcionamiento (por ejemplo, para recordar tu preferencia de idioma). Actualmente no utilizamos cookies ni tecnologías de analítica o marketing de terceros.

**Información de otras fuentes.** Podemos recibir información de socios de negocio y fuentes disponibles públicamente.

## Cómo usamos la información

Usamos la información para operar, mantener y mejorar el Sitio Web; responder a consultas y comunicarnos contigo; enviarte comunicaciones cuando lo has autorizado; analizar el uso y el rendimiento del Sitio Web; y proteger nuestros derechos, seguridad y cumplimiento.

## Cómo compartimos la información

Podemos compartir información con proveedores de servicios que dan soporte a nuestro Sitio Web y analítica; con partes involucradas en transacciones corporativas; con autoridades cuando la ley lo exige; y con terceros cuando la información está agregada o anonimizada.

**No vendemos tu información personal.**

## Transferencias internacionales de datos

Podemos procesar y almacenar información en El Salvador y en otros países donde operan nuestros proveedores de servicios. Cuando sea necesario, aplicamos las salvaguardas apropiadas para las transferencias transfronterizas.

## Cookies y tecnologías similares

Usamos solo cookies estrictamente necesarias para el funcionamiento del Sitio Web (por ejemplo, para recordar tu preferencia de idioma). Actualmente no usamos cookies de analítica ni de marketing de terceros. Tu navegador puede permitirte rechazar cookies, aunque hacerlo podría limitar algunas funciones del Sitio Web.

## Tus opciones y derechos

**Comunicaciones.** Puedes darte de baja de nuestras comunicaciones usando el enlace de cancelación o escribiéndonos.

**Cookies.** Puedes controlar las cookies mediante la configuración de tu navegador.

**Derechos bajo la legislación aplicable.** Según tu ubicación, puedes tener derecho a acceder, rectificar, eliminar o restringir el uso de tu información, o a oponerte a ciertos tratamientos. Los residentes de El Salvador cuentan con los derechos reconocidos por la Ley de Protección de Datos Personales aplicable. Para ejercer cualquier derecho, escríbenos a **privacidad@sivarbrains.com**.

## Retención de datos

Conservamos la información personal durante el tiempo necesario para los fines descritos en esta política o según lo exija la ley.

## Seguridad de los datos

Aplicamos medidas técnicas y organizativas apropiadas para proteger la información. Sin embargo, ningún método de transmisión o almacenamiento es completamente seguro.

## Privacidad de menores

El Sitio Web no está dirigido a menores de edad y no recopilamos información de ellos de forma consciente.

## Enlaces a terceros

Nuestro Sitio Web puede contener enlaces a sitios de terceros. No somos responsables de sus prácticas de privacidad.

## Cambios a esta Política

Podemos actualizar esta Política de Privacidad de tiempo en tiempo. La versión actualizada se publicará en esta página.

## Contacto

Si tienes preguntas o deseas ejercer tus derechos de privacidad, escríbenos:

**Sivar Brains**
Correo: **privacidad@sivarbrains.com**

SIVAR FILMS, SOCIEDAD ANÓNIMA DE CAPITAL VARIABLE
Centro Comercial Feria Rosa, Local 219B, San Salvador, El Salvador
Correo legal: **hola@sivarfilms.com** · Tel: +503 7729-5285

*Última actualización: 4 de julio de 2026.*
`;

const BODY_MD_EN = `## Introduction

Sivar Brains (“Sivar Brains,” “we,” “us,” or “our”) respects your privacy and is committed to protecting it. This Privacy Policy explains how we collect, use, disclose, and protect information when you visit or interact with our public website, including sivarbrains.com and any other sites that link to this Privacy Policy (collectively, the “Website”).

This Privacy Policy applies only to our Website and public-facing interactions. It does not apply to the brand brains or operating systems we build for our clients, which are governed by the agreements and terms established with each client.

By accessing or using the Website, you agree to the practices described in this Privacy Policy.

The Website operates under the commercial brand “Sivar Brains,” a project of SIVAR FILMS, SOCIEDAD ANÓNIMA DE CAPITAL VARIABLE (“Sivar Films”), the legal entity responsible for the data processing described in this Policy.

## Scope

This policy applies to:

- Visitors to our Website.
- Individuals who interact with us through forms, sign-ups, or contact pages.

This policy does not apply to:

- Data processed within the systems we build for clients.
- Third-party services we do not control.

## Information We Collect

**Information you provide.** We may collect information you provide directly, such as when you:

- Request a conversation, a proposal, or a demo.
- Subscribe to communications or newsletters.
- Submit contact forms or send emails.

Information you provide may include your name and contact details, professional information (company, role), the content of your message, and any other information you choose to share.

**Information collected automatically.** The Website uses only strictly necessary cookies for its operation (for example, to remember your language preference). We do not currently use analytics or third-party marketing cookies or technologies.

**Information from other sources.** We may receive information from business partners and publicly available sources.

## How We Use Information

We use information to operate, maintain, and improve the Website; respond to inquiries and communicate with you; send communications where you have authorized them; analyze Website usage and performance; and protect our rights, security, and compliance.

## How We Share Information

We may share information with service providers that support our Website and analytics; with parties involved in corporate transactions; with legal authorities where required; and with third parties where the information is aggregated or de-identified.

**We do not sell your personal information.**

## International Data Transfers

We may process and store information in El Salvador and in other countries where our service providers operate. Where required, we apply appropriate safeguards for cross-border transfers.

## Cookies and Similar Technologies

We use only strictly necessary cookies for the Website's operation (for example, to remember your language preference). We do not currently use analytics or third-party marketing cookies. Your browser may allow you to refuse cookies, although doing so may limit some Website functionality.

## Your Choices and Rights

**Communications.** You may opt out of our communications using the unsubscribe link or by contacting us.

**Cookies.** You may control cookies through your browser settings.

**Rights under applicable law.** Depending on your location, you may have the right to access, correct, delete, or restrict the use of your information, or to object to certain processing. Residents of El Salvador have the rights recognized under the applicable Personal Data Protection Law. To exercise any right, write to us at **privacidad@sivarbrains.com**.

## Data Retention

We retain personal information for as long as needed for the purposes described in this policy or as required by law.

## Data Security

We use appropriate technical and organizational measures to protect information. However, no method of transmission or storage is completely secure.

## Children's Privacy

The Website is not intended for minors, and we do not knowingly collect information from them.

## Third-Party Links

Our Website may contain links to third-party websites. We are not responsible for their privacy practices.

## Changes to This Privacy Policy

We may update this Privacy Policy from time to time. The updated version will be posted on this page.

## Contact Us

If you have questions or wish to exercise your privacy rights, contact us:

**Sivar Brains**
Email: **privacidad@sivarbrains.com**

SIVAR FILMS, SOCIEDAD ANÓNIMA DE CAPITAL VARIABLE
Centro Comercial Feria Rosa, Local 219B, San Salvador, El Salvador
Legal email: **hola@sivarfilms.com** · Tel: +503 7729-5285

*Last updated: July 4, 2026.*
`;

const TITLE_ES = 'Política de Privacidad';
const TITLE_EN = 'Privacy Policy';
const SLUG_ES = 'privacidad';
const SLUG_EN = 'privacy';

const SEO_ES = {
  title: 'Política de Privacidad — Sivar Brains',
  description:
    'Cómo Sivar Brains recopila, usa y protege tu información en sivarbrains.com. Solo cookies necesarias — sin analítica ni marketing de terceros por ahora.',
};

const SEO_EN = {
  title: 'Privacy Policy — Sivar Brains',
  description:
    'How Sivar Brains collects, uses, and protects your information on sivarbrains.com. Only necessary cookies — no analytics or third-party marketing today.',
};

async function seedPrivacyPage() {
  const payload = await getPayload({ config });

  console.log('[seed-privacy-page] D-BBF-PRIVACY Fase 3 — Pages "privacy" ES+EN');

  const editorConfig = await editorConfigFactory.default({ config: payload.config });

  const lexicalEs = convertMarkdownToLexical({ editorConfig, markdown: BODY_MD_ES });
  const lexicalEn = convertMarkdownToLexical({ editorConfig, markdown: BODY_MD_EN });

  // ── PASO 1: crear con locale ES ────────────────────────────────────────────
  // @ts-justify: Pages recién generó payload-types con layout — tipos pendientes de refresh en este script standalone
  const created = await (payload.create as Function)({
    collection: 'pages',
    locale: 'es',
    data: {
      title: TITLE_ES,
      slug: SLUG_ES,
      layout: [{ blockType: 'rich-text', body: lexicalEs }],
      meta: {
        title: SEO_ES.title,
        description: SEO_ES.description,
        noIndex: true,
      },
      // Pages.afterChange (revalidatePage) ya tolera correr fuera de
      // contexto de request Next.js (try/catch, mismo patrón que
      // revalidateGlobal.ts) — seguro publicar directo desde un script.
      _status: 'published',
    },
  });

  const pageId = created.id;
  console.log(`[1/2] ✅ locale ES creado — id=${pageId} slug=${SLUG_ES}`);

  // ── PASO 2: actualizar con locale EN (fila independiente, sin orphaning) ──
  await (payload.update as Function)({
    collection: 'pages',
    id: pageId,
    locale: 'en',
    data: {
      title: TITLE_EN,
      slug: SLUG_EN,
      layout: [{ blockType: 'rich-text', body: lexicalEn }],
      meta: {
        title: SEO_EN.title,
        description: SEO_EN.description,
        noIndex: true,
      },
    },
  });

  console.log(`[2/2] ✅ locale EN actualizado — id=${pageId} slug=${SLUG_EN}`);

  // ── VERIFICACIÓN ────────────────────────────────────────────────────────
  const verifyEs = await (payload.findByID as Function)({
    collection: 'pages',
    id: pageId,
    locale: 'es',
    depth: 0,
  });
  const verifyEn = await (payload.findByID as Function)({
    collection: 'pages',
    id: pageId,
    locale: 'en',
    depth: 0,
  });

  console.log('');
  console.log('[seed-privacy-page] Verificación:');
  console.log(
    `   ES: title="${verifyEs.title}" slug="${verifyEs.slug}" path="${verifyEs.path}" layout blocks=${verifyEs.layout?.length ?? 0} noIndex=${verifyEs.meta?.noIndex}`,
  );
  console.log(
    `   EN: title="${verifyEn.title}" slug="${verifyEn.slug}" path="${verifyEn.path}" layout blocks=${verifyEn.layout?.length ?? 0} noIndex=${verifyEn.meta?.noIndex}`,
  );

  const pass =
    verifyEs.slug === SLUG_ES &&
    verifyEn.slug === SLUG_EN &&
    (verifyEs.layout?.length ?? 0) === 1 &&
    (verifyEn.layout?.length ?? 0) === 1 &&
    verifyEs.meta?.noIndex === true &&
    verifyEn.meta?.noIndex === true;

  if (pass) {
    console.log('');
    console.log(
      '✅ Page "privacy" creada y PUBLICADA — ES+EN, layout 1 block c/u, noIndex=true ambos',
    );
  } else {
    throw new Error('[seed-privacy-page] ERROR: verificación falló — revisar logs arriba');
  }

  process.exit(0);
}

seedPrivacyPage().catch((err) => {
  console.error('[seed-privacy-page] ERROR:', err);
  process.exit(1);
});
