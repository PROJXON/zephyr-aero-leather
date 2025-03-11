"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const backgroundImageUrl = "/ifr.jpg";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Added loading state

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    setLoading(true); // Disable button & show loading

    try {
      const response = await fetch("/api/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage("Check your email for a password reset link.");
      } else {
        setError(data.error || "An error occurred. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <section
      className="flex items-center justify-center min-h-screen bg-cover bg-center px-4"
      style={{ backgroundImage: `url(${backgroundImageUrl})` }}
    >
      <div className="relative w-full max-w-4xl min-h-[600px] bg-white shadow-lg rounded-xl flex flex-col md:flex-row overflow-hidden">
        {/* Left Panel */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-16 bg-[#605137] text-white rounded-t-xl md:rounded-l-xl md:rounded-tr-none">
          <h2 className="text-2xl font-bold mb-4 mt-2">Remember Password?</h2>
          <p className="text-center mt-2">Go back and sign in to your account.</p>

          <button
            onClick={() => router.push("/login")}
            className="mt-4 px-6 py-2 border border-white rounded-full hover:bg-white hover:text-[#605137] transition"
          >
            Sign In
          </button>
        </div>

        {/* Right Panel */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-6 md:p-10 bg-white bg-opacity-90 rounded-b-xl md:rounded-r-xl md:rounded-bl-none">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4 mt-2">
              Forgot Password
            </h1>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {message && <p className="text-green-500 text-sm">{message}</p>}

            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit} noValidate>
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 mb-4 bg-gray-100 border border-gray-700 text-gray-900 rounded-lg focus:ring-2 focus:ring-[#605137] placeholder-gray-400 transition-all"
                  placeholder="name@company.com"
                  required
                />
              </div>
              <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 bg-[#30291C] text-white font-bold rounded-full mt-4 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
