// components/AOSWrapper.jsx
"use client";

import { useEffect } from "react";
import type { ReactElement } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function AOSWrapper(): ReactElement | null {
  useEffect(() => {
    AOS.init({
      once: true, // Only animate once
      duration: 600, // Animation duration
      easing: "ease-out", // Smoother easing
    });
  }, []);

  return null;
}
