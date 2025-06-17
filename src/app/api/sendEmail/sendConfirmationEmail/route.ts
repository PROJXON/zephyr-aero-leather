import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { ConfirmationEmailTemplate } from '@/components/email-template';
import type { NextRequest } from 'next/server';
import type { ResendError } from '../../../../../types/types';

const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = process.env.CONTACT_FORM_FROM_EMAIL!;

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const body = await request.json();
    const { name, email, message }: { name: string; email: string; message: string } = body;
    const data = await resend.emails.send({
      from: `Zephyr Aero Leather <${fromEmail}>`,
      to: [email],
      subject: 'Confirmation Email',
      react: ConfirmationEmailTemplate({ name, email, message }),
    });
    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error(error);
    const err = error as ResendError;
    return NextResponse.json({ error: err?.message || 'Failed to send confirmation email' });
  }
}