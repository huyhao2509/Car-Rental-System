import Api from "@/utils/Api";
import React, { useState, useEffect } from "react";
import { FaSearch, FaMapMarkerAlt, FaGasPump, FaCog, FaRegCalendarAlt, FaShoppingCart } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
const CarList = () => {
    const navigate = useNavigate();

    // Dữ liệu mẫu danh sách xe
    const [cars, setCars] = useState([]);

    // Trạng thái cho bộ lọc
    const [filters, setFilters] = useState({
        hangXe: "",
        loaiXe: "",
        namSanXuat: "",
        sucChua: "",
        trangThai: "",
        minPrice: "",
        maxPrice: "",
        search: "",
    });

    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        const cartItems = localStorage.getItem('cartItems');
        if (cartItems) {
            const items = JSON.parse(cartItems);
            setCartCount(items.length);
        }
    }, []);

    // Trạng thái cho sắp xếp
    const [sortBy, setSortBy] = useState("default");

    // Xử lý thay đổi bộ lọc và tìm kiếm
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
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
        // Bắt đầu với tất cả xe
        return cars
            .filter(car => {
                // Điều kiện tìm kiếm theo từ khóa (tên xe hoặc biển số)
                if (filters.search) {
                    const searchTerm = filters.search.toLowerCase();
                    if (!car.tenXe?.toLowerCase().includes(searchTerm) && 
                        !car.bienSoXe?.toLowerCase().includes(searchTerm)) {
                        return false;
                    }
                }
                
                // Lọc theo hãng xe
                if (filters.hangXe && (!car.HangXe || car.HangXe.tenHangXe !== filters.hangXe)) {
                    return false;
                }
                
                // Lọc theo loại xe
                if (filters.loaiXe && (!car.LoaiXe || car.LoaiXe.tenLoaiXe !== filters.loaiXe)) {
                    return false;
                }
                
                if (filters.namSanXuat && car.namSanXuat !== parseInt(filters.namSanXuat)) {
                    return false;
                }
                
                if (filters.sucChua && car.sucChua !== parseInt(filters.sucChua)) {
                    return false;
                }
                
                if (filters.trangThai !== "" && car.trangThai !== parseInt(filters.trangThai)) {
                    return false;
                }
                
                if (filters.minPrice && car.giaTheoNgay < parseInt(filters.minPrice)) {
                    return false;
                }
                
                if (filters.maxPrice && car.giaTheoNgay > parseInt(filters.maxPrice)) {
                    return false;
                }
                
                return true;
            })
            .sort((a, b) => {
                // Sắp xếp xe
                switch (sortBy) {
                    case "priceAsc":
                        return a.giaTheoNgay - b.giaTheoNgay; // Giá tăng dần
                    case "priceDesc":
                        return b.giaTheoNgay - a.giaTheoNgay; // Giá giảm dần
                    case "newest":
                        return b.namSanXuat - a.namSanXuat; // Xe mới nhất
                    case "rating":
                        return (b.rating || 0) - (a.rating || 0); // Đánh giá cao nhất
                    default:
                        return 0;
                }
            });
    };


    const getDataXe = async () => {
        const res = await Api.get('client/xe/get-all');
        setCars(res.data.data);
    }

    useEffect(() => {
        getDataXe();
    }, []);
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

    // const locations = Array.isArray(cars)
    //     ? [...new Set(cars.map(car => car.location).filter(Boolean))]
    //     : [];

    // const fuelTypes = Array.isArray(cars)
    //     ? [...new Set(cars.map(car => car.fuel).filter(Boolean))]
    //     : [];

    // const transmissionTypes = Array.isArray(cars)
    //     ? [...new Set(cars.map(car => car.transmission).filter(Boolean))]
    //     : [];

    // const seatOptions = Array.isArray(cars)
    //     ? [...new Set(cars.map(car => car.seats).filter(seat => seat !== undefined && seat !== null))]
    //     : [];


    const filteredCars = filterCars();

    // Lấy danh sách các tùy chọn lọc một cách an toàn
    const getHangXe = () => {
        return cars && cars.length > 0 
            ? [...new Set(cars.filter(car => car.HangXe).map(car => car.HangXe.tenHangXe))]
            : [];
    };

    const getLoaiXe = () => {
        return cars && cars.length > 0 
            ? [...new Set(cars.filter(car => car.LoaiXe).map(car => car.LoaiXe.tenLoaiXe))]
            : [];
    };

    const getNamSanXuat = () => {
        return cars && cars.length > 0 
            ? [...new Set(cars.map(car => car.namSanXuat))].sort((a, b) => b - a)
            : [];
    };

    const getSucChua = () => {
        return cars && cars.length > 0 
            ? [...new Set(cars.map(car => car.sucChua))].sort((a, b) => a - b)
            : [];
    };

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
                                    onChange={handleFilterChange}
                                    placeholder="Tìm kiếm xe theo tên hoặc tên hãng..."
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

                            {/* Lọc theo hãng xe */}
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium mb-2">
                                    <FaGasPump className="inline mr-2 text-red-600" />
                                    Hãng xe
                                </label>
                                <select
                                    name="hangXe"
                                    value={filters.hangXe}
                                    onChange={handleFilterChange}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Tất cả hãng xe</option>
                                    {getHangXe().map(hangXe => (
                                        <option key={hangXe} value={hangXe}>
                                            {hangXe}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Lọc theo loại xe */}
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium mb-2">
                                    <FaCog className="inline mr-2 text-red-600" />
                                    Loại xe
                                </label>
                                <select
                                    name="loaiXe"
                                    value={filters.loaiXe}
                                    onChange={handleFilterChange}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Tất cả loại xe</option>
                                    {getLoaiXe().map(loaiXe => (
                                        <option key={loaiXe} value={loaiXe}>
                                            {loaiXe}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Lọc theo năm sản xuất */}
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium mb-2">
                                    <FaRegCalendarAlt className="inline mr-2 text-red-600" />
                                    Năm sản xuất
                                </label>
                                <select
                                    name="namSanXuat"
                                    value={filters.namSanXuat}
                                    onChange={handleFilterChange}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Tất cả năm</option>
                                    {getNamSanXuat().map(nam => (
                                        <option key={nam} value={nam}>
                                            {nam}
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
                                    name="sucChua"
                                    value={filters.sucChua}
                                    onChange={handleFilterChange}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Tất cả số ghế</option>
                                    {getSucChua().map(soGhe => (
                                        <option key={soGhe} value={soGhe}>
                                            {soGhe} chỗ
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Lọc theo trạng thái */}
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium mb-2">
                                    Trạng thái xe
                                </label>
                                <select
                                    name="trangThai"
                                    value={filters.trangThai}
                                    onChange={handleFilterChange}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Tất cả trạng thái</option>
                                    <option value="1">Sẵn sàng</option>
                                    <option value="2">Đang thuê</option>
                                    <option value="0">Bảo dưỡng</option>
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

                            <button 
                                onClick={() => setFilters({
                                    hangXe: "",
                                    loaiXe: "",
                                    namSanXuat: "",
                                    sucChua: "",
                                    trangThai: "",
                                    minPrice: "",
                                    maxPrice: "",
                                    search: filters.search,
                                })}
                                className="w-full bg-red-600 text-white py-3 rounded-md font-medium hover:bg-red-700 transition-colors mt-2"
                            >
                                Xóa bộ lọc
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
                                            <div className="md:w-2/5 h-64 md:h-auto relative">
                                                <img
                                                    src={car.hinhAnh || 'https://via.placeholder.com/400x300?text=No+Image'}
                                                    alt={car.tenXe}
                                                    className="w-full h-full object-cover"
                                                />
                                                <div
                                                    className={`absolute top-4 left-4 text-white px-2 py-1 rounded text-sm font-semibold
                                                    ${car.trangThai === 1 ? 'bg-green-600' : car.trangThai === 2 ? 'bg-yellow-500' : 'bg-red-600'}`}
                                                >
                                                    {car.trangThai === 1 ? 'Sẵn Sàng' : car.trangThai === 2 ? 'Đang thuê' : 'Bảo Dưỡng'}
                                                </div>
                                            </div>

                                            {/* Car info */}
                                            <div className="md:w-3/5 p-6">
                                                <div className="flex flex-col md:flex-row justify-between mb-4">
                                                    <h2 className="text-2xl font-bold text-gray-800 mb-2 md:mb-0">{car.tenXe}</h2>
                                                    <div className="flex items-center">
                                                        <div className="flex items-center text-gray-600 mr-3">
                                                            <FaMapMarkerAlt className="mr-1 text-red-500" />
                                                            <span className="text-sm font-medium">{car.bienSoXe}</span>
                                                        </div>
                                                        {car.rating && (
                                                            <div className="flex items-center">
                                                                <div className="mr-1">
                                                                    {renderRating(car.rating)}
                                                                </div>
                                                                <span className="text-sm text-gray-600">({car.reviews || 0})</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
                                                    {car.HangXe && (
                                                        <div className="flex items-center bg-gray-50 p-2 rounded-lg">
                                                            <span className="w-8 h-8 bg-red-50 rounded-full flex items-center justify-center mr-2">
                                                                <FaGasPump className="text-red-600" />
                                                            </span>
                                                            <div>
                                                                <div className="text-xs text-gray-500">Hãng xe</div>
                                                                <div className="text-sm font-medium">{car.HangXe.tenHangXe}</div>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {car.namSanXuat && (
                                                        <div className="flex items-center bg-gray-50 p-2 rounded-lg">
                                                            <span className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center mr-2">
                                                                <FaCog className="text-blue-600" />
                                                            </span>
                                                            <div>
                                                                <div className="text-xs text-gray-500">Năm SX</div>
                                                                <div className="text-sm font-medium">{car.namSanXuat}</div>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {car.sucChua && (
                                                        <div className="flex items-center bg-gray-50 p-2 rounded-lg">
                                                            <span className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center mr-2">
                                                                <span className="text-green-600 font-bold">A</span>
                                                            </span>
                                                            <div>
                                                                <div className="text-xs text-gray-500">Số ghế</div>
                                                                <div className="text-sm font-medium">{car.sucChua} chỗ</div>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {car.LoaiXe && (
                                                        <div className="flex items-center bg-gray-50 p-2 rounded-lg">
                                                            <span className="w-8 h-8 bg-purple-50 rounded-full flex items-center justify-center mr-2">
                                                                <span className="text-purple-600 font-bold">C</span>
                                                            </span>
                                                            <div>
                                                                <div className="text-xs text-gray-500">Loại xe</div>
                                                                <div className="text-sm font-medium">{car.LoaiXe.tenLoaiXe}</div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="border-t pt-4 flex flex-col md:flex-row items-center justify-between">
                                                    <div className="mb-4 md:mb-0">
                                                        <span className="text-gray-600 text-sm">Giá thuê mỗi ngày</span>
                                                        <div className="text-2xl font-bold text-red-600">
                                                            {formatCurrency(car.giaTheoNgay)}
                                                        </div>
                                                        {car.giaTheoGio && (
                                                            <div className="text-sm text-gray-600">
                                                                {formatCurrency(car.giaTheoGio)}/giờ
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-wrap gap-2 justify-center md:justify-end">
                                                        <Link
                                                            to={`/cars/${car.id}`}
                                                            className="px-4 py-2 bg-white border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors whitespace-nowrap"
                                                        >
                                                            Xem chi tiết
                                                        </Link>
                                                        {/* {car.trangThai === 1 && (
                                                            <>
                                                                <button
                                                                    onClick={() => addToCart(car)}
                                                                    className="px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors whitespace-nowrap"
                                                                >
                                                                    <FaShoppingCart className="inline mr-1" />
                                                                    Thêm vào giỏ
                                                                </button>
                                                                <button
                                                                    onClick={() => bookNowAndGoToCart(car)}
                                                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors whitespace-nowrap"
                                                                >
                                                                    Đặt ngay
                                                                </button>
                                                            </>
                                                        )} */}
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
                                        hangXe: "",
                                        loaiXe: "",
                                        namSanXuat: "",
                                        sucChua: "",
                                        trangThai: "",
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
