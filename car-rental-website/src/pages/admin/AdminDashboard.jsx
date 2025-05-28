import React, { useState, useEffect, useRef } from "react";
import {
    LayoutDashboard, Car, Users, FileText, CreditCard, Tag,
    Shield, AlertTriangle, BarChart2, Settings, LogOut, ChevronDown,
    Search, Filter, Download, Calendar, DollarSign, TrendingUp, CheckCircle,
    XCircle, Clock, Trash2, Edit, Eye, UserCheck, AlertCircle, Menu, X, Bell
} from "lucide-react";
import DashboardBookings from "./DashboardBookings";
import DashboardCars from "./DashboardCars";
import DashboardUsers from "./DashboardUsers";
import DashboardReports from "./DashboardReports";
import DashboardPromotions from "./DashboardPromotions";
import DashboardManageBrands from "./DashboardManageBrands";
import DashboardManageCarTypes from "./DashboardManageCarTypes";
import DashboardManageCars from "./DashboardManageCars";
import DashboardManageRoles from "./DashboardManageRoles";
import Api from '@/utils/Api';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {    // State để quản lý menu active
    const [activeMenu, setActiveMenu] = useState("dashboard");
    const [openSubmenu, setOpenSubmenu] = useState(null);
    // State cho thông báo
    const [notifications, setNotifications] = useState(3);
    // State cho sidebar mobile
    const [sidebarOpen, setSidebarOpen] = useState(false);
    // State cho phần trăm tăng trưởng doanh thu
    const [growthPercentage, setGrowthPercentage] = useState(0);
    // State cho dashboard với giá trị khởi tạo ban đầu
    const [stats, setStats] = useState({
        totalCars: 0,
        availableCars: 0,
        totalCustomers: 0,
        pendingOrders: 0,
        confirmedOrders: 0,
        completedOrders: 0,
        cancelledOrders: 0,
        totalRevenue: 0,
        monthlyRevenue: 0,
        lastMonthRevenue: 0,
        topRentedCars: [],
        monthlyRevenueData: [],
        recentOrders: []
    });
    const [showNotifications, setShowNotifications] = useState(false);
    const notificationRef = useRef(null);

    const navigate = useNavigate();

    // Fetch dashboard stats từ API
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await Api.get('client/don-hang/admin/dashboard-stats');
                if (res.data.status) {
                    // Lưu toàn bộ dữ liệu thống kê từ API
                    setStats({
                        totalCars: res.data.data.totalCars || 0,
                        availableCars: res.data.data.availableCars || 0,
                        totalCustomers: res.data.data.totalCustomers || 0,
                        pendingOrders: res.data.data.pendingOrders || 0,
                        confirmedOrders: res.data.data.confirmedOrders || 0,
                        completedOrders: res.data.data.completedOrders || 0,
                        cancelledOrders: res.data.data.cancelledOrders || 0,
                        totalRevenue: res.data.data.totalRevenue || 0,
                        monthlyRevenue: res.data.data.monthlyRevenue || 0,
                        lastMonthRevenue: res.data.data.lastMonthRevenue || 0,
                        monthlyRevenueData: res.data.data.monthlyRevenueData || [],
                        topRentedCars: res.data.data.topRentedCars || []
                    });
                    
                    // Tính phần trăm tăng trưởng doanh thu so với tháng trước
                    const monthlyRevenue = res.data.data.monthlyRevenue || 0;
                    const lastMonthRevenue = res.data.data.lastMonthRevenue || 0;
                    let growthPercentage = 0;
                    
                    if (lastMonthRevenue > 0) {
                        growthPercentage = ((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 100;
                    }
                    
                    setGrowthPercentage(growthPercentage.toFixed(1));
                    
                    // Nếu có dữ liệu đơn hàng gần đây, cập nhật vào state orders
                    if (res.data.data.recentOrders && res.data.data.recentOrders.length > 0) {
                        const formattedOrders = res.data.data.recentOrders.map(order => {                            // Lấy thông tin xe từ đơn hàng chi tiết đầu tiên (nếu có)
                            let carName = 'Không xác định';
                            if (order.ChiTietDonHangs && order.ChiTietDonHangs.length > 0 && order.ChiTietDonHangs[0].Xe) {
                                carName = order.ChiTietDonHangs[0].Xe.tenXe;
                            }
                            
                            return {
                                id: order.maDonHang || order.id,
                                customerName: order.NguoiDung?.hoTen || 'Không xác định',
                                carName: carName,
                                startDate: order.thoiGianBatDau,
                                endDate: order.thoiGianKetThuc,
                                status: mapOrderStatus(order.trangThai),
                                total: order.thanhTien
                            };
                        });
                        setOrders(formattedOrders);
                    }
                }
            } catch (err) {
                console.error('Lỗi khi lấy thông tin dashboard:', err);
            }
        };
        
        // Hàm chuyển đổi mã trạng thái đơn hàng sang chuỗi status
        const mapOrderStatus = (statusCode) => {
            switch (statusCode) {
                case 1: return 'pending';      // Chờ thanh toán
                case 2: return 'confirmed';    // Đã thanh toán
                case 3: return 'cancelled';    // Đã hủy
                case 4: return 'completed';    // Hoàn thành
                default: return 'unknown';
            }
        };
        
        fetchStats();
    }, []);

    const [orders, setOrders] = useState([
        {
            id: "ORD001",
            customerName: "Nguyễn Văn A",
            carName: "Toyota Camry 2.5Q",
            startDate: "2025-03-01",
            endDate: "2025-03-05",
            status: "pending",
            total: 6000000
        },
        {
            id: "ORD002",
            customerName: "Trần Thị B",
            carName: "Honda Civic RS",
            startDate: "2025-03-02",
            endDate: "2025-03-03",
            status: "confirmed",
            total: 2000000
        },
        {
            id: "ORD003",
            customerName: "Lê Văn C",
            carName: "Mazda CX-5 2.5L",
            startDate: "2025-03-04",
            endDate: "2025-03-07",
            status: "completed",
            total: 4400000
        },
        {
            id: "ORD004",
            customerName: "Phạm Thị D",
            carName: "VinFast VF8 Eco",
            startDate: "2025-03-01",
            endDate: "2025-03-08",
            status: "cancelled",
            total: 12000000
        },
        {
            id: "ORD005",
            customerName: "Hoàng Văn E",
            carName: "Hyundai Tucson 1.6 Turbo",
            startDate: "2025-03-03",
            endDate: "2025-03-06",
            status: "pending",
            total: 3300000
        }
    ]);

    // Hàm thay đổi trạng thái đơn hàng
    const changeOrderStatus = (orderId, newStatus) => {
        setOrders(orders.map(order =>
            order.id === orderId ? { ...order, status: newStatus } : order
        ));
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const renderStatus = (status) => {
        switch (status) {
            case 'pending':
                return (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 flex items-center">
                        <Clock className="w-3 h-3 mr-1" /> Chờ duyệt
                    </span>
                );
            case 'confirmed':
                return (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 flex items-center">
                        <CheckCircle className="w-3 h-3 mr-1" /> Đã xác nhận
                    </span>
                );
            case 'completed':
                return (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 flex items-center">
                        <CheckCircle className="w-3 h-3 mr-1" /> Hoàn thành
                    </span>
                );
            case 'cancelled':
                return (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 flex items-center">
                        <XCircle className="w-3 h-3 mr-1" /> Đã hủy
                    </span>
                );
            default:
                return status;
        }
    };

    // Thêm useEffect để xử lý click outside cho notification dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Format thời gian
    const formatTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);
        
        if (diffInSeconds < 60) return 'Vừa xong';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
        return `${Math.floor(diffInSeconds / 86400)} ngày trước`;
    };

    // Hàm render nội dung chính dựa vào menu active
    const renderContent = () => {
        switch (activeMenu) {
            case 'dashboard':
                return renderDashboard();
            case 'orders':
                return (
                    <DashboardBookings
                        orders={orders}
                        changeOrderStatus={changeOrderStatus}
                        formatCurrency={formatCurrency}
                        renderStatus={renderStatus}
                    />
                );
            case 'cars':
                return (
                    <DashboardManageCars
                        formatCurrency={formatCurrency}
                    />
                );
            case 'carBrands':
                return (
                    <DashboardManageBrands />
                );
            case 'carTypes':
                return (
                    <DashboardManageCarTypes />
                );
            case 'positions':
                return (
                    <DashboardManageRoles />
                );
            
            case 'customers':
                return (
                    <DashboardUsers
                        // customers={customers}
                        // setCustomers={setCustomers}
                    />
                );
            case 'reports':
                return (
                    <DashboardReports formatCurrency={formatCurrency} />
                );
            case 'promotions':
                return (
                    <DashboardPromotions formatCurrency={formatCurrency} />
                );
            default:
                return renderDashboard();
        }
    };

    // Render Dashboard chính
    const renderDashboard = () => {
        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-800">Tổng quan</h1>
                    <div className="flex space-x-2">
                        <div className="relative">
                            <select className="bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option>Tháng 3, 2025</option>
                                <option>Tháng 2, 2025</option>
                                <option>Tháng 1, 2025</option>
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                        </div>
                        <button className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg font-medium border border-blue-100 flex items-center hover:bg-blue-100 transition duration-300">
                            <Download className="w-4 h-4 mr-1" />
                            Xuất báo cáo
                        </button>
                    </div>
                </div>

                {/* Thống kê */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-gray-500 text-sm">Tổng doanh thu</p>
                                <h3 className="text-2xl font-bold mt-1">{formatCurrency(stats.totalRevenue)}</h3>
                            </div>
                            <div className="bg-green-100 p-3 rounded-lg">
                                <DollarSign className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex justify-between items-start">
                            <div>                                <p className="text-gray-500 text-sm">Doanh thu tháng này</p>
                                <h3 className="text-2xl font-bold mt-1">{formatCurrency(stats.monthlyRevenue)}</h3>
                                {growthPercentage > 0 ? (
                                    <p className="text-sm text-green-600 flex items-center mt-1">
                                        <TrendingUp className="w-4 h-4 mr-1" />
                                        +{growthPercentage}% so với tháng trước
                                    </p>
                                ) : growthPercentage < 0 ? (
                                    <p className="text-sm text-red-600 flex items-center mt-1">
                                        <TrendingUp className="w-4 h-4 mr-1 transform rotate-180" />
                                        {growthPercentage}% so với tháng trước
                                    </p>
                                ) : (
                                    <p className="text-sm text-gray-600 flex items-center mt-1">
                                        Không thay đổi so với tháng trước
                                    </p>
                                )}
                            </div>
                            <div className="bg-blue-100 p-3 rounded-lg">
                                <BarChart2 className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-gray-500 text-sm">Tổng số xe</p>
                                <h3 className="text-2xl font-bold mt-1">{stats.totalCars}</h3>
                                <p className="text-sm text-gray-600 mt-1">
                                    <span className="text-green-600 font-medium">{stats.availableCars}</span> xe có sẵn
                                </p>
                            </div>
                            <div className="bg-purple-100 p-3 rounded-lg">
                                <Car className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-gray-500 text-sm">Khách hàng</p>
                                <h3 className="text-2xl font-bold mt-1">{stats.totalCustomers}</h3>
                                <p className="text-sm text-gray-600 mt-1">
                                    +24 trong tháng này
                                </p>
                            </div>
                            <div className="bg-orange-100 p-3 rounded-lg">
                                <Users className="w-6 h-6 text-orange-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Đơn hàng gần đây */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-gray-800">Đơn thuê xe gần đây</h2>
                        <button
                            className="text-blue-600 text-sm font-medium hover:underline"
                            onClick={() => setActiveMenu('orders')}
                        >
                            Xem tất cả
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-gray-500 text-xs uppercase">
                                    <th className="pb-3 px-4">Mã đơn</th>
                                    <th className="pb-3 px-4">Khách hàng</th>
                                    <th className="pb-3 px-4">Xe</th>
                                    <th className="pb-3 px-4">Ngày thuê</th>
                                    <th className="pb-3 px-4">Trạng thái</th>
                                    <th className="pb-3 px-4">Tổng tiền</th>
                                    <th className="pb-3 px-4">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order, index) => (
                                    <tr key={order.id} className={`border-t border-gray-100 ${index % 2 === 0 ? 'bg-gray-50' : ''}`}>
                                        <td className="py-4 px-4 font-medium">{order.id}</td>
                                        <td className="py-4 px-4">{order.customerName}</td>
                                        <td className="py-4 px-4">{order.carName}</td>
                                        <td className="py-4 px-4">
                                            {new Date(order.startDate).toLocaleDateString('vi-VN')} - {new Date(order.endDate).toLocaleDateString('vi-VN')}
                                        </td>
                                        <td className="py-4 px-4">{renderStatus(order.status)}</td>
                                        <td className="py-4 px-4 font-medium">{formatCurrency(order.total)}</td>
                                        <td className="py-4 px-4">
                                            <div className="flex space-x-2">
                                                <button
                                                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                                    title="Xem chi tiết"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                {order.status === 'pending' && (
                                                    <>
                                                        <button
                                                            className="p-1 text-green-600 hover:bg-green-50 rounded"
                                                            title="Duyệt đơn"
                                                            onClick={() => changeOrderStatus(order.id, 'confirmed')}
                                                        >
                                                            <CheckCircle className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                                                            title="Từ chối"
                                                            onClick={() => changeOrderStatus(order.id, 'cancelled')}
                                                        >
                                                            <XCircle className="w-4 h-4" />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Số liệu bổ sung */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">Đơn thuê theo trạng thái</h2>
                        <div className="flex items-center space-x-8 mt-6">
                            <div className="flex flex-col items-center">
                                <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mb-2">
                                    <Clock className="w-8 h-8 text-yellow-600" />
                                </div>
                                <span className="text-sm text-gray-500">Chờ duyệt</span>
                                <span className="text-xl font-bold">{stats.pendingOrders || 0}</span>
                            </div>

                            <div className="flex flex-col items-center">
                                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-2">
                                    <CheckCircle className="w-8 h-8 text-blue-600" />
                                </div>
                                <span className="text-sm text-gray-500">Đã xác nhận</span>
                                <span className="text-xl font-bold">{stats.confirmedOrders || 0}</span>
                            </div>

                            <div className="flex flex-col items-center">
                                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-2">
                                    <CheckCircle className="w-8 h-8 text-green-600" />
                                </div>
                                <span className="text-sm text-gray-500">Hoàn thành</span>
                                <span className="text-xl font-bold">{stats.completedOrders || 0}</span>
                            </div>

                            <div className="flex flex-col items-center">
                                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mb-2">
                                    <XCircle className="w-8 h-8 text-red-600" />
                                </div>
                                <span className="text-sm text-gray-500">Đã hủy</span>
                                <span className="text-xl font-bold">{stats.cancelledOrders || 0}</span>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">Xe được thuê nhiều nhất</h2>
                        <div className="space-y-4 mt-4">
                            {stats.topRentedCars && stats.topRentedCars.length > 0 ? (
                                stats.topRentedCars.map((car, index) => (
                                    <div key={index} className="flex items-center">
                                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                                            <Car className="w-6 h-6 text-gray-500" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-center">
                                                <h4 className="font-medium">{car.name}</h4>
                                                <span className="text-sm text-gray-500">{car.rentCount} lượt thuê</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                                <div 
                                                    className="bg-blue-600 h-2 rounded-full" 
                                                    style={{ width: `${car.percentage}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-4 text-gray-500">Chưa có dữ liệu xe được thuê</div>
                            )}
                        </div>
                    </div>
                </div>
                
                {/* Biểu đồ doanh thu theo tháng */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Doanh thu theo tháng</h2>
                    
                    <div className="mt-4" style={{ height: '300px' }}>
                        {stats.monthlyRevenueData && stats.monthlyRevenueData.length > 0 ? (
                            <div className="flex items-end h-64 space-x-2">
                                {stats.monthlyRevenueData.map((item, index) => {
                                    // Tìm giá trị cao nhất để tính tỷ lệ
                                    const maxValue = Math.max(...stats.monthlyRevenueData.map(d => d.value));
                                    const heightPercent = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
                                    
                                    return (
                                        <div key={index} className="flex flex-col items-center flex-1">
                                            <div 
                                                className="w-full bg-blue-500 rounded-t-lg hover:bg-blue-600 transition-all duration-200"
                                                style={{ height: `${heightPercent}%` }}
                                            ></div>
                                            <div className="text-xs font-medium text-gray-500 mt-2">{item.month}</div>
                                            <div className="text-xs text-gray-500">{formatCurrency(item.value)}</div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-400">
                                Không có dữ liệu doanh thu theo tháng
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Tỷ lệ hoàn thành đơn hàng */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Tỷ lệ hoàn thành đơn hàng</h2>
                    
                    <div className="flex items-center justify-center mt-4">
                        <div className="relative w-64 h-64">
                            {/* Biểu đồ tròn hiển thị tỷ lệ hoàn thành */}
                            <svg viewBox="0 0 36 36" className="w-full h-full">
                                <path
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="#eee"
                                    strokeWidth="3"
                                />
                                {(() => {
                                    const total = (stats.pendingOrders || 0) + (stats.confirmedOrders || 0) + 
                                                 (stats.completedOrders || 0) + (stats.cancelledOrders || 0);
                                    const completedPercentage = total > 0 ? Math.round(((stats.completedOrders || 0) / total) * 100) : 0;
                                    
                                    // Tính toán SVG arc properties
                                    const radius = 15.9155;
                                    const circumference = 2 * Math.PI * radius;
                                    const strokeDasharray = circumference;
                                    const strokeDashoffset = circumference - (completedPercentage / 100) * circumference;
                                    
                                    return (
                                        <path
                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                            fill="none"
                                            stroke="#48bb78"
                                            strokeWidth="3"
                                            strokeDasharray={strokeDasharray}
                                            strokeDashoffset={strokeDashoffset}
                                            strokeLinecap="round"
                                        />
                                    );
                                })()}
                            </svg>
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                                <div className="text-3xl font-bold text-gray-800">
                                    {(() => {
                                        const total = (stats.pendingOrders || 0) + (stats.confirmedOrders || 0) + 
                                                     (stats.completedOrders || 0) + (stats.cancelledOrders || 0);
                                        return total > 0 ? Math.round(((stats.completedOrders || 0) / total) * 100) : 0;
                                    })()}%
                                </div>
                                <div className="text-sm text-gray-500">Hoàn thành</div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-8">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">
                                {(stats.completedOrders || 0) + (stats.confirmedOrders || 0)}
                            </div>
                            <div className="text-sm text-gray-500">Đơn hoàn thành & xác nhận</div>
                        </div>
                        
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="text-2xl font-bold text-red-600">
                                {(stats.pendingOrders || 0) + (stats.cancelledOrders || 0)}
                            </div>
                            <div className="text-sm text-gray-500">Đơn chờ duyệt & hủy</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const handleLogout = () => {
        // Xóa token khỏi localStorage
        localStorage.removeItem('token');
        // Chuyển hướng về trang đăng nhập
        window.location.href = '/login';
    };

    // Main render
    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out`}>
                <div className="flex flex-col h-full">
                    <div className="p-5 border-b border-gray-200">
                        <h1 className="text-xl font-bold text-blue-600">Car Rental Admin</h1>
                    </div>

                    <div className="flex-1 px-3 py-4 overflow-y-auto">
                        <nav className="space-y-1">
                            <button
                                className={`flex items-center w-full px-3 py-3 text-left rounded-lg ${activeMenu === 'dashboard' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
                                onClick={() => setActiveMenu('dashboard')}
                            >
                                <LayoutDashboard className={`w-5 h-5 mr-3 ${activeMenu === 'dashboard' ? 'text-blue-600' : 'text-gray-400'}`} />
                                <span className="font-medium">Tổng quan</span>
                            </button>

                            <button
                                className={`flex items-center w-full px-3 py-3 text-left rounded-lg ${activeMenu === 'orders' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
                                onClick={() => setActiveMenu('orders')}
                            >
                                <FileText className={`w-5 h-5 mr-3 ${activeMenu === 'orders' ? 'text-blue-600' : 'text-gray-400'}`} />
                                <span className="font-medium">Đơn đặt thuê</span>
                                <span className="ml-auto bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-0.5 rounded-full">{stats.pendingOrders}</span>
                            </button>

                            <button
                                className={`flex items-center w-full px-3 py-3 text-left rounded-lg ${activeMenu === 'cars' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
                                onClick={() => setActiveMenu('cars')}
                            >
                                <Car className={`w-5 h-5 mr-3 ${activeMenu === 'cars' ? 'text-blue-600' : 'text-gray-400'}`} />
                                <span className="font-medium">Quản lý xe</span>
                            </button>

                            <button
                                className={`flex items-center w-full px-3 py-3 text-left rounded-lg ${activeMenu === 'carBrands' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
                                onClick={() => setActiveMenu('carBrands')}
                            >
                                <Car className={`w-5 h-5 mr-3 ${activeMenu === 'carBrands' ? 'text-blue-600' : 'text-gray-400'}`} />
                                <span className="font-medium">Quản lý hãng xe</span>
                            </button>

                            <button
                                className={`flex items-center w-full px-3 py-3 text-left rounded-lg ${activeMenu === 'carTypes' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
                                onClick={() => setActiveMenu('carTypes')}
                            >
                                <Car className={`w-5 h-5 mr-3 ${activeMenu === 'carTypes' ? 'text-blue-600' : 'text-gray-400'}`} />
                                <span className="font-medium">Quản lý loại xe</span>
                            </button>

                            <button
                                className={`flex items-center w-full px-3 py-3 text-left rounded-lg ${activeMenu === 'positions' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
                                onClick={() => setActiveMenu('positions')}
                            >
                                <Users className={`w-5 h-5 mr-3 ${activeMenu === 'positions' ? 'text-blue-600' : 'text-gray-400'}`} />
                                <span className="font-medium">Quản lý Phân Quyền</span>
                            </button>
                            <button
                                className={`flex items-center w-full px-3 py-3 text-left rounded-lg ${activeMenu === 'customers' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
                                onClick={() => setActiveMenu('customers')}
                            >
                                <Users className={`w-5 h-5 mr-3 ${activeMenu === 'customers' ? 'text-blue-600' : 'text-gray-400'}`} />
                                <span className="font-medium">Người Dùng</span>
                            </button>

                            <button
                                className={`flex items-center w-full px-3 py-3 text-left rounded-lg ${activeMenu === 'reports' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
                                onClick={() => setActiveMenu('reports')}
                            >
                                <BarChart2 className={`w-5 h-5 mr-3 ${activeMenu === 'reports' ? 'text-blue-600' : 'text-gray-400'}`} />
                                <span className="font-medium">Báo cáo</span>
                            </button>

                            <button
                                className={`flex items-center w-full px-3 py-3 text-left rounded-lg ${activeMenu === 'promotions' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
                                onClick={() => setActiveMenu('promotions')}
                            >
                                <Tag className={`w-5 h-5 mr-3 ${activeMenu === 'promotions' ? 'text-blue-600' : 'text-gray-400'}`} />
                                <span className="font-medium">Khuyến mãi</span>
                            </button>

                            {/* <button
                                className={`flex items-center w-full px-3 py-3 text-left rounded-lg ${activeMenu === 'settings' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
                                onClick={() => setActiveMenu('settings')}
                            >
                                <Settings className={`w-5 h-5 mr-3 ${activeMenu === 'settings' ? 'text-blue-600' : 'text-gray-400'}`} />
                                <span className="font-medium">Cài đặt</span>
                            </button> */}
                        </nav>
                    </div>

                    <div className="p-4 border-t border-gray-200">
                        <button 
                            onClick={handleLogout}
                            className="flex items-center w-full px-3 py-3 text-left rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200"
                        >
                            <LogOut className="w-5 h-5 mr-3 text-red-500" />
                            <span className="font-medium">Đăng xuất</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="flex-1 md:ml-64">
                {/* Top navigation */}
                <header className="bg-white border-b border-gray-200 fixed right-0 left-0 md:left-64 z-20 shadow-sm">
                    <div className="px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center">
                            <button
                                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 md:hidden"
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                            >
                                {sidebarOpen ? (
                                    <X className="w-6 h-6" />
                                ) : (
                                    <Menu className="w-6 h-6" />
                                )}
                            </button>

                            <div className="ml-2 md:ml-4 relative max-w-xs hidden md:block">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <Search className="w-5 h-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-4 py-2"
                                    placeholder="Tìm kiếm..."
                                />
                            </div>
                        </div>

                        <div className="flex items-center">
                            <div className="relative" ref={notificationRef}>
                                <button 
                                    className="relative p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-200 rounded-full"
                                    onClick={() => setShowNotifications(!showNotifications)}
                                >
                                    <Bell className="w-6 h-6" />
                                    {notifications > 0 && (
                                        <span className="absolute top-1 right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                                            {notifications}
                                        </span>
                                    )}
                                </button>

                                {/* Notification Dropdown */}
                                {showNotifications && (
                                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-100">
                                        <div className="px-4 py-2 border-b border-gray-100">
                                            <h3 className="text-sm font-semibold text-gray-800">Thông báo</h3>
                                        </div>
                                        <div className="max-h-96 overflow-y-auto">
                                            {orders.slice(0, 10).map((order) => (
                                                <div key={order.id} className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-0">
                                                    <div className="flex items-start">
                                                        <div className="flex-shrink-0">
                                                            {order.status === 'pending' && (
                                                                <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                                                                    <Clock className="w-4 h-4 text-yellow-600" />
                                                                </div>
                                                            )}
                                                            {order.status === 'confirmed' && (
                                                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                                                    <CheckCircle className="w-4 h-4 text-blue-600" />
                                                                </div>
                                                            )}
                                                            {order.status === 'completed' && (
                                                                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                                                </div>
                                                            )}
                                                            {order.status === 'cancelled' && (
                                                                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                                                                    <XCircle className="w-4 h-4 text-red-600" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="ml-3 flex-1">
                                                            <p className="text-sm text-gray-800">
                                                                Đơn hàng <span className="font-medium">{order.id}</span>
                                                            </p>
                                                            <p className="text-xs text-gray-500 mt-1">
                                                                {order.customerName} - {order.carName}
                                                            </p>
                                                            <div className="flex justify-between items-center mt-1">
                                                                <span className="text-xs text-gray-400">
                                                                    {formatTimeAgo(order.startDate)}
                                                                </span>
                                                                {renderStatus(order.status)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="px-4 py-2 border-t border-gray-100">
                                            <button 
                                                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                                                onClick={() => {
                                                    setActiveMenu('orders');
                                                    setShowNotifications(false);
                                                }}
                                            >
                                                Xem tất cả thông báo
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="ml-3 relative">
                                <div className="flex items-center">
                                    <button className="flex items-center space-x-2 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                                            A
                                        </div>
                                        <span className="font-medium text-gray-700 hidden md:inline-block">Admin</span>
                                        <ChevronDown className="w-4 h-4 text-gray-500 hidden md:inline-block" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main content wrapper */}
                <main className="pt-16 px-4 md:px-6 pb-8">
                    <div className="max-w-7xl mx-auto mt-6">
                        {renderContent()}
                    </div>
                </main>
            </div>

            {/* Backdrop overlay for mobile sidebar */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-gray-600 bg-opacity-50 z-20 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}
        </div>
    );
};

export default AdminDashboard;
