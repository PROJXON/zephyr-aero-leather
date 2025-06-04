import HeroCarousel from "./HeroCarousel";

const Hero = ({ title, subtitle, images }) => {
  return (
    <section className="relative bg-warm-bg">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-light text-neutral-dark leading-tight">
              {title}
              {subtitle && (
                <>
                  <br />
                  <span className="font-normal">{subtitle}</span>
                </>
              )}
            </h1>
          </div>

          {/* ✅ Only this is client-side */}
          <HeroCarousel images={images} altBase={title} />
        </div>
      </div>
    </section>
  );
};

export default Hero;