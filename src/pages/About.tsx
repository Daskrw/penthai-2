import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const About = () => {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-8">เกี่ยวกับเป็นไทย</h1>
            
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <p className="text-lg text-foreground leading-relaxed">
                  ยินดีต้อนรับสู่ <span className="font-semibold text-primary">เป็นไทย</span> แหล่งรวมสินค้าไทยแท้คุณภาพสูง 
                  เราหลงใหลในการนำสินค้าคุณภาพจากช่างฝีมือไทยส่งตรงถึงมือคุณ
                </p>
                
                <p className="text-lg text-foreground leading-relaxed">
                  ก่อตั้งขึ้นด้วยพันธกิจในการเผยแพร่วัฒนธรรมและงานฝีมือไทย 
                  เป็นไทยคัดสรรสินค้าทุกชิ้นอย่างพิถีพิถันเพื่อรับประกันความแท้และคุณภาพ
                </p>
                
                <p className="text-lg text-foreground leading-relaxed">
                  ตั้งแต่งานหัตถกรรมดั้งเดิมไปจนถึงผลิตภัณฑ์ไลฟ์สไตล์สมัยใหม่ 
                  คอลเลกชันของเราเป็นตัวแทนของมรดกไทยและนวัตกรรมที่ดีที่สุด 
                  สินค้าทุกชิ้นเล่าเรื่องราวของช่างฝีมือ เทคนิคที่สืบทอดมา และจิตวิญญาณที่มีชีวิตชีวาของประเทศไทย
                </p>

                <div className="bg-card p-6 rounded-lg shadow-md border-l-4 border-primary">
                  <h2 className="text-2xl font-semibold text-foreground mb-4">คำมั่นสัญญาของเรา</h2>
                  <ul className="space-y-2 text-foreground">
                    <li className="flex items-start">
                      <span className="text-primary mr-2">✓</span>
                      <span>สินค้าไทยแท้ 100%</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">✓</span>
                      <span>รับประกันคุณภาพ</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">✓</span>
                      <span>จัดส่งปลอดภัยและรวดเร็ว</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">✓</span>
                      <span>บริการลูกค้าเป็นเลิศ</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="relative">
                <img
                  src="/placeholder.svg"
                  alt="งานฝีมือไทย"
                  className="rounded-lg shadow-thai-lg w-full h-[500px] object-cover"
                />
                <div className="absolute -bottom-6 -left-6 bg-primary text-primary-foreground p-6 rounded-lg shadow-lg max-w-xs">
                  <p className="font-semibold text-lg">นำประเทศไทยมาสู่บ้านคุณ</p>
                  <p className="text-sm mt-2 opacity-90">ตั้งแต่ 2024</p>
                </div>
              </div>
            </div>

            <div className="mt-20 grid md:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-card rounded-lg shadow-md">
                <div className="text-4xl font-bold text-primary mb-2">1,000+</div>
                <p className="text-foreground">ลูกค้าที่พึงพอใจ</p>
              </div>
              <div className="text-center p-6 bg-card rounded-lg shadow-md">
                <div className="text-4xl font-bold text-primary mb-2">500+</div>
                <p className="text-foreground">สินค้า</p>
              </div>
              <div className="text-center p-6 bg-card rounded-lg shadow-md">
                <div className="text-4xl font-bold text-primary mb-2">50+</div>
                <p className="text-foreground">ช่างฝีมือท้องถิ่น</p>
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
