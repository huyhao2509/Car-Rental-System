import React, { useState, useEffect } from "react";
import { 
  LayoutDashboard, Car, Users, FileText, CreditCard, Tag, 
  Shield, AlertTriangle, BarChart2, Settings, LogOut, ChevronDown,
  Search, Filter, Download, Calendar, DollarSign, TrendingUp, CheckCircle,
  XCircle, Clock, Trash2, Edit, Eye, UserCheck, AlertCircle, Menu, X, Bell
} from "lucide-react";

const AdminDashboard = () => {
  // State để quản lý menu active
  const [activeMenu, setActiveMenu] = useState("dashboard");
  // State để quản lý submenu
  const [openSubmenu, setOpenSubmenu] = useState(null);
  // State cho thông báo
  const [notifications, setNotifications] = useState(3);
  // State cho sidebar mobile
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Mock data cho dashboard
  const [stats, setStats] = useState({
    totalCars: 120,
    availableCars: 78,
    totalCustomers: 865,
    pendingOrders: 12,
    totalRevenue: 1235000000,
    monthlyRevenue: 135000000,
    lastMonthRevenue: 120000000
  });
  
  // Mock data cho danh sách đơn hàng
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
      order.id === orderId ? {...order, status: newStatus} : order
    ));
  };
  
  // Hàm định dạng tiền VND
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND',
      maximumFractionDigits: 0 
    }).format(amount);
  };

  // Hàm hiển thị trạng thái đơn hàng
  const renderStatus = (status) => {
    switch(status) {
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
  
  // Mock data cho xe
  const [cars, setCars] = useState([
    {
      id: 1,
      name: "Toyota Camry 2.5Q",
      licensePlate: "30A-123.45",
      year: 2023,
      seats: 5,
      fuel: "Xăng",
      pricePerDay: 1200000,
      status: "available",
      location: "Hà Nội"
    },
    {
      id: 2,
      name: "Honda Civic RS",
      licensePlate: "51F-678.90",
      year: 2023,
      seats: 5,
      fuel: "Xăng",
      pricePerDay: 1000000,
      status: "rented",
      location: "Hồ Chí Minh"
    },
    {
      id: 3,
      name: "Mazda CX-5 2.5L",
      licensePlate: "43A-111.22",
      year: 2022,
      seats: 5,
      fuel: "Xăng",
      pricePerDay: 1100000,
      status: "available",
      location: "Đà Nẵng"
    },
    {
      id: 4,
      name: "VinFast VF8 Eco",
      licensePlate: "30F-333.44",
      year: 2023,
      seats: 7,
      fuel: "Điện",
      pricePerDay: 1500000,
      status: "maintenance",
      location: "Hà Nội"
    }
  ]);
  
  // Mock data cho khách hàng
  const [customers, setCustomers] = useState([
    {
      id: 1,
      name: "Nguyễn Văn A",
      phone: "0912345678",
      email: "nguyenvana@example.com",
      identityNumber: "0123456789",
      driverLicense: "AB123456",
      registeredDate: "2023-01-15",
      totalOrders: 8
    },
    {
      id: 2,
      name: "Trần Thị B",
      phone: "0987654321",
      email: "tranthib@example.com",
      identityNumber: "0987654321",
      driverLicense: "CD789012",
      registeredDate: "2023-02-20",
      totalOrders: 5
    },
    {
      id: 3,
      name: "Lê Văn C",
      phone: "0912345677",
      email: "levanc@example.com",
      identityNumber: "0123456788",
      driverLicense: "EF345678",
      registeredDate: "2023-03-10",
      totalOrders: 3
    }
  ]);
  
  // Hàm render nội dung chính dựa vào menu active
  const renderContent = () => {
    switch(activeMenu) {
      case 'dashboard':
        return renderDashboard();
      case 'orders':
        return renderOrders();
      case 'cars':
        return renderCars();
      case 'customers':
        return renderCustomers();
      case 'reports':
        return renderReports();
      case 'promotions':
        return renderPromotions();
      case 'insurances':
        return renderInsurances();
      case 'incidents':
        return renderIncidents();
      case 'settings':
        return renderSettings();
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
              <div>
                <p className="text-gray-500 text-sm">Doanh thu tháng này</p>
                <h3 className="text-2xl font-bold mt-1">{formatCurrency(stats.monthlyRevenue)}</h3>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +12.5% so với tháng trước
                </p>
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
                <span className="text-xl font-bold">{stats.pendingOrders}</span>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-2">
                  <CheckCircle className="w-8 h-8 text-blue-600" />
                </div>
                <span className="text-sm text-gray-500">Đã xác nhận</span>
                <span className="text-xl font-bold">18</span>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-2">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <span className="text-sm text-gray-500">Hoàn thành</span>
                <span className="text-xl font-bold">87</span>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mb-2">
                  <XCircle className="w-8 h-8 text-red-600" />
                </div>
                <span className="text-sm text-gray-500">Đã hủy</span>
                <span className="text-xl font-bold">5</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Xe được thuê nhiều nhất</h2>
            <div className="space-y-4 mt-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                  <Car className="w-6 h-6 text-gray-500" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Toyota Camry 2.5Q</h4>
                    <span className="text-sm text-gray-500">35 lượt thuê</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                  <Car className="w-6 h-6 text-gray-500" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Honda Civic RS</h4>
                    <span className="text-sm text-gray-500">28 lượt thuê</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '70%' }}></div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                  <Car className="w-6 h-6 text-gray-500" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">VinFast VF8 Eco</h4>
                    <span className="text-sm text-gray-500">22 lượt thuê</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Render danh sách đơn hàng
  const renderOrders = () => {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Quản lý đơn đặt thuê</h1>
          <button className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg font-medium border border-blue-100 flex items-center hover:bg-blue-100 transition duration-300">
            <Download className="w-4 h-4 mr-1" />
            Xuất Excel
          </button>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center bg-gray-50 rounded-lg px-3 py-2 w-full md:w-1/3">
              <Search className="w-5 h-5 text-gray-400 mr-2" />
              <input 
                type="text" 
                placeholder="Tìm kiếm đơn hàng..." 
                className="bg-transparent outline-none text-sm w-full"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center">
                <label className="text-gray-500 mr-2 text-sm whitespace-nowrap">Trạng thái:</label>
                <select className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Tất cả</option>
                  <option value="pending">Chờ duyệt</option>
                  <option value="confirmed">Đã xác nhận</option>
                  <option value="completed">Hoàn thành</option>
                  <option value="cancelled">Đã hủy</option>
                </select>
              </div>
              
              <div className="flex items-center">
                <label className="text-gray-500 mr-2 text-sm whitespace-nowrap">Từ ngày:</label>
                <input 
                  type="date" 
                  className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex items-center">
                <label className="text-gray-500 mr-2 text-sm whitespace-nowrap">Đến ngày:</label>
                <input 
                  type="date" 
                  className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <button className="bg-gray-100 p-2 rounded-lg hover:bg-gray-200 transition">
                <Filter className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-500 text-xs uppercase bg-gray-50">
                  <th className="py-3 px-4 rounded-l-lg">Mã đơn</th>
                  <th className="py-3 px-4">Khách hàng</th>
                  <th className="py-3 px-4">Xe</th>
                  <th className="py-3 px-4">Ngày thuê</th>
                  <th className="py-3 px-4">Trạng thái</th>
                  <th className="py-3 px-4">Tổng tiền</th>
                  <th className="py-3 px-4 rounded-r-lg">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <tr key={order.id} className="border-t border-gray-100">
                    <td className="py-4 px-4 font-medium">{order.id}</td>
                    <td className="py-4 px-4">{order.customerName}</td>
                    <td className="py-4 px-4">{order.carName}</td>
                    <td className="py-4 px-4">
                      {new Date(order.startDate).toLocaleDateString('vi-VN')} - {new Date(order.endDate).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="py-4 px-4">{renderStatus(order.status)}</td>
                    <td className="py-4 px-4 font-medium">{formatCurrency(order.total)}</td>
                    <td className="py-4 px-4">
                      <div className="flex space-x-1">
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
                              <UserCheck className="w-4 h-4" />
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
                        
                        {order.status === 'confirmed' && (
                          <button 
                            className="p-1 text-green-600 hover:bg-green-50 rounded"
                            title="Hoàn thành"
                            onClick={() => changeOrderStatus(order.id, 'completed')}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="flex items-center justify-between mt-6">
            <p className="text-gray-500 text-sm">Hiển thị 1-5 của 24 kết quả</p>
            <div className="flex">
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 mr-2 bg-white">
                <ChevronDown className="w-4 h-4 text-gray-500 transform rotate-90" />
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-blue-600 text-white bg-blue-600 mr-2">
                1
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 mr-2 bg-white">
                2
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 bg-white">
                <ChevronDown className="w-4 h-4 text-gray-500 transform -rotate-90" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Add placeholder implementations for other rendering functions
  const renderCars = () => {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý xe</h1>
        {/* Content will go here */}
      </div>
    );
  };
  
  const renderCustomers = () => {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý khách hàng</h1>
        {/* Content will go here */}
      </div>
    );
  };
  
  const renderReports = () => {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Báo cáo thống kê</h1>
        {/* Content will go here */}
      </div>
    );
  };
  
  const renderPromotions = () => {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý khuyến mãi</h1>
        {/* Content will go here */}
      </div>
    );
  };
  
  const renderInsurances = () => {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý bảo hiểm</h1>
        {/* Content will go here */}
      </div>
    );
  };
  
  const renderIncidents = () => {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý sự cố</h1>
        {/* Content will go here */}
      </div>
    );
  };
  
  const renderSettings = () => {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Cài đặt hệ thống</h1>
        {/* Content will go here */}
      </div>
    );
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
                className={`flex items-center w-full px-3 py-3 text-left rounded-lg ${activeMenu === 'customers' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
                onClick={() => setActiveMenu('customers')}
              >
                <Users className={`w-5 h-5 mr-3 ${activeMenu === 'customers' ? 'text-blue-600' : 'text-gray-400'}`} />
                <span className="font-medium">Khách hàng</span>
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
              
              <button 
                className={`flex items-center w-full px-3 py-3 text-left rounded-lg ${activeMenu === 'insurances' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
                onClick={() => setActiveMenu('insurances')}
              >
                <Shield className={`w-5 h-5 mr-3 ${activeMenu === 'insurances' ? 'text-blue-600' : 'text-gray-400'}`} />
                <span className="font-medium">Bảo hiểm</span>
              </button>
              
              <button 
                className={`flex items-center w-full px-3 py-3 text-left rounded-lg ${activeMenu === 'incidents' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
                onClick={() => setActiveMenu('incidents')}
              >
                <AlertTriangle className={`w-5 h-5 mr-3 ${activeMenu === 'incidents' ? 'text-blue-600' : 'text-gray-400'}`} />
                <span className="font-medium">Sự cố</span>
              </button>
              
              <button 
                className={`flex items-center w-full px-3 py-3 text-left rounded-lg ${activeMenu === 'settings' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
                onClick={() => setActiveMenu('settings')}
              >
                <Settings className={`w-5 h-5 mr-3 ${activeMenu === 'settings' ? 'text-blue-600' : 'text-gray-400'}`} />
                <span className="font-medium">Cài đặt</span>
              </button>
            </nav>
          </div>
          
          <div className="p-4 border-t border-gray-200">
            <button className="flex items-center w-full px-3 py-3 text-left rounded-lg text-red-600 hover:bg-red-50">
              <LogOut className="w-5 h-5 mr-3 text-red-500" />
              <span className="font-medium">Đăng xuất</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
      
      {/* Main content */}
      <div className="flex-1 md:ml-64">
        {/* Top navigation */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="px-4 py-4 flex justify-between items-center">
            <div className="flex items-center">
              <button 
                className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 md:hidden"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <h2 className="text-xl font-semibold ml-2 md:hidden">Car Rental Admin</h2>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 relative">
                  <Bell className="w-6 h-6" />
                  {notifications > 0 && (
                    <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      {notifications}
                    </span>
                  )}
                </button>
              </div>
              
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold mr-3">
                  A
                </div>
                <div className="hidden md:block">
                  <h3 className="font-medium">Admin User</h3>
                  <p className="text-xs text-gray-500">Admin</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Content area */}
        <div className="p-6 max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
