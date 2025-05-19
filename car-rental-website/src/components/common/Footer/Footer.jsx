import React from "react";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaLocationArrow,
  FaMobileAlt,
  FaEnvelope,
  FaClock,
  FaChevronRight,
} from "react-icons/fa";

const FooterLinks = [
  {
    title: "Trang Chủ",
    link: "/#",
  },
  {
    title: "Giới Thiệu",
    link: "/#about",
  },
  {
    title: "Liên Hệ",
    link: "/#contact",
  },
  {
    title: "Blog",
    link: "/#blog",
  },
];

const ServiceLinks = [
  {
    title: "Cho thuê xe tự lái",
    link: "/#service-1",
  },
  {
    title: "Cho thuê xe có tài xế",
    link: "/#service-2",
  },
  {
    title: "Thuê xe du lịch",
    link: "/#service-4",
  },
];

const LocationLinks = [
  {
    title: "Đà Nẵng",
    link: "/#location-1",
  },
  {
    title: "Hà Nội",
    link: "/#location-2",
  },
  {
    title: "Hồ Chí Minh",
    link: "/#location-3",
  },
];

const Footer = () => {
  return (
    <footer>
      <div className="bg-red-50 pt-16 pb-10">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Thông tin công ty */}
            <div>
              <h2 className="text-2xl font-bold mb-6 text-red-800 font-serif border-b border-red-400 pb-2 inline-block">
                Thuê Xe Tự Lái
              </h2>
              <p className="text-gray-600 mb-6">
                Dịch vụ cho thuê xe tự lái nhanh chóng, thuận tiện và chuyên nghiệp với hơn 10 năm kinh nghiệm.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <FaLocationArrow className="text-red-700 mt-1" />
                  <p className="text-gray-600">123 Nguyễn Văn Linh, Hải Châu, Đà Nẵng, Việt Nam</p>
                </div>
                <div className="flex items-center gap-3">
                  <FaMobileAlt className="text-red-700" />
                  <p className="text-gray-600">+84 123 456 789</p>
                </div>
                <div className="flex items-center gap-3">
                  <FaEnvelope className="text-red-700" />
                  <p className="text-gray-600">info@thuexetulai.com</p>
                </div>
                <div className="flex items-center gap-3">
                  <FaClock className="text-red-700" />
                  <p className="text-gray-600">08:00 - 18:00, Thứ 2 - Chủ Nhật</p>
                </div>
              </div>
              
              {/* Mạng xã hội */}
              <div className="flex items-center gap-4 mt-6">
                <a href="#" className="bg-red-700 text-white p-2 rounded-full hover:bg-red-800 transition-colors">
                  <FaFacebook className="text-xl" />
                </a>
                <a href="#" className="bg-red-700 text-white p-2 rounded-full hover:bg-red-800 transition-colors">
                  <FaInstagram className="text-xl" />
                </a>
                <a href="#" className="bg-red-700 text-white p-2 rounded-full hover:bg-red-800 transition-colors">
                  <FaLinkedin className="text-xl" />
                </a>
              </div>
            </div>

            {/* Các liên kết */}
            <div>
              <h3 className="text-xl font-bold mb-6 text-red-800 border-b border-red-400 pb-2 inline-block">
                Liên Kết Quan Trọng
              </h3>
              <ul className="space-y-3">
                {FooterLinks.map((link, index) => (
                  <li key={index}>
                    <a 
                      href={link.link}
                      className="flex items-center text-gray-600 hover:text-red-700 hover:translate-x-1 transition-all duration-300"
                    >
                      <FaChevronRight className="mr-2 text-xs text-red-700" />
                      {link.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-6 text-red-800 border-b border-red-400 pb-2 inline-block">
                Dịch Vụ
              </h3>
              <ul className="space-y-3">
                {ServiceLinks.map((link, index) => (
                  <li key={index}>
                    <a 
                      href={link.link}
                      className="flex items-center text-gray-600 hover:text-red-700 hover:translate-x-1 transition-all duration-300"
                    >
                      <FaChevronRight className="mr-2 text-xs text-red-700" />
                      {link.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-6 text-red-800 border-b border-red-400 pb-2 inline-block">
                Chi Nhánh
              </h3>
              <ul className="space-y-3">
                {LocationLinks.map((link, index) => (
                  <li key={index}>
                    <a 
                      href={link.link}
                      className="flex items-center text-gray-600 hover:text-red-700 hover:translate-x-1 transition-all duration-300"
                    >
                      <FaChevronRight className="mr-2 text-xs text-red-700" />
                      {link.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      {/* Copyright Section */}
      <div className="bg-red-100 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm">
              © {new Date().getFullYear()} Thuê Xe Tự Lái. Đã đăng ký bản quyền.
            </p>
            <div className="flex gap-4 mt-3 md:mt-0">
              <a href="#" className="text-sm text-gray-600 hover:text-red-700">Điều khoản sử dụng</a>
              <span className="text-gray-500">|</span>
              <a href="#" className="text-sm text-gray-600 hover:text-red-700">Chính sách bảo mật</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
