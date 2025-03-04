import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import { cookies } from "next/headers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Zephyr Aero Leather",
  description: "Luxury Leather Goods",
};

export default async function RootLayout({ children }) {
  let user = null;

  try {
    const cookieStore = await cookies(); // ✅ Read cookies from the server
    const userCookie = cookieStore.get("userData")?.value;
    if (userCookie) {
      user = JSON.parse(Buffer.from(userCookie, "base64").toString("utf-8")); // ✅ Decode Base64
    }
  } catch (error) {
    console.error("Error reading cookies on server:", error);
  }

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <Navbar initialUser={user} /> {/* ✅ Pass `user` to Navbar before render */}
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
