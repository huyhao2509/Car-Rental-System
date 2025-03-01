import React, { useEffect } from "react";
import yellowCar from "../../assets/banner-car.png";
import AOS from "aos";
import "aos/dist/aos.css";

const Hero = () => {
  useEffect(() => {
    AOS.init({ duration: 1200, once: true });
  }, []);

  return (
    <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 text-black py-24 overflow-hidden">
      {/* Background Elements - Nhiều hơn và đa dạng hơn */}
      <div className="absolute top-20 left-10 w-40 h-40 bg-yellow-400 opacity-20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-60 h-60 bg-blue-300 opacity-20 rounded-full blur-3xl"></div>
      <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-red-300 opacity-15 rounded-full blur-3xl"></div>
      
      <div className="container min-h-[650px] flex">
        <div className="grid grid-cols-1 sm:grid-cols-2 place-items-center gap-12">
          {/* Hình ảnh xe - thêm hiệu ứng và trang trí */}
          <div data-aos="zoom-in" className="order-1 sm:order-2 relative">
            {/* Vòng tròn trang trí phía sau xe */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] bg-gradient-to-r from-yellow-300/30 to-orange-300/30 rounded-full blur-sm"></div>
            
            {/* Bóng đổ nâng cao */}
            <div className="absolute bottom-0 w-4/5 h-8 bg-black/20 blur-xl rounded-full mx-auto left-0 right-0"></div>
            
            <img
              src={yellowCar}
              alt="Luxury Car"
              className="sm:scale-125 max-h-[600px] 
                      drop-shadow-[0_35px_35px_rgba(0,0,0,0.3)] transition-all duration-700 
                      hover:scale-[1.28] hover:-rotate-2 hover:drop-shadow-[0_45px_45px_rgba(0,0,0,0.35)]"
            />
            
            {/* Badges trang trí */}
            <div className="absolute -top-5 right-10 bg-yellow-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg transform rotate-12">NEW</div>
          </div>

          {/* Nội dung - thêm các hiệu ứng và style */}
          <div className="space-y-7 order-2 sm:order-1 sm:pr-20 text-center sm:text-left">
            <div 
              data-aos="fade-up" 
              className="inline-block bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-1 rounded-full font-semibold tracking-wide"
            >
              Dễ dàng - Tiện lợi - An toàn
            </div>
            
            <h1
              data-aos="fade-up"
              data-aos-delay="300"
              className="text-5xl lg:text-6xl xl:text-7xl font-bold font-serif leading-tight bg-gradient-to-r from-gray-900 via-gray-700 to-black bg-clip-text text-transparent"
            >
              Dịch Vụ <span className="text-yellow-500">Thuê Xe</span> Tự Lái
            </h1>
            
            <p 
              data-aos="fade-up" 
              data-aos-delay="600" 
              className="text-lg text-gray-600 max-w-xl"
            >
              Trải nghiệm di chuyển đẳng cấp với dịch vụ thuê xe hàng đầu. 
              Thủ tục nhanh chóng, đa dạng mẫu xe, hỗ trợ 24/7 cho mọi hành trình của bạn.
            </p>
            
            <div className="flex flex-wrap sm:flex-nowrap gap-5 justify-center sm:justify-start mt-8" data-aos="fade-up" data-aos-delay="900">
              <a href="/booking">
                <button className="rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 transition-all duration-500 py-4 px-8 text-white text-lg font-medium shadow-xl hover:shadow-2xl transform hover:-translate-y-1 flex items-center gap-2">
                  <span>Đặt xe ngay</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </a>
              <a href="/cars">
                <button className="rounded-full border-2 border-gray-800 hover:bg-gray-800 transition-all duration-500 py-4 px-8 text-gray-800 hover:text-white text-lg font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                  Xem danh sách xe
                </button>
              </a>
            </div>
            
            {/* Thêm chỉ số vượt trội */}
            <div className="grid grid-cols-3 gap-4 mt-12" data-aos="fade-up" data-aos-delay="1200">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-500">100+</div>
                <div className="text-sm text-gray-600">Xe Sang</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-500">24/7</div>
                <div className="text-sm text-gray-600">Hỗ Trợ</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-500">99%</div>
                <div className="text-sm text-gray-600">Hài Lòng</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
