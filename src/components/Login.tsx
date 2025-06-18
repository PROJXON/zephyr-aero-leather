"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import type { LoginFormData, ApiResponse, User } from "../../types/types";

const CDN_URL = process.env.NEXT_PUBLIC_CDN_URL?.replace(/\/$/, '');
const backgroundImageUrl = `${CDN_URL}/ifr.jpg`;

const Login = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Email and password are required");
      return;
    }

    setLoading(true);

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
        setLoading(false);
        return;
      }

      const data: ApiResponse<User> = await response.json();

      const userResponse = await fetch("/api/auth/user", {
        credentials: "include",
      });

      const userData = await userResponse.json();

      if (userData.isAuthenticated) {
        login(userData.user);
      } else {
        login(data.user!);
      }

      router.push("/");
    } catch (error) {
      setError("An error occurred. Please try again.");
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <section className="relative flex items-center justify-center min-h-screen px-4 py-8">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-50"
        style={{ backgroundImage: `url(${backgroundImageUrl})`, zIndex: -1 }}
      />
      <div className="relative w-full max-w-4xl h-[500px] bg-white shadow-lg rounded-xl flex flex-col md:flex-row overflow-hidden">
        {/* Left Panel: Sign In Form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-6 md:p-8 bg-white bg-opacity-90 rounded-t-xl md:rounded-l-xl md:rounded-tr-none">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Sign in</h2>

          <form onSubmit={handleSubmit} className="w-full">
            {/* Email Input */}
            <input
              type="email"
              name="email"
              placeholder="name@company.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 mb-4 bg-gray-100 border border-gray-300 text-gray-900 rounded-lg focus:ring-0 focus:border-neutral-dark placeholder-gray-400 transition-all"
              required
              disabled={loading}
            />

            {/* Password Input with Show/Hide Button */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-100 border border-gray-300 text-gray-900 rounded-lg focus:ring-0 focus:border-neutral-dark placeholder-gray-400 transition-all pr-16"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-4 flex items-center text-sm text-neutral-dark font-semibold focus:outline-none"
                disabled={loading}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                )}
              </button>
            </div>

            {/* Display Error Message */}
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

            {/* Forgot Password */}
            <p className="text-sm text-gray-600 mb-4 mt-2">
              Forgot your password?{" "}
              <Link href="/forgot-password" className="text-neutral-dark font-semibold hover:text-neutral-medium transition">
                Click here
              </Link>
            </p>

            {/* Submit Button with Loading State */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-4 text-sm font-medium bg-neutral-light text-neutral-dark rounded hover:bg-neutral-medium hover:text-white transition-colors ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>
        </div>

        {/* Right Panel: Sign Up Prompt */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-16 bg-neutral-dark text-white rounded-b-xl md:rounded-r-xl md:rounded-bl-none md:mt-0 mt-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center">New Here?</h2>
          <p className="text-center mt-2 mb-6">Create an account to start shopping with us.</p>

          <Link href="/register">
            <button className="w-full md:w-auto px-6 py-2 text-sm font-medium bg-neutral-light text-neutral-dark rounded hover:bg-neutral-medium hover:text-white transition-colors">
              Create Account
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Login; 