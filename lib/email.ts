import { Resend } from 'resend';
import type { SendEmailParams } from '../types/types';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({ to, subject, html }: SendEmailParams): Promise<boolean> {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Zephyr Aero Leather <contact@zephyraeroleather.com>',
      to,
      subject,
      html,
    });

    if (error) {
      console.error('Error sending email:', error);
      throw error;
    }

    console.log('Email sent:', data);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  };
};