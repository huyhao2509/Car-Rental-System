import Api from "@/utils/Api";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

// Bỏ import service
// import userService from "../../../services/userService";

const ProfileUpdate = ({ user, onProfileUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(user);

    // Cập nhật dữ liệu form khi user thay đổi
    useEffect(() => {
        if (user) {
            setFormData(user);
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
            const res = await Api.post(`/api/nguoi-dung/profile/update`, formData);
            if(res.data.status) {
                onProfileUpdate({
                    ...user,
                    ...formData,
                });
                setIsEditing(false);
                toast.success("Cập nhật thông tin thành công!");
            } else {
                toast.error("Đã có lỗi xảy ra khi cập nhật thông tin!");
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật thông tin:", error);
            toast.error("Đã có lỗi xảy ra khi cập nhật thông tin!");
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
                            value={formData.hoTen}
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
                            value={formData.sdt}
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
                            value={formData.diaChi}
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
                            value={formData.soCMND}
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
                            <p className="mt-1 text-gray-900">{formData.hoTen || "Chưa cập nhật"}</p>
                        </div>

                        <div>
                            <p className="text-sm font-medium text-gray-500">Email</p>
                            <p className="mt-1 text-gray-900">{formData.email || "Chưa cập nhật"}</p>
                        </div>

                        <div>
                            <p className="text-sm font-medium text-gray-500">Số điện thoại</p>
                            <p className="mt-1 text-gray-900">{formData.sdt || "Chưa cập nhật"}</p>
                        </div>

                        <div>
                            <p className="text-sm font-medium text-gray-500">Bằng lái xe</p>
                            <p className="mt-1 text-gray-900">{formData.soCMND || "Chưa cập nhật"}</p>
                        </div>
                    </div>

                    <div>
                        <p className="text-sm font-medium text-gray-500">Địa chỉ</p>
                        <p className="mt-1 text-gray-900">{formData.diaChi || "Chưa cập nhật"}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileUpdate;
