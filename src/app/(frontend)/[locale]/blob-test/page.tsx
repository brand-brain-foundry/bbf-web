import { setRequestLocale } from 'next-intl/server';

import { BlobTestScene } from './_scene';

export default async function BlobTestPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <BlobTestScene />;
}
