import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import fetchProducts from "../../lib/woocommerce";
import AOSWrapper from "@/components/AOSWrapper";
import type { JSX } from "react";
import Script from "next/script";
import AnalyticsTracker from "@/components/AnalyticsTracker";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_MEASUREMENT_ID;

if (!GA_MEASUREMENT_ID) {
  console.warn("GA_MEASUREMENT_ID is not defined in environment variables");
}

export const metadata = {
  metadataBase: new URL("https://zephyraeroleather.com"),
  title: "Zephyr Aero Leather",
  description: "Designed for Flight. Made for Life",
  icons: { icon: "/favicon.png" },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): Promise<JSX.Element> {
  const products = await fetchProducts();

  return (
    <html lang="en" className="overflow-x-hidden">
      <head>
        {/* Google Analytics */}
        {GA_MEASUREMENT_ID && (
          <>
            <Script
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col overflow-x-hidden`}
      >
        {GA_MEASUREMENT_ID && <AnalyticsTracker />}
        <AOSWrapper />
        <AuthProvider>
          <CartProvider>
            <Navbar allProducts={products} />
            <main className="flex-1 relative z-0 overflow-x-hidden pt-16">
              {children}
            </main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
