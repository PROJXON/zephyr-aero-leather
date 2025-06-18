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

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Google Tag Manager script
const GTM_ID: string = process.env.NEXT_PUBLIC_GTM_ID || '';

if (!GTM_ID) {
  console.warn('GTM_ID is not defined in environment variables');
}

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
        url: "/og-image.png", 
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

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default async function RootLayout({ children }: { children: React.ReactNode }): Promise<JSX.Element> {
  const products = await fetchProducts();

  return (
    <html lang="en" className="overflow-x-hidden">
      <head>
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="" />
        {GTM_ID && (
          <Script id="gtm-head" strategy="afterInteractive">
            {`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${GTM_ID}');
            `}
          </Script>
        )}
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-[100dvh] grid grid-rows-[auto_1fr_auto] overflow-x-hidden`}>
        {GTM_ID && (
          <noscript>
            <iframe 
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
              title="Google Tag Manager"
            />
          </noscript>
        )}
        <AOSWrapper />
        <AuthProvider>
          <CartProvider>
            <Navbar allProducts={products} />
            <main className="relative z-0 overflow-x-hidden">{children}</main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
