import { useState, useEffect } from "react";
import {
  Facebook,
  Instagram,
  Linkedin,
  MapPin,
  Phone,
  Mail,
  Clock,
  ChevronRight,
  ChevronUp,
  Star,
  Users,
  Car,
} from "lucide-react";

const FooterLinks = [
  { title: "Trang Chủ", link: "/#" },
  { title: "Giới Thiệu", link: "/#about" },
  { title: "Liên Hệ", link: "/#contact" },
  { title: "Blog", link: "/#blog" },
];

const ServiceLinks = [
  { title: "Cho thuê xe tự lái", link: "/#service-1" },
  { title: "Thuê xe du lịch", link: "/#service-4" },
  { title: "Thuê xe dài hạn", link: "/#service-5" },
];

const LocationLinks = [
  { title: "Đà Nẵng", link: "/#location-1" },
  { title: "Hà Nội", link: "/#location-2" },
  { title: "Hồ Chí Minh", link: "/#location-3" },
];

const Footer = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer>
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-red-800 text-white p-3 rounded-full shadow-lg hover:bg-red-800 transition-all duration-300 hover:scale-110 z-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
          aria-label="Back to top"
        >
          <ChevronUp size={18} />
        </button>
      )}

      <div className="bg-red-50 pt-16 pb-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Information */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-red-800 p-2 rounded-lg">
                  <Car className="text-white" size={20} />
                </div>
                <h2 className="text-2xl font-bold text-red-800 font-sans border-b border-red-400 pb-2 inline-block">
                  Thuê Xe Tự Lái
                </h2>
              </div>

              <p className="text-gray-600 mb-6">
                Dịch vụ cho thuê xe tự lái nhanh chóng, thuận tiện và chuyên
                nghiệp với hơn 10 năm kinh nghiệm.
              </p>

              <div className="flex gap-4 mb-6">
                <div className="flex items-center gap-2 bg-white p-2 rounded-lg shadow-sm">
                  <Users className="text-red-600" size={16} />
                  <span className="text-sm font-medium">500+ KH</span>
                </div>
                <div className="flex items-center gap-2 bg-white p-2 rounded-lg shadow-sm">
                  <Star className="text-yellow-500" size={16} />
                  <span className="text-sm font-medium">4.8/5</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3 hover:bg-white hover:shadow-sm p-2 rounded-lg transition-all">
                  <MapPin className="text-red-700 flex-shrink-0" size={16} />
                  <div>
                    <p className="font-semibold">Văn phòng Đà Nẵng</p>
                    <p className="text-gray-600 text-sm">
                      123 Nguyễn Văn Linh, Hải Châu, Đà Nẵng
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 hover:bg-white hover:shadow-sm p-2 rounded-lg transition-all">
                  <MapPin className="text-red-700 flex-shrink-0" size={16} />
                  <div>
                    <p className="font-semibold">Văn phòng Hà Nội</p>
                    <p className="text-gray-600 text-sm">
                      1152 Đường Láng, Đống Đa, Hà Nội
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 hover:bg-white hover:shadow-sm p-2 rounded-lg transition-all">
                  <MapPin className="text-red-700 flex-shrink-0" size={16} />
                  <div>
                    <p className="font-semibold">Văn phòng TP.HCM</p>
                    <p className="text-gray-600 text-sm">
                      456 Lê Lai, Quận 1, TP. Hồ Chí Minh
                    </p>
                  </div>
                </div>

                <div className="space-y-3 mt-6">
                  <div className="flex items-center gap-3 hover:text-red-700 transition-colors cursor-pointer">
                    <Phone className="text-red-700" size={16} />
                    <p className="text-gray-600">+84 123 456 789</p>
                  </div>
                  <div className="flex items-center gap-3 hover:text-red-700 transition-colors cursor-pointer">
                    <Mail className="text-red-700" size={16} />
                    <p className="text-gray-600">huyhao852@gmail.com</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="text-red-700" size={16} />
                    <p className="text-gray-600">
                      08:00 - 18:00, Thứ 2 - Chủ Nhật
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 mt-6">
                <a
                  href="#"
                  className="bg-red-800 text-white p-3 rounded-full hover:bg-red-800 hover:scale-110 transition-all duration-300"
                  aria-label="Facebook"
                >
                  <Facebook size={18} />
                </a>
                <a
                  href="#"
                  className="bg-red-800 text-white p-3 rounded-full hover:bg-red-800 hover:scale-110 transition-all duration-300"
                  aria-label="Instagram"
                >
                  <Instagram size={18} />
                </a>
                <a
                  href="#"
                  className="bg-red-800 text-white p-3 rounded-full hover:bg-red-800 hover:scale-110 transition-all duration-300"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={18} />
                </a>
              </div>
            </div>

            {/* Important Links */}
            <div>
              <h3 className="text-xl font-bold mb-6 text-red-800 border-b border-red-400 pb-2 inline-block">
                Liên Kết Quan Trọng
              </h3>
              <ul className="space-y-3">
                {FooterLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.link}
                      className="flex items-center text-gray-600 hover:text-red-700 hover:translate-x-2 transition-all duration-300 group"
                    >
                      <ChevronRight
                        className="mr-2 text-red-700 group-hover:text-red-800"
                        size={14}
                      />
                      <span className="group-hover:font-medium">
                        {link.title}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>

              <div className="mt-8 p-4 bg-white rounded-lg shadow-sm">
                <h4 className="font-semibold text-gray-800 mb-3">
                  Đăng ký nhận tin
                </h4>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Email của bạn"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-red-500"
                    aria-label="Email for newsletter"
                  />
                  <button className="bg-red-800 text-white px-4 py-2 rounded-lg hover:bg-red-800 transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50">
                    Đăng ký
                  </button>
                </div>
              </div>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-xl font-bold mb-6 text-red-800 border-b border-red-400 pb-2 inline-block">
                Dịch Vụ
              </h3>
              <ul className="space-y-3">
                {ServiceLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.link}
                      className="flex items-center text-gray-600 hover:text-red-700 hover:translate-x-2 transition-all duration-300 group"
                    >
                      <ChevronRight
                        className="mr-2 text-red-700 group-hover:text-red-800"
                        size={14}
                      />
                      <span className="group-hover:font-medium">
                        {link.title}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>

              <div className="mt-6 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Giao xe tận nơi</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Hỗ trợ 24/7</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Giá cả cạnh tranh</span>
                </div>
              </div>
            </div>

            {/* Branches */}
            <div>
              <h3 className="text-xl font-bold mb-6 text-red-800 border-b border-red-400 pb-2 inline-block">
                Chi Nhánh
              </h3>
              <ul className="space-y-3">
                {LocationLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.link}
                      className="flex items-center justify-between text-gray-600 hover:text-red-700 hover:translate-x-2 transition-all duration-300 group p-2 hover:bg-white hover:shadow-sm rounded-lg"
                    >
                      <div className="flex items-center">
                        <ChevronRight
                          className="mr-2 text-red-700 group-hover:text-red-800"
                          size={14}
                        />
                        <span className="group-hover:font-medium">
                          {link.title}
                        </span>
                      </div>
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                        Hoạt động
                      </span>
                    </a>
                  </li>
                ))}
              </ul>

              <div className="mt-6 p-4 bg-gradient-to-r from-red-700 to-red-800 text-white rounded-lg">
                <h4 className="font-semibold mb-2">Hotline 24/7</h4>
                <p className="text-red-100 text-2xl font-bold">0123 456 789</p>
                <p className="text-red-200 text-sm">Gọi ngay để được tư vấn</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-red-800 text-gray-400 py-6">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-sm">
          <p>&copy; 2024 Thuê Xe Tự Lái. All rights reserved.</p>
          <p>Thiết kế bởi HuyHao</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
