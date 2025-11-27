import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturedCategories from "@/components/FeaturedCategories";
import BestSellers from "@/components/BestSellers";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturedCategories />
        <BestSellers />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
