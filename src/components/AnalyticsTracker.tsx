"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const GA_ID = process.env.NEXT_PUBLIC_MEASUREMENT_ID;

  useEffect(() => {
    if (GA_ID && typeof window.gtag === "function") {
      window.gtag("config", GA_ID, { page_path: pathname });
    }
  }, [pathname, GA_ID]);

  return null;
}
