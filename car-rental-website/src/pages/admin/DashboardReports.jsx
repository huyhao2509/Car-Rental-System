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
import Api from '@/utils/Api';

const DashboardReports = ({ formatCurrency }) => {
  // State cho filter
  const [reportPeriod, setReportPeriod] = useState("month");
  const [reportType, setReportType] = useState("revenue");
  const [yearFilter, setYearFilter] = useState(new Date().getFullYear());
  const [monthFilter, setMonthFilter] = useState(new Date().getMonth() + 1);
  const [loading, setLoading] = useState(false);
  
  // State for report data
  const [monthlyRevenueData, setMonthlyRevenueData] = useState([]);
  const [growthData, setGrowthData] = useState([]);
  const [carTypeData, setCarTypeData] = useState([]);
  const [rentalDurationData, setRentalDurationData] = useState([]);
  const [summaryStats, setSummaryStats] = useState({
    totalRentals: 0,
    totalRevenue: 0,
    averageRentalPrice: 0,
    mostRentedCar: "",
    mostActiveCustomer: "",
    completionRate: 0,
    cancellationRate: 0
  });
  const [topCarsData, setTopCarsData] = useState([]);

  // Fetch report data
  useEffect(() => {
    const fetchReportData = async () => {
      setLoading(true);
      try {
        const response = await Api.get('client/don-hang/admin/reports', {
          params: {
            period: reportPeriod,
            year: yearFilter,
            month: monthFilter
          }
        });
        
        if (response.data && response.data.status) {
          const data = response.data.data;
          setMonthlyRevenueData(data.monthlyRevenueData || []);
          setGrowthData(data.growthData || []);
          setCarTypeData(data.carTypeData || []);
          setRentalDurationData(data.rentalDurationData || []);
          setSummaryStats(data.summaryStats || {
            totalRentals: 0,
            totalRevenue: 0,
            averageRentalPrice: 0,
            mostRentedCar: "",
            mostActiveCustomer: "",
            completionRate: 0,
            cancellationRate: 0
          });
          setTopCarsData(data.topCarsData || []);
        }
      } catch (error) {
        console.error("Error fetching report data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchReportData();
  }, [reportPeriod, yearFilter, monthFilter]);
  
  // Colors for pie charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  // Hàm render biểu đồ doanh thu
  const renderRevenueChart = () => {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-800">Doanh thu theo tháng</h2>
          <div className="flex space-x-2">
            <select              className="bg-white border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={yearFilter}
              onChange={(e) => setYearFilter(Number(e.target.value))}
              disabled={loading}
            >
              <option value={new Date().getFullYear() - 2}>{new Date().getFullYear() - 2}</option>
              <option value={new Date().getFullYear() - 1}>{new Date().getFullYear() - 1}</option>
              <option value={new Date().getFullYear()}>{new Date().getFullYear()}</option>
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
              disabled={loading}
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
              disabled={loading}
            >
              <option value="revenue">Doanh thu</option>
              <option value="bookings">Đơn hàng</option>
              <option value="cars">Xe</option>
              <option value="customers">Khách hàng</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />          </div>
          
          {/* Month filter for monthly view */}
          {reportPeriod === 'month' && (
            <div className="relative">
              <select 
                className="bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={monthFilter}
                onChange={(e) => setMonthFilter(Number(e.target.value))}
                disabled={loading}
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i+1} value={i+1}>Tháng {i+1}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
            </div>
          )}
          
          <button
            className={`${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-100'} bg-blue-50 text-blue-600 px-4 py-2 rounded-lg font-medium border border-blue-100 flex items-center transition duration-300`}
            disabled={loading}
          >
            <Filter className="w-4 h-4 mr-1" />
            Bộ lọc
          </button>
          
          <button
            className={`${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'} bg-blue-600 text-white px-4 py-2 rounded-lg font-medium flex items-center transition duration-300`}
            disabled={loading}
            onClick={() => {
              // Generate CSV data and download it
              alert('Tính năng xuất báo cáo sẽ được triển khai trong cập nhật tiếp theo');
            }}
          >
            <Download className="w-4 h-4 mr-1" />
            Xuất báo cáo
          </button>
        </div>
      </div>
        {loading ? (
        <div className="flex flex-col items-center justify-center py-10">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-3 text-gray-600">Đang tải dữ liệu...</p>
        </div>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
};

export default DashboardReports;
