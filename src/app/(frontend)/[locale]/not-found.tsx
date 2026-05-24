import { Container } from '@/components/atoms/Container';
import { Heading } from '@/components/atoms/Heading';
import { Text } from '@/components/atoms/Text';
import { Button } from '@/components/atoms/Button';
import Link from 'next/link';

export default function NotFound() {
  return (
    <main data-component="bbf-not-found" className="flex min-h-[60vh] items-center py-24">
      <Container size="prose" className="text-center">
        <Heading level="display-1" as="h1" weight="bold" color="primary" className="mb-4">
          404
        </Heading>
        <Heading level="h3" weight="regular" color="secondary" className="mb-6">
          Página no encontrada
        </Heading>
        <Text variant="body-lg" color="secondary" className="mb-10">
          Esta página no existe o fue movida.
        </Text>
        <Button asChild intent="primary" size="lg">
          <Link href="/">Volver al inicio</Link>
        </Button>
      </Container>
    </main>
  );
}
