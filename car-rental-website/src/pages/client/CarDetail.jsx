import React, { useState } from "react";
import { FaCalendarAlt, FaMapMarkerAlt, FaGasPump, FaCogs, FaUsers, FaShieldAlt, FaArrowLeft, FaCheck } from "react-icons/fa";
import whiteCar from "../../assets/white-car.png";

function CarDetail() {
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [days, setDays] = useState(1);

  // Thông tin chi tiết xe mẫu
  const carInfo = {
    id: 1,
    name: "BMW UX 2023",
    price: 1200000,
    priceOld: 1500000,
    image: whiteCar,
    gallery: [whiteCar, whiteCar, whiteCar, whiteCar],
    description: "BMW UX là mẫu xe SUV hạng sang với thiết kế hiện đại, nội thất sang trọng và động cơ mạnh mẽ. Xe được trang bị nhiều công nghệ tiên tiến, mang lại trải nghiệm lái xe tuyệt vời.",
    features: [
      { icon: <FaGasPump />, name: "Động cơ", value: "2.0L" },
      { icon: <FaCogs />, name: "Hộp số", value: "Tự động" },
      { icon: <FaUsers />, name: "Chỗ ngồi", value: "5 người" },
      { icon: <FaShieldAlt />, name: "Bảo hiểm", value: "Đầy đủ" }
    ],
    specs: [
      { name: "Nhiên liệu", value: "Xăng" },
      { name: "Tiêu thụ nhiên liệu", value: "7.5L/100km" },
      { name: "Công suất", value: "180 mã lực" },
      { name: "Năm sản xuất", value: "2023" },
      { name: "Kiểu dáng", value: "SUV" },
      { name: "Màu sắc", value: "Trắng" },
      { name: "Xuất xứ", value: "Nhập khẩu" },
      { name: "Tình trạng", value: "Mới 100%" }
    ],
    advantages: [
      "Thủ tục đơn giản, nhanh chóng",
      "Giao xe tận nơi",
      "Bảo hiểm toàn diện",
      "Hỗ trợ 24/7",
      "Không giới hạn quãng đường",
      "Bảo dưỡng định kỳ"
    ],
    locations: ["Đà Nẵng", "Hà Nội", "Hồ Chí Minh"]
  };

  // Tính tổng tiền
  const calculateTotal = () => {
    return carInfo.price * days;
  };

  // Format tiền tệ
  const formatCurrency = (amount) => {
    return amount.toLocaleString('vi-VN') + ' VND';
  };

  // Xử lý khi thay đổi ngày nhận xe
  const handlePickupDateChange = (e) => {
    const newPickupDate = e.target.value;
    setPickupDate(newPickupDate);
    
    // Cập nhật ngày trả xe nếu đã có ngày nhận
    if (newPickupDate) {
      const pickupDateObj = new Date(newPickupDate);
      const returnDateObj = new Date(pickupDateObj);
      returnDateObj.setDate(pickupDateObj.getDate() + days);
      setReturnDate(returnDateObj.toISOString().split('T')[0]);
    }
  };

  // Xử lý khi thay đổi ngày trả xe
  const handleReturnDateChange = (e) => {
    const newReturnDate = e.target.value;
    setReturnDate(newReturnDate);
    
    // Tính số ngày thuê
    if (pickupDate && newReturnDate) {
      const pickupDateObj = new Date(pickupDate);
      const returnDateObj = new Date(newReturnDate);
      const diffTime = returnDateObj - pickupDateObj;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setDays(diffDays > 0 ? diffDays : 1);
    }
  };

  // Chọn hình ảnh thumbnail
  const [mainImage, setMainImage] = useState(carInfo.image);
  
  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Đường dẫn và nút quay lại */}
        <div className="mb-6">
          <a href="/" className="flex items-center text-red-700 hover:text-red-800 w-fit">
            <FaArrowLeft className="mr-2" />
            <span>Quay lại danh sách xe</span>
          </a>
        </div>

        {/* Phần chính */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Hình ảnh và thông tin chi tiết */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
              {/* Phần hình ảnh */}
              <div className="p-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">{carInfo.name}</h1>
                <div className="mb-4">
                  <div className="bg-white rounded-lg overflow-hidden mb-4">
                    <img 
                      src={mainImage} 
                      alt={carInfo.name}
                      className="w-full h-96 object-contain"
                    />
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {carInfo.gallery.map((img, index) => (
                      <div 
                        key={index}
                        className={`cursor-pointer border-2 rounded-lg overflow-hidden ${mainImage === img ? 'border-red-700' : 'border-gray-200'}`}
                        onClick={() => setMainImage(img)}
                      >
                        <img 
                          src={img} 
                          alt={`${carInfo.name}-${index}`}
                          className="w-full h-20 object-contain"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Các tính năng chính */}
              <div className="grid grid-cols-2 sm:grid-cols-4 bg-gray-50 border-t border-b border-gray-200">
                {carInfo.features.map((feature, index) => (
                  <div key={index} className="p-4 text-center">
                    <div className="text-red-700 text-2xl flex justify-center mb-2">
                      {feature.icon}
                    </div>
                    <p className="text-gray-500 text-sm">{feature.name}</p>
                    <p className="font-semibold">{feature.value}</p>
                  </div>
                ))}
              </div>

              {/* Mô tả */}
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Mô tả</h2>
                <p className="text-gray-600 mb-6">
                  {carInfo.description}
                </p>
              </div>
            </div>

            {/* Thông số kỹ thuật */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Thông số kỹ thuật</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {carInfo.specs.map((spec, index) => (
                    <div key={index} className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">{spec.name}</span>
                      <span className="font-medium">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Ưu điểm dịch vụ */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Ưu điểm dịch vụ</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {carInfo.advantages.map((advantage, index) => (
                    <div key={index} className="flex items-center">
                      <FaCheck className="text-green-500 mr-2" />
                      <span>{advantage}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Đặt xe và thông tin giá */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-4 pb-4 border-b">Đặt xe</h2>
              
              {/* Giá */}
              <div className="mb-6">
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-red-700 mr-2">{formatCurrency(carInfo.price)}</span>
                  <span className="text-lg line-through text-gray-400">{formatCurrency(carInfo.priceOld)}</span>
                  <span className="ml-2 bg-red-100 text-red-700 px-2 py-1 rounded text-sm">-20%</span>
                </div>
                <p className="text-gray-500 text-sm">Giá thuê / ngày</p>
              </div>
              
              {/* Form đặt xe */}
              <form className="space-y-4">
                {/* Địa điểm */}
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">Địa điểm</label>
                  <div className="relative">
                    <FaMapMarkerAlt className="absolute top-3 left-3 text-gray-400" />
                    <select className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500">
                      {carInfo.locations.map((location, index) => (
                        <option key={index} value={location}>{location}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                {/* Ngày nhận xe */}
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">Ngày nhận xe</label>
                  <div className="relative">
                    <FaCalendarAlt className="absolute top-3 left-3 text-gray-400" />
                    <input
                      type="date"
                      value={pickupDate}
                      onChange={handlePickupDateChange}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                </div>
                
                {/* Ngày trả xe */}
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">Ngày trả xe</label>
                  <div className="relative">
                    <FaCalendarAlt className="absolute top-3 left-3 text-gray-400" />
                    <input
                      type="date"
                      value={returnDate}
                      onChange={handleReturnDateChange}
                      min={pickupDate || new Date().toISOString().split('T')[0]}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                </div>
                
                {/* Số ngày thuê */}
                <div className="border-t border-b border-gray-200 py-4 my-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Số ngày thuê:</span>
                    <span className="font-semibold">{days} ngày</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-gray-600">Tổng tiền:</span>
                    <span className="text-xl font-bold text-red-700">{formatCurrency(calculateTotal())}</span>
                  </div>
                </div>
                
                {/* Nút đặt xe */}
                <button
                  type="submit"
                  className="w-full py-3 bg-red-700 text-white rounded-lg hover:bg-red-800 transition-colors font-medium"
                >
                  Đặt xe ngay
                </button>
                
                <button
                  type="button"
                  className="w-full py-3 border border-red-700 text-red-700 rounded-lg hover:bg-red-50 transition-colors font-medium"
                >
                  Thêm vào giỏ hàng
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CarDetail;
