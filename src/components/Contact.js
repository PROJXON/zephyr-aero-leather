"use client";

import { useState } from "react";
import { FiMapPin, FiPhone, FiMail } from "react-icons/fi"; // Importing icons

export default function Contact() {
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSending(true);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSending(false);
    alert("Message sent successfully!");
  };

  return (
    <div className="contact-container text-white">
      {/* Left Section - Contact Info */}
      <div className="contact-info">
        <h2 className="text-4xl font-bold text-[#90D3B6]">Contact Us</h2>
        <p className="text-lg text-gray-300">We would love to hear from you! Please reach out with any questions or comments.</p>

        <div className="info-item">
  <div className="info-label">
    <FiMapPin className="icon text-[#90D3B6] text-2xl" />
    <span>Address:</span>
  </div>
  <span className="info-value">Las Vegas, NV</span>
</div>

<div className="info-item">
  <div className="info-label">
    <FiPhone className="icon text-[#90D3B6] text-2xl" />
    <span>Phone:</span>
  </div>
  <span className="info-value">000-000-0000</span>
</div>

<div className="info-item">
  <div className="info-label">
    <FiMail className="icon text-[#90D3B6] text-2xl" />
    <span>Email:</span>
  </div>
  <span className="info-value">test@gmail.com</span>
</div>



      </div>

      {/* Right Section - Contact Form */}
      <div className="contact-form bg-gray-900 p-6 rounded-lg mt-8">
        <div className="border-animation"></div>

        <h3 className="text-2xl font-bold text-white mb-4">Send Message</h3>

        <form onSubmit={handleSubmit}>
          <div className="input-group mb-4">
            <input type="text" id="name" required className="w-full p-3 border border-gray-700 rounded-lg bg-gray-800 text-white"/>
            <label htmlFor="name" className="text-gray-400">Full Name</label>
          </div>

          <div className="input-group mb-4">
            <input type="email" id="email" required className="w-full p-3 border border-gray-700 rounded-lg bg-gray-800 text-white"/>
            <label htmlFor="email" className="text-gray-400">Email</label>
          </div>

          <div className="input-group mb-4">
            <textarea id="message" required className="w-full p-3 border border-gray-700 rounded-lg bg-gray-800 text-white"></textarea>
            <label htmlFor="message" className="text-gray-400">Type your Message...</label>
          </div>

          <button type="submit" disabled={isSending} className={`w-full py-3 rounded-lg text-white font-bold ${isSending ? "bg-gray-600" : "bg-[#90D3B6] hover:bg-[#78C2A4] transition"}`}>
            {isSending ? "Sending..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
}
