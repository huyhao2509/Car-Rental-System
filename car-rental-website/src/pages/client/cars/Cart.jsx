import Api from "@/utils/Api";
import React, { useEffect, useState } from "react";
import { FaTrash, FaMinus, FaPlus, FaCalendarAlt, FaArrowLeft } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Tính tổng tiền tất cả các đơn hàng trong giỏ hàng
    const calculateTotal = () => {
        let total = 0;
        cartItems.forEach(item => {
            item.ChiTietDonHangs.forEach(detail => {
                total += detail.donGia;
            });
        });
        return total;
    };

    // Tính thuế 10%
    const calculateTax = () => {
        return calculateTotal() * 0.1;
    };

    // Tính tổng cộng bao gồm thuế
    const calculateFinalTotal = () => {
        return calculateTotal() + calculateTax();
    };

    // Xóa đơn hàng khỏi giỏ hàng
    const removeItem = async (id) => {
        try {
            const res = await Api.delete(`/client/don-hang/xoa-gio-hang/${id}`);
            if (res.data.status) {
                toast.success(res.data.message);
                getCartItems(); // Tải lại giỏ hàng
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            toast.error("Lỗi khi xóa đơn hàng khỏi giỏ hàng");
        }
    };

    // Format tiền tệ thành VND
    const formatCurrency = (amount) => {
        if (!amount) return "0 VNĐ";
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            maximumFractionDigits: 0
        }).format(amount);
    };

    // Format ngày
    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    };

    // Xử lý khi nhấn nút thanh toán
    const handleProceedToCheckout = async () => {
        if (cartItems.length === 0) {
            toast.error("Giỏ hàng của bạn đang trống");
            return;
        }
        // navigate('/payment');
        const res = await Api.post('/client/don-hang/thanh-toan', {
            listDonHang: cartItems.map(item => item.id)
        });
        if (res.data.status) {
            toast.success(res.data.message);
            navigate('/donhang', { state: { listDonHang: res.data.data } });
        } else {
            toast.error(res.data.message);
        }
    };

    const getCartItems = async () => {
        try {
            setLoading(true);
            const res = await Api.get('/client/don-hang/lay-gio-hang');
            setCartItems(res.data.data || []);
        } catch (error) {
            console.error(error);
            toast.error("Lỗi khi lấy giỏ hàng");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getCartItems();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-700"></div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 py-12 min-h-screen">
            <div className="container mx-auto px-4">
                <div className="flex items-center mb-8">
                    <Link to="/cars" className="flex items-center text-red-700 hover:text-red-800">
                        <FaArrowLeft className="mr-2" />
                        <span>Tiếp tục thuê xe</span>
                    </Link>
                    <h1 className="text-3xl font-semibold font-serif mx-auto pr-16">Giỏ Hàng</h1>
                </div>

                {cartItems.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold mb-4">Giỏ hàng của bạn đang trống</h2>
                        <p className="text-gray-600 mb-8">Hãy thêm xe vào giỏ hàng để tiến hành thuê xe</p>
                        <Link
                            to="/cars"
                            className="px-6 py-3 bg-red-700 text-white rounded-lg hover:bg-red-800 transition-colors duration-200"
                        >
                            Xem danh sách xe
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            {cartItems.map((order) => (
                                order.ChiTietDonHangs.map((item) => (
                                    <div key={item.id} className="bg-white rounded-lg shadow-md mb-6 overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow">
                                        <div className="relative">
                                            {/* Hình ảnh xe */}
                                            <div className="flex flex-col md:flex-row">
                                                <div className="md:w-2/5 relative">
                                                    <div className="absolute top-0 left-0 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-br z-10">
                                                        Sẵn Sàng
                                                    </div>
                                                    <img
                                                        src={item.Xe.hinhAnh}
                                                        alt={item.Xe.tenXe}
                                                        className="w-full h-60 object-cover"
                                                    />
                                                </div>

                                                {/* Thông tin xe */}
                                                <div className="md:w-3/5 p-5">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div>
                                                            <h2 className="text-2xl font-bold text-gray-800 mb-1">{item.Xe.tenXe}</h2>
                                                            <div className="flex items-center text-gray-600">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-600 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                </svg>
                                                                <span className="text-sm">Biển số: {item.Xe.bienSoXe || "Chưa cập nhật"}</span>
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => removeItem(order.id)}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                                            title="Xóa khỏi giỏ hàng"
                                                        >
                                                            <FaTrash />
                                                        </button>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                                        <div className="flex items-center bg-gray-50 rounded-md p-2">
                                                            <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center mr-2">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                                                                </svg>
                                                            </div>
                                                            <div>
                                                                <span className="text-xs text-gray-500">Loại xe</span>
                                                                <p className="text-sm font-medium">{item.Xe.LoaiXe?.tenLoaiXe || "Không xác định"}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center bg-gray-50 rounded-md p-2">
                                                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mr-2">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                </svg>
                                                            </div>
                                                            <div>
                                                                <span className="text-xs text-gray-500">Thời gian thuê</span>
                                                                <p className="text-sm font-medium">
                                                                    {item.soNgayThue} ngày
                                                                    {item.soGioThue > 0 && ` ${item.soGioThue} giờ`}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Thời gian thuê và giá */}
                                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-t border-gray-100 pt-4">
                                                        <div className="mb-3 sm:mb-0">
                                                            <div className="flex items-center text-gray-600 mb-1">
                                                                <FaCalendarAlt className="mr-2 text-red-600" />
                                                                <span className="text-sm">{formatDate(order.thoiGianBatDau)} - {formatDate(order.thoiGianKetThuc)}</span>
                                                            </div>
                                                            <div className="text-2xl font-bold text-red-600">
                                                                {formatCurrency(item.donGia)}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {formatCurrency(item.donGia / item.soNgayThue)}/ngày
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ))}
                        </div>

                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                                <h2 className="text-xl font-semibold mb-4 pb-4 border-b">Tóm Tắt Đơn Hàng</h2>

                                <div className="space-y-3 mb-4">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Tạm tính</span>
                                        <span className="font-semibold">{formatCurrency(calculateTotal())}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Thuế (10%)</span>
                                        <span>{formatCurrency(calculateTax())}</span>
                                    </div>
                                </div>

                                <div className="flex justify-between py-4 border-t border-b mb-6">
                                    <span className="text-lg font-semibold">Tổng cộng</span>
                                    <span className="text-xl font-bold text-red-700">{formatCurrency(calculateFinalTotal())}</span>
                                </div>

                                <button
                                    onClick={handleProceedToCheckout}
                                    className="w-full py-3 bg-red-700 text-white rounded-lg hover:bg-red-800 transition-colors mb-3"
                                >
                                    Tiến hành thanh toán
                                </button>

                                <Link
                                    to="/cars"
                                    className="w-full py-3 border border-red-700 text-red-700 rounded-lg hover:bg-red-50 transition-colors text-center block"
                                >
                                    Tiếp tục thuê xe
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
