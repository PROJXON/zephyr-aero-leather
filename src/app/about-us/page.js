export const dynamic = "force-static"; // ✅ Force SSG at build time

import AboutUs from "@/components/AboutUs";
import Hero from "@/components/Hero";

export const metadata = {
  title: "About Us | Zephyr Aero Leather",
  description: "Learn about Zephyr Aero Leather – our story, commitment, and products.",
};

export default function AboutPage() {
  return (
    <div className="about-page bg-white text-gray-800">
      {/* Hero Section */}
      <Hero />

      <AboutUs />
    </div>
  );
}
