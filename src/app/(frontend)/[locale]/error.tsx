'use client';

import { Container } from '@/components/atoms/Container';
import { Heading } from '@/components/atoms/Heading';
import { Text } from '@/components/atoms/Text';
import { Button } from '@/components/atoms/Button';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main data-component="bbf-error" className="flex min-h-[60vh] items-center py-24">
      <Container size="prose" className="text-center">
        <Heading level="h2" weight="bold" color="primary" className="mb-4">
          Algo salió mal
        </Heading>
        <Text variant="body-lg" color="secondary" className="mb-10">
          Ocurrió un error inesperado. Por favor intenta de nuevo.
        </Text>
        <Button intent="primary" size="lg" onClick={reset}>
          Reintentar
        </Button>
      </Container>
    </main>
  );
}
