import React from "react";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaLocationArrow,
  FaMobileAlt,
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

const Footer = () => {
  return (
    <div className="bg-white dark:bg-gray-200 mt-14 rounded-t-3xl shadow-lg">
      <section className="container">
        <div className="grid md:grid-cols-3 py-5">
          {/* Thông tin công ty */}
          <div className="py-8 px-4">
            <h1 className="sm:text-3xl text-xl font-bold sm:text-left text-justify mb-3 flex items-center gap-3 font-serif">
              Thuê Xe Tự Lái
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-800">
              Dịch vụ cho thuê xe tự lái nhanh chóng, thuận tiện và chuyên nghiệp.
            </p>
            <br />
            <div className="flex items-center gap-3">
              <FaLocationArrow />
              <p>Đà Nẵng, Việt Nam</p>
            </div>
            <div className="flex items-center gap-3 mt-3">
              <FaMobileAlt />
              <p>+84 123 456 789</p>
            </div>
            {/* Mạng xã hội */}
            <div className="flex items-center gap-3 mt-6">
              <a href="#">
                <FaInstagram className="text-3xl hover:text-primary duration-300" />
              </a>
              <a href="#">
                <FaFacebook className="text-3xl hover:text-primary duration-300" />
              </a>
              <a href="#">
                <FaLinkedin className="text-3xl hover:text-primary duration-300" />
              </a>
            </div>
          </div>

          {/* Các liên kết */}
          <div className="grid grid-cols-2 sm:grid-cols-3 col-span-2 md:pl-10">
            <div className="py-8 px-4">
              <h1 className="sm:text-xl text-xl font-bold sm:text-left text-justify mb-3">
                Liên Kết Quan Trọng
              </h1>
              <ul className="flex flex-col gap-3">
                {FooterLinks.map((link, index) => (
                  <li key={index} className="cursor-pointer hover:translate-x-1 duration-300 hover:text-primary space-x-1 text-gray-600 dark:text-gray-800">
                    <span>&#11162;</span>
                    <span>{link.title}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="py-8 px-4">
              <h1 className="sm:text-xl text-xl font-bold sm:text-left text-justify mb-3">
                Dịch Vụ
              </h1>
              <ul className="flex flex-col gap-3">
                {FooterLinks.map((link, index) => (
                  <li key={index} className="cursor-pointer hover:translate-x-1 duration-300 hover:text-primary space-x-1 text-gray-600 dark:text-gray-800">
                    <span>&#11162;</span>
                    <span>{link.title}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="py-8 px-4">
              <h1 className="sm:text-xl text-xl font-bold sm:text-left text-justify mb-3">
                Địa Chỉ
              </h1>
              <ul className="flex flex-col gap-3">
                <li className="cursor-pointer hover:translate-x-1 duration-300 hover:text-primary space-x-1 text-gray-600 dark:text-gray-800">
                  <span>&#11162;</span>
                  <span>Đà Nẵng, Việt Nam</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Footer;
