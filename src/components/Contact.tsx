"use client";

import { useState } from "react";
import type { ContactFormData } from "../../types/types";
import type { FormEvent, ChangeEvent } from "react";

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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
    <div className="contact-form bg-white p-8 rounded-lg my-24 max-w-2xl mx-auto shadow-sm">
      <h3 className="text-3xl font-semibold text-neutral-dark mb-6 text-center">Contact Us</h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="input-group">
          <label htmlFor="name" className="block text-sm font-medium text-neutral-dark mb-1">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            required
            disabled={sent}
            value={formData.name}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
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
            onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, email: e.target.value })}
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
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, message: e.target.value })}
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
  );
}
