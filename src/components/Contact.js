"use client";

import { useState } from "react";
import { FiMapPin, FiPhone, FiMail } from "react-icons/fi"; // Importing icons

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const confirmationEmail = async () => {  
    const response = await fetch('/api/sendEmail/sendConfirmationEmail', {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSending(true);

    const response = await fetch('/api/sendEmail', {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      confirmationEmail();
      setIsSending(false);
      setSent(true);
      setFormData({
        name: "",
        email: "",
        message: "",
      });
    } else {
      setIsSending(false);
    }
  };

  return (
      <div className="contact-form bg-gray-900 p-8 rounded-lg my-24 max-w-2xl mx-auto shadow-xl">
        <h3 className="text-3xl font-bold text-white mb-6 text-center">Contact Us</h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input 
              type="text" 
              id="name" 
              value={formData.name} 
              disabled={sent}
              required 
              onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
              className="w-full p-4 border border-gray-700 rounded-lg bg-gray-800 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
              placeholder=" "
            />
            <label 
              htmlFor="name"  
              className="absolute left-4 top-4 text-gray-400 transition-all duration-200 pointer-events-none peer-focus:-top-2 peer-focus:text-sm peer-focus:text-blue-500 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base"
            >
              Full Name
            </label>
          </div>

          <div className="relative">
            <input 
              type="email" 
              id="email" 
              value={formData.email} 
              disabled={sent}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required 
              className="w-full p-4 border border-gray-700 rounded-lg bg-gray-800 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
              placeholder=" "
            />
            <label 
              htmlFor="email"  
              className="absolute left-4 top-4 text-gray-400 transition-all duration-200 pointer-events-none peer-focus:-top-2 peer-focus:text-sm peer-focus:text-blue-500 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base"
            >
              Email
            </label>
          </div>

          <div className="relative">
            <textarea 
              id="message" 
              required 
              value={formData.message} 
              disabled={sent}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })} 
              className="w-full p-4 border border-gray-700 rounded-lg bg-gray-800 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200 min-h-[150px] resize-none"
              placeholder=" "
            ></textarea>
            <label 
              htmlFor="message"  
              className="absolute left-4 top-4 text-gray-400 transition-all duration-200 pointer-events-none peer-focus:-top-2 peer-focus:text-sm peer-focus:text-blue-500 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base"
            >
              Type your Message...
            </label>
          </div>

          <button 
            type="submit" 
            disabled={isSending || sent} 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {isSending ? "Sending..." : sent ? "Message Sent Successfully" : "Send Message"}
          </button>
        </form>
      </div>
  );
}
