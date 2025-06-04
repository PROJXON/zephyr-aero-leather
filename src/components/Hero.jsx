import HeroCarousel from "./HeroCarousel";

const Hero = ({ title, subtitle, description, images }) => {
  return (
    <section className="relative bg-warm-bg">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-[1.2fr_1fr] gap-12 items-center">
          <div className="space-y-6 text-center md:text-left max-w-2xl">
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

          <HeroCarousel images={images} altBase={title} />
        </div>
      </div>
    </section>
  );
};

export default Hero;
