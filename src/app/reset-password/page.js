import { Suspense } from "react";
import ResetPasswordForm from "../../components/ResetPasswordForm";

const CDN_URL = process.env.NEXT_PUBLIC_CDN_URL;
const backgroundImageUrl = `${CDN_URL}/ifr.jpg`;

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-50"
        style={{ backgroundImage: `url(${backgroundImageUrl})`, zIndex: -1 }}
      />
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative w-full max-w-md p-8">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-8 shadow-xl">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Reset Password</h1>
            <p className="mt-2 text-gray-600">Enter your new password below</p>
          </div>

          <Suspense fallback={<div>Loading...</div>}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
