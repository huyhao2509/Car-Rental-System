import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '@/contexts/AuthContext';
import Api from '@/utils/Api';
import { toast } from 'react-toastify';

// Sử dụng ảnh mặc định thay vì placeholder.com
const DEFAULT_AVATAR = 'https://img.freepik.com/premium-vector/man-avatar-profile-picture-isolated-background-avatar-profile-picture-man_1293239-4866.jpg';

// Components cho từng tab
const ProfileUpdate = ({ user, onProfileDataChange }) => {
    const { updateUserInfo } = useAuth();
    const [formData, setFormData] = useState({
        hoTen: '',
        email: '',
        soDienThoai: '',
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                hoTen: user.hoTen || '',
                email: user.email || '',
                soDienThoai: user.soDienThoai || '',
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const dataToUpdate = {
                hoTen: formData.hoTen,
                soDienThoai: formData.soDienThoai,
            };
            const response = await updateUserInfo(dataToUpdate);

            if (response.status) {
                toast.success("Cập nhật thông tin thành công");
                onProfileDataChange(response.data);
            } else {
                toast.error(response.message || "Cập nhật thất bại");
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật thông tin:", error);
            toast.error(error.message || "Đã xảy ra lỗi khi cập nhật thông tin");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Thông tin cá nhân</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="hoTen">
                        Họ và tên
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="hoTen"
                        type="text"
                        name="hoTen"
                        value={formData.hoTen}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">
                        Email
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100"
                        id="email"
                        type="email"
                        name="email"
                        value={formData.email}
                        readOnly
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="soDienThoai">
                        Số điện thoại
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="soDienThoai"
                        type="text"
                        name="soDienThoai"
                        value={formData.soDienThoai}
                        onChange={handleChange}
                    />
                </div>
                <div className="flex items-center justify-between">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? 'Đang cập nhật...' : 'Cập nhật thông tin'}
                    </button>
                </div>
            </form>
        </div>
    );
};

const DocumentUpload = ({ user, onProfileDataChange }) => {
    const { updateUserInfo } = useAuth();
    const [canCuocFile, setCanCuocFile] = useState(null);
    const [bangLaiFile, setBangLaiFile] = useState(null);
    const [canCuocPreview, setCanCuocPreview] = useState('');
    const [bangLaiPreview, setBangLaiPreview] = useState('');
    const [canCuocNumber, setCanCuocNumber] = useState('');
    const [loading, setLoading] = useState(false);

    // Hàm chuyển đổi đường dẫn tương đối thành URL đầy đủ để hiển thị ảnh
    const getImageUrl = (path) => {
        if (!path) return '';
        
        // Nếu đã là URL đầy đủ, trả về nguyên trạng
        if (path.startsWith('http://') || path.startsWith('https://')) {
            return path;
        }
        
        // Thử các cách khác nhau để tạo URL
        // 1. Sử dụng domain từ API
        const apiBaseUrl = 'http://localhost:5000';
        const directUrl = `${apiBaseUrl}${path}`;
        
        console.log("Đường dẫn gốc:", path);
        console.log("URL trực tiếp:", directUrl);
        
        return directUrl;
    };

    useEffect(() => {
        if (user) {
            // Nếu có ảnh căn cước hoặc bằng lái từ user, chuyển đổi URL để hiển thị
            if (user.anhCanCuoc) {
                console.log("Ảnh căn cước từ server:", user.anhCanCuoc);
                setCanCuocPreview(getImageUrl(user.anhCanCuoc));
            }
            if (user.anhBangLaiXe) {
                console.log("Ảnh bằng lái từ server:", user.anhBangLaiXe);
                setBangLaiPreview(getImageUrl(user.anhBangLaiXe));
            }
            setCanCuocNumber(user.canCuocCongDan || '');
        }
    }, [user]);

    const handleCanCuocChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setCanCuocFile(file);
            // Tạo URL tạm thời để hiển thị preview
            setCanCuocPreview(URL.createObjectURL(file));
        }
    };

    const handleBangLaiChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setBangLaiFile(file);
            // Tạo URL tạm thời để hiển thị preview
            setBangLaiPreview(URL.createObjectURL(file));
        }
    };

    const handleCanCuocNumberChange = (e) => {
        setCanCuocNumber(e.target.value);
    };

    // Hàm xóa ảnh căn cước hiện tại trên server
    const handleDeleteCanCuoc = async () => {
        try {
            setLoading(true);
            const response = await Api.delete('/nguoi-dung/profile/delete-can-cuoc');
            if (response.data.status) {
                toast.success("Đã xóa ảnh căn cước thành công");
                setCanCuocPreview('');
                setCanCuocFile(null);
                onProfileDataChange(response.data.data);
            } else {
                toast.error(response.data.message || "Xóa ảnh căn cước thất bại");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Đã xảy ra lỗi khi xóa ảnh căn cước");
        } finally {
            setLoading(false);
        }
    };

    // Hàm xóa ảnh bằng lái xe hiện tại trên server
    const handleDeleteBangLai = async () => {
        try {
            setLoading(true);
            const response = await Api.delete('/nguoi-dung/profile/delete-bang-lai');
            if (response.data.status) {
                toast.success("Đã xóa ảnh bằng lái thành công");
                setBangLaiPreview('');
                setBangLaiFile(null);
                onProfileDataChange(response.data.data);
            } else {
                toast.error(response.data.message || "Xóa ảnh bằng lái thất bại");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Đã xảy ra lỗi khi xóa ảnh bằng lái");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formDataToSend = new FormData();
        if (canCuocFile) formDataToSend.append('anhCanCuoc', canCuocFile);
        if (bangLaiFile) formDataToSend.append('anhBangLaiXe', bangLaiFile);
        formDataToSend.append('canCuocCongDan', canCuocNumber);
        
        if (!canCuocFile && !bangLaiFile && canCuocNumber === (user?.canCuocCongDan || '')) {
            toast.info("Không có thay đổi nào để cập nhật.");
            setLoading(false);
            return;
        }

        try {
            const response = await Api.post(`/nguoi-dung/profile/update`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            if (response.data.status) {
                toast.success("Cập nhật giấy tờ thành công");
                onProfileDataChange(response.data.data);
                
                // Nếu có ảnh mới từ response, cập nhật preview
                if (response.data.data.anhCanCuoc) {
                    setCanCuocPreview(getImageUrl(response.data.data.anhCanCuoc));
                }
                if (response.data.data.anhBangLaiXe) {
                    setBangLaiPreview(getImageUrl(response.data.data.anhBangLaiXe));
                }
                
                // Reset file đã chọn sau khi upload thành công
                setCanCuocFile(null);
                setBangLaiFile(null);
            } else {
                toast.error(response.data.message || "Cập nhật thất bại");
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật giấy tờ:", error);
            toast.error(error.response?.data?.message || "Đã xảy ra lỗi khi cập nhật giấy tờ");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Giấy tờ</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="canCuocCongDan">
                        Số căn cước công dân
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="canCuocCongDan"
                        type="text"
                        name="canCuocCongDan"
                        value={canCuocNumber}
                        onChange={handleCanCuocNumberChange}
                    />
                </div>
                
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                        Ảnh căn cước công dân
                    </label>
                    <input
                        className="hidden"
                        id="anhCanCuoc"
                        type="file"
                        accept="image/*"
                        onChange={handleCanCuocChange}
                    />
                    
                    <div className="mt-2 flex flex-col items-start space-y-3">
                        {/* Hiển thị ảnh preview nếu có */}
                        {canCuocPreview && (
                            <div className="relative border border-gray-300 rounded overflow-hidden">
                                <img
                                    src={canCuocPreview}
                                    alt="Căn cước công dân"
                                    className="max-w-xs h-auto object-contain"
                                    onError={(e) => {
                                        console.error("Lỗi tải ảnh căn cước:", canCuocPreview);
                                        // Thử hiển thị ảnh với base64 url nếu có
                                        if (canCuocFile) {
                                            const reader = new FileReader();
                                            reader.onloadend = () => {
                                                e.target.src = reader.result;
                                            }
                                            reader.readAsDataURL(canCuocFile);
                                        } else {
                                            e.target.style.display = 'none';
                                            toast.error("Không thể tải ảnh căn cước");
                                        }
                                    }}
                                />
                                {/* Hiển thị nút xóa ảnh nếu có ảnh */}
                                {canCuocPreview && (
                                    <button
                                        type="button"
                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                        onClick={() => {
                                            if (canCuocFile) {
                                                setCanCuocFile(null);
                                                setCanCuocPreview('');
                                            } else {
                                                // Xóa ảnh căn cước hiện tại trên server
                                                handleDeleteCanCuoc();
                                            }
                                        }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        )}
                        
                        <label
                            htmlFor="anhCanCuoc"
                            className="cursor-pointer bg-blue-500 text-white py-2 px-4 rounded text-center hover:bg-blue-600 inline-block"
                        >
                            {canCuocPreview ? "Thay đổi ảnh" : "Tải lên ảnh căn cước"}
                        </label>
                        
                        {canCuocFile && (
                            <p className="text-xs text-gray-500">Đã chọn: {canCuocFile.name}</p>
                        )}
                    </div>
                </div>
                
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                        Ảnh bằng lái xe
                    </label>
                    <input
                        className="hidden"
                        id="anhBangLaiXe"
                        type="file"
                        accept="image/*"
                        onChange={handleBangLaiChange}
                    />
                    
                    <div className="mt-2 flex flex-col items-start space-y-3">
                        {/* Hiển thị ảnh preview nếu có */}
                        {bangLaiPreview && (
                            <div className="relative border border-gray-300 rounded overflow-hidden">
                                <img
                                    src={bangLaiPreview}
                                    alt="Bằng lái xe"
                                    className="max-w-xs h-auto object-contain"
                                    onError={(e) => {
                                        console.error("Lỗi tải ảnh bằng lái:", bangLaiPreview);
                                        e.target.style.display = 'none';
                                        toast.error("Không thể tải ảnh bằng lái xe");
                                    }}
                                />
                                {/* Hiển thị nút xóa ảnh nếu có ảnh */}
                                <button
                                    type="button"
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                    onClick={() => {
                                        if (bangLaiFile) {
                                            setBangLaiFile(null);
                                            setBangLaiPreview('');
                                        } else {
                                            // Xóa ảnh bằng lái xe hiện tại trên server
                                            handleDeleteBangLai();
                                        }
                                    }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        )}
                        
                        <label
                            htmlFor="anhBangLaiXe"
                            className="cursor-pointer bg-gray-200 text-gray-700 py-2 px-4 rounded text-center hover:bg-gray-300 inline-block"
                        >
                            {bangLaiPreview ? "Thay đổi ảnh" : "Tải lên ảnh bằng lái"}
                        </label>
                        
                        {bangLaiFile && (
                            <p className="text-xs text-gray-500">Đã chọn: {bangLaiFile.name}</p>
                        )}
                    </div>
                </div>
                
                <div className="flex items-center justify-between">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Đang cập nhật..." : "Cập nhật giấy tờ"}
                    </button>
                </div>
            </form>
        </div>
    );
};

const BookingHistory = ({ user }) => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            setLoading(true);
            try {
                const response = await Api.get(`/client/don-hang/history`);
                if (response.data.status) {
                    setBookings(response.data.data);
                    console.log(response.data.data);
                } else {
                    toast.error(response.data.message || "Không thể tải lịch sử đơn hàng.");
                }
            } catch (error) {
                toast.error(error.response?.data?.message || "Lỗi khi tải lịch sử thuê xe.");
            } finally {
                setLoading(false);
            }
        };

        if (user?.id) {
            fetchBookings();
        } else {
            setLoading(false);
        }
    }, [user]);

    // Hàm chuyển đổi trạng thái đơn hàng sang chữ
    const getStatusText = (status) => {
        switch (status) {
            case 0: return "Trong giỏ hàng";
            case 1: return "Đã tạo đơn hàng";
            case 2: return "Đã thanh toán";
            case 3: return "Đã hủy";
            case 4: return "Đã hoàn thành";
            default: return "Không xác định";
        }
    };

    // Hàm chuyển đổi trạng thái thanh toán sang chữ
    const getPaymentStatusText = (status) => {
        switch (status) {
            case 0: return "Chưa thanh toán";
            case 1: return "Đã thanh toán";
            default: return "Không xác định";
        }
    };

    // Hàm chuyển đổi loại thanh toán sang chữ
    const getPaymentTypeText = (type) => {
        switch (type) {
            case 1: return "Tiền mặt";
            case 2: return "Chuyển khoản";
            case 3: return "Thẻ tín dụng";
            default: return "Không xác định";
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-center items-center h-40">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Lịch sử thuê xe</h2>
            
            {bookings.length === 0 ? (
                <p className="text-gray-500 italic text-center py-8">Bạn chưa có đơn hàng nào.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                        <thead className="bg-gray-100">
                            <tr className="text-center text-nowrap">
                                <th className="py-2 px-4 border-b text-center">Mã đơn hàng</th>
                                <th className="py-2 px-4 border-b text-center">Xe</th>
                                <th className="py-2 px-4 border-b text-center">Thời gian thuê</th>
                                <th className="py-2 px-4 border-b text-center">Thời gian trả</th>
                                <th className="py-2 px-4 border-b text-center">Tổng tiền</th>
                                <th className="py-2 px-4 border-b text-center">Trạng thái</th>
                                <th className="py-2 px-4 border-b text-center">Thanh toán</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map(booking => (
                                <tr key={booking.id} className="hover:bg-gray-50">
                                    <td className="py-2 px-4 border-b text-nowrap text-center">{booking.maDonHang}</td>
                                    <td className="py-2 px-4 border-b text-nowrap text-center">
                                        {booking.ChiTietDonHangs && booking.ChiTietDonHangs.length > 0 && booking.ChiTietDonHangs[0].Xe 
                                            ? booking.ChiTietDonHangs[0].Xe.tenXe 
                                            : 'N/A'}
                                    </td>
                                    <td className="py-2 px-4 border-b text-nowrap text-center">{new Date(booking.thoiGianBatDau).toLocaleString()}</td>
                                    <td className="py-2 px-4 border-b text-nowrap text-center">{new Date(booking.thoiGianKetThuc).toLocaleString()}</td>
                                    <td className="py-2 px-4 border-b text-nowrap text-center">{booking.thanhTien?.toLocaleString()} đ</td>
                                    <td className="py-2 px-4 border-b text-nowrap text-center">
                                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                                            booking.trangThai === 4 ? 'bg-green-100 text-green-800' : 
                                            booking.trangThai === 3 ? 'bg-red-100 text-red-800' : 
                                            booking.trangThai === 2 ? 'bg-blue-100 text-blue-800' : 
                                            booking.trangThai === 1 ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {getStatusText(booking.trangThai)}
                                        </span>
                                    </td>
                                    <td className="py-2 px-4 border-b text-nowrap text-center">
                                        <div className="flex flex-col">
                                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                                                booking.isThanhToan === 1 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {getPaymentStatusText(booking.isThanhToan)}
                                            </span>
                                            {booking.loaiThanhToan && (
                                                <span className="text-xs text-gray-500 mt-1">
                                                    ({getPaymentTypeText(booking.loaiThanhToan)})
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

const AvatarUpload = ({ user, onProfileDataChange }) => {
    const { setCurrentUser } = useAuth();
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setAvatarPreview(user?.anhDaiDien || DEFAULT_AVATAR);
    }, [user]);

    const handleAvatarChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     if (!avatarFile) {
    //         toast.warn("Vui lòng chọn một ảnh để tải lên.");
    //         return;
    //     }

    //     setLoading(true);
    //     try {
    //         const formData = new FormData();
    //         formData.append('anhDaiDien', avatarFile);

    //         const response = await Api.post(`/nguoi-dung/profile/upload-avatar`, formData, {
    //             headers: {
    //                 'Content-Type': 'multipart/form-data'
    //             }
    //         });

    //         if (response.data.status) {
    //             toast.success("Cập nhật ảnh đại diện thành công");
    //             const updatedUserData = response.data.data;
    //             setCurrentUser(prevUser => ({ ...prevUser, ...updatedUserData }));
    //             onProfileDataChange(updatedUserData);
    //             setAvatarFile(null);
    //         } else {
    //             toast.error(response.data.message || "Cập nhật thất bại");
    //         }
    //     } catch (error) {
    //         console.error("Lỗi khi cập nhật ảnh đại diện:", error);
    //         const message = error.response?.data?.message || "Đã xảy ra lỗi khi cập nhật ảnh đại diện";
    //         toast.error(message);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    // return (
    //     <div className="bg-white rounded-lg shadow-md p-6">
    //         <h2 className="text-xl font-semibold text-gray-800 mb-4">Cập nhật ảnh đại diện</h2>
    //         <form onSubmit={handleSubmit} className="flex flex-col items-center">
    //             <div className="mb-6 flex flex-col items-center">
    //                 <div className="w-40 h-40 rounded-full overflow-hidden mb-4 border-4 border-gray-200 shadow-sm">
    //                     <img
    //                         src={avatarPreview || DEFAULT_AVATAR}
    //                         alt=""
    //                         className="w-full h-full object-cover"
    //                         onError={(e) => {
    //                             e.target.onerror = null;
    //                             e.target.src = DEFAULT_AVATAR;
    //                         }}
    //                     />
    //                 </div>
    //                 <input
    //                     className="hidden"
    //                     id="anhDaiDien"
    //                     type="file"
    //                     accept="image/*"
    //                     onChange={handleAvatarChange}
    //                 />
    //                 <label
    //                     htmlFor="anhDaiDien"
    //                     className="cursor-pointer bg-blue-500 text-white py-2 px-4 rounded text-center hover:bg-blue-600 transition-colors"
    //                 >
    //                     {avatarFile ? "Thay đổi ảnh đã chọn" : "Chọn ảnh mới"}
    //                 </label>
    //                 {avatarFile && (
    //                     <p className="text-sm text-gray-500 mt-2">Đã chọn: {avatarFile.name}</p>
    //                 )}
    //             </div>
    //             <button
    //                 className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline transition-colors"
    //                 type="submit"
    //                 disabled={!avatarFile || loading}
    //             >
    //                 {loading ? "Đang cập nhật..." : "Cập nhật ảnh"}
    //             </button>
    //         </form>
    //     </div>
    // );
};

// Component Profile chính
const Profile = () => {
    const navigate = useNavigate();
    const { currentUser, isAuthenticated, loading: authLoading, refreshUserInfo, setCurrentUser, logout } = useAuth();
    const [activeTab, setActiveTab] = useState("profile");
    const [profileData, setProfileData] = useState(null);
    const [pageLoading, setPageLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            toast.info("Vui lòng đăng nhập để xem trang cá nhân.");
            navigate('/login');
        }
    }, [isAuthenticated, authLoading, navigate]);
    
    useEffect(() => {
        const fetchData = async () => {
            if (isAuthenticated && currentUser) {
                setProfileData(currentUser);
                setPageLoading(false);
            } else if (isAuthenticated && !currentUser) {
                setPageLoading(true);
                const success = await refreshUserInfo();
                if (!success) {
                    toast.error("Không thể tải thông tin người dùng. Vui lòng đăng nhập lại.");
                }
            }
        };
        
        if (!authLoading) {
            fetchData();
        }

    }, [isAuthenticated, currentUser, authLoading, refreshUserInfo, navigate]);

    useEffect(() => {
        if (currentUser) {
            setProfileData(currentUser);
            if(pageLoading) setPageLoading(false);
        }
    }, [currentUser]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const handleProfileDataChange = (updatedData) => {
        setProfileData(prev => ({ ...prev, ...updatedData }));
    };

    const renderContent = () => {
        if (!profileData) return null; 
        
        switch (activeTab) {
            case "profile":
                return <ProfileUpdate user={profileData} onProfileDataChange={handleProfileDataChange} />;
            case "documents":
                return <DocumentUpload user={profileData} onProfileDataChange={handleProfileDataChange} />;
            case "avatar":
                return <AvatarUpload user={profileData} onProfileDataChange={handleProfileDataChange} />;
            case "rentHistory":
                return <BookingHistory user={profileData} />;
            default:
                return <ProfileUpdate user={profileData} onProfileDataChange={handleProfileDataChange} />;
        }
    };

    if (authLoading || pageLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-700 text-lg">Đang tải thông tin trang cá nhân...</p>
            </div>
        );
    }

    if (!profileData) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
                <p className="text-red-500 text-lg mb-4">Không thể tải thông tin người dùng.</p>
                <button
                    className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    onClick={() => navigate('/login')}
                >
                    Đăng nhập lại
                </button>
            </div>
        );
    }
    
    return (
        <div className="max-w-6xl mx-auto p-4 md:p-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center pb-4 mb-6 border-b border-gray-300">
                <h1 className="text-3xl font-bold text-gray-800">
                    {activeTab === "profile" && "Thông Tin Cá Nhân"}
                    {activeTab === "documents" && "Giấy Tờ Cá Nhân"}
                    {activeTab === "rentHistory" && "Lịch Sử Thuê Xe"}
                </h1>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
                {/* Sidebar */}
                <div className="md:w-1/3 lg:w-1/4">
                    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                        <div className="flex flex-col items-center mb-4">
                            <div className="relative">
                                <img
                                    src={profileData.anhDaiDien || DEFAULT_AVATAR}
                                    alt="Avatar"
                                    className="w-32 h-32 rounded-full object-cover border-4 border-blue-200 shadow-md"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = DEFAULT_AVATAR;
                                    }}
                                />
                                <button 
                                    className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-all transform hover:scale-110 shadow-md"
                                    onClick={() => setActiveTab("avatar")}
                                    title="Đổi ảnh đại diện"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                                        <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div className="text-center mb-4">
                            <h3 className="text-xl font-semibold text-gray-800">{profileData.hoTen || 'Chưa cập nhật'}</h3>
                            <p className="text-sm text-gray-500">{profileData.email}</p>
                            {profileData.ChucVu && (
                                <div className="mt-3">
                                    <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2 py-1 rounded-full">{profileData.ChucVu.tenChucVu}</span>
                                </div>
                            )}
                        </div>
                         <button
                            onClick={() => {
                                logout();
                                toast.success("Đã đăng xuất thành công!");
                            }}
                            className="w-full mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors flex items-center justify-center"
                        >
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                            </svg>
                            Đăng xuất
                        </button>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <ul className="divide-y divide-gray-200">
                            {[
                                {key: "profile", label: "Thông tin cá nhân"},
                                {key: "documents", label: "Giấy tờ"},
                                // {key: "avatar", label: "Ảnh đại diện"},
                                {key: "rentHistory", label: "Lịch sử thuê xe"}
                            ].map(tab => (
                                <li
                                    key={tab.key}
                                    className={`px-4 py-3 cursor-pointer transition-colors duration-150 ease-in-out flex items-center ${activeTab === tab.key ? "bg-blue-500 text-white font-semibold" : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"}`}
                                    onClick={() => handleTabChange(tab.key)}
                                >
                                    {tab.label}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Main Content */}
                <div className="md:w-2/3 lg:w-3/4">
                    <div className="bg-white rounded-xl shadow-lg p-6 min-h-[400px]">
                        {renderContent()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
