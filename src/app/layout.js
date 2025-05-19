import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import fetchProducts from "../../lib/woocommerce"
import getCookieInfo from "../../lib/getCookieInfo";

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
  // let user = null;

  const products = await fetchProducts();

  // try {
  //   const [, userCookie] = await getCookieInfo()
  //   if (userCookie) {
  //     user = JSON.parse(atob(userCookie));
  //   }
  // } catch (error) {
  //   console.error("Error reading cookies on server:", error);
  // }

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-[100dvh] grid grid-rows-[auto_1fr_auto]`}>
        <AuthProvider>
          <CartProvider>
            <Navbar allProducts={products} />
            <main>{children}</main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
