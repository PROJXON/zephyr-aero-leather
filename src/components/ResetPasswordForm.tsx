"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface ResetPasswordFormState {
  password: string;
  confirmPassword: string;
  error: string;
  message: string;
  loading: boolean;
}

interface ApiResponse {
  error?: string;
}

export default function ResetPasswordForm() {
  const [formState, setFormState] = useState<ResetPasswordFormState>({
    password: "",
    confirmPassword: "",
    error: "",
    message: "",
    loading: false,
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormState(prev => ({ ...prev, error: "", message: "" }));

    if (!token) {
      setFormState(prev => ({ ...prev, error: "Invalid reset token" }));
      return;
    }

    if (formState.password.length < 8) {
      setFormState(prev => ({ ...prev, error: "Password must be at least 8 characters long" }));
      return;
    }

    if (formState.password !== formState.confirmPassword) {
      setFormState(prev => ({ ...prev, error: "Passwords do not match" }));
      return;
    }

    setFormState(prev => ({ ...prev, loading: true }));

    try {
      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: formState.password }),
      });

      const data: ApiResponse = await response.json();

      if (response.ok) {
        setFormState(prev => ({ ...prev, message: "Password has been reset successfully" }));
        setTimeout(() => router.push("/login"), 2000);
      } else {
        setFormState(prev => ({ ...prev, error: data.error || "Failed to reset password" }));
      }
    } catch {
      setFormState(prev => ({ ...prev, error: "An error occurred. Please try again." }));
    } finally {
      setFormState(prev => ({ ...prev, loading: false }));
    }
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormState(prev => ({ ...prev, password: e.target.value }));
  };

  const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormState(prev => ({ ...prev, confirmPassword: e.target.value }));
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 md:p-6">
      {formState.error && <p className="text-red-500 text-sm mb-4">{formState.error}</p>}
      {formState.message && <p className="text-green-500 text-sm mb-4">{formState.message}</p>}

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-2">
            New Password
          </label>
          <input
            id="password"
            type="password"
            required
            value={formState.password}
            onChange={handlePasswordChange}
            className="w-full px-4 py-3 bg-gray-100 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-neutral-dark placeholder-gray-400 transition-all"
            disabled={formState.loading}
          />
        </div>

        <div>
          <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-900 mb-2">
            Confirm New Password
          </label>
          <input
            id="confirm-password"
            type="password"
            required
            value={formState.confirmPassword}
            onChange={handleConfirmPasswordChange}
            className="w-full px-4 py-3 bg-gray-100 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-neutral-dark placeholder-gray-400 transition-all"
            disabled={formState.loading}
          />
        </div>

        <button
          type="submit"
          disabled={formState.loading}
          className={`w-full py-2 px-4 text-sm font-medium bg-neutral-light text-neutral-dark rounded hover:bg-neutral-medium hover:text-white transition-colors ${
            formState.loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {formState.loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
} 