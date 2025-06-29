import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';
import Api from "@/utils/Api";
import { toast } from "react-toastify";
import PaymentPage from './PaymentPage';

// Định nghĩa các trạng thái đơn hàng
const ORDER_STATUS = {
    DA_TAO_DON_HANG: 1,
    DA_THANH_TOAN: 2,
    DA_HUY_DON_HANG: 3,
    DA_HOAN_THANH: 4
};

const DonHang = () => {
    const navigate = useNavigate();
    const { currentUser, isAuthenticated } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [orders, setOrders] = useState([]);
    const [activeFilter, setActiveFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedOrders, setSelectedOrders] = useState([]);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [currentPaymentOrder, setCurrentPaymentOrder] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('banking');
    const [promoCode, setPromoCode] = useState('');
    const [appliedPromo, setAppliedPromo] = useState(null);
    const [promoError, setPromoError] = useState('');
    const [isCheckingPromo, setIsCheckingPromo] = useState(false);
    const [paymentWarning, setPaymentWarning] = useState('');

    const fetchOrders = async () => {
        try {
           const res = await Api.get("client/don-hang/lay-don-hang-all");
           setOrders(res.data.data);
          } catch (error) {
            setIsLoading(false);
          }
    };
    useEffect(() => {
        fetchOrders();
    }, []);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleFilterChange = (filter) => {
        setActiveFilter(filter);
    };

    const handleOrderDetail = (orderId) => {
        console.log("Xem chi tiết đơn hàng:", orderId);
        // Trong thực tế, chuyển hướng đến trang chi tiết đơn hàng
        // navigate(`/cars/${orderId}`);
        toast.info(`Chức năng xem chi tiết đơn hàng đang được phát triển`);
    };

    const handleCancelOrder = async (orderId) => {
        try {
            setIsLoading(true);
            const response = await Api.get(`client/don-hang/huy-don-hang/${orderId}`);
            if (response.data.status) {
                fetchOrders();
                toast.success(response.data.message);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error('Lỗi khi hủy đơn hàng:', error);
            toast.error('Có lỗi xảy ra khi hủy đơn hàng. Vui lòng thử lại sau.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectOrder = (orderId) => {
        console.log("Chọn đơn hàng:", orderId);
        setSelectedOrders(prev => {
            if (prev.includes(orderId)) {
                return prev.filter(id => id !== orderId);
            } else {
                return [...prev, orderId];
            }
        });
    };

    const handlePaySingleOrder = (order) => {
        setCurrentPaymentOrder(order);
        setShowPaymentModal(true);
    };

    const handlePaySelectedOrders = () => {
        if (selectedOrders.length === 0) {
            alert('Vui lòng chọn ít nhất một đơn hàng để thanh toán');
            return;
        }
        setShowPaymentModal(true);
    };

    const handleClosePaymentModal = () => {
        setShowPaymentModal(false);
        setCurrentPaymentOrder(null);
    };

    // Hàm tạo link thanh toán (gọi đúng API theo phương thức thanh toán)
    const createPaymentUrl = async (listDonHang) => {
        if (paymentMethod === 'vnpay' || paymentMethod === 'momo') {
            alert('Phương thức đang được phát triển. Vui lòng chọn phương thức khác.');
            return;
        }
        try {
            let apiUrl = 'client/don-hang/create-payment-url';
            const response = await Api.post(
                apiUrl,
                {
                    listDonHang: listDonHang,
                    maKhuyenMai: appliedPromo ? appliedPromo.maKhuyenMai : '',
                    phuongThucThanhToan: paymentMethod
                }
            );
            if (response.data.status) {
                window.location.href = response.data.data.paymentUrl;
            }
        } catch (error) {
            console.error('Lỗi khi tạo URL thanh toán:', error);
            alert('Có lỗi xảy ra khi tạo URL thanh toán. Vui lòng thử lại sau.');
        }
    };

    const handleApplyPromoCode = async () => {
        if (!promoCode.trim()) {
            setPromoError('Vui lòng nhập mã khuyến mãi');
            return;
        }

        try {
            setIsCheckingPromo(true);
            setPromoError('');

            const response = await Api.post('client/don-hang/get-ma-khuyen-mai', {
                maKhuyenMai: promoCode.trim()
            });

            if (response.data.status) {
                setAppliedPromo(response.data.data);
            } else {
                setPromoError(response.data.message || 'Mã khuyến mãi không hợp lệ');
                setAppliedPromo(null);
            }
        } catch (error) {
            console.error('Lỗi khi kiểm tra mã khuyến mãi:', error);
            setPromoError(error.response?.data?.message || 'Có lỗi xảy ra khi kiểm tra mã khuyến mãi');
            setAppliedPromo(null);
        } finally {
            setIsCheckingPromo(false);
        }
    };

    const handleClearPromo = () => {
        setPromoCode('');
        setAppliedPromo(null);
        setPromoError('');
    };

    const handlePaymentMethodChange = (e) => {
        setPaymentMethod(e.target.value);
        if (e.target.value === 'vnpay' || e.target.value === 'momo') {
            setPaymentWarning('Phương thức đang được phát triển');
        } else {
            setPaymentWarning('');
        }
    };

    const handlePaymentConfirm = async () => {
        if (paymentMethod === 'banking') {
            // Chuyển sang trang thanh toán
            navigate('/don-hang/thanh-toan', { state: { order: currentPaymentOrder, appliedPromo: appliedPromo } });
            handleClosePaymentModal();
            return;
        }
        try {
            setIsLoading(true);
            let listDonHang = [];
            
            if (currentPaymentOrder) {
                // Nếu thanh toán một đơn hàng
                listDonHang = [currentPaymentOrder.id];
            } else {
                // Nếu thanh toán nhiều đơn hàng đã chọn
                listDonHang = selectedOrders;
            }

            await createPaymentUrl(listDonHang);
            handleClosePaymentModal();
        } catch (error) {
            console.error('Lỗi khi xử lý thanh toán:', error);
            alert('Có lỗi xảy ra khi xử lý thanh toán. Vui lòng thử lại sau.');
        } finally {
            setIsLoading(false);
        }
    };

    // Lọc đơn hàng theo trạng thái và tìm kiếm
    const filteredOrders = orders && orders.length > 0 ? orders.filter(order => {
        // Lọc theo trạng thái
        if (activeFilter !== "all") {
            const statusCode = parseInt(activeFilter);
            if (order.trangThai !== statusCode) {
                return false;
            }
        }

        // Lọc theo từ khóa tìm kiếm
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            return (order.maDonHang && order.maDonHang.toLowerCase().includes(searchLower)) ||
                (order.ChiTietDonHangs && order.ChiTietDonHangs[0]?.Xe?.tenXe.toLowerCase().includes(searchLower));
        }

        return true;
    }) : [];

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            maximumFractionDigits: 0
        }).format(amount);
    };

    // Hàm tính tổng tiền sau khi áp dụng khuyến mãi (chỉ tính cho đơn hàng trạng thái 1)
    const calculateFinalAmount = () => {
        const totalAmount = currentPaymentOrder
            ? currentPaymentOrder.thanhTien
            : orders
                .filter(order => selectedOrders.includes(order.id) && order.trangThai === 1)
                .reduce((sum, order) => sum + order.thanhTien, 0);
        if (!appliedPromo) return totalAmount;
        if (appliedPromo.phanTramGiam > 0) {
            const discountAmount = totalAmount * appliedPromo.phanTramGiam / 100;
            return totalAmount - discountAmount;
        } else if (appliedPromo.soTien > 0) {
            return totalAmount - appliedPromo.soTien;
        }
        return totalAmount;
    };

    // Render trạng thái đơn hàng
    const renderStatus = (status) => {
        switch (status) {
            case ORDER_STATUS.DA_TAO_DON_HANG:
                return (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 whitespace-nowrap">
                        Chưa thanh toán
                    </span>
                );
            case ORDER_STATUS.DA_THANH_TOAN:
                return (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 whitespace-nowrap">
                        Đã thanh toán
                    </span>
                );
            case ORDER_STATUS.DA_HUY_DON_HANG:
                return (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 whitespace-nowrap">
                        Đã hủy
                    </span>
                );
            case ORDER_STATUS.DA_HOAN_THANH:
                return (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 whitespace-nowrap">
                        Hoàn thành
                    </span>
                );
            default:
                return (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 whitespace-nowrap">
                        Không xác định
                    </span>
                );
        }
    };

    // Hiển thị trạng thái loading
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4">
                <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mb-4"></div>
                <p className="text-gray-600">Đang tải thông tin đơn hàng...</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-6">
            <div className="flex justify-between items-center pb-4 mb-6 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-gray-800">Đơn Hàng Của Tôi</h1>
                <button
                    className={`px-4 py-2 rounded-md ${selectedOrders.length > 0 ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-300 cursor-not-allowed'} text-white`}
                    onClick={handlePaySelectedOrders}
                    disabled={selectedOrders.length === 0}
                >
                    Thanh Toán Các đơn đã chọn ({selectedOrders.length})
                </button>
            </div>

            <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="mb-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div className="flex space-x-2 mb-3 md:mb-0">
                                <button
                                    className={`px-3 py-1 rounded-md ${activeFilter === "all"
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                        }`}
                                    onClick={() => handleFilterChange("all")}
                                >
                                    Tất cả
                                </button>
                                <button
                                    className={`px-3 py-1 rounded-md ${activeFilter === ORDER_STATUS.DA_TAO_DON_HANG.toString()
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                        }`}
                                    onClick={() => handleFilterChange(ORDER_STATUS.DA_TAO_DON_HANG.toString())}
                                >
                                    Chưa thanh toán
                                </button>
                                <button
                                    className={`px-3 py-1 rounded-md ${activeFilter === ORDER_STATUS.DA_HOAN_THANH.toString()
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                        }`}
                                    onClick={() => handleFilterChange(ORDER_STATUS.DA_HOAN_THANH.toString())}
                                >
                                    Hoàn thành
                                </button>
                                <button
                                    className={`px-3 py-1 rounded-md ${activeFilter === ORDER_STATUS.DA_HUY_DON_HANG.toString()
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                        }`}
                                    onClick={() => handleFilterChange(ORDER_STATUS.DA_HUY_DON_HANG.toString())}
                                >
                                    Đã hủy
                                </button>
                            </div>
                            <div className="mt-3 md:mt-0">
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm theo ID hoặc tên xe"
                                    value={searchTerm}
                                    onChange={handleSearch}
                                    className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    {filteredOrders.length > 0 ? (
                        <div className="space-y-4">
                            {filteredOrders.map((order) => (
                                <div
                                    key={order.id}
                                    className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow relative"
                                >
                                    <div className="absolute top-4 left-4">
                                        <input
                                            type="checkbox"
                                            checked={selectedOrders.includes(order.id)}
                                            onChange={() => handleSelectOrder(order.id)}
                                            className="w-5 h-5 accent-blue-500 cursor-pointer"
                                        />
                                    </div>
                                    <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <div className="md:col-span-1">
                                            <div className="ml-8 md:ml-0">
                                                <img
                                                    src={order?.ChiTietDonHangs[0]?.Xe?.hinhAnh}
                                                    alt={order?.ChiTietDonHangs?.Xe?.tenXe}
                                                    className="w-full h-40 object-cover rounded-md"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = "";
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="md:col-span-3">
                                            <div className="flex flex-col md:flex-row md:justify-between">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-800">{order?.ChiTietDonHangs[0]?.Xe?.tenXe}</h3>
                                                    <p className="text-sm text-gray-500">Mã đơn hàng: {order.maDonHang}</p>
                                                </div>
                                                <div>
                                                    <td className="py-3 px-4 text-sm text-center">{renderStatus(order.trangThai)}</td>
                                                </div>
                                            </div>

                                            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                                                <div>
                                                    <p className="text-sm text-gray-600">
                                                        <span className="font-medium">Ngày thuê:</span> {new Date(order.thoiGianBatDau).toLocaleDateString('vi-VN')}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        <span className="font-medium">Ngày trả:</span> {new Date(order.thoiGianKetThuc).toLocaleDateString('vi-VN')}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-800">
                                                        <span className="font-medium">Tổng chi phí:</span> {formatCurrency(order.thanhTien)}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="mt-4 flex flex-wrap gap-2">
                                                <button
                                                    className="px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                                                    onClick={() => handleOrderDetail(order.id)}
                                                >
                                                    Xem chi tiết
                                                </button>
                                                {order.trangThai === ORDER_STATUS.DA_TAO_DON_HANG && (
                                                    <button
                                                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                                                        onClick={() => handlePaySingleOrder(order)}
                                                    >
                                                        Thanh toán
                                                    </button>
                                                )}
                                                {order.trangThai === ORDER_STATUS.DA_TAO_DON_HANG && (
                                                    <button
                                                        className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
                                                        onClick={() => handleCancelOrder(order.id)}
                                                    >
                                                        Hủy đơn hàng
                                                    </button>
                                                )}
                                                {order.trangThai === ORDER_STATUS.DA_HOAN_THANH && (
                                                    <button
                                                        className="px-4 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200"
                                                    >
                                                        Đánh giá
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <p className="mt-2 text-gray-500 italic">Không tìm thấy đơn hàng nào {searchTerm ? "phù hợp với từ khóa tìm kiếm" : ""}</p>
                            <button
                                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                onClick={() => navigate('/cars')}
                            >
                                Tìm xe ngay
                            </button>
                        </div>
                    )}

                    {filteredOrders.length > 0 && (
                        <div className="mt-6">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-500">
                                    Hiển thị 1-{filteredOrders.length} của {filteredOrders.length} đơn hàng
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50" disabled>
                                        Trước
                                    </button>
                                    <button className="px-3 py-1 bg-blue-500 text-white rounded-md">
                                        1
                                    </button>
                                    <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50" disabled>
                                        Sau
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Thống kê đơn hàng</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="p-4 bg-blue-50 rounded-lg">
                            <p className="text-sm font-medium text-gray-500">Tổng số đơn</p>
                            <p className="text-2xl font-bold text-blue-600">{orders && orders.length > 0 ? orders.length : 0}</p>
                        </div>
                        <div className="p-4 bg-green-50 rounded-lg">
                            <p className="text-sm font-medium text-gray-500">Hoàn thành</p>
                            <p className="text-2xl font-bold text-green-600">
                                {orders && orders.length > 0 ? orders.filter(order => order.trangThai === ORDER_STATUS.DA_HOAN_THANH).length : 0}
                            </p>
                        </div>
                        <div className="p-4 bg-yellow-50 rounded-lg">
                            <p className="text-sm font-medium text-gray-500">Chưa thanh toán</p>
                            <p className="text-2xl font-bold text-yellow-600">
                                {orders && orders.length > 0 ? orders.filter(order => order.trangThai != ORDER_STATUS.DA_HOAN_THANH && order.trangThai != ORDER_STATUS.DA_THANH_TOAN && order.trangThai != ORDER_STATUS.DA_HUY_DON_HANG).length : 0}
                            </p>
                        </div>
                        <div className="p-4 bg-red-50 rounded-lg">
                            <p className="text-sm font-medium text-gray-500">Đã hủy</p>
                            <p className="text-2xl font-bold text-red-600">
                                {orders && orders.length > 0 ? orders.filter(order => order.trangThai === ORDER_STATUS.DA_HUY_DON_HANG).length : 0}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Thanh toán */}
            {showPaymentModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-800">
                                Thanh toán {currentPaymentOrder ? 'đơn hàng' : 'các đơn hàng đã chọn'}
                            </h2>
                            <button
                                onClick={handleClosePaymentModal}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="mb-4">
                            {currentPaymentOrder ? (
                                <div>
                                    <p className="text-gray-600 mb-2">Mã đơn hàng: {currentPaymentOrder.maDonHang}</p>
                                    <p className="text-gray-600 mb-2">Xe: {currentPaymentOrder?.ChiTietDonHangs[0]?.Xe?.tenXe}</p>
                                    <p className="text-gray-600 mb-4">Số tiền: {formatCurrency(currentPaymentOrder.thanhTien)}</p>
                                </div>
                            ) : (
                                <div>
                                    <p className="text-gray-600 mb-2">Các đơn hàng đã chọn: {selectedOrders.length}</p>
                                    <p className="text-gray-600 mb-4">
                                        Tổng số tiền: {formatCurrency(
                                            orders
                                                .filter(order => selectedOrders.includes(order.id) && order.trangThai === 1)
                                                .reduce((sum, order) => sum + order.thanhTien, 0)
                                        )}
                                    </p>
                                </div>
                            )}

                            <div className="space-y-3">
                                <p className="font-medium text-gray-700">Chọn phương thức thanh toán:</p>
                                <div>
                                    <label>
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="banking"
                                            checked={paymentMethod === 'banking'}
                                            onChange={handlePaymentMethodChange}
                                        />
                                        Internet Banking
                                    </label>
                                    <label style={{ marginLeft: 16 }}>
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="vnpay"
                                            checked={paymentMethod === 'vnpay'}
                                            onChange={handlePaymentMethodChange}
                                        />
                                        VNPay
                                    </label>
                                    <label style={{ marginLeft: 16 }}>
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="momo"
                                            checked={paymentMethod === 'momo'}
                                            onChange={handlePaymentMethodChange}
                                        />
                                        Momo
                                    </label>
                                    {paymentWarning && (
                                        <div style={{ color: 'red', marginTop: 8 }}>{paymentWarning}</div>
                                    )}
                                </div>
                            </div>

                            {/* Mã khuyến mãi */}
                            <div className="mt-4 border-t pt-4">
                                <p className="font-medium text-gray-700 mb-2">Mã khuyến mãi:</p>
                                
                                {appliedPromo ? (
                                    <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-3">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="text-green-700 font-medium">{appliedPromo.maKhuyenMai}</p>
                                                <p className="text-sm text-green-600">
                                                    {appliedPromo.phanTramGiam > 0 
                                                        ? `Giảm ${appliedPromo.phanTramGiam}%` 
                                                        : `Giảm ${formatCurrency(appliedPromo.soTien)}`}
                                                </p>
                                            </div>
                                            <button 
                                                onClick={handleClearPromo} 
                                                className="text-gray-500 hover:text-gray-700"
                                                title="Hủy áp dụng"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-end space-x-2">
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                placeholder="Nhập mã khuyến mãi"
                                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${promoError ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                                                value={promoCode}
                                                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                                                disabled={isCheckingPromo}
                                            />
                                            {promoError && <p className="text-red-500 text-xs mt-1">{promoError}</p>}
                                        </div>
                                        <button
                                            className={`px-4 py-2 text-white rounded-md ${isCheckingPromo ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
                                            onClick={handleApplyPromoCode}
                                            disabled={isCheckingPromo}
                                        >
                                            {isCheckingPromo ? 'Đang kiểm tra...' : 'Áp dụng'}
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Tổng tiền thanh toán */}
                            <div className="mt-4 border-t pt-4">
                                <div className="flex justify-between items-center mb-2">
                                    <p className="text-gray-700">Tạm tính:</p>
                                    <p className="font-medium">
                                        {formatCurrency(
                                            currentPaymentOrder 
                                                ? currentPaymentOrder.thanhTien 
                                                : orders
                                                    .filter(order => selectedOrders.includes(order.id))
                                                    .reduce((sum, order) => sum + order.thanhTien, 0)
                                        )}
                                    </p>
                                </div>
                                
                                {appliedPromo && (
                                    <div className="flex justify-between items-center mb-2 text-green-600">
                                        <p>Giảm giá:</p>
                                        <p>- {appliedPromo.phanTramGiam > 0 
                                            ? formatCurrency((currentPaymentOrder 
                                                ? currentPaymentOrder.thanhTien 
                                                : orders
                                                    .filter(order => selectedOrders.includes(order.id))
                                                    .reduce((sum, order) => sum + order.thanhTien, 0)) * appliedPromo.phanTramGiam / 100)
                                            : formatCurrency(appliedPromo.soTien)
                                        }</p>
                                    </div>
                                )}
                                
                                <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-200">
                                    <p className="font-bold text-gray-800">Tổng thanh toán:</p>
                                    <p className="font-bold text-xl text-blue-600">
                                        {formatCurrency(
                                            calculateFinalAmount()
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                onClick={handleClosePaymentModal}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                                disabled={isLoading}
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handlePaymentConfirm}
                                className={`px-4 py-2 text-white rounded-md ${paymentMethod === 'vnpay' || paymentMethod === 'momo' || isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
                                disabled={paymentMethod === 'vnpay' || paymentMethod === 'momo' || isLoading}
                            >
                                {isLoading ? 'Đang xử lý...' : 'Xác nhận thanh toán'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DonHang;
