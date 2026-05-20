import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const contactId = searchParams.get('contactId');
  const audienceId = searchParams.get('audienceId');

  if (!contactId || !audienceId) {
    return NextResponse.redirect(new URL('/newsletter/error?reason=invalid', request.url));
  }

  try {
    const { error } = await resend.contacts.update({
      audienceId,
      id: contactId,
      unsubscribed: false,
    });

    if (error) {
      console.error('[newsletter/confirm] Update failed', error);
      return NextResponse.redirect(new URL('/newsletter/error?reason=provider', request.url));
    }

    return NextResponse.redirect(new URL('/newsletter/confirmed', request.url));
  } catch (err) {
    console.error('[newsletter/confirm] Unexpected error', err);
    return NextResponse.redirect(new URL('/newsletter/error?reason=unexpected', request.url));
  }
}
