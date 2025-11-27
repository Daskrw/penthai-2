import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroBanner from "@/assets/hero-banner.jpg";

const HeroSection = () => {
  return (
    <section className="relative h-[600px] md:h-[700px] overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={heroBanner}
          alt="Authentic Thai Products"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 h-full flex items-center">
        <div className="max-w-2xl text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            Discover Authentic
            <br />
            <span className="text-accent">Thai Excellence</span>
          </h1>
          <p className="text-lg md:text-xl mb-8 text-gray-200 animate-fade-in">
            Premium Thai products, carefully curated for quality and authenticity.
            From traditional crafts to modern luxuries.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary-hover text-primary-foreground shadow-thai-lg group"
            >
              Shop Now
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-white/10 backdrop-blur-sm border-white text-white hover:bg-white hover:text-foreground"
            >
              Explore Categories
            </Button>
          </div>

          {/* Trust Badges */}
          <div className="mt-12 flex flex-wrap gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center">
                ✓
              </div>
              <span>Secure Payment</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center">
                ✓
              </div>
              <span>Quality Guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center">
                ✓
              </div>
              <span>Fast Shipping</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
