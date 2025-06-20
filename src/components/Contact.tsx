"use client";

import { useState } from "react";
import type { ContactFormData } from "../../types/types";
import type { FormEvent, ChangeEvent } from "react";

const CDN_URL = process.env.NEXT_PUBLIC_CDN_URL?.replace(/\/$/, '');
const backgroundImageUrl = `${CDN_URL}/ifr.jpg`;

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    message: "",
  });

  const confirmationEmail = async () => {
    await fetch("/api/sendEmail/sendConfirmationEmail", {
      method: "POST",
      body: JSON.stringify(formData),
      headers: { "Content-Type": "application/json" },
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSending(true);

    const res = await fetch("/api/sendEmail", {
      method: "POST",
      body: JSON.stringify(formData),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      confirmationEmail();
      setSent(true);
      setFormData({ name: "", email: "", message: "" });
    }
    setIsSending(false);
  };

  return (
    <section className="relative flex items-center justify-center min-h-screen px-4 py-8">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-50"
        style={{ backgroundImage: `url(${backgroundImageUrl})`, zIndex: -1 }}
      />
      <div className="relative contact-form bg-white p-8 rounded-lg w-full max-w-2xl shadow-lg bg-opacity-90">
        <h3 className="text-3xl font-semibold text-neutral-dark mb-6 text-center">Contact Us</h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="input-group">
            <label htmlFor="name" className="block text-sm font-medium text-neutral-dark mb-1">
              Name or Call Sign
            </label>
            <input
              type="text"
              id="name"
              required
              disabled={sent}
              value={formData.name}
              onChange={(event: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: event.target.value })}
              className="w-full px-4 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-1 focus:ring-neutral-medium"
            />
          </div>

          <div className="input-group">
            <label htmlFor="email" className="block text-sm font-medium text-neutral-dark mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              required
              disabled={sent}
              value={formData.email}
              onChange={(event: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, email: event.target.value })}
              className="w-full px-4 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-1 focus:ring-neutral-medium"
            />
          </div>

          <div className="input-group">
            <label htmlFor="message" className="block text-sm font-medium text-neutral-dark mb-1">
              Message
            </label>
            <textarea
              id="message"
              required
              disabled={sent}
              value={formData.message}
              onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, message: event.target.value })}
              className="w-full px-4 py-2 border border-neutral-light rounded-md min-h-[150px] resize-none focus:outline-none focus:ring-1 focus:ring-neutral-medium"
            ></textarea>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isSending || sent}
              className="py-2 px-6 text-sm font-medium bg-neutral-light text-neutral-dark rounded hover:bg-neutral-medium transition-colors disabled:bg-neutral-medium disabled:cursor-not-allowed"
            >
              {isSending ? "Sending..." : sent ? "Message Sent Successfully" : "Send Message"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
