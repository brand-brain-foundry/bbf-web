// src/app/api/webhooks/resend/route.ts
import { Webhook } from 'svix'
import { NextRequest, NextResponse } from 'next/server'

const WEBHOOK_SECRET = process.env.RESEND_WEBHOOK_SECRET

type ResendEventType =
  | 'email.sent'
  | 'email.delivered'
  | 'email.bounced'
  | 'email.complained'
  | 'email.delivery_delayed'
  | 'email.opened'
  | 'email.clicked'

type ResendEvent = {
  type: ResendEventType
  created_at: string
  data: {
    email_id: string
    from: string
    to: string[]
    subject: string
    bounce?: {
      message: string
      subType: string
      type: string
    }
  }
}

export async function POST(req: NextRequest) {
  if (!WEBHOOK_SECRET) {
    console.error('[resend-webhook] RESEND_WEBHOOK_SECRET missing')
    return NextResponse.json({ error: 'configuration error' }, { status: 500 })
  }

  // Raw body crítico para signature verification
  const body = await req.text()
  
  const svixHeaders = {
    'svix-id': req.headers.get('svix-id') ?? '',
    'svix-timestamp': req.headers.get('svix-timestamp') ?? '',
    'svix-signature': req.headers.get('svix-signature') ?? '',
  }

  // Verify signature
  const wh = new Webhook(WEBHOOK_SECRET)
  let event: ResendEvent

  try {
    event = wh.verify(body, svixHeaders) as ResendEvent
  } catch (err) {
    console.error('[resend-webhook] verification failed:', err)
    return NextResponse.json({ error: 'invalid signature' }, { status: 401 })
  }

  // Log estructurado por event type
  const baseLog = {
    emailId: event.data.email_id,
    to: event.data.to[0],
    subject: event.data.subject,
    timestamp: event.created_at,
  }

  switch (event.type) {
    case 'email.sent':
      console.log('[resend] sent', baseLog)
      break

    case 'email.delivered':
      console.log('[resend] delivered', baseLog)
      break

    case 'email.bounced':
      console.error('[resend] BOUNCED', {
        ...baseLog,
        bounce: event.data.bounce,
      })
      // TODO M10: persistir en Neon DB suppression list
      break

    case 'email.complained':
      console.error('[resend] COMPLAINT', baseLog)
      // TODO M10: persistir + auto-suppress
      break

    case 'email.delivery_delayed':
      console.warn('[resend] delivery delayed', baseLog)
      break

    case 'email.opened':
      console.log('[resend] opened', baseLog)
      break

    case 'email.clicked':
      console.log('[resend] clicked', baseLog)
      break

    default:
      console.warn('[resend] unknown event type:', (event as { type: string }).type)
  }

  // Siempre return 200 si verified (Resend reintenta si !200)
  return NextResponse.json({ ok: true }, { status: 200 })
}

// Healthcheck GET (opcional, útil para Resend testing)
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    endpoint: 'resend webhook receiver',
    events: [
      'email.sent',
      'email.delivered',
      'email.bounced',
      'email.complained',
      'email.delivery_delayed',
    ],
  })
}

// Next.js: evita body parsing automático
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'