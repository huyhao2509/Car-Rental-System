import React, { useState } from "react";
import whiteCar from "@/assets/white-car.png";
import car2 from "@/assets/car5.png";
import car3 from "@/assets/car6.png";

// ...
// Thêm nhiều xe hơn
const carList = [
  {
    name: "BMW UX",
    price: 100,
    image: whiteCar,
    features: ["Tự động", "4 chỗ", "Xăng"]
  },
  {
    name: "KIA UX",
    price: 140,
    image: car2,
    features: ["Tự động", "7 chỗ", "Xăng"]
  },
  {
    name: "BMW UX",
    price: 100,
    image: car3,
    features: ["Tự động", "5 chỗ", "Diesel"]
  },
  {
    name: "Toyota Camry",
    price: 120,
    image: whiteCar,
    features: ["Tự động", "5 chỗ", "Xăng"]
  },
  {
    name: "Honda CRV",
    price: 150,
    image: car2,
    features: ["Tự động", "7 chỗ", "Xăng"]
  },
  {
    name: "Mazda 6",
    price: 110,
    image: car3,
    features: ["Tự động", "5 chỗ", "Xăng"]
  },
  {
    name: "Ford Everest",
    price: 180,
    image: whiteCar,
    features: ["Tự động", "7 chỗ", "Diesel"]
  },
  {
    name: "Hyundai Tucson",
    price: 130,
    image: car2,
    features: ["Tự động", "5 chỗ", "Xăng"]
  },
  {
    name: "Mercedes E200",
    price: 250,
    image: car3,
    features: ["Tự động", "5 chỗ", "Xăng"]
  },
];

const CarList = () => {
  // State để kiểm soát số lượng xe hiển thị
  const [visibleCars, setVisibleCars] = useState(3);
  
  // Hiển thị tất cả xe
  const showAllCars = () => {
    setVisibleCars(carList.length);
  };
  
  // Lấy danh sách xe hiện tại để hiển thị
  const currentCars = carList.slice(0, visibleCars);
  
  // Kiểm tra xem đã hiển thị tất cả xe chưa
  const isShowingAll = visibleCars >= carList.length;

  return (
    <div className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-semibold font-serif mb-4">
            Danh Sách Xe
          </h1>
          <div className="w-24 h-1 bg-red-700 rounded-full mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Khám phá các dòng xe với giá thuê hợp lý tại dịch vụ cho thuê xe của chúng tôi.
          </p>
        </div>

        {/* Car List Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentCars.map((car, index) => (
            <div
              key={index}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200"
            >
              {/* Badge */}
              <div className="relative">
                <span className="absolute top-3 left-3 bg-red-700 text-white px-2 py-1 rounded-md text-sm">
                  12 Km
                </span>
                
                {/* Car Image */}
                <div className="bg-gray-100 h-44 flex items-center justify-center p-4">
                  <img
                    src={car.image}
                    alt={car.name}
                    className="h-full object-contain"
                  />
                </div>
              </div>

              {/* Car Details */}
              <div className="p-4">
                <h2 className="text-lg font-semibold text-red-700 mb-2">{car.name}</h2>
                
                {/* Features */}
                <div className="flex gap-2 mb-3">
                  {car.features.map((feature, idx) => (
                    <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                      {feature}
                    </span>
                  ))}
                </div>
                
                <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                  <p className="text-xl font-bold text-gray-800">
                    ${car.price}
                    <span className="text-sm text-gray-500 font-normal">/Ngày</span>
                  </p>
                  <a
                    href="#"
                    className="px-3 py-1 bg-red-700 text-white text-sm rounded hover:bg-red-800 transition-colors duration-200"
                  >
                    Chi tiết
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button - chỉ hiển thị khi chưa hiển thị tất cả xe */}
        {!isShowingAll && (
          <div className="text-center mt-10">
            <button 
              onClick={showAllCars}
              className="px-6 py-2 bg-red-700 text-white font-medium rounded-lg hover:bg-red-800 transition-colors duration-200"
            >
              Xem Tất Cả Xe
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CarList;
