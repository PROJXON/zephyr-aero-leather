"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

const CDN_URL = process.env.NEXT_PUBLIC_CDN_URL;
const backgroundImageUrl = `${CDN_URL}/ifr.jpg`;

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
    <section className="relative flex items-center justify-center min-h-screen px-4 py-8">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-50"
        style={{ backgroundImage: `url(${backgroundImageUrl})`, zIndex: -1 }}
      />

      <div className="relative w-full max-w-4xl min-h-[600px] bg-white shadow-lg rounded-xl flex flex-col md:flex-row overflow-hidden">
        {/* Left Panel */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-16 bg-neutral-dark text-white rounded-t-xl md:rounded-l-xl md:rounded-tr-none">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 mt-2">Remember Password?</h2>
          <p className="text-center mt-2 mb-6">Go back and sign in to your account.</p>

          <button
            onClick={() => router.push("/login")}
            className="w-full md:w-auto px-6 py-2 text-sm font-medium bg-neutral-light text-neutral-dark rounded hover:bg-neutral-medium hover:text-white transition-colors"
          >
            Sign In
          </button>
        </div>

        {/* Right Panel */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-6 md:p-10 bg-white bg-opacity-90 rounded-b-xl md:rounded-r-xl md:rounded-bl-none">
          <div className="p-4 md:p-6 space-y-4 md:space-y-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 mt-2">
              Forgot Password
            </h1>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {message && <p className="text-green-500 text-sm">{message}</p>}

            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit} noValidate>
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 mb-4 bg-gray-100 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-neutral-dark placeholder-gray-400 transition-all"
                  placeholder="name@company.com"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 px-4 text-sm font-medium bg-neutral-light text-neutral-dark rounded hover:bg-neutral-medium hover:text-white transition-colors ${
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
