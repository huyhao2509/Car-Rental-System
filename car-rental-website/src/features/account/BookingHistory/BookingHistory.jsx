import React, { useState } from "react";
import { Link } from "react-router-dom";

// Bỏ import service
// import bookingService from "../../../services/bookingService";

const BookingHistory = ({ user }) => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Lọc danh sách theo trạng thái và từ khóa tìm kiếm
  const filteredBookings = user?.rentHistory?.filter(booking => {
    // Lọc theo trạng thái
    if (activeFilter !== "all" && booking.status !== activeFilter) {
      return false;
    }
    
    // Lọc theo từ khóa tìm kiếm
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return booking.id.toLowerCase().includes(searchLower) || 
        booking.carName.toLowerCase().includes(searchLower);
    }
    
    return true;
  }) || [];

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  const handleViewDetail = (bookingId) => {
    console.log("Xem chi tiết đơn đặt xe:", bookingId);
    // Trong thực tế, chuyển trang đến trang chi tiết đơn đặt xe
  };

  const handleAddReview = (bookingId) => {
    console.log("Đánh giá đơn đặt xe:", bookingId);
    // Trong thực tế, chuyển trang đến trang đánh giá
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Lịch sử thuê xe</h2>
        
        <div className="mb-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex space-x-2 mb-3 md:mb-0">
              <button 
                className={`px-3 py-1 rounded-md ${
                  activeFilter === "all" 
                    ? "bg-blue-500 text-white" 
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
                onClick={() => handleFilterChange("all")}
              >
                Tất cả
              </button>
              <button 
                className={`px-3 py-1 rounded-md ${
                  activeFilter === "Đang xử lý" 
                    ? "bg-blue-500 text-white" 
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
                onClick={() => handleFilterChange("Đang xử lý")}
              >
                Đang xử lý
              </button>
              <button 
                className={`px-3 py-1 rounded-md ${
                  activeFilter === "Hoàn thành" 
                    ? "bg-blue-500 text-white" 
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
                onClick={() => handleFilterChange("Hoàn thành")}
              >
                Hoàn thành
              </button>
            </div>
            <div>
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
        
        {filteredBookings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Xe</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày thuê</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày trả</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chi phí</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{booking.id}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{booking.carName}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{booking.date}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{booking.returnDate}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{booking.cost}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        booking.status === "Hoàn thành" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
                      <div className="flex justify-center space-x-2">
                        <button 
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                          onClick={() => handleViewDetail(booking.id)}
                        >
                          Chi tiết
                        </button>
                        {booking.status === "Hoàn thành" && (
                          <button 
                            className="px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200"
                            onClick={() => handleAddReview(booking.id)}
                          >
                            Đánh giá
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-500 italic">Không tìm thấy đơn đặt xe nào {searchTerm ? "phù hợp với từ khóa tìm kiếm" : ""}</p>
          </div>
        )}
        
        {filteredBookings.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Hiển thị 1-{filteredBookings.length} của {filteredBookings.length} bản ghi
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
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Thống kê thuê xe</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm font-medium text-gray-500">Tổng số lần thuê</p>
            <p className="text-2xl font-bold text-blue-600">{user?.rentHistory?.length || 0}</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm font-medium text-gray-500">Đã hoàn thành</p>
            <p className="text-2xl font-bold text-green-600">
              {user?.rentHistory?.filter(rent => rent.status === "Hoàn thành").length || 0}
            </p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg">
            <p className="text-sm font-medium text-gray-500">Đang xử lý</p>
            <p className="text-2xl font-bold text-yellow-600">
              {user?.rentHistory?.filter(rent => rent.status === "Đang xử lý").length || 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingHistory;
