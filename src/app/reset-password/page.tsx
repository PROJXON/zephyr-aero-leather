import { Suspense } from "react";
import ResetPasswordForm from "../../components/ResetPasswordForm";
import type { JSX } from "react";

export default function ResetPasswordPage(): JSX.Element {
  return (
    <section className="flex items-center justify-center min-h-screen bg-cover bg-center px-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Reset Password</h1>
          <p className="mt-2 text-gray-600">Enter your new password below</p>
        </div>

        <Suspense fallback={<div>Loading...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </section>
  );
}
