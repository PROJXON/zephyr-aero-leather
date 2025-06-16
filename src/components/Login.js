"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";

const CDN_URL = process.env.NEXT_PUBLIC_CDN_URL;
const backgroundImageUrl = `${CDN_URL}/ifr.jpg`;

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Added loading state
  const router = useRouter();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Email and password are required");
      return;
    }

    setLoading(true); // Disable button & show loading

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
        credentials: "include",
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Invalid email or password");
        setLoading(false); // Re-enable button on error
        return;
      }

      const data = await response.json();

      const userResponse = await fetch("/api/auth/user", {
        credentials: "include",
      });

      const userData = await userResponse.json();

      if (userData.isAuthenticated) {
        login(userData.user);
      } else {
        login(data.user);
      }

      router.push("/");
    } catch (error) {
      setError("An error occurred. Please try again.");
      console.error(error);
      setLoading(false); // Re-enable button on error
    }
  };

  return (
    <section className="relative flex items-center justify-center min-h-screen px-4">
  {/* Background Image with 50% opacity overlay */}
  <div
    className="absolute inset-0 bg-cover bg-center opacity-50"
    style={{ backgroundImage: `url(${backgroundImageUrl})`, zIndex: -1 }}
  />
      <div className="relative w-full max-w-4xl min-h-[600px] bg-white shadow-lg rounded-xl flex flex-col md:flex-row overflow-hidden">
        {/* Left Panel: Sign In Form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 bg-white bg-opacity-90 rounded-l-xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 mt-4">Sign in</h2>

          <form onSubmit={handleSubmit} className="w-full">
            {/* Email Input */}
            <input
              type="email"
              name="email"
              placeholder="name@company.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 mb-4 bg-gray-100 border border-gray-700 text-gray-900 rounded-lg focus:ring-2 focus:ring-[#605137] placeholder-gray-400 transition-all"
              required
              disabled={loading} // Disable input when loading
            />

            {/* Password Input with Show/Hide Button */}
            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-100 border border-gray-700 text-gray-900 rounded-lg focus:ring-2 focus:ring-[#605137] placeholder-gray-400 transition-all pr-16"
                required
                disabled={loading} // Disable input when loading
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-4 flex items-center text-sm text-[#605137] font-semibold hover:underline focus:outline-none"
                disabled={loading} // Disable toggle when loading
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            {/* Display Error Message */}
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

            {/* Forgot Password */}
            <p className="text-sm text-gray-600 mb-4 mt-2">
              Forgot your password?{" "}
              <Link href="/forgot-password" className="text-[#605137] font-semibold hover:text-[#30291C] transition">
                Click here
              </Link>
            </p>

            {/* Submit Button with Loading State */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 bg-[#30291C] text-neutral-dark font-bold rounded-full mt-4 bg-neutral-light  hover:bg-neutral-medium transition-colors ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>
        </div>

        {/* Right Panel: Sign Up Prompt */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-16 bg-[#605137] text-white rounded-r-xl">
          <h2 className="text-3xl font-bold">New Here?</h2>
          <p className="text-center mt-2">Create an account to start shopping with us.</p>

          <Link href="/register">
            <button className="mt-4 px-6 py-2 border border-white rounded-full hover:bg-white hover:text-[#605137] transition bg-neutral-light text-neutral-dark">
              Create Account
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Login;
