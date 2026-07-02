/**
 * On-demand revalidation — H-BBF-523.
 *
 * Route Handler dedicado: revalidatePath/revalidateTag SOLO garantizan
 * invalidar la cache ISR real cuando corren dentro del contexto de ejecución
 * de un Route Handler (o Server Function) de Next.js — no cuando se llaman
 * inline desde dentro del ciclo de vida async de un hook de Payload (ver
 * B-BBF-WEB-DIAG-REVALIDACION-FONDO). Los hooks de Payload deben hacer un
 * fetch() HTTP real a este endpoint en vez de importar revalidatePath/Tag
 * directamente.
 *
 * Auth: header x-revalidate-secret debe matchear PAYLOAD_SECRET — sin esto,
 * cualquiera podría forzar regeneración de páginas (vector de abuso/DoS
 * de cómputo). Interno únicamente — no se expone a formularios públicos.
 */
import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { env } from '@/lib/env';

export const dynamic = 'force-dynamic';

const RevalidateSchema = z.object({
  paths: z.array(z.string().min(1)).max(20).optional(),
  type: z.enum(['page', 'layout']).optional(),
  tags: z.array(z.string().min(1)).max(20).optional(),
});

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-revalidate-secret');
  if (!secret || secret !== env.PAYLOAD_SECRET) {
    return NextResponse.json({ revalidated: false, error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = RevalidateSchema.safeParse(body);

  if (!parsed.success || (!parsed.data.paths?.length && !parsed.data.tags?.length)) {
    return NextResponse.json(
      { revalidated: false, error: 'Missing paths or tags' },
      { status: 400 },
    );
  }

  const { paths = [], type, tags = [] } = parsed.data;

  for (const path of paths) {
    revalidatePath(path, type);
  }
  for (const tag of tags) {
    revalidateTag(tag);
  }

  return NextResponse.json({ revalidated: true, paths, tags, now: Date.now() });
}
