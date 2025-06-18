"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import type { AuthApiResponse } from "../../types/types";

const CDN_URL = process.env.NEXT_PUBLIC_CDN_URL;
const backgroundImageUrl = `${CDN_URL}/ifr.jpg`;

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  termsAccepted: boolean;
}

const Register = () => {
  const [formData, setFormdata] = useState<RegisterFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "", 
    termsAccepted: false,
  });

  const [error, setError] = useState("");
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { setUser, login } = useAuth();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;
    setFormdata((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const isValidEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); 
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("All fields are required");
      return;
    }
  
    if (!isValidEmail(formData.email)) {
      setError("Invalid email format");
      return;
    }
  
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
  
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
  
    if (!formData.termsAccepted) {
      setError("You must accept the terms and conditions");
      return;
    }
    
    setLoading(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });
  
      const data: AuthApiResponse = await response.json();
  
      if (!response.ok) {
        setError(data.error || "Failed to create an account");
        setLoading(false);
        return;
      }

      const loginResponse = await fetch("/api/login", {
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

      const loginData: AuthApiResponse = await loginResponse.json();
      login(loginData.user!);
  
      if (!loginResponse.ok) {
        setError(loginData.error || "Failed to log in");
        return;
      }

      const userResponse = await fetch("/api/auth/user", { credentials: "include" });
      const userData = await userResponse.json();
      if (userData.isAuthenticated) {
        setUser(userData.user); // Make sure to set the latest user data
      }

      router.push("/");
    } catch (error) {
      setError("An error occurred. Please try again.");
      console.error(error);
      setLoading(false); // Re-enable button on error
    }
  };  

  return (
    <section className="relative flex items-center justify-center min-h-screen px-4 py-8 md:py-4">
      {/* Background Image with 50% opacity overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-50"
        style={{ backgroundImage: `url(${backgroundImageUrl})`, zIndex: -1 }}
      />

      <div className="relative w-full max-w-4xl h-[650px] md:h-[700px] bg-white shadow-lg rounded-xl flex flex-col md:flex-row overflow-hidden mb-8 md:mb-0">
        {/* Left: Already Have an Account? - Hidden on mobile */}
        <div className="hidden md:flex w-full md:w-1/2 flex-col justify-center items-center p-8 md:p-16 bg-neutral-dark text-white rounded-t-xl md:rounded-l-xl md:rounded-tr-none">
          <h2 className="text-2xl md:text-3xl font-bold text-center">Welcome Back!</h2>
          <p className="text-center mt-2 mb-6">Already have an account? Sign in now.</p>
          
          <Link href="/login">
            <button className="w-full md:w-auto px-6 py-2 text-sm font-medium bg-neutral-light text-neutral-dark rounded hover:bg-neutral-medium hover:text-white transition-colors">
              Sign In
            </button>
          </Link>
        </div>

        {/* Right: Register Form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-6 md:p-10 bg-white bg-opacity-90 rounded-b-xl md:rounded-r-xl md:rounded-bl-none">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Create an account
          </h1>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <form className="w-full" onSubmit={handleSubmit} noValidate>
            <input 
              type="text" 
              name="name" 
              id="name" 
              autoComplete="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 mb-4 bg-gray-100 border border-gray-300 text-gray-900 rounded-lg focus:ring-0 focus:border-neutral-dark placeholder-gray-400 transition-all" 
              placeholder="Name or Callsign" 
              required 
              disabled={loading}
            />
            <input 
              type="email" 
              name="email" 
              id="email" 
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 mb-4 bg-gray-100 border border-gray-300 text-gray-900 rounded-lg focus:ring-0 focus:border-neutral-dark placeholder-gray-400 transition-all" 
              placeholder="maverick@topgun.com" 
              required 
              disabled={loading}
            />
            <div className="relative mb-4">
              <input 
                type={showPassword ? "text" : "password"} 
                name="password" 
                id="password" 
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-100 border border-gray-300 text-gray-900 rounded-lg focus:ring-0 focus:border-neutral-dark placeholder-gray-400 transition-all" 
                placeholder="••••••••" 
                required 
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
            <div className="relative mb-4">
              <input 
                type={showPassword ? "text" : "password"} 
                name="confirmPassword" 
                id="confirmPassword" 
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-100 border border-gray-300 text-gray-900 rounded-lg focus:ring-0 focus:border-neutral-dark placeholder-gray-400 transition-all" 
                placeholder="••••••••" 
                required 
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
            <div className="flex items-start mb-4">
              <div className="flex items-center h-5">
                <input 
                  id="terms"
                  aria-describedby="terms" 
                  type="checkbox"
                  name="termsAccepted"
                  checked={formData.termsAccepted}
                  onChange={handleChange}
                  className="w-5 h-5 border border-gray-300 rounded bg-gray-50 focus:ring-2 focus:ring-neutral-dark transition accent-neutral-dark"
                  required
                  disabled={loading}
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="font-light">I accept the <a className="font-medium text-neutral-dark hover:underline" href="/terms">Terms and Conditions</a></label>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-4 text-sm font-medium bg-neutral-light text-neutral-dark rounded hover:bg-neutral-medium hover:text-white transition-colors ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Register; 