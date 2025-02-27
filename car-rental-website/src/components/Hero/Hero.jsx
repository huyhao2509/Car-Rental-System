import React, { useEffect } from "react";
import yellowCar from "../../assets/banner-car.png"; // Chỉ dùng 1 ảnh
import AOS from "aos";
import "aos/dist/aos.css";

const Hero = () => {
  useEffect(() => {
    AOS.init({ duration: 1200, once: true });
  }, []);

  return (
    <div className="relative bg-gray-50 text-black py-20 overflow-hidden">
      <div className="container min-h-[620px] flex">
        <div className="grid grid-cols-1 sm:grid-cols-2 place-items-center gap-10">
          {/* Hình ảnh xe */}
          <div data-aos="zoom-in" className="order-1 sm:order-2 relative">
            <img
              src={yellowCar}
              alt="Luxury Car"
              className="sm:scale-125 max-h-[600px] 
                        drop-shadow-2xl transition-transform duration-500 
                        hover:scale-[1.25] hover:-rotate-2"
            />
          </div>

          {/* Nội dung */}
          <div className="space-y-6 order-2 sm:order-1 sm:pr-20 text-center sm:text-left">
            <p data-aos="fade-up" className="text-xl font-semibold uppercase tracking-wide">
              Dễ dàng - Tiện lợi - An toàn
            </p>
            <h1
              data-aos="fade-up"
              data-aos-delay="500"
              className="text-5xl lg:text-7xl font-bold font-serif leading-tight"
            >
              Dịch Vụ Thuê Xe Tự Lái
            </h1>
            <p data-aos="fade-up" data-aos-delay="800" className="text-lg text-gray-600">
              Trải nghiệm di chuyển đẳng cấp với dịch vụ thuê xe hàng đầu. Thủ tục nhanh chóng, hỗ trợ 24/7.
            </p>
            <div data-aos="fade-up" data-aos-delay="1100" className="flex flex-col sm:flex-row gap-4 justify-center sm:justify-start">
              <a href="/dat-xe">
                <button className="rounded-lg bg-black hover:bg-gray-800 transition duration-500 py-3 px-8 text-white text-lg font-medium shadow-lg">
                  Đặt xe ngay
                </button>
              </a>
              <a href="/danh-sach-xe">
                <button className="rounded-lg border border-black hover:bg-black transition duration-500 py-3 px-8 text-black hover:text-white text-lg font-medium">
                  Xem danh sách xe
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-gray-300 opacity-30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-40 h-40 bg-gray-400 opacity-20 rounded-full blur-3xl"></div>
    </div>
  );
};

export default Hero;
