import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ProfileUpdate, DocumentUpload, BookingHistory } from "../../../features/account";
import { useAuth } from '@/contexts/AuthContext'; // Import useAuth hook
import axios from 'axios';

const Profile = () => {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth(); // Lấy thông tin từ AuthContext
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");

  // Lấy dữ liệu người dùng từ API hoặc AuthContext
  useEffect(() => {
    const fetchUserData = async () => {
      if (!isAuthenticated) {
        navigate('/login');
        return;
      }

      try {
        // Thử gọi API để lấy thông tin chi tiết hơn nếu cần
        const token = localStorage.getItem('token');
        
        if (token && currentUser) {
          // Option 1: Sử dụng trực tiếp từ currentUser
          const userData = {
            id: currentUser.id || currentUser._id || "",
            fullName: currentUser.fullName || currentUser.name || "",
            email: currentUser.email || "",
            phone: currentUser.phone || "",
            address: currentUser.address || "",
            drivingLicense: currentUser.drivingLicense || "",
            avatar: currentUser.avatar || "https://via.placeholder.com/150",
            // Thêm các trường dữ liệu mẫu cho phần chưa kết nối
            rentHistory: currentUser.rentHistory || [],
            paymentMethods: currentUser.paymentMethods || []
          };
          
          setUser(userData);
        } else {
          // Fallback nếu không có token hoặc currentUser
          navigate('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [currentUser, isAuthenticated, navigate]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Callback để cập nhật thông tin người dùng từ các component con
  const handleProfileUpdate = (updatedUser) => {
    setUser(updatedUser);
  };

  // Callback để cập nhật giấy tờ từ DocumentUpload
  const handleDocumentUpdate = (updatedUser) => {
    setUser(updatedUser);
  };

  // Render nội dung dựa trên tab đang active
  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileUpdate user={user} onProfileUpdate={handleProfileUpdate} />;
      case "documents":
        return <DocumentUpload user={user} onDocumentUpdate={handleDocumentUpdate} />;
      case "rentHistory":
        return <BookingHistory user={user} />;
      case "payment":
        return renderPaymentContent();
      default:
        return <ProfileUpdate user={user} onProfileUpdate={handleProfileUpdate} />;
    }
  };

  // Hiển thị nội dung phương thức thanh toán
  const renderPaymentContent = () => {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Phương thức thanh toán</h2>
        
        <div className="mb-6">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            + Thêm phương thức thanh toán
          </button>
        </div>
        
        {user.paymentMethods && user.paymentMethods.length > 0 ? (
          <div className="space-y-4">
            {user.paymentMethods.map((method) => (
              <div key={method.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center">
                  <div className="bg-gray-100 p-2 rounded-md mr-4">
                    {method.type === "Thẻ tín dụng" ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{method.type}</p>
                    <p className="text-sm text-gray-500">
                      {method.type === "Thẻ tín dụng" 
                        ? `**** **** **** ${method.last4} - Hết hạn ${method.expiry}` 
                        : method.account}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                    Chỉnh sửa
                  </button>
                  <button className="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200">
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">Bạn chưa có phương thức thanh toán nào.</p>
        )}
      </div>
    );
  };

  // Hiển thị trạng thái loading
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600">Đang tải thông tin...</p>
      </div>
    );
  }

  // Kiểm tra nếu không có dữ liệu người dùng
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <p className="text-gray-600">Không thể tải thông tin người dùng. Vui lòng đăng nhập lại.</p>
        <button 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          onClick={() => navigate('/login')}
        >
          Đăng nhập
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <div className="flex justify-between items-center pb-4 mb-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800">
          {activeTab === "profile" && "Thông Tin Cá Nhân"}
          {activeTab === "documents" && "Giấy Tờ"}
          {activeTab === "rentHistory" && "Lịch Sử Thuê Xe"}
          {activeTab === "payment" && "Phương Thức Thanh Toán"}
        </h1>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="md:w-1/3 lg:w-1/4">
          <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <div className="flex flex-col items-center mb-4">
              <img 
                src={user.avatar} 
                alt="Avatar" 
                className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = "https://via.placeholder.com/150"; 
                }}
              />
              <button className="mt-2 px-3 py-1 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300">
                Đổi ảnh
              </button>
            </div>
            <div className="text-center mb-4">
              <h3 className="text-sm font-medium text-gray-500">ID Người Dùng</h3>
              <p className="text-gray-700">{user.id}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <ul className="divide-y divide-gray-200">
              <li 
                className={`px-4 py-3 cursor-pointer ${activeTab === "profile" ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-700 hover:bg-gray-50"}`}
                onClick={() => handleTabChange("profile")}
              >
                Thông tin cá nhân
              </li>
              <li 
                className={`px-4 py-3 cursor-pointer ${activeTab === "documents" ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-700 hover:bg-gray-50"}`}
                onClick={() => handleTabChange("documents")}
              >
                Giấy tờ
              </li>
              <li 
                className={`px-4 py-3 cursor-pointer ${activeTab === "rentHistory" ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-700 hover:bg-gray-50"}`}
                onClick={() => handleTabChange("rentHistory")}
              >
                Lịch sử thuê xe
              </li>
              <li 
                className={`px-4 py-3 cursor-pointer ${activeTab === "payment" ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-700 hover:bg-gray-50"}`}
                onClick={() => handleTabChange("payment")}
              >
                Phương thức thanh toán
              </li>
            </ul>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:w-2/3 lg:w-3/4">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Profile;
