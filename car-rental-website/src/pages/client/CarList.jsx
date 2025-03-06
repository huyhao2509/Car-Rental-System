import React, { useState, useEffect } from "react";
import { FaSearch, FaMapMarkerAlt, FaGasPump, FaCog, FaRegCalendarAlt, FaShoppingCart } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const CarList = () => {
  const navigate = useNavigate();
  
  // Dữ liệu mẫu danh sách xe
  const [cars, setCars] = useState([
    {
      id: 1,
      name: "Toyota Camry 2.5Q",
      year: 2023,
      pricePerDay: 1200000,
      image: "/api/placeholder/320/180",
      mileage: "30000",
      fuel: "Xăng",
      transmission: "Tự động",
      seats: 5,
      color: "Trắng ngọc trai",
      location: "Hà Nội",
      status: "Có sẵn",
      rating: 4.8,
      reviews: 24,
      features: ["Hệ thống an toàn Toyota Safety Sense", "Màn hình 9 inch", "Camera 360", "Cửa sổ trời"],
    },
    {
      id: 2,
      name: "Honda Civic RS",
      year: 2023,
      pricePerDay: 1000000,
      image: "/api/placeholder/320/180",
      mileage: "15000",
      fuel: "Xăng",
      transmission: "Tự động",
      seats: 5,
      color: "Đỏ",
      location: "Hồ Chí Minh",
      status: "Có sẵn",
      rating: 4.7,
      reviews: 18,
      features: ["Động cơ tăng áp VTEC Turbo", "Hệ thống Honda Sensing", "Màn hình 10.2 inch", "Ghế da"],
    },
    {
      id: 3,
      name: "Mazda CX-5 2.5L",
      year: 2022,
      pricePerDay: 1100000,
      image: "/api/placeholder/320/180",
      mileage: "40000",
      fuel: "Xăng",
      transmission: "Tự động",
      seats: 5,
      color: "Xanh đen",
      location: "Đà Nẵng",
      status: "Có sẵn",
      rating: 4.6,
      reviews: 15,
      features: ["Bản cao cấp", "Cửa sổ trời", "Âm thanh Bose", "Ghế da"],
    },
    {
      id: 4,
      name: "VinFast VF8 Eco",
      year: 2023,
      pricePerDay: 1500000,
      image: "/api/placeholder/320/180",
      mileage: "10000",
      fuel: "Điện",
      transmission: "Tự động",
      seats: 7,
      color: "Xám",
      location: "Hà Nội",
      status: "Có sẵn",
      rating: 4.5,
      reviews: 12,
      features: ["Pin 82kWh", "Phạm vi di chuyển 400km", "Màn hình trung tâm 15.6 inch", "Trợ lý ảo"],
    },
    {
      id: 5,
      name: "Hyundai Tucson 1.6 Turbo",
      year: 2023,
      pricePerDay: 1100000,
      image: "/api/placeholder/320/180",
      mileage: "25000",
      fuel: "Xăng",
      transmission: "Tự động",
      seats: 5,
      color: "Trắng",
      location: "Hồ Chí Minh",
      status: "Có sẵn",
      rating: 4.6,
      reviews: 20,
      features: ["Động cơ tăng áp", "Hệ thống an toàn SmartSense", "Màn hình 10.25 inch", "Cửa sổ trời toàn cảnh"],
    },
    {
      id: 6,
      name: "Ford Everest Titanium+",
      year: 2023,
      pricePerDay: 1400000,
      image: "/api/placeholder/320/180",
      mileage: "20000",
      fuel: "Dầu",
      transmission: "Tự động",
      seats: 7,
      color: "Xanh",
      location: "Hải Phòng",
      status: "Có sẵn",
      rating: 4.7,
      reviews: 16,
      features: ["Động cơ Bi-Turbo", "Hệ thống địa hình Terrain Management", "Màn hình 12 inch cảm ứng", "Hàng ghế thứ 3"],
    },
  ]);

  // Trạng thái cho bộ lọc
  const [filters, setFilters] = useState({
    location: "",
    date: "",
    fuel: "",
    seats: "",
    transmission: "",
    minPrice: "",
    maxPrice: "",
    search: "",
  });

  // Trạng thái cho giỏ hàng
  const [cartCount, setCartCount] = useState(0);

  // Lấy số lượng xe trong giỏ hàng từ localStorage khi component được khởi tạo
  useEffect(() => {
    const cartItems = localStorage.getItem('cartItems');
    if (cartItems) {
      const items = JSON.parse(cartItems);
      setCartCount(items.length);
    }
  }, []);

  // Trạng thái cho sắp xếp
  const [sortBy, setSortBy] = useState("default");

  // Xử lý thay đổi bộ lọc
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  // Xử lý thay đổi sắp xếp
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  // Tạo ngày thuê mặc định từ ngày hiện tại đến ngày mai
  const getDefaultDates = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return {
      pickupDate: today.toISOString().split('T')[0],
      returnDate: tomorrow.toISOString().split('T')[0]
    };
  };

  // Thêm xe vào giỏ hàng
  const addToCart = (car) => {
    // Lấy ngày mặc định
    const { pickupDate, returnDate } = getDefaultDates();
    
    // Tạo đối tượng booking
    const bookingDetails = {
      id: Date.now(), // ID tạm thời cho booking
      name: car.name,
      image: car.image,
      price: car.pricePerDay,
      days: 1, // Mặc định 1 ngày
      features: [car.transmission, `${car.seats} chỗ`, car.fuel],
      pickupDate: pickupDate,
      returnDate: returnDate,
      location: car.location
    };
    
    // Lấy giỏ hàng hiện tại từ localStorage
    const existingCartItems = localStorage.getItem('cartItems');
    const cartItems = existingCartItems ? JSON.parse(existingCartItems) : [];
    
    // Thêm xe mới vào giỏ hàng
    cartItems.push(bookingDetails);
    
    // Lưu giỏ hàng mới vào localStorage
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    
    // Cập nhật số lượng xe trong giỏ hàng
    setCartCount(cartItems.length);
    
    // Hiển thị thông báo
    if (typeof toast !== 'undefined') {
      toast.success(`Đã thêm ${car.name} vào giỏ hàng!`, {
        position: "top-right",
        autoClose: 3000
      });
    } else {
      alert(`Đã thêm ${car.name} vào giỏ hàng!`);
    }
  };

  // Đặt ngay và đi đến trang giỏ hàng
  const bookNowAndGoToCart = (car) => {
    addToCart(car);
    navigate('/cart');
  };

  // Hàm lọc xe
  const filterCars = () => {
    let filteredCars = [...cars];

    // Lọc theo tìm kiếm
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredCars = filteredCars.filter(car => 
        car.name.toLowerCase().includes(searchTerm) ||
        car.location.toLowerCase().includes(searchTerm)
      );
    }

    // Lọc theo địa điểm
    if (filters.location) {
      filteredCars = filteredCars.filter(car => car.location === filters.location);
    }

    // Lọc theo loại nhiên liệu
    if (filters.fuel) {
      filteredCars = filteredCars.filter(car => car.fuel === filters.fuel);
    }

    // Lọc theo số ghế
    if (filters.seats) {
      filteredCars = filteredCars.filter(car => car.seats === parseInt(filters.seats));
    }

    // Lọc theo hộp số
    if (filters.transmission) {
      filteredCars = filteredCars.filter(car => car.transmission === filters.transmission);
    }

    // Lọc theo giá tối thiểu
    if (filters.minPrice) {
      filteredCars = filteredCars.filter(car => car.pricePerDay >= parseInt(filters.minPrice));
    }

    // Lọc theo giá tối đa
    if (filters.maxPrice) {
      filteredCars = filteredCars.filter(car => car.pricePerDay <= parseInt(filters.maxPrice));
    }

    // Sắp xếp
    if (sortBy === "priceAsc") {
      filteredCars.sort((a, b) => a.pricePerDay - b.pricePerDay);
    } else if (sortBy === "priceDesc") {
      filteredCars.sort((a, b) => b.pricePerDay - a.pricePerDay);
    } else if (sortBy === "newest") {
      filteredCars.sort((a, b) => b.year - a.year);
    } else if (sortBy === "rating") {
      filteredCars.sort((a, b) => b.rating - a.rating);
    }

    return filteredCars;
  };

  // Format giá tiền
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND',
      maximumFractionDigits: 0 
    }).format(amount);
  };

  // Tạo stars rating UI
  const renderRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={`star-${i}`} className="text-yellow-500">★</span>);
    }
    
    if (hasHalfStar) {
      stars.push(<span key="half-star" className="text-yellow-500">★</span>);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="text-gray-300">★</span>);
    }
    
    return stars;
  };

  // Lấy danh sách địa điểm duy nhất
  const locations = [...new Set(cars.map(car => car.location))];
  
  // Lấy danh sách loại nhiên liệu duy nhất
  const fuelTypes = [...new Set(cars.map(car => car.fuel))];
  
  // Lấy danh sách loại hộp số duy nhất
  const transmissionTypes = [...new Set(cars.map(car => car.transmission))];
  
  // Lấy danh sách số ghế duy nhất
  const seatOptions = [...new Set(cars.map(car => car.seats))];

  // Danh sách xe đã lọc
  const filteredCars = filterCars();

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-700 to-red-500 py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex justify-end mb-4">
            <Link to="/cart" className="flex items-center bg-white/20 backdrop-blur px-4 py-2 rounded-full text-white">
              <FaShoppingCart className="mr-2" />
              <span className="font-medium">Giỏ hàng ({cartCount})</span>
            </Link>
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-6 drop-shadow-md">Thuê Xe Uy Tín, Giá Tốt</h1>
          <p className="text-xl text-white opacity-90 mb-8">
            Đa dạng dòng xe, giá cả cạnh tranh, dịch vụ chuyên nghiệp
          </p>
          
          {/* Search bar */}
          <div className="max-w-3xl mx-auto flex bg-white/30 backdrop-blur rounded-full overflow-hidden shadow-lg border border-white/20">
            <div className="flex-grow p-3 pl-6">
              <div className="flex items-center">
                <FaSearch className="text-white mr-3" />
                <input
                  type="text"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  placeholder="Tìm kiếm xe..."
                  className="w-full outline-none bg-transparent text-white placeholder-white/80"
                />
              </div>
            </div>
            <button className="bg-gray-800 text-white px-8 py-3 font-medium hover:bg-gray-900 transition-colors rounded-full m-1">
              Tìm Kiếm
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar filters */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-6">Bộ Lọc</h2>
              
              {/* Lọc theo địa điểm */}
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  <FaMapMarkerAlt className="inline mr-2 text-red-600" />
                  Địa điểm
                </label>
                <select
                  name="location"
                  value={filters.location}
                  onChange={handleFilterChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Tất cả địa điểm</option>
                  {locations.map(location => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Lọc theo ngày */}
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  <FaRegCalendarAlt className="inline mr-2 text-red-600" />
                  Ngày thuê
                </label>
                <input
                  type="date"
                  name="date"
                  value={filters.date}
                  onChange={handleFilterChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              {/* Lọc theo nhiên liệu */}
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  <FaGasPump className="inline mr-2 text-red-600" />
                  Loại nhiên liệu
                </label>
                <select
                  name="fuel"
                  value={filters.fuel}
                  onChange={handleFilterChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Tất cả nhiên liệu</option>
                  {fuelTypes.map(type => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Lọc theo số ghế */}
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Số chỗ ngồi
                </label>
                <select
                  name="seats"
                  value={filters.seats}
                  onChange={handleFilterChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Tất cả số ghế</option>
                  {seatOptions.map(seats => (
                    <option key={seats} value={seats}>
                      {seats} chỗ
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Lọc theo hộp số */}
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  <FaCog className="inline mr-2 text-red-600" />
                  Hộp số
                </label>
                <select
                  name="transmission"
                  value={filters.transmission}
                  onChange={handleFilterChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Tất cả hộp số</option>
                  {transmissionTypes.map(type => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Lọc theo giá */}
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Khoảng giá (VNĐ/ngày)
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <select
                    name="minPrice"
                    value={filters.minPrice}
                    onChange={handleFilterChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Giá tối thiểu</option>
                    <option value="500000">500.000</option>
                    <option value="800000">800.000</option>
                    <option value="1000000">1.000.000</option>
                    <option value="1200000">1.200.000</option>
                  </select>
                  <select
                    name="maxPrice"
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Giá tối đa</option>
                    <option value="1000000">1.000.000</option>
                    <option value="1500000">1.500.000</option>
                    <option value="2000000">2.000.000</option>
                    <option value="2500000">2.500.000</option>
                  </select>
                </div>
              </div>
              
              <button className="w-full bg-red-600 text-white py-3 rounded-md font-medium hover:bg-red-700 transition-colors mt-2">
                Áp dụng bộ lọc
              </button>
            </div>
          </div>
          
          {/* Main content */}
          <div className="lg:w-3/4">
            {/* Sorting and result count */}
            <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-lg shadow-md mb-6">
              <p className="mb-3 sm:mb-0">
                <span className="font-medium">Hiển thị:</span> {filteredCars.length} xe
              </p>
              <div className="flex items-center">
                <label htmlFor="sortBy" className="text-gray-700 mr-2">
                  Sắp xếp:
                </label>
                <select
                  id="sortBy"
                  value={sortBy}
                  onChange={handleSortChange}
                  className="p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="default">Mặc định</option>
                  <option value="priceAsc">Giá: Thấp đến cao</option>
                  <option value="priceDesc">Giá: Cao đến thấp</option>
                  <option value="newest">Mới nhất</option>
                  <option value="rating">Đánh giá cao nhất</option>
                </select>
              </div>
            </div>
            
            {/* Car list */}
            {filteredCars.length > 0 ? (
              <div className="space-y-6">
                {filteredCars.map(car => (
                  <div key={car.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div className="flex flex-col md:flex-row">
                      {/* Car image */}
                      <div className="md:w-2/5 relative">
                        <img
                          src={car.image}
                          alt={car.name}
                          className="w-full h-64 md:h-full object-cover"
                        />
                        <div className="absolute top-4 left-4 bg-red-600 text-white px-2 py-1 rounded text-sm font-semibold">
                          {car.status}
                        </div>
                      </div>
                      
                      {/* Car info */}
                      <div className="md:w-3/5 p-6">
                        <div className="flex justify-between items-start mb-2">
                          <h2 className="text-2xl font-bold text-gray-800">{car.name}</h2>
                          <div className="flex items-center">
                            <div className="mr-1">
                              {renderRating(car.rating)}
                            </div>
                            <span className="text-sm text-gray-600">({car.reviews})</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center text-gray-600 mb-4">
                          <FaMapMarkerAlt className="mr-1 text-red-500" />
                          <span>{car.location}</span>
                        </div>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-3 gap-x-2 mb-4">
                          <div className="flex items-center">
                            <span className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center mr-2 text-xs">
                              <FaGasPump className="text-gray-700" />
                            </span>
                            <span className="text-sm">{car.fuel}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center mr-2 text-xs">
                              <FaCog className="text-gray-700" />
                            </span>
                            <span className="text-sm">{car.transmission}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center mr-2 text-xs">
                              A
                            </span>
                            <span className="text-sm">{car.seats} chỗ</span>
                          </div>
                          <div className="flex items-center">
                            <span className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center mr-2 text-xs">
                              C
                            </span>
                            <span className="text-sm">Đời {car.year}</span>
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <h3 className="text-sm font-medium text-gray-700 mb-2">Tính năng nổi bật:</h3>
                          <div className="flex flex-wrap gap-2">
                            {car.features.map((feature, idx) => (
                              <span key={idx} className="inline-block bg-gray-100 rounded-full px-3 py-1 text-xs font-medium text-gray-700">
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex flex-col md:flex-row md:items-center justify-between mt-4 pt-4 border-t">
                          <div className="mb-4 md:mb-0">
                            <span className="text-gray-600 text-sm">Giá thuê mỗi ngày từ</span>
                            <div className="text-2xl font-bold text-red-600">
                              {formatCurrency(car.pricePerDay)}
                            </div>
                          </div>
                          <div className="flex space-x-3">
                            <Link 
                              to={`/cars/${car.id}`} 
                              className="px-4 py-2 bg-white border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                            >
                              Xem chi tiết
                            </Link>
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => addToCart(car)}
                                className="px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                              >
                                <FaShoppingCart className="inline mr-1" />
                                Thêm vào giỏ
                              </button>
                              <button 
                                onClick={() => bookNowAndGoToCart(car)}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                              >
                                Đặt ngay
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 p-8 rounded-lg text-center">
                <h3 className="text-xl font-semibold text-yellow-800 mb-3">Không tìm thấy xe nào</h3>
                <p className="text-yellow-700 mb-4">
                  Không có xe nào phù hợp với bộ lọc của bạn. Vui lòng thử lại với các lựa chọn khác.
                </p>
                <button 
                  onClick={() => setFilters({
                    location: "",
                    date: "",
                    fuel: "",
                    seats: "",
                    transmission: "",
                    minPrice: "",
                    maxPrice: "",
                    search: "",
                  })}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
                >
                  Xóa bộ lọc
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarList;
