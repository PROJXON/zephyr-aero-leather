"use client";

import { useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { ResetPasswordFormState } from "../../types/types";

export default function ResetPasswordForm() {
  const [state, setState] = useState<ResetPasswordFormState>({
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
    setState((prev) => ({ ...prev, error: "", message: "" }));

    if (!token) {
      setState((prev) => ({ ...prev, error: "Invalid reset token" }));
      return;
    }
    if (state.password.length < 8) {
      setState((prev) => ({ ...prev, error: "Password must be at least 8 characters long" }));
      return;
    }
    if (state.password !== state.confirmPassword) {
      setState((prev) => ({ ...prev, error: "Passwords do not match" }));
      return;
    }
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: state.password }),
      });
      const data = await response.json();
      if (response.ok) {
        setState((prev) => ({ ...prev, message: "Password has been reset successfully" }));
        setTimeout(() => router.push("/login"), 2000);
      } else {
        setState((prev) => ({ ...prev, error: data.error || "Failed to reset password" }));
      }
    } catch {
      setState((prev) => ({ ...prev, error: "An error occurred. Please try again." }));
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  return (
    <>
      {state.error && <p className="text-red-500 text-sm">{state.error}</p>}
      {state.message && <p className="text-green-500 text-sm">{state.message}</p>}
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            New Password
          </label>
          <input
            id="password"
            type="password"
            required
            value={state.password}
            onChange={(e) => setState((prev) => ({ ...prev, password: e.target.value }))}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#605137] focus:border-[#605137]"
            disabled={state.loading}
          />
        </div>
        <div>
          <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
            Confirm New Password
          </label>
          <input
            id="confirm-password"
            type="password"
            required
            value={state.confirmPassword}
            onChange={(e) => setState((prev) => ({ ...prev, confirmPassword: e.target.value }))}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#605137] focus:border-[#605137]"
            disabled={state.loading}
          />
        </div>
        <button
          type="submit"
          disabled={state.loading}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#605137] hover:bg-[#30291C] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#605137] ${
            state.loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {state.loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </>
  );
}
