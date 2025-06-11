export const dynamic = "force-static"; // ✅ Force SSG at build time

import AboutUs from "@/components/AboutUs";
import Hero from "@/components/Hero";
const CDN_URL = process.env.NEXT_PUBLIC_CDN_URL;

export const metadata = {
  title: "About Us | Zephyr Aero Leather",
  description: "Learn about Zephyr Aero Leather – our story, commitment, and products.",
};

export default function AboutPage() {
  return (
    <div className="about-page bg-background text-gray-800">
      {/* Hero Section */}
      <Hero 
        title="Our Story"
        subtitle="Zephyr Aero Leather was born from a passion for vintage aviation and masterful leather craftsmanship"
        description="Every stitch we make reflects the enduring spirit of explorers and pilots who paved the skies before us"
        images={[
          `${CDN_URL}/phelanhelicopter.jpg`,
          `${CDN_URL}/phelanmotorcycle.jpg`,
          `${CDN_URL}/phelandesert.jpg`,
          `${CDN_URL}/phelancar.jpg`
        ]}
      
      />

      <AboutUs />
    </div>
  );
}
