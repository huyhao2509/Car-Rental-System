import React from "react";
import carImage from "@/assets/banner-car.png";
import CarSearchForm from "@/features/cars/CarSearchForm/CarSearchForm";

const Hero = () => {
  return (
    <div className="bg-gradient-to-b from-red-50 to-slate-100 text-gray-700 py-6 relative">
      {/* Background elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-red-200 opacity-10 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-red-300 opacity-10 rounded-full blur-xl"></div>
      
      {/* Changed from container mx-auto px-4 to container mx-auto to match navbar width */}
      <div className="container mx-auto min-h-[500px]">
        <div className="grid grid-cols-1 md:grid-cols-2 place-items-center gap-8">
          {/* Car image - simplified effects */}
          <div className="order-1 md:order-2 relative">
            {/* Clearer background highlight for the car */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] h-[85%] bg-white/70 rounded-full"></div>
            
            {/* Simpler shadow */}
            <div className="absolute bottom-0 w-4/5 h-6 bg-black/10 blur-lg rounded-full mx-auto left-0 right-0"></div>
            
            <img
              src={carImage}
              alt="Car Rental"
              className="max-h-[450px] drop-shadow-lg transition-all duration-500 hover:scale-105 filter contrast-125 brightness-105"
            />
            
            {/* More friendly badge */}
            <div className="absolute -top-3 right-10 bg-red-800 text-white text-sm font-medium px-3 py-1 rounded-lg shadow-md">Dễ Thuê</div>
          </div>

          {/* Content - more approachable style */}
          <div className="space-y-6 order-2 md:order-1 md:pr-10 text-center md:text-left">
            <div className="inline-block bg-red-800 text-white px-4 py-1 rounded-lg font-medium">
              Thuận tiện - Tiết kiệm - An toàn
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-700 leading-tight">
              Dịch Vụ <span className="text-red-800">Thuê Xe</span> Tự Lái
            </h1>
            
            <p className="text-lg text-gray-600 max-w-xl">
              Trải nghiệm dịch vụ thuê xe tự lái chất lượng. 
              Nhiều lựa chọn xe, giá cả hợp lý, thủ tục đơn giản.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center md:justify-start mt-6">
              <a href="/cars">
                <button className="rounded-lg bg-red-800 hover:bg-red-700 transition-all duration-300 py-3 px-6 text-white text-base font-medium shadow-md hover:shadow-lg flex items-center gap-2">
                  <span>Tìm xe ngay</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </a>
              <a href="/cars">
                <button className="rounded-lg border-2 border-gray-400 hover:bg-gray-100 transition-all duration-300 py-3 px-6 text-gray-600 text-base font-medium">
                  Xem danh sách xe
                </button>
              </a>
            </div>
            
            {/* Simplified stats with more friendly look */}
            <div className="grid grid-cols-3 gap-4 mt-8 bg-white p-4 rounded-lg shadow-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-800">50+</div>
                <div className="text-sm text-gray-600">Xe Tự Lái</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-800">24/7</div>
                <div className="text-sm text-gray-600">Hỗ Trợ</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-800">99%</div>
                <div className="text-sm text-gray-600">Hài Lòng</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Search Form also adjusted to match navbar width */}
      <div id="search-section" className="container mx-auto mt-16 mb-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-6">Tìm xe phù hợp với bạn</h2>
          <div className="bg-white rounded-xl shadow-lg">
            <CarSearchForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
