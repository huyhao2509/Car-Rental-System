import React, { useEffect, useState } from "react";
import { FaCalendarAlt, FaMapMarkerAlt, FaGasPump, FaCogs, FaUsers, FaArrowLeft, FaCheck, FaCar, FaRegCalendarAlt } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import Api from "@/utils/Api";
import { toast } from "react-toastify";

function CarDetail() {
    const [pickupDate, setPickupDate] = useState("");
    const [returnDate, setReturnDate] = useState("");
    const [days, setDays] = useState(1);
    const [car, setCar] = useState({});
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const [gioThue, setGioThue] = useState(0);

    const getDataDetail = async () => {
        try {
            setLoading(true);
            const res = await Api.get(`/client/xe/get-detail/${id}`);
            setCar(res.data.data);
            console.log(res.data.data);
        } catch (error) {
            console.error("Lỗi khi lấy thông tin xe:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getDataDetail();
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        setPickupDate(today.toISOString().split('T')[0]);
        setReturnDate(tomorrow.toISOString().split('T')[0]);
    }, [id]);

    // Tính tổng tiền
    const calculateTotal = () => {
        return (car.giaTheoNgay * days) + (car.giaTheoGio * gioThue);
    };

    // Format tiền tệ
    const formatCurrency = (amount) => {
        if (!amount) return "0 VNĐ";
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            maximumFractionDigits: 0
        }).format(amount);
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

    // Thêm vào giỏ hàng
    const addToCart = async () => {
        if (!pickupDate || !returnDate) {
            alert("Vui lòng chọn ngày nhận và trả xe");
            return;
        }

        const bookingDetails = {
            idXe: car.id,
            thoiGianBatDau: pickupDate,
            thoiGianKetThuc: returnDate,
            soGioThue: gioThue,
            soNgayThue: days,
            donGia: calculateTotal(),
        };

        try {
            const res = await Api.post('/client/don-hang/them-gio-hang', bookingDetails);
            if(res.data.status) {
                toast.success(res.data.message);
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            toast.error(error.data.message ?? "Lỗi khi thêm vào giỏ hàng");
        }
        
    };

    // Đặt xe ngay
    const bookNow = async () => {
        await addToCart();
    };

    // Hiển thị trạng thái xe
    const renderStatus = (status) => {
        switch(status) {
            case 1:
                return <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">Sẵn sàng</span>;
            case 2:
                return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm font-medium">Đang thuê</span>;
            case 0:
                return <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">Bảo dưỡng</span>;
            default:
                return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-medium">Không xác định</span>;
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-700"></div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 py-12">
            <div className="container mx-auto px-4">
                {/* Đường dẫn và nút quay lại */}
                <div className="mb-6">
                    <Link to="/cars" className="flex items-center text-red-700 hover:text-red-800 w-fit">
                        <FaArrowLeft className="mr-2" />
                        <span>Quay lại danh sách xe</span>
                    </Link>
                </div>

                {/* Phần chính */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Hình ảnh và thông tin chi tiết */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                            {/* Phần hình ảnh */}
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <h1 className="text-3xl font-bold text-gray-800">{car.tenXe}</h1>
                                    <div>
                                        {renderStatus(car.trangThai)}
                                    </div>
                                </div>
                                <div className="flex items-center text-gray-600 mb-6">
                                    <span className="flex items-center mr-4">
                                        <FaMapMarkerAlt className="mr-1 text-red-600" />
                                        <span>{car.bienSoXe}</span>
                                    </span>
                                </div>
                                <div className="mb-4">
                                    <div className="bg-white rounded-lg overflow-hidden mb-4">
                                        <img
                                            src={car.hinhAnh}
                                            alt={car.tenXe}
                                            className="w-full h-96 object-contain"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Các tính năng chính */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 bg-gray-50 border-t border-b border-gray-200">
                                <div className="p-4 text-center">
                                    <div className="text-red-700 text-2xl flex justify-center mb-2">
                                        <FaCar />
                                    </div>
                                    <p className="text-gray-500 text-sm">Hãng xe</p>
                                    <p className="font-semibold">{car.HangXe?.tenHangXe}</p>
                                </div>
                                <div className="p-4 text-center">
                                    <div className="text-red-700 text-2xl flex justify-center mb-2">
                                        <FaCogs />
                                    </div>
                                    <p className="text-gray-500 text-sm">Loại xe</p>
                                    <p className="font-semibold">{car.LoaiXe?.tenLoaiXe}</p>
                                </div>
                                <div className="p-4 text-center">
                                    <div className="text-red-700 text-2xl flex justify-center mb-2">
                                        <FaUsers />
                                    </div>
                                    <p className="text-gray-500 text-sm">Số chỗ ngồi</p>
                                    <p className="font-semibold">{car.sucChua} chỗ</p>
                                </div>
                                <div className="p-4 text-center">
                                    <div className="text-red-700 text-2xl flex justify-center mb-2">
                                        <FaRegCalendarAlt />
                                    </div>
                                    <p className="text-gray-500 text-sm">Năm sản xuất</p>
                                    <p className="font-semibold">{car.namSanXuat}</p>
                                </div>
                            </div>

                            {/* Thông tin giá */}
                            <div className="p-6">
                                <h2 className="text-xl font-semibold mb-4">Bảng giá thuê xe</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-gray-600 mb-1">Giá thuê theo giờ</p>
                                        <p className="text-xl font-bold text-gray-800">{formatCurrency(car.giaTheoGio)}</p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-gray-600 mb-1">Giá thuê theo ngày</p>
                                        <p className="text-xl font-bold text-red-700">{formatCurrency(car.giaTheoNgay)}</p>
                                    </div>
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
                                    <span className="text-2xl font-bold text-red-700 mr-2">{formatCurrency(car.giaTheoNgay)}</span>
                                </div>
                                <p className="text-gray-500 text-sm">Giá thuê / ngày</p>
                            </div>

                            {/* Form đặt xe */}
                            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
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
                                            required
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
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Số giờ thuê thêm */}
                                <div>
                                    <label className="block text-gray-700 mb-2 font-medium">Số giờ thuê thêm</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={gioThue}
                                            onChange={(e) => setGioThue(parseInt(e.target.value) || 0)}
                                            min="0"
                                            max="23"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">Thêm giờ nếu bạn cần thuê thêm ngoài số ngày</p>
                                </div>

                                {/* Số ngày thuê */}
                                <div className="border-t border-b border-gray-200 py-4 my-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Số ngày thuê:</span>
                                        <span className="font-semibold">{days} ngày</span>
                                    </div>
                                    {gioThue > 0 && (
                                        <div className="flex justify-between items-center mt-2">
                                            <span className="text-gray-600">Số giờ thuê thêm:</span>
                                            <span className="font-semibold">{gioThue} giờ</span>
                                        </div>
                                    )}
                                    {gioThue > 0 && (
                                        <div className="flex justify-between items-center mt-2">
                                            <span className="text-gray-600">Tiền thuê giờ:</span>
                                            <span className="font-medium text-gray-700">{formatCurrency(car.giaTheoGio * gioThue)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between items-center mt-2">
                                        <span className="text-gray-600">Tiền thuê ngày:</span>
                                        <span className="font-medium text-gray-700">{formatCurrency(car.giaTheoNgay * days)}</span>
                                    </div>
                                    <div className="flex justify-between items-center mt-2">
                                        <span className="text-gray-600">Tổng tiền:</span>
                                        <span className="text-xl font-bold text-red-700">{formatCurrency(calculateTotal())}</span>
                                    </div>
                                </div>

                                {car.trangThai === 1 ? (
                                    <>
                                        {/* Nút đặt xe */}
                                        <button
                                            type="button"
                                            onClick={bookNow}
                                            className="w-full py-3 bg-red-700 text-white rounded-lg hover:bg-red-800 transition-colors font-medium"
                                        >
                                            Đặt xe ngay
                                        </button>

                                        <button
                                            type="button"
                                            onClick={addToCart}
                                            className="w-full py-3 border border-red-700 text-red-700 rounded-lg hover:bg-red-50 transition-colors font-medium"
                                        >
                                            Thêm vào giỏ hàng
                                        </button>
                                    </>
                                ) : (
                                    <div className="w-full py-3 bg-gray-300 text-gray-600 rounded-lg font-medium text-center">
                                        Xe hiện không khả dụng
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CarDetail;
