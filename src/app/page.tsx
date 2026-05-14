export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-12">
      <div className="flex flex-col items-center text-center max-w-3xl">
        {/* Logo BBF (placeholder textual hasta tener SVG) */}
        <div className="mb-12 text-2xl font-bold tracking-tight">brand brain foundry</div>

        {/* Headline canónico D-BBF-WEB-23 */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-tight mb-6">
          construimos
          <br />
          cerebros de marca.
        </h1>

        {/* Subheadline */}
        <p className="text-lg sm:text-xl mb-10 opacity-80">Próximamente.</p>

        {/* CTA pill button */}
        <a
          href="mailto:contacto@brandbrainfoundry.com"
          className="inline-flex items-center justify-center rounded-full bg-black px-8 py-4 text-base font-medium text-white transition-opacity hover:opacity-90"
        >
          contactanos
        </a>
      </div>
    </main>
  );
}
