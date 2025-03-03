import React, { useState } from "react";
import { FaTrash, FaMinus, FaPlus, FaCalendarAlt, FaArrowLeft } from "react-icons/fa";

// Dữ liệu mẫu cho giỏ hàng
const initialCartItems = [
  {
    id: 1,
    name: "BMW UX",
    image: "/api/placeholder/300/200", // Thay thế bằng placeholder vì không có assets
    price: 1000000,
    days: 3,
    features: ["Tự động", "4 chỗ", "Xăng"],
    pickupDate: "2025-03-10",
    returnDate: "2025-03-13",
    location: "Đà Nẵng"
  },
  {
    id: 2,
    name: "KIA UX",
    image: "/api/placeholder/300/200", // Thay thế bằng placeholder vì không có assets
    price: 1400000,
    days: 2,
    features: ["Tự động", "7 chỗ", "Xăng"],
    pickupDate: "2025-03-15",
    returnDate: "2025-03-17",
    location: "Hà Nội"
  }
];

const CartList = () => {
  const [cartItems, setCartItems] = useState(initialCartItems);

  // Tính tổng tiền
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.days), 0);
  };

  // Tính thuế (10%)
  const calculateTax = () => {
    return calculateSubtotal() * 0.1;
  };

  // Tính tổng cộng
  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  // Xóa một mục khỏi giỏ hàng
  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  // Tăng số ngày thuê
  const increaseDays = (id) => {
    setCartItems(cartItems.map(item => {
      if (item.id === id) {
        const newDays = item.days + 1;
        // Cập nhật ngày trả xe dựa trên số ngày mới
        const pickupDate = new Date(item.pickupDate);
        const newReturnDate = new Date(pickupDate);
        newReturnDate.setDate(pickupDate.getDate() + newDays);
        
        return {
          ...item,
          days: newDays,
          returnDate: newReturnDate.toISOString().split('T')[0]
        };
      }
      return item;
    }));
  };

  // Giảm số ngày thuê (tối thiểu 1 ngày)
  const decreaseDays = (id) => {
    setCartItems(cartItems.map(item => {
      if (item.id === id && item.days > 1) {
        const newDays = item.days - 1;
        // Cập nhật ngày trả xe dựa trên số ngày mới
        const pickupDate = new Date(item.pickupDate);
        const newReturnDate = new Date(pickupDate);
        newReturnDate.setDate(pickupDate.getDate() + newDays);
        
        return {
          ...item,
          days: newDays,
          returnDate: newReturnDate.toISOString().split('T')[0]
        };
      }
      return item;
    }));
  };

  // Format tiền tệ
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND',
      maximumFractionDigits: 0 
    }).format(amount);
  };

  // Chuyển đổi ngày thành định dạng dd/mm/yyyy
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  return (
    <div className="bg-gray-50 py-12 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="flex items-center mb-8">
          <a href="/" className="flex items-center text-red-700 hover:text-red-800">
            <FaArrowLeft className="mr-2" />
            <span>Tiếp tục thuê xe</span>
          </a>
          <h1 className="text-3xl font-semibold font-serif mx-auto pr-16">Giỏ Hàng</h1>
        </div>
        
        {cartItems.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Giỏ hàng của bạn đang trống</h2>
            <p className="text-gray-600 mb-8">Hãy thêm xe vào giỏ hàng để tiến hành thuê xe</p>
            <a
              href="/"
              className="px-6 py-3 bg-red-700 text-white rounded-lg hover:bg-red-800 transition-colors duration-200"
            >
              Xem danh sách xe
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Danh sách xe trong giỏ hàng */}
            <div className="lg:col-span-2">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-md mb-6 overflow-hidden">
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row">
                      {/* Hình ảnh xe */}
                      <div className="md:w-1/3 bg-gray-100 p-4 rounded-lg flex items-center justify-center">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-36 object-contain"
                        />
                      </div>
                      
                      {/* Thông tin xe */}
                      <div className="md:w-2/3 md:pl-6 mt-4 md:mt-0">
                        <div className="flex justify-between items-start">
                          <h2 className="text-xl font-semibold text-gray-800">{item.name}</h2>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-red-700 hover:text-red-900"
                          >
                            <FaTrash />
                          </button>
                        </div>
                        
                        {/* Các tính năng xe */}
                        <div className="flex gap-2 my-2">
                          {item.features.map((feature, idx) => (
                            <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                              {feature}
                            </span>
                          ))}
                        </div>
                        
                        {/* Địa điểm */}
                        <p className="text-gray-600 my-2">
                          <span className="font-semibold">Địa điểm: </span>
                          {item.location}
                        </p>
                        
                        {/* Thời gian thuê */}
                        <div className="flex items-center text-gray-600 mb-4">
                          <FaCalendarAlt className="mr-2 text-red-700" />
                          <span>{formatDate(item.pickupDate)} - {formatDate(item.returnDate)}</span>
                        </div>
                        
                        {/* Điều chỉnh số ngày và giá */}
                        <div className="flex flex-wrap items-center justify-between mt-2">
                          <div className="flex items-center border rounded-lg overflow-hidden mr-4 mb-2">
                            <button
                              onClick={() => decreaseDays(item.id)}
                              className="px-3 py-1 bg-gray-100 hover:bg-gray-200"
                              disabled={item.days <= 1}
                            >
                              <FaMinus className={item.days <= 1 ? "text-gray-400" : "text-gray-700"} />
                            </button>
                            <span className="px-4 py-1">{item.days} ngày</span>
                            <button
                              onClick={() => increaseDays(item.id)}
                              className="px-3 py-1 bg-gray-100 hover:bg-gray-200"
                            >
                              <FaPlus className="text-gray-700" />
                            </button>
                          </div>
                          <div className="text-xl font-bold text-red-700 mb-2">
                            {formatCurrency(item.price * item.days)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Tóm tắt đơn hàng */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h2 className="text-xl font-semibold mb-4 pb-4 border-b">Tóm Tắt Đơn Hàng</h2>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tạm tính</span>
                    <span className="font-semibold">{formatCurrency(calculateSubtotal())}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Thuế (10%)</span>
                    <span>{formatCurrency(calculateTax())}</span>
                  </div>
                </div>
                
                <div className="flex justify-between py-4 border-t border-b mb-6">
                  <span className="text-lg font-semibold">Tổng cộng</span>
                  <span className="text-xl font-bold text-red-700">{formatCurrency(calculateTotal())}</span>
                </div>
                
                <button className="w-full py-3 bg-red-700 text-white rounded-lg hover:bg-red-800 transition-colors mb-3">
                  Tiến hành thanh toán
                </button>
                
                <button className="w-full py-3 border border-red-700 text-red-700 rounded-lg hover:bg-red-50 transition-colors">
                  Tiếp tục thuê xe
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartList;
