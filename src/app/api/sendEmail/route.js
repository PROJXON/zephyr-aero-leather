import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { EmailTemplate } from '@/components/email-template';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
    try {
        const body = await request.json()

        const { name, email, message } = body
        const data = await resend.emails.send({
            from: 'Zephyr Aero Leather <confirmation@zephyraeroleather.com>',
            to: ['zephyr.aero.leather1@gmail.com'],
            subject: name + ' ' + 'Contact Us',
            react: EmailTemplate({ name, email, message }),
        });

        return NextResponse.json(data);
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error });
    }
}