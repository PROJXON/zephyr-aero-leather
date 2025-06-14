import HeroCarousel from "./HeroCarousel";
import type { JSX } from "react";

interface HeroProps {
  title: string;
  subtitle?: string | JSX.Element;
  description?: string;
  images: string[];
}

const Hero = ({ title, subtitle, description, images }: HeroProps): JSX.Element => {
  return (
    <section className="relative bg-warm-bg">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-[1.2fr_1fr] gap-12 items-center">
          {/* Text side */}
          <div
            className="space-y-6 text-center md:text-left max-w-2xl w-full mx-auto"
            data-aos="fade-right"
          >
            <h1 className="text-4xl md:text-5xl font-light text-neutral-dark leading-tight">
              {title}
              {subtitle && (
                <>
                  <br />
                  <span className="font-normal">{subtitle}</span>
                </>
              )}
            </h1>
            {description && (
              <p className="text-neutral-medium text-lg italic max-w-xl mx-auto md:mx-0">
                {description}
              </p>
            )}
          </div>

          {/* Carousel side */}
          <div
            data-aos="fade-left"
            className="w-full flex justify-center md:justify-end"
          >
            <HeroCarousel images={images} altBase={title} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
