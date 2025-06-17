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
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
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
};

// Google Tag Manager script
const GTM_ID = 'GTM-K3BTZ942';

export default async function RootLayout({ children }: { children: React.ReactNode }): Promise<JSX.Element> {
  const products = await fetchProducts();

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="" />
        <Script id="gtm-head" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GTM_ID}');
          `}
        </Script>
      </head>
      <body className="antialiased min-h-[100dvh] grid grid-rows-[auto_1fr_auto]">
        <noscript>
          <iframe 
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
            title="Google Tag Manager"
          />
        </noscript>

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
