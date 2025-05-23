import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PaymentPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const order = location.state?.order;
    const thongTin  = {
        chuTaiKhoan : "NGUYEN VAN A",
        soTaiKhoan : "113366668888",
        nganHang : "MB Bank",
    }

    if (!order) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <h2 className="text-xl font-bold text-red-600 mb-4">Không tìm thấy thông tin đơn hàng!</h2>
                <button
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    onClick={() => navigate(-1)}
                >
                    Quay lại
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] bg-gray-50 py-8">
            <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
                <div className="flex items-center justify-center mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Xác nhận thanh toán</h2>
                <p className="text-center text-gray-500 mb-6">Vui lòng kiểm tra lại thông tin trước khi thanh toán</p>
                <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                        <span className="text-gray-600">Mã đơn hàng:</span>
                        <span className="font-semibold">{order.maDonHang || order.id}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Xe:</span>
                        <span className="font-semibold">{order.ChiTietDonHangs?.[0]?.Xe?.tenXe || '---'}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Số tiền:</span>
                        <span className="font-semibold text-blue-600 text-lg">{order.thanhTien?.toLocaleString('vi-VN')} đ</span>
                    </div>
                </div>
                {/* QR chuyển khoản MB Bank */}
                <div className="mt-8 text-center mb-5">
                    <h3 className="text-lg font-semibold mb-2 text-gray-800">Chuyển khoản qua VietQR (MB Bank)</h3>
                    <img
                        src={`https://img.vietqr.io/image/mb-${thongTin.soTaiKhoan}-qr_only.png?amount=${order.thanhTien || 0}&addInfo=${encodeURIComponent(order.maDonHang || order.id)}&accountName=${encodeURIComponent(thongTin.chuTaiKhoan)}`}
                        alt="QR chuyển khoản MB Bank"
                        className="mx-auto rounded-lg border shadow mb-2"
                        style={{ maxWidth: 220 }}
                    />
                    <div className="text-sm text-gray-600 mb-1">STK: <b>113366668888</b> (MB Bank)</div>
                    <div className="text-sm text-gray-600 mb-1">Tên tài khoản: <b>NGUYEN VAN A</b></div>
                    <div className="text-sm text-gray-600">Nội dung chuyển khoản: <b>{order.maDonHang || order.id}</b></div>
                </div>

                <button
                    className="w-full py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition mb-3 text-lg shadow"
                    onClick={() => {
                        alert('Thanh toán thành công! (Demo)');
                        navigate('/donhang');
                    }}
                >
                    Đã Chuyển Khoản
                </button>
                <button
                    className="w-full py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-base"
                    onClick={() => navigate(-1)}
                >
                    Quay lại
                </button>
            </div>
        </div>
    );
};

export default PaymentPage;
