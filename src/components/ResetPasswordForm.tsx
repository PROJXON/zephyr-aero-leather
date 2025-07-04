"use client";

import { useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import type { ResetPasswordFormState, ResetPasswordResponse } from "../../types/types";
import type { JSX } from "react";

export default function ResetPasswordForm(): JSX.Element {
  const [formState, setFormState] = useState<ResetPasswordFormState>({
    password: "",
    confirmPassword: "",
    error: "",
    message: "",
    loading: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { login } = useAuth();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormState((prev) => ({ ...prev, error: "", message: "" }));

    if (!token) {
      setFormState((prev) => ({ ...prev, error: "Invalid reset token" }));
      return;
    }
    if (formState.password.length < 8) {
      setFormState((prev) => ({ ...prev, error: "Password must be at least 8 characters long" }));
      return;
    }
    if (formState.password !== formState.confirmPassword) {
      setFormState((prev) => ({ ...prev, error: "Passwords do not match" }));
      return;
    }
    setFormState((prev) => ({ ...prev, loading: true }));
    try {
      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: formState.password }),
      });
      const data: ResetPasswordResponse = await response.json();
      if (response.ok) {
        setFormState((prev) => ({ ...prev, message: "Password has been reset successfully. Logging you in..." }));
        
        // Automatically log in the user with the new password
        try {
          const loginResponse = await fetch("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              email: data.user?.email, 
              password: formState.password 
            }),
          });
          
          if (loginResponse.ok) {
            const loginData = await loginResponse.json();
            if (loginData.user) {
              login(loginData.user);
              setTimeout(() => router.push("/"), 1500);
            } else {
              // Fallback: redirect to login page
              setTimeout(() => router.push("/login"), 2000);
            }
          } else {
            // Fallback: redirect to login page
            setTimeout(() => router.push("/login"), 2000);
          }
        } catch (loginError) {
          console.error("Auto-login failed:", loginError);
          // Fallback: redirect to login page
          setTimeout(() => router.push("/login"), 2000);
        }
      } else {
        setFormState((prev) => ({ ...prev, error: data.error || "Failed to reset password" }));
      }
    } catch {
      setFormState((prev) => ({ ...prev, error: "An error occurred. Please try again." }));
    } finally {
      setFormState((prev) => ({ ...prev, loading: false }));
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 md:p-6">
      {formState.error && <p className="text-red-500 text-sm mb-4">{formState.error}</p>}
      {formState.message && <p className="text-green-500 text-sm mb-4">{formState.message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="relative mb-4">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            required
            value={formState.password}
            onChange={(e) => setFormState((prev) => ({ ...prev, password: e.target.value }))}
            className="w-full px-4 py-3 bg-gray-100 border border-gray-300 text-gray-900 rounded-lg focus:ring-0 focus:border-neutral-dark placeholder-gray-400 transition-all"
            placeholder="New Password"
            disabled={formState.loading}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
            disabled={formState.loading}
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
            id="confirm-password"
            type={showPassword ? "text" : "password"}
            required
            value={formState.confirmPassword}
            onChange={(e) => setFormState((prev) => ({ ...prev, confirmPassword: e.target.value }))}
            className="w-full px-4 py-3 bg-gray-100 border border-gray-300 text-gray-900 rounded-lg focus:ring-0 focus:border-neutral-dark placeholder-gray-400 transition-all"
            placeholder="Confirm New Password"
            disabled={formState.loading}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
            disabled={formState.loading}
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
        <button
          type="submit"
          disabled={formState.loading || !!formState.message}
          className={`w-full py-2 px-4 text-sm font-medium bg-neutral-light text-neutral-dark rounded hover:bg-neutral-medium hover:text-white transition-colors ${
            (formState.loading || !!formState.message) ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {formState.loading ? "Resetting..." : formState.message ? "Password Reset Successful!" : "Reset Password"}
        </button>
      </form>
    </div>
  );
}