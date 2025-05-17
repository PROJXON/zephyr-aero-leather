import "./globals.css";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "@/hooks/useCart";
import FloatingCartButton from "@/components/FloatingCartButton";
import { AuthProvider } from "@/app/context/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Zephyr Aero Leather",
  description: "Premium leather goods and accessories",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <FloatingCartButton />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
