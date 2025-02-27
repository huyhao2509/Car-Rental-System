import React from "react";
import CarPng from "../../assets/car1.png";

const About = () => {
  return (
    <div className="bg-gradient-to-b from-gray-100 to-gray-200 sm:min-h-[600px] sm:grid sm:place-items-center py-16">
      <div className="container px-6 sm:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 place-items-center gap-12">
          {/* Hình ảnh */}
          <div data-aos="slide-right" data-aos-duration="1500">
            <img
              src={CarPng}
              alt="Xe hơi"
              className="sm:scale-110 sm:-translate-x-6 max-h-[320px] drop-shadow-2xl rounded-2xl transition-transform duration-500 hover:scale-105"
            />
          </div>

          {/* Nội dung */}
          <div className="text-center sm:text-left space-y-6 sm:p-12">
            <h1
              data-aos="fade-up"
              className="text-3xl sm:text-4xl font-bold font-serif text-gray-900"
            >
              Về Chúng Tôi
            </h1>
            <p data-aos="fade-up" className="leading-8 tracking-wide text-gray-700 text-lg">
              Chúng tôi cung cấp dịch vụ thuê xe tự lái <span className="text-gray-900 font-semibold">chất lượng, tiện lợi và an toàn</span>.  
              Cam kết mang đến trải nghiệm tốt nhất cho khách hàng.
            </p>
            <p data-aos="fade-up" className="text-gray-700 text-lg">
              Hãy khám phá và đồng hành cùng chúng tôi trên mọi hành trình!
            </p>
            <button
              data-aos="fade-up"
              className="px-6 py-3 border border-gray-900 text-gray-900 rounded-full font-semibold shadow-md hover:bg-gray-900 hover:text-white transition-all duration-300"
            >
              Bắt Đầu Ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
