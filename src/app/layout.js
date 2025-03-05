import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
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
    const cookieStore = await cookies(); 
    const userCookie = cookieStore.get("userData")?.value;
    if (userCookie) {
      user = JSON.parse(atob(userCookie));
    }
  } catch (error) {
    console.error("Error reading cookies on server:", error);
  }

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <CartProvider>
            <Navbar initialUser={user} />
            <main>{children}</main>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
