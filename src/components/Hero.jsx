import HeroCarousel from "./HeroCarousel";

const Hero = ({ title, subtitle, description, images }) => {
  return (
    <section className="relative bg-warm-bg">
      <div className="container mx-auto px-4 md:px-12 lg:px-24 py-16 md:py-16">
        <div className="grid md:grid-cols-[1.2fr_1fr] gap-12 items-center">
          {/* Text side */}
          <div
            className="space-y-6 text-center md:text-left max-w-2xl"
            data-aos="fade-right"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-neutral-dark leading-tight tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-neutral-dark to-neutral-medium">
                {title}
              </span>
              {subtitle && (
                <>
                  <br />
                  <span className="font-light text-2xl md:text-3xl text-neutral-medium tracking-wide">
                    {subtitle}
                  </span>
                </>
              )}
            </h1>
            {description && (
              <p className="text-neutral-medium text-lg md:text-xl italic max-w-xl mx-auto md:mx-0 font-light tracking-wide">
                {description}
              </p>
            )}
          </div>

          {/* Carousel side */}
          <div
            data-aos="fade-left"
            className="w-full"
          >
            <HeroCarousel images={images} altBase={title} />
          </div>
        </div>
      </div>
    </section>

  );
};

export default Hero;
