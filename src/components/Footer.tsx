import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div>
            <h3 className="text-2xl font-bold mb-4">เป็นไทย</h3>
            <p className="text-secondary-foreground/80 mb-4">
              แหล่งรวมสินค้าไทยแท้คุณภาพสูง ส่งตรงจากช่างฝีมือไทยสู่มือคุณ
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">ลิงก์ด่วน</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-secondary-foreground/80 hover:text-secondary-foreground transition-colors">
                  เกี่ยวกับเรา
                </Link>
              </li>
              <li>
                <Link to="/shop" className="text-secondary-foreground/80 hover:text-secondary-foreground transition-colors">
                  สินค้า
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-secondary-foreground/80 hover:text-secondary-foreground transition-colors">
                  ติดต่อเรา
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold mb-4">บริการลูกค้า</h4>
            <ul className="space-y-2">
              <li>
                <span className="text-secondary-foreground/80">
                  ข้อมูลการจัดส่ง
                </span>
              </li>
              <li>
                <span className="text-secondary-foreground/80">
                  นโยบายคืนสินค้า
                </span>
              </li>
              <li>
                <span className="text-secondary-foreground/80">
                  คำถามที่พบบ่อย
                </span>
              </li>
              <li>
                <span className="text-secondary-foreground/80">
                  นโยบายความเป็นส่วนตัว
                </span>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4">ติดต่อเรา</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <span className="text-secondary-foreground/80">
                  123 ถนนไทย กรุงเทพมหานคร ประเทศไทย
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 flex-shrink-0" />
                <span className="text-secondary-foreground/80">
                  +66 2 123 4567
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 flex-shrink-0" />
                <span className="text-secondary-foreground/80">
                  hello@penthai.com
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 text-center text-secondary-foreground/60">
          <p>&copy; 2024 เป็นไทย สงวนลิขสิทธิ์</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
