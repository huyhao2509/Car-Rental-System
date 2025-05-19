import React, { useState, useEffect } from "react";

// Bỏ import service
// import userService from "../../../services/userService";

const ProfileUpdate = ({ user, onProfileUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    drivingLicense: "",
  });

  // Cập nhật dữ liệu form khi user thay đổi
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        drivingLicense: user.drivingLicense || "",
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Trong thực tế, bạn sẽ gọi API để cập nhật thông tin người dùng
      // const response = await userService.updateProfile(formData);
      
      // Giả lập việc cập nhật thành công
      console.log("Đã cập nhật thông tin:", formData);
      
      // Gọi callback để cập nhật state ở component cha
      if (onProfileUpdate) {
        onProfileUpdate({
          ...user,
          ...formData,
        });
      }
      
      setIsEditing(false);
      
      // Hiển thị thông báo thành công
      alert("Cập nhật thông tin thành công!");
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin:", error);
      alert("Đã có lỗi xảy ra khi cập nhật thông tin!");
    }
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center pb-4 mb-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Thông tin cá nhân</h2>
        <button 
          className={`px-4 py-2 rounded-md transition-colors ${isEditing ? 'bg-gray-500 text-white' : 'bg-blue-500 text-white'}`}
          onClick={toggleEditMode}
        >
          {isEditing ? "Hủy" : "Chỉnh Sửa"}
        </button>
      </div>
      
      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
              Họ và tên
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Số điện thoại
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Địa chỉ
            </label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="drivingLicense" className="block text-sm font-medium text-gray-700 mb-1">
              Bằng lái xe
            </label>
            <input
              type="text"
              id="drivingLicense"
              name="drivingLicense"
              value={formData.drivingLicense}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={toggleEditMode}
              className="mr-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Lưu thay đổi
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Họ và tên</p>
              <p className="mt-1 text-gray-900">{formData.fullName || "Chưa cập nhật"}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="mt-1 text-gray-900">{formData.email || "Chưa cập nhật"}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">Số điện thoại</p>
              <p className="mt-1 text-gray-900">{formData.phone || "Chưa cập nhật"}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">Bằng lái xe</p>
              <p className="mt-1 text-gray-900">{formData.drivingLicense || "Chưa cập nhật"}</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500">Địa chỉ</p>
            <p className="mt-1 text-gray-900">{formData.address || "Chưa cập nhật"}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileUpdate;
