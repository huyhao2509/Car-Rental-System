import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, Eye, CheckCircle, XCircle, Calendar, Clock, AlertCircle } from 'lucide-react';
import Api from '@/utils/Api';
import { toast } from 'react-toastify';

const DashboardBookings = () => {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [timeFilter, setTimeFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setIsLoading(true);
            const response = await Api.get('admin/don-hang/lay-don-hang-all-admin');
            setOrders(response.data.data || []);
        } catch (error) {
            console.error('Lỗi khi tải danh sách đơn hàng:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const changeOrderStatus = async (orderId, newStatus) => {
        try {
            setIsLoading(true);
            const res = await Api.post('admin/don-hang/cap-nhat-trang-thai', {
                id: orderId,
                trangThai: newStatus
            });
            setOrders(orders.map(order =>
                order.id === orderId
                    ? { ...order, trangThai: newStatus }
                    : order
            ));

            toast.success(res.data.message);
        } catch (error) {
            console.error('Lỗi khi cập nhật trạng thái đơn hàng:', error);
            toast.error('Có lỗi xảy ra khi cập nhật trạng thái đơn hàng. Vui lòng thử lại sau.');
        } finally {
            setIsLoading(false);
        }
    };

    // Xác nhận thanh toán đơn hàng
    const confirmPayment = async (orderId) => {
        try {
            setIsLoading(true);
            const response = await Api.post(`admin/don-hang/xac-nhan-thanh-toan/${orderId}`);
            
            if (response.data.status) {
                setOrders(orders.map(order => 
                    order.id === orderId 
                        ? { ...order, trangThai: 2 } 
                        : order
                ));
                
                toast.success(response.data.message);
            } else {
                throw new Error(response.data.message || 'Có lỗi xảy ra');
            }
        } catch (error) {
            console.error('Lỗi khi xác nhận thanh toán đơn hàng:', error);
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi xác nhận thanh toán. Vui lòng thử lại sau.');
        } finally {
            setIsLoading(false);
        }
    };

    // Format tiền tệ VND
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            maximumFractionDigits: 0
        }).format(amount);
    };

    // Render trạng thái đơn hàng
    const renderStatus = (status, orderId) => {
        let statusClass = '';
        let statusText = '';
        let isClickable = false;

        switch (status) {
            case 1:
                statusClass = 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200 cursor-pointer';
                statusText = 'Chưa thanh toán';
                isClickable = true;
                break;
            case 2:
                statusClass = 'bg-blue-100 text-blue-700';
                statusText = 'Đã xác nhận';
                break;
            case 3:
                statusClass = 'bg-red-100 text-red-700';
                statusText = 'Đã hủy';
                break;
            case 4:
                statusClass = 'bg-green-100 text-green-700';
                statusText = 'Hoàn thành';
                break;
            default:
                statusClass = 'bg-gray-100 text-gray-700';
                statusText = 'Không xác định';
        }

        return (
            <span 
                className={`px-2 py-1 rounded-full text-xs font-medium ${statusClass} transition-colors duration-200 whitespace-nowrap`}
                onClick={isClickable ? () => confirmPayment(orderId) : undefined}
                title={isClickable ? "Bấm để xác nhận thanh toán" : ""}
            >
                {statusText}
            </span>
        );
    };

    // Lọc đơn hàng
    const filteredOrders = orders.filter(order => {
        // Lọc theo trạng thái
        if (filterStatus !== 'all' && order.trangThai !== parseInt(filterStatus)) {
            return false;
        }
        
        // Lọc theo từ khóa tìm kiếm (mã đơn hoặc tên khách hàng)
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            const orderIdMatch = order.maDonHang && order.maDonHang.toLowerCase().includes(searchLower);
            const customerNameMatch = order.NguoiDung && order.NguoiDung.hoTen && order.NguoiDung.hoTen.toLowerCase().includes(searchLower);
            
            if (!orderIdMatch && !customerNameMatch) {
                return false;
            }
        }
        
        // Lọc theo thời gian
        if (timeFilter !== 'all') {
            const now = new Date();
            const orderDate = new Date(order.createdAt || order.ngayTao || order.thoiGianBatDau);
            
            if (timeFilter === 'this-month') {
                if (orderDate.getMonth() !== now.getMonth() || orderDate.getFullYear() !== now.getFullYear()) {
                    return false;
                }
            } else if (timeFilter === 'last-month') {
                const lastMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
                const lastMonthYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
                
                if (orderDate.getMonth() !== lastMonth || orderDate.getFullYear() !== lastMonthYear) {
                    return false;
                }
            } else if (timeFilter === 'this-quarter') {
                const currentQuarter = Math.floor(now.getMonth() / 3);
                const orderQuarter = Math.floor(orderDate.getMonth() / 3);
                
                if (orderQuarter !== currentQuarter || orderDate.getFullYear() !== now.getFullYear()) {
                    return false;
                }
            }
        }
        
        return true;
    });

    // Phân trang
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

    // Chuyển trang
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Xem chi tiết đơn hàng
    const viewOrderDetail = (orderId) => {
        // Xử lý logic xem chi tiết đơn hàng
        console.log('Xem chi tiết đơn hàng:', orderId);
    };

    return (
        <div className="space-y-6 p-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Quản lý đơn đặt thuê</h1>
                <button
                    className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg font-medium border border-blue-100 flex items-center hover:bg-blue-100 transition duration-300"
                    onClick={() => console.log('Xuất báo cáo')}
                >
                    <Download className="w-4 h-4 mr-1" />
                    Xuất báo cáo
                </button>
            </div>

            {/* Filter và tìm kiếm */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                    <div className="flex-1 relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Search className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-4 py-2.5"
                            placeholder="Tìm kiếm theo mã đơn, tên khách hàng..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="relative min-w-[200px]">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Filter className="w-5 h-5 text-gray-400" />
                        </div>
                        <select
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-4 py-2.5"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="all">Tất cả trạng thái</option>
                            <option value="1">Chưa thanh toán</option>
                            <option value="2">Đã xác nhận</option>
                            <option value="4">Hoàn thành</option>
                            <option value="3">Đã hủy</option>
                        </select>
                    </div>

                    <div className="relative min-w-[200px]">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Calendar className="w-5 h-5 text-gray-400" />
                        </div>
                        <select
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-4 py-2.5"
                            value={timeFilter}
                            onChange={(e) => setTimeFilter(e.target.value)}
                        >
                            <option value="all">Toàn bộ thời gian</option>
                            <option value="this-month">Tháng này</option>
                            <option value="last-month">Tháng trước</option>
                            <option value="this-quarter">Quý này</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Bảng đơn hàng */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center p-10">
                        <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-600">Đang tải dữ liệu...</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50 text-left text-gray-500 text-xs uppercase">
                                        <th className="py-4 px-4 font-medium">Mã đơn</th>
                                        <th className="py-4 px-4 font-medium">Khách hàng</th>
                                        <th className="py-4 px-4 font-medium">Xe</th>
                                        <th className="py-4 px-4 font-medium">Ngày thuê</th>
                                        <th className="py-4 px-4 font-medium text-center w-32">Trạng thái</th>
                                        <th className="py-4 px-4 font-medium">Tổng tiền</th>
                                        <th className="py-4 px-4 font-medium">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItems.length > 0 ? (
                                        currentItems.map((order) => (
                                            <tr key={order.id} className="border-t border-gray-100 hover:bg-gray-50">
                                                <td className="py-4 px-4 font-medium">{order.maDonHang}</td>
                                                <td className="py-4 px-4">{order.NguoiDung?.hoTen || 'Không có dữ liệu'}</td>
                                                <td className="py-4 px-4">{order.ChiTietDonHangs?.[0]?.Xe?.tenXe || 'Không có dữ liệu'}</td>
                                                <td className="py-4 px-4">
                                                    {new Date(order.thoiGianBatDau).toLocaleDateString('vi-VN')} - {new Date(order.thoiGianKetThuc).toLocaleDateString('vi-VN')}
                                                </td>
                                                <td className="py-3 px-4 text-sm text-center">{renderStatus(order.trangThai, order.id)}</td>
                                                <td className="py-4 px-4 font-medium">{formatCurrency(order.thanhTien)}</td>
                                                <td className="py-4 px-4 text-center">
                                                    <div className="flex space-x-2 text-center">
                                                        {order.trangThai === 1 && (
                                                            <>
                                                                <button
                                                                    className="p-1.5 text-green-600 hover:bg-green-50 rounded"
                                                                    title="Xác nhận đơn"
                                                                    onClick={() => changeOrderStatus(order.id, 2)}
                                                                >
                                                                    <CheckCircle className="w-4 h-4" />
                                                                </button>
                                                                <button
                                                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                                                                    title="Từ chối đơn"
                                                                    onClick={() => changeOrderStatus(order.id, 3)}
                                                                >
                                                                    <XCircle className="w-4 h-4" />
                                                                </button>
                                                            </>
                                                        )}

                                                        {order.trangThai === 2 && (
                                                            <button
                                                                className="p-1.5 text-green-600 hover:bg-green-50 rounded"
                                                                title="Hoàn thành đơn"
                                                                onClick={() => changeOrderStatus(order.id, 4)}
                                                            >
                                                                <CheckCircle className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="py-8 text-center text-gray-500">
                                                <div className="flex flex-col items-center justify-center">
                                                    <AlertCircle className="w-8 h-8 text-gray-300 mb-2" />
                                                    <p>Không tìm thấy đơn hàng nào phù hợp</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Phân trang */}
                        <div className="py-4 px-6 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="text-sm text-gray-500">
                                Hiển thị {currentItems.length > 0 ? indexOfFirstItem + 1 : 0}-{Math.min(indexOfLastItem, filteredOrders.length)} / {filteredOrders.length} đơn hàng
                            </div>

                            {totalPages > 1 && (
                                <div className="flex space-x-1">
                                    <button
                                        className={`px-3 py-1 border rounded text-sm ${currentPage === 1 ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed' : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'}`}
                                        onClick={() => currentPage > 1 && paginate(currentPage - 1)}
                                        disabled={currentPage === 1}
                                    >
                                        Trước
                                    </button>

                                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                        // Logic hiển thị phân trang
                                        let pageNumber = 0;
                                        if (totalPages <= 5) {
                                            // Nếu tổng số trang <= 5, hiển thị tất cả các trang
                                            pageNumber = i + 1;
                                        } else if (currentPage <= 3) {
                                            // Nếu trang hiện tại <= 3, hiển thị 5 trang đầu tiên
                                            pageNumber = i + 1;
                                        } else if (currentPage >= totalPages - 2) {
                                            // Nếu trang hiện tại gần cuối, hiển thị 5 trang cuối cùng
                                            pageNumber = totalPages - 4 + i;
                                        } else {
                                            // Nếu trang hiện tại ở giữa, hiển thị 2 trang trước và 2 trang sau
                                            pageNumber = currentPage - 2 + i;
                                        }

                                        return (
                                            <button
                                                key={pageNumber}
                                                className={`px-3 py-1 border text-sm ${pageNumber === currentPage ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50'}`}
                                                onClick={() => paginate(pageNumber)}
                                            >
                                                {pageNumber}
                                            </button>
                                        );
                                    })}

                                    <button
                                        className={`px-3 py-1 border rounded text-sm ${currentPage === totalPages ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed' : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'}`}
                                        onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                    >
                                        Sau
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default DashboardBookings;
