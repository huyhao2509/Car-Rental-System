import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Api from '@/utils/Api';

const MomoPayment = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const listDonHang = location.state?.listDonHang || [];
    
    const [paymentInfo, setPaymentInfo] = useState({
        amount: '0',
        description: 'Thanh toán dịch vụ thuê xe',
        name: '',
        phone: '',
        email: '',
    });
    const [isProcessing, setIsProcessing] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showQRCode, setShowQRCode] = useState(false);
    const [orderDetails, setOrderDetails] = useState({
        id: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
        date: new Date().toISOString().split('T')[0],
        items: [],
        total: 0,
    });

    useEffect(() => {
        if (!location.state || !location.state.listDonHang || location.state.listDonHang.length === 0) {
            navigate('/cart');
            return;
        }

        let totalAmount = 0;
        const items = [];

        // location.state.listDonHang.forEach(order => {
        //     order.ChiTietDonHangs.forEach(item => {
        //         totalAmount += item.donGia;
        //         items.push({
        //             id: item.id,
        //             name: `${item.Xe.tenXe} (${item.soNgayThue} ngày${item.soGioThue > 0 ? ` ${item.soGioThue} giờ` : ''})`,
        //             price: item.donGia,
        //             quantity: 1,
        //         });
        //     });
        // });

        // setOrderDetails({
        //     id: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
        //     date: new Date().toISOString().split('T')[0],
        //     items: items,
        //     total: totalAmount,
        // });

        getDataDonHang();

        setPaymentInfo(prev => ({
            ...prev,
            amount: totalAmount.toString(),
        }));
    }, [navigate, location]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPaymentInfo(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!paymentInfo.name || !paymentInfo.phone || !paymentInfo.email) {
            alert('Vui lòng điền đầy đủ thông tin');
            return;
        }

        setIsProcessing(true);

        setTimeout(() => {
            setIsProcessing(false);
            setShowQRCode(true);
        }, 1500);
    };

    const handlePaymentCompleted = async () => {
        setShowQRCode(false);
        setIsProcessing(true);

        try {
            const res = await Api.post('/client/don-hang/xac-nhan-thanh-toan', {
                listDonHang: listDonHang.map(order => order.id),
                thongTinThanhToan: {
                    name: paymentInfo.name,
                    phone: paymentInfo.phone,
                    email: paymentInfo.email,
                    amount: paymentInfo.amount,
                    description: paymentInfo.description
                }
            });

            if (res.data.status) {
                setIsProcessing(false);
                setShowSuccess(true);
            } else {
                alert('Xảy ra lỗi khi xác nhận thanh toán: ' + res.data.message);
                setIsProcessing(false);
            }
        } catch (error) {
            console.error('Lỗi khi xác nhận thanh toán:', error);
            alert('Có lỗi xảy ra khi xác nhận thanh toán. Vui lòng thử lại.');
            setIsProcessing(false);
        }
    };

    const handleGoBack = () => {
        navigate('/');
    };

    const handleCancelQR = () => {
        setShowQRCode(false);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const getDataDonHang = async () => {
        const res = await Api.post('/client/don-hang/lay-don-hang', {
            listDonHang: listDonHang.map(order => order.id),
        });
        setOrderDetails(res.data.data);
    }

    if (showSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
                <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Thanh toán thành công!</h2>
                    <p className="text-gray-600 mb-2">Mã đơn hàng: {orderDetails.id}</p>
                    <p className="text-gray-600 mb-6">Cảm ơn bạn đã thanh toán {formatCurrency(parseFloat(paymentInfo.amount))} qua MoMo.</p>
                    <button
                        onClick={handleGoBack}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
                    >
                        Quay về trang chủ
                    </button>
                </div>
            </div>
        );
    }

    if (showQRCode) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
                <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
                    <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-white font-bold text-2xl">M</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Quét mã để thanh toán</h2>
                    <p className="text-gray-600 mb-4">
                        Sử dụng ứng dụng MoMo để quét mã QR bên dưới
                    </p>

                    <div className="mx-auto w-64 h-64 bg-white p-4 border rounded-lg shadow-sm mb-6">
                        <div className="bg-pink-50 w-full h-full flex flex-col items-center justify-center relative">
                            <div className="grid grid-cols-10 grid-rows-10 gap-1 w-48 h-48 bg-white p-2">
                                {Array(100).fill(0).map((_, i) => (
                                    <div
                                        key={i}
                                        className={`${Math.random() > 0.7 ? 'bg-black' : 'bg-white'} 
                              ${i === 22 || i === 27 || i === 72 || i === 77 ? 'bg-black' : ''}
                              ${i >= 20 && i <= 29 && (i === 20 || i === 29 || i <= 22 || i >= 27) ? 'bg-black' : ''}
                              ${i >= 70 && i <= 79 && (i === 70 || i === 79 || i <= 72 || i >= 77) ? 'bg-black' : ''}
                    `}
                                    ></div>
                                ))}
                            </div>

                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold text-xs">MoMo</span>
                            </div>
                        </div>
                    </div>

                    <p className="text-gray-800 font-medium mb-2">
                        Số tiền: {formatCurrency(parseFloat(paymentInfo.amount))}
                    </p>
                    <p className="text-gray-600 text-sm mb-6">
                        Mã đơn hàng: {orderDetails.id}
                    </p>

                    <div className="flex space-x-4">
                        <button
                            onClick={handleCancelQR}
                            className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Hủy
                        </button>
                        <button
                            onClick={handlePaymentCompleted}
                            className="flex-1 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                        >
                            Đã thanh toán
                        </button>
                    </div>

                    <p className="text-gray-500 text-xs mt-4">
                        Vui lòng không đóng trang này cho đến khi hoàn tất thanh toán
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Thanh toán</h1>
                    <p className="text-gray-600">Hoàn tất việc đặt xe của bạn</p>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                    <div className="md:w-1/3">
                        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                            <h2 className="text-xl font-bold mb-4 pb-2 border-b">Thông tin đơn hàng</h2>
                            <div className="mb-4">
                                <p className="text-gray-500 text-sm">Mã đơn hàng</p>
                                <p className="font-medium">{orderDetails.id}</p>
                            </div>
                            <div className="mb-4">
                                <p className="text-gray-500 text-sm">Ngày đặt</p>
                                <p className="font-medium">{orderDetails.date}</p>
                            </div>

                            <h3 className="font-bold text-gray-700 mt-6 mb-3">Chi tiết</h3>
                            <div className="space-y-3 mb-4">
                                {orderDetails.items.map((item) => (
                                    <div key={item.id} className="flex justify-between">
                                        <div>
                                            <p className="font-medium">{item.name}</p>
                                            <p className="text-sm text-gray-500">x{item.quantity}</p>
                                        </div>
                                        <p className="font-medium">{formatCurrency(item.price)}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t pt-4 mt-4">
                                <div className="flex justify-between font-bold text-lg">
                                    <p>Tổng cộng</p>
                                    <p>{formatCurrency(orderDetails.total)}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h2 className="text-xl font-bold mb-4">Hỗ trợ</h2>
                            <p className="text-gray-600 mb-4">Nếu bạn có câu hỏi về đơn hàng hoặc thanh toán, vui lòng liên hệ với chúng tôi.</p>
                            <div className="flex items-center text-red-700">
                                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V5a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                <span>Trung tâm hỗ trợ</span>
                            </div>
                        </div>
                    </div>

                    <div className="md:w-2/3">
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                            <div className="bg-pink-500 py-4 px-6">
                                <h2 className="text-white text-xl font-bold">Thanh toán qua MoMo</h2>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6">
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="amount">
                                        Số tiền (VND)
                                    </label>
                                    <input
                                        type="text"
                                        id="amount"
                                        name="amount"
                                        value={paymentInfo.amount}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                                        required
                                        readOnly
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="description">
                                        Nội dung thanh toán
                                    </label>
                                    <input
                                        type="text"
                                        id="description"
                                        name="description"
                                        value={paymentInfo.description}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="name">
                                        Họ và tên
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={paymentInfo.name}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                                        required
                                        placeholder="Nhập họ và tên"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="phone">
                                        Số điện thoại
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={paymentInfo.phone}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                                        required
                                        placeholder="Nhập số điện thoại"
                                    />
                                </div>

                                <div className="mb-6">
                                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={paymentInfo.email}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                                        required
                                        placeholder="Nhập email"
                                    />
                                </div>

                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center">
                                        <input
                                            id="remember"
                                            type="checkbox"
                                            className="h-4 w-4 text-pink-500 focus:ring-pink-400 border-gray-300 rounded"
                                        />
                                        <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                                            Lưu thông tin cho lần sau
                                        </label>
                                    </div>
                                </div>

                                <div className="bg-gray-50 py-3 px-4 -mx-6 -mb-6 mt-4">
                                    <div className="mb-4">
                                        <div className="text-sm font-medium text-gray-700 mb-2">
                                            Phương thức thanh toán
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <div className="flex-1 border border-pink-500 rounded-md p-3 bg-pink-50 flex items-center">
                                                <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center mr-3">
                                                    <span className="text-white font-bold">M</span>
                                                </div>
                                                <div>
                                                    <div className="font-medium text-pink-600">MoMo</div>
                                                    <div className="text-xs text-gray-500">Ví điện tử MoMo</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-pink-500 hover:bg-pink-600 text-white font-medium py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 flex items-center justify-center"
                                        disabled={isProcessing}
                                    >
                                        {isProcessing ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Đang xử lý...
                                            </>
                                        ) : (
                                            'Tạo mã QR MoMo'
                                        )}
                                    </button>

                                    <div className="mt-4 text-xs text-gray-500 text-center">
                                        Bằng việc thanh toán, bạn đồng ý với các điều khoản dịch vụ của chúng tôi
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MomoPayment;
