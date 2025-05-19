import React from "react";
import CarPng from "@/assets/car1.png";

const About = () => {
  return (
    <div className="bg-gradient-to-b from-slate-100 to-white py-16">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 place-items-center gap-10">
          {/* Hình ảnh - đơn giản hóa */}
          <div className="relative">
            {/* Phần tử trang trí đơn giản hơn */}
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] bg-red-50 rounded-xl"></div>
            
            <img
              src={CarPng}
              alt="Xe hơi"
              className="max-h-[300px] drop-shadow-md rounded-lg transition-all duration-300 hover:scale-105"
            />
          </div>

          {/* Nội dung - phong cách đơn giản, dễ đọc */}
          <div className="text-center md:text-left space-y-5">
            <div className="inline-block bg-red-50 px-3 py-1 rounded-lg text-red-700 font-medium text-sm">
              DỊCH VỤ THUÊ XE TỰ LÁI
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800">
              Về Dịch Vụ Của Chúng Tôi
            </h2>
            
            <div className="w-16 h-1 bg-red-700 rounded-full mx-auto md:mx-0"></div>
            
            <p className="text-slate-600 text-lg">
              Chúng tôi cung cấp dịch vụ thuê xe tự lái với ba tiêu chí chính: 
              <span className="text-red-700 font-medium"> chất lượng, tiện lợi và an toàn</span>. 
              Đáp ứng mọi nhu cầu di chuyển với đội xe đa dạng.
            </p>
            
            <div className="bg-white p-4 rounded-lg shadow-sm my-6">
              <ul className="space-y-2">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-red-700 mt-1 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-slate-700">Xe được kiểm tra kỹ thuật định kỳ</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-red-700 mt-1 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-slate-700">Thủ tục thuê xe đơn giản, nhanh chóng</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-red-700 mt-1 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-slate-700">Hỗ trợ khách hàng 24/7</span>
                </li>
              </ul>
            </div>
            
            <div className="flex flex-wrap gap-4 pt-2 justify-center md:justify-start">
              <button className="px-6 py-2.5 bg-red-800 text-white rounded-lg font-medium hover:bg-red-700 transition-all duration-300 flex items-center gap-2">
                <span>Tìm Hiểu Thêm</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              
              <button className="px-6 py-2.5 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-red-50 transition-all duration-300">
                Liên Hệ Ngay
              </button>
            </div>
            
            {/* Thông tin số liệu */}
            <div className="grid grid-cols-3 gap-4 pt-6 mt-4 border-t border-slate-200">
              <div className="text-center p-2 bg-white rounded-lg shadow-sm">
                <div className="text-red-700 font-bold text-xl">200+</div>
                <div className="text-sm text-slate-600">Xe Các Loại</div>
              </div>
              <div className="text-center p-2 bg-white rounded-lg shadow-sm">
                <div className="text-red-700 font-bold text-xl">15+</div>
                <div className="text-sm text-slate-600">Năm Kinh Nghiệm</div>
              </div>
              <div className="text-center p-2 bg-white rounded-lg shadow-sm">
                <div className="text-red-700 font-bold text-xl">24/7</div>
                <div className="text-sm text-slate-600">Hỗ Trợ</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
