import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaCalendarAlt, FaMapMarkerAlt, FaCar } from 'react-icons/fa';

// Tạo một Context API riêng cho giỏ hàng nếu chưa có
// Hoặc thay đổi state để lưu trữ trong localStorage
const useCart = () => {
  // Đọc giỏ hàng từ localStorage khi component được khởi tạo
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cartItems');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Cập nhật localStorage mỗi khi giỏ hàng thay đổi
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cart));
  }, [cart]);

  // Thêm item vào giỏ hàng
  const addToCart = (item) => {
    setCart(prevCart => [...prevCart, item]);
  };

  return { cart, addToCart };
};

export default function Booking({ car }) {
  const navigate = useNavigate();
  const { carId } = useParams(); // Nếu lấy carId từ URL
  const { addToCart } = useCart();
  
  // State cho form đặt xe
  const [formData, setFormData] = useState({
    pickupDate: '',
    returnDate: '',
    pickupLocation: 'Đà Nẵng', // Default địa điểm
    returnLocation: 'Đà Nẵng',
    additionalServices: []
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Nếu không có car prop, bạn có thể tạo dữ liệu mẫu hoặc lấy từ API
  const carData = car || {
    id: carId || Date.now(),
    name: "Toyota Camry",
    image: "/api/placeholder/300/200",
    price: 800000,
    features: ["Tự động", "4 chỗ", "Xăng"],
  };
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      // Xử lý cho các ô checkbox (dịch vụ bổ sung)
      if (checked) {
        setFormData({
          ...formData,
          additionalServices: [...formData.additionalServices, name]
        });
      } else {
        setFormData({
          ...formData,
          additionalServices: formData.additionalServices.filter(service => service !== name)
        });
      }
    } else {
      // Xử lý cho các trường input thông thường
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  // Tính số ngày thuê từ ngày đi và ngày về
  const calculateDays = () => {
    if (!formData.pickupDate || !formData.returnDate) return 1;
    
    const pickupDate = new Date(formData.pickupDate);
    const returnDate = new Date(formData.returnDate);
    const diffTime = Math.abs(returnDate - pickupDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays || 1; // Tối thiểu 1 ngày
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Kiểm tra thông tin đầu vào
    if (!formData.pickupDate || !formData.returnDate || !formData.pickupLocation) {
      alert("Vui lòng điền đầy đủ thông tin thuê xe");
      return;
    }
    
    // Tạo đối tượng booking phù hợp với cấu trúc dữ liệu CartList
    const bookingDetails = {
      id: Date.now(), // ID tạm thời cho booking
      name: carData.name,
      image: carData.image,
      price: carData.price,
      days: calculateDays(),
      features: carData.features || ["Tự động", "4 chỗ", "Xăng"],
      pickupDate: formData.pickupDate,
      returnDate: formData.returnDate,
      location: formData.pickupLocation
    };
    
    // Thêm vào giỏ hàng
    addToCart(bookingDetails);
    
    // Hiển thị thông báo thành công
    setIsSubmitted(true);
    
    // Tự động chuyển đến trang giỏ hàng sau 2 giây
    setTimeout(() => {
      navigate('/cart');
    }, 2000);
  };
  
  if (isSubmitted) {
    return (
      <div className="max-w-md mx-auto my-10 p-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <div className="bg-green-100 inline-flex p-3 rounded-full mb-4">
            <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-center text-green-600 mb-4">Đã thêm vào giỏ hàng!</h2>
          <p className="text-gray-700 mb-6">
            Xe {carData.name} đã được thêm vào giỏ hàng của bạn.
          </p>
          <div className="mt-6 bg-gray-50 p-4 rounded-md mb-6">
            <h3 className="font-semibold mb-2">Thông tin thuê xe:</h3>
            <p className="text-sm text-gray-600">Ngày nhận: {formData.pickupDate}</p>
            <p className="text-sm text-gray-600">Ngày trả: {formData.returnDate}</p>
            <p className="text-sm text-gray-600">Địa điểm: {formData.pickupLocation}</p>
            <p className="text-sm text-gray-600">Số ngày thuê: {calculateDays()} ngày</p>
          </div>
          <div className="flex space-x-4">
            <button 
              onClick={() => navigate('/cart')}
              className="w-1/2 bg-red-700 text-white py-2 rounded-md hover:bg-red-800"
            >
              Xem giỏ hàng
            </button>
            <button 
              onClick={() => {
                setIsSubmitted(false);
                setFormData({
                  pickupDate: '',
                  returnDate: '',
                  pickupLocation: 'Đà Nẵng',
                  returnLocation: 'Đà Nẵng',
                  additionalServices: []
                });
              }}
              className="w-1/2 bg-gray-200 text-gray-800 py-2 rounded-md hover:bg-gray-300"
            >
              Thuê xe khác
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-3xl mx-auto my-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-red-700 mb-6">Đặt thuê xe</h2>
      
      {/* Thông tin xe */}
      <div className="flex flex-col md:flex-row border-b pb-6 mb-6">
        <div className="md:w-1/3 bg-gray-100 p-4 rounded-lg flex items-center justify-center">
          <img 
            src={carData.image}
            alt={carData.name} 
            className="h-40 object-contain"
          />
        </div>
        
        <div className="md:w-2/3 md:pl-6 mt-4 md:mt-0">
          <h3 className="text-xl font-bold text-gray-800">{carData.name}</h3>
          
          <div className="flex gap-2 my-3">
            {carData.features && carData.features.map((feature, idx) => (
              <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                {feature}
              </span>
            ))}
          </div>
          
          <div className="mt-2 text-gray-700">
            <div className="flex items-center mb-1">
              <FaCar className="mr-2 text-red-700" />
              <span>Xe có sẵn để thuê ngay</span>
            </div>
            <div className="flex items-center mb-1">
              <FaMapMarkerAlt className="mr-2 text-red-700" />
              <span>Có sẵn tại Đà Nẵng, Hà Nội, Hồ Chí Minh</span>
            </div>
          </div>
          
          <div className="mt-4">
            <span className="text-gray-600 text-sm">Giá thuê:</span>
            <div className="text-2xl font-bold text-red-700">
              {new Intl.NumberFormat('vi-VN', { 
                style: 'currency', 
                currency: 'VND',
                maximumFractionDigits: 0 
              }).format(carData.price)} / ngày
            </div>
          </div>
        </div>
      </div>
      
      {/* Form đặt xe */}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="pickupDate">
              <div className="flex items-center">
                <FaCalendarAlt className="mr-2 text-red-700" />
                Ngày nhận xe
              </div>
            </label>
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              id="pickupDate"
              name="pickupDate"
              type="date"
              value={formData.pickupDate}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="returnDate">
              <div className="flex items-center">
                <FaCalendarAlt className="mr-2 text-red-700" />
                Ngày trả xe
              </div>
            </label>
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              id="returnDate"
              name="returnDate"
              type="date"
              value={formData.returnDate}
              onChange={handleChange}
              min={formData.pickupDate} // Không cho chọn ngày trả trước ngày nhận
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="pickupLocation">
              <div className="flex items-center">
                <FaMapMarkerAlt className="mr-2 text-red-700" />
                Địa điểm nhận xe
              </div>
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              id="pickupLocation"
              name="pickupLocation"
              value={formData.pickupLocation}
              onChange={handleChange}
              required
            >
              <option value="">Chọn địa điểm</option>
              <option value="Đà Nẵng">Đà Nẵng</option>
              <option value="Hà Nội">Hà Nội</option>
              <option value="Hồ Chí Minh">Hồ Chí Minh</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="returnLocation">
              <div className="flex items-center">
                <FaMapMarkerAlt className="mr-2 text-red-700" />
                Địa điểm trả xe
              </div>
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              id="returnLocation"
              name="returnLocation"
              value={formData.returnLocation}
              onChange={handleChange}
              required
            >
              <option value="">Chọn địa điểm</option>
              <option value="Đà Nẵng">Đà Nẵng</option>
              <option value="Hà Nội">Hà Nội</option>
              <option value="Hồ Chí Minh">Hồ Chí Minh</option>
            </select>
          </div>
        </div>
        
        <div className="mt-6">
          <h4 className="text-md font-semibold text-gray-700 mb-3">Dịch vụ bổ sung</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="insurance" 
                name="insurance"
                onChange={handleChange}
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
              <label htmlFor="insurance" className="ml-2 block text-sm text-gray-700">
                Bảo hiểm toàn diện (+100,000 VNĐ/ngày)
              </label>
            </div>
            
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="gps" 
                name="gps"
                onChange={handleChange}
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
              <label htmlFor="gps" className="ml-2 block text-sm text-gray-700">
                GPS (+50,000 VNĐ/ngày)
              </label>
            </div>
            
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="childSeat" 
                name="childSeat"
                onChange={handleChange}
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
              <label htmlFor="childSeat" className="ml-2 block text-sm text-gray-700">
                Ghế em bé (+80,000 VNĐ/ngày)
              </label>
            </div>
            
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="extraDriver" 
                name="extraDriver"
                onChange={handleChange}
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
              <label htmlFor="extraDriver" className="ml-2 block text-sm text-gray-700">
                Tài xế bổ sung (+200,000 VNĐ/ngày)
              </label>
            </div>
          </div>
        </div>
        
        <div className="mt-8 border-t pt-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600">Số ngày thuê:</span>
            <span className="font-semibold">{calculateDays()} ngày</span>
          </div>
          
          <div className="flex justify-between items-center mb-6">
            <span className="text-gray-600">Tổng tiền dự kiến:</span>
            <span className="text-xl font-bold text-red-700">
              {new Intl.NumberFormat('vi-VN', { 
                style: 'currency', 
                currency: 'VND',
                maximumFractionDigits: 0 
              }).format(carData.price * calculateDays())}
            </span>
          </div>
          
          <button
            type="submit"
            className="w-full bg-red-700 text-white py-3 rounded-md hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Thêm vào giỏ hàng
          </button>
        </div>
      </form>
    </div>
  );
}
