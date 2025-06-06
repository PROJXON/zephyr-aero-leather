import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import fetchProducts from "../../lib/woocommerce"
import getCookieInfo from "../../lib/getCookieInfo";
import AOSWrapper from "@/components/AOSWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL("https://zephyraeroleather.com"),
  title: "Zephyr Aero Leather",
  description: "Designed for Flight. Made for Life",
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    title: "Zephyr Aero Leather",
    description: "Designed for Flight. Made for Life.",
    url: "https://zephyraeroleather.com",
    siteName: "Zephyr Aero Leather",
    images: [
      {
        url: "/og-image.png", // relative path is now safe due to metadataBase
        width: 1200,
        height: 630,
        alt: "Zephyr Aero Leather - Premium Leather Goods",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zephyr Aero Leather",
    description: "Designed for Flight. Made for Life",
    images: ["/og-image.png"],
  },
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
        <AOSWrapper />
        <AuthProvider>
          <CartProvider>
            <Navbar allProducts={products} />
            <main className="relative z-0">{children}</main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
