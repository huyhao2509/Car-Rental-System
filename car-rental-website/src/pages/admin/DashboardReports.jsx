import React, { useState, useEffect } from "react";
import { 
  Calendar, ChevronDown, Download, Filter, Search, 
  BarChart2, TrendingUp, PieChart, Map, DollarSign,
  Users, Car, FileText, ArrowRight, ArrowUp, ArrowDown
} from "lucide-react";
import { 
  LineChart, Line, BarChart, Bar, PieChart as RechartPieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

const DashboardReports = ({ formatCurrency }) => {
  // State cho filter
  const [reportPeriod, setReportPeriod] = useState("month");
  const [reportType, setReportType] = useState("revenue");
  const [yearFilter, setYearFilter] = useState(2025);
  const [monthFilter, setMonthFilter] = useState(3); // Tháng 3
  
  // Mock data cho biểu đồ doanh thu theo tháng
  const monthlyRevenueData = [
    { name: "T1", value: 95000000 },
    { name: "T2", value: 120000000 },
    { name: "T3", value: 135000000 },
    { name: "T4", value: 140000000 },
    { name: "T5", value: 150000000 },
    { name: "T6", value: 180000000 },
    { name: "T7", value: 200000000 },
    { name: "T8", value: 220000000 },
    { name: "T9", value: 190000000 },
    { name: "T10", value: 160000000 },
    { name: "T11", value: 140000000 },
    { name: "T12", value: 180000000 }
  ];
  
  // Mock data cho biểu đồ tăng trưởng
  const growthData = [
    { name: "T1", value: 0 },
    { name: "T2", value: 26 },
    { name: "T3", value: 12.5 },
    { name: "T4", value: 3.7 },
    { name: "T5", value: 7.1 },
    { name: "T6", value: 20 },
    { name: "T7", value: 11.1 },
    { name: "T8", value: 10 },
    { name: "T9", value: -13.6 },
    { name: "T10", value: -15.8 },
    { name: "T11", value: -12.5 },
    { name: "T12", value: 28.6 }
  ];
  
  // Mock data cho biểu đồ loại xe được thuê nhiều nhất
  const carTypeData = [
    { name: "Sedan", value: 35 },
    { name: "SUV", value: 30 },
    { name: "Hatchback", value: 15 },
    { name: "MPV", value: 12 },
    { name: "Xe điện", value: 8 }
  ];
  
  // Mock data cho biểu đồ thời gian thuê
  const rentalDurationData = [
    { name: "1 ngày", value: 15 },
    { name: "2-3 ngày", value: 40 },
    { name: "4-7 ngày", value: 30 },
    { name: "1-2 tuần", value: 10 },
    { name: "Trên 2 tuần", value: 5 }
  ];
  
  // Colors for pie charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  // Mock data cho thống kê tổng hợp
  const summaryStats = {
    totalRentals: 245,
    totalRevenue: 1435000000,
    averageRentalPrice: 5800000,
    mostRentedCar: "Toyota Camry 2.5Q",
    mostActiveCustomer: "Nguyễn Văn A",
    completionRate: 92,
    cancellationRate: 5
  };
  
  // Mock data cho bảng thống kê top xe
  const topCarsData = [
    { 
      id: 1, 
      name: "Toyota Camry 2.5Q", 
      rentCount: 35, 
      revenue: 42000000, 
      avgRating: 4.8,
      growth: 15
    },
    { 
      id: 2, 
      name: "Honda Civic RS", 
      rentCount: 28, 
      revenue: 28000000, 
      avgRating: 4.7,
      growth: 8
    },
    { 
      id: 3, 
      name: "VinFast VF8 Eco", 
      rentCount: 22, 
      revenue: 33000000, 
      avgRating: 4.5,
      growth: 25
    },
    { 
      id: 4, 
      name: "Mazda CX-5 2.5L", 
      rentCount: 20, 
      revenue: 22000000, 
      avgRating: 4.6,
      growth: 5
    },
    { 
      id: 5, 
      name: "Hyundai Tucson 1.6 Turbo", 
      rentCount: 18, 
      revenue: 19800000, 
      avgRating: 4.4,
      growth: -3
    }
  ];
  
  // Hàm render biểu đồ doanh thu
  const renderRevenueChart = () => {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-800">Doanh thu theo tháng</h2>
          <div className="flex space-x-2">
            <select
              className="bg-white border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={yearFilter}
              onChange={(e) => setYearFilter(Number(e.target.value))}
            >
              <option value={2023}>2023</option>
              <option value={2024}>2024</option>
              <option value={2025}>2025</option>
            </select>
            <button className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-sm font-medium border border-blue-100 flex items-center hover:bg-blue-100">
              <Download className="w-4 h-4 mr-1" />
              Xuất báo cáo
            </button>
          </div>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={monthlyRevenueData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis
                tickFormatter={(value) => 
                  value === 0 ? '0' : 
                  value >= 1000000 ? `${value / 1000000}Tr` : 
                  `${value / 1000}k`
                }
              />
              <Tooltip 
                formatter={(value) => [formatCurrency(value), "Doanh thu"]}
                labelFormatter={(label) => `Tháng ${label.substring(1)}`}
              />
              <Legend />
              <Bar dataKey="value" name="Doanh thu" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-3">
            <p className="text-sm text-gray-500">Doanh thu cao nhất</p>
            <p className="text-lg font-bold text-blue-600">{formatCurrency(Math.max(...monthlyRevenueData.map(item => item.value)))}</p>
            <p className="text-xs text-gray-500">Tháng 8, 2025</p>
          </div>
          <div className="bg-green-50 rounded-lg p-3">
            <p className="text-sm text-gray-500">Doanh thu trung bình</p>
            <p className="text-lg font-bold text-green-600">
              {formatCurrency(monthlyRevenueData.reduce((sum, item) => sum + item.value, 0) / monthlyRevenueData.length)}
            </p>
            <p className="text-xs text-gray-500">12 tháng gần nhất</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-3">
            <p className="text-sm text-gray-500">Tăng trưởng</p>
            <p className="text-lg font-bold text-purple-600">+15.4%</p>
            <p className="text-xs text-gray-500">So với năm trước</p>
          </div>
        </div>
      </div>
    );
  };
  
  // Hàm render biểu đồ tăng trưởng
  const renderGrowthChart = () => {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-6">Tăng trưởng doanh thu theo tháng</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={growthData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis 
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip 
                formatter={(value) => [`${value.toFixed(1)}%`, "Tăng trưởng"]}
                labelFormatter={(label) => `Tháng ${label.substring(1)}`}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="value" 
                name="Tăng trưởng" 
                stroke="#8884d8" 
                activeDot={{ r: 8 }}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };
  
  // Hàm render biểu đồ loại xe và thời gian thuê
  const renderPieCharts = () => {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-6">Phân bố loại xe được thuê</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RechartPieChart>
                <Pie
                  data={carTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {carTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name, props) => [`${value}%`, name]}
                />
                <Legend />
              </RechartPieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-6">Thời gian thuê xe</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RechartPieChart>
                <Pie
                  data={rentalDurationData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {rentalDurationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name, props) => [`${value}%`, name]}
                />
                <Legend />
              </RechartPieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  };
  
  // Hàm render thống kê tổng hợp
  const renderSummaryStats = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 p-3 rounded-lg mr-4">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Tổng số đơn thuê</p>
                <p className="text-2xl font-bold">{summaryStats.totalRentals}</p>
              </div>
            </div>
            <div className="bg-blue-50 rounded-lg p-2 text-center">
              <span className="text-sm text-blue-600 font-medium flex items-center justify-center">
                <ArrowUp className="w-4 h-4 mr-1" /> +12.5% so với tháng trước
              </span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col">
            <div className="flex items-center mb-4">
              <div className="bg-green-100 p-3 rounded-lg mr-4">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Doanh thu</p>
                <p className="text-2xl font-bold">{formatCurrency(summaryStats.totalRevenue)}</p>
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-2 text-center">
              <span className="text-sm text-green-600 font-medium flex items-center justify-center">
                <ArrowUp className="w-4 h-4 mr-1" /> +15.4% so với tháng trước
              </span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col">
            <div className="flex items-center mb-4">
              <div className="bg-purple-100 p-3 rounded-lg mr-4">
                <Car className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Giá thuê trung bình</p>
                <p className="text-2xl font-bold">{formatCurrency(summaryStats.averageRentalPrice)}</p>
              </div>
            </div>
            <div className="bg-purple-50 rounded-lg p-2 text-center">
              <span className="text-sm text-purple-600 font-medium flex items-center justify-center">
                <ArrowUp className="w-4 h-4 mr-1" /> +5.2% so với tháng trước
              </span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col">
            <div className="flex items-center mb-4">
              <div className="bg-orange-100 p-3 rounded-lg mr-4">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Tỉ lệ hoàn thành</p>
                <p className="text-2xl font-bold">{summaryStats.completionRate}%</p>
              </div>
            </div>
            <div className="bg-orange-50 rounded-lg p-2 text-center">
              <span className="text-sm text-green-600 font-medium flex items-center justify-center">
                <ArrowUp className="w-4 h-4 mr-1" /> +2.1% so với tháng trước
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Hàm render bảng top xe
  const renderTopCarsTable = () => {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-6">Top xe được thuê nhiều nhất</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-500 text-xs uppercase">
                <th className="pb-3 px-4">Tên xe</th>
                <th className="pb-3 px-4 text-center">Số lượt thuê</th>
                <th className="pb-3 px-4 text-center">Doanh thu</th>
                <th className="pb-3 px-4 text-center">Đánh giá</th>
                <th className="pb-3 px-4 text-center">Tăng trưởng</th>
              </tr>
            </thead>
            <tbody>
              {topCarsData.map((car, index) => (
                <tr key={car.id} className={`border-t border-gray-100 ${index % 2 === 0 ? 'bg-gray-50' : ''}`}>
                  <td className="py-4 px-4 font-medium">{car.name}</td>
                  <td className="py-4 px-4 text-center">{car.rentCount}</td>
                  <td className="py-4 px-4 text-center font-medium">{formatCurrency(car.revenue)}</td>
                  <td className="py-4 px-4 text-center">
                    <div className="flex items-center justify-center">
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                        {car.avgRating} / 5
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-center">
                      {car.growth > 0 ? (
                        <span className="text-green-600 flex items-center">
                          <ArrowUp className="w-4 h-4 mr-1" /> {car.growth}%
                        </span>
                      ) : car.growth < 0 ? (
                        <span className="text-red-600 flex items-center">
                          <ArrowDown className="w-4 h-4 mr-1" /> {Math.abs(car.growth)}%
                        </span>
                      ) : (
                        <span className="text-gray-600 flex items-center">
                          <ArrowRight className="w-4 h-4 mr-1" /> 0%
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Báo cáo thống kê</h1>
        <div className="flex space-x-2">
          <div className="relative">
            <select 
              className="bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={reportPeriod}
              onChange={(e) => setReportPeriod(e.target.value)}
            >
              <option value="day">Ngày</option>
              <option value="week">Tuần</option>
              <option value="month">Tháng</option>
              <option value="year">Năm</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
          </div>
          
          <div className="relative">
            <select 
              className="bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            >
              <option value="revenue">Doanh thu</option>
              <option value="bookings">Đơn hàng</option>
              <option value="cars">Xe</option>
              <option value="customers">Khách hàng</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
          </div>
          
          <button className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg font-medium border border-blue-100 flex items-center hover:bg-blue-100 transition duration-300">
            <Filter className="w-4 h-4 mr-1" />
            Bộ lọc
          </button>
          
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium flex items-center hover:bg-blue-700 transition duration-300">
            <Download className="w-4 h-4 mr-1" />
            Xuất báo cáo
          </button>
        </div>
      </div>
      
      {/* Thống kê tổng hợp */}
      {renderSummaryStats()}
      
      {/* Biểu đồ doanh thu */}
      {renderRevenueChart()}
      
      {/* Biểu đồ tăng trưởng */}
      {renderGrowthChart()}
      
      {/* Biểu đồ phân bố loại xe và thời gian thuê */}
      {renderPieCharts()}
      
      {/* Bảng top xe */}
      {renderTopCarsTable()}
    </div>
  );
};

export default DashboardReports;
