import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const About = () => {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-8">About PenThai</h1>
            
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <p className="text-lg text-foreground leading-relaxed">
                  Welcome to <span className="font-semibold text-primary">PenThai</span>, your premier destination for authentic Thai products. 
                  We are passionate about bringing the finest selection of Thai goods directly to your doorstep.
                </p>
                
                <p className="text-lg text-foreground leading-relaxed">
                  Founded with a mission to share the rich culture and quality craftsmanship of Thailand, 
                  PenThai carefully curates each product to ensure authenticity and excellence.
                </p>
                
                <p className="text-lg text-foreground leading-relaxed">
                  From traditional handicrafts to modern lifestyle products, our collection represents 
                  the best of Thai heritage and innovation. Every item in our store tells a story of 
                  skilled artisans, time-honored techniques, and the vibrant spirit of Thailand.
                </p>

                <div className="bg-card p-6 rounded-lg shadow-md border-l-4 border-primary">
                  <h2 className="text-2xl font-semibold text-foreground mb-4">Our Promise</h2>
                  <ul className="space-y-2 text-foreground">
                    <li className="flex items-start">
                      <span className="text-primary mr-2">✓</span>
                      <span>100% Authentic Thai Products</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">✓</span>
                      <span>Quality Guaranteed</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">✓</span>
                      <span>Secure & Fast Shipping</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">✓</span>
                      <span>Exceptional Customer Service</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="relative">
                <img
                  src="/placeholder.svg"
                  alt="Thai craftsmanship"
                  className="rounded-lg shadow-thai-lg w-full h-[500px] object-cover"
                />
                <div className="absolute -bottom-6 -left-6 bg-primary text-primary-foreground p-6 rounded-lg shadow-lg max-w-xs">
                  <p className="font-semibold text-lg">Bringing Thailand to Your Home</p>
                  <p className="text-sm mt-2 opacity-90">Since 2024</p>
                </div>
              </div>
            </div>

            <div className="mt-20 grid md:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-card rounded-lg shadow-md">
                <div className="text-4xl font-bold text-primary mb-2">1000+</div>
                <p className="text-foreground">Happy Customers</p>
              </div>
              <div className="text-center p-6 bg-card rounded-lg shadow-md">
                <div className="text-4xl font-bold text-primary mb-2">500+</div>
                <p className="text-foreground">Products</p>
              </div>
              <div className="text-center p-6 bg-card rounded-lg shadow-md">
                <div className="text-4xl font-bold text-primary mb-2">50+</div>
                <p className="text-foreground">Local Artisans</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default About;