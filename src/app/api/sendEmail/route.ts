import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { EmailTemplate } from '@/components/email-template';
import type { NextRequest } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);
const toEmail = process.env.CONTACT_FORM_TO_EMAIL!;
const fromEmail = process.env.CONTACT_FORM_FROM_EMAIL!;

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const body = await request.json();
    const { name, email, message }: { name: string; email: string; message: string } = body;
    const data = await resend.emails.send({
      from: `Zephyr Aero Leather <${fromEmail}>`,
      to: [toEmail],
      subject: name + ' ' + 'Contact Us',
      react: EmailTemplate({ name, email, message }),
    });
    return NextResponse.json(data);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error?.message || 'Failed to send email' });
  }
}