import React, { useEffect, useState } from 'react';
import { Search, Filter, Download, Plus, Edit, Trash2, Eye, CheckCircle, XCircle, AlertCircle, Mail, Phone, Calendar, MapPin, Key } from 'lucide-react';
import Api from '@/utils/Api';
import { toast } from 'react-toastify';

export default function DashboardUsers() {
    // State for users data
    const [users, setUsers] = useState([]);
    const [showAddModalDelete, setShowAddModalDelete] = useState(false);

    // State for search and filter
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    // State for modals
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [userIdDelete, setUserIdDelete] = useState(null);
    const [showEditPasswordModal, setShowEditPasswordModal] = useState(false);
    const [password_new, setPassword_new] = useState('');
    const [positions, setPositions] = useState([]);

    // Form state for adding/editing users

    const getDataChucVus = async () => {
        try {
            await Api.get('/admin/chuc-vu/get-all')
                    .then((res) => {
                        setPositions(res.data.data);
                    })
                    .catch((err) => {
                        console.log(err);
                    })
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const [formData, setFormData] = useState({
        hoTen: '',
        email: '',
        soDienThoai: '',
        trangThai: 1,
        anhBangLaiXe: false
    });

    // Filter users based on search and filter criteria
    const filteredUsers = users && users.length > 0 ? users.filter(user => {
        if (filterStatus !== 'all' && user.trangThai !== filterStatus) {
            return false;
        }

        if (searchTerm && !user.hoTen.toLowerCase().includes(searchTerm.toLowerCase()) &&
            !user.email.toLowerCase().includes(searchTerm.toLowerCase()) &&
            !user.soDienThoai.includes(searchTerm)) {
            return false;
        }
        return true;
    }) : [];

    // Reset form
    const resetForm = () => {
        setFormData({
            hoTen: '',
            email: '',
            soDienThoai: '',
            trangThai: 1,
            anhBangLaiXe: false
        });
    };

    // Open edit modal
    const openEditModal = (user) => {
        setEditingUser(user);
        setFormData({ ...user });
        setShowAddModal(true);
    };

    // Open add modal
    const openAddModal = () => {
        setEditingUser(null);
        resetForm();
        setShowAddModal(true);
    };

    // Handle form change
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleChangePassword = (e) => {
        const { password_new } = e.target;
        setEditingUser(prev => ({
            ...prev,
            password_new: password_new
        }));
    };

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editingUser) {
            try {
                const res = await Api.post(`/admin/nguoi-dung/update`, formData);
                if (res.data.status) {
                    toast.success(res.data.message);
                    getDataNguoiDung();
                    setShowAddModal(false);
                    resetForm();
                } else {
                    toast.error(res.data.message);
                }
            } catch (error) {
                toast.error(error.data.message ?? "Đã có lỗi xảy ra!");
            }
        } else {
            try {
                const res = await Api.post('/admin/nguoi-dung/create', formData);
                if (res.data.status) {
                    toast.success(res.data.message);
                    getDataNguoiDung();
                    setShowAddModal(false);
                    resetForm();
                } else {
                    toast.error(res.data.message);
                }
            } catch (error) {
                toast.error(error.data.message ?? "Đã có lỗi xảy ra!");
            }
        }

        setShowAddModal(false);
        resetForm();
    };

    // Handle delete user
    const handleDelete = (id) => {
        setShowAddModalDelete(true);
        setUserIdDelete(id);
    };

    const handleChangeStatus = async (id) => {
        const res = await Api.get(`/admin/nguoi-dung/change-status/${id}`);
        if (res.data.status) {
            getDataNguoiDung();
            toast.success(res.data.message);
        } else {
            toast.error(res.data.message);
        }
    }


    const handleDeleteConfirm = async (e) => {
        e.preventDefault();
        const res = await Api.get(`/admin/nguoi-dung/delete/${userIdDelete}`);
        if (res.data.status) {
            toast.success(res.data.message);
            getDataNguoiDung();
            setShowAddModalDelete(false);
        } else {
            toast.error(res.data.message);
        }
    }

    const handleEditPassword = async (e) => {
        e.preventDefault();
        var payload = {
            password_new: password_new,
            id          : editingUser.id
        }
        const res = await Api.post(`/admin/nguoi-dung/change-password`, payload);
        if (res.data.status) {
            toast.success(res.data.message);
            setShowEditPasswordModal(false);
            setPassword_new('');
        } else {
            toast.error(res.data.message);
        }
    }

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    };

    // Render user status
    const renderStatus = (status, id) => {
        switch (status) {
            case 1:
                return (
                    <span onClick={() => handleChangeStatus(id)} className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 flex items-center">
                        <CheckCircle className="w-3 h-3 mr-1" /> Hoạt động
                    </span>
                );
            case 0:
                return (
                    <span onClick={() => handleChangeStatus(id)} className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" /> Chờ xác nhận
                    </span>
                );
            case 2:
                return (
                    <span onClick={() => handleChangeStatus(id)} className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 flex items-center">
                        <XCircle className="w-3 h-3 mr-1" /> Đã khóa
                    </span>
                );
            default:
                return status;
        }
    };

    const getDataNguoiDung = async () => {
        const response = await Api.get('/admin/nguoi-dung/get-all');
        setUsers(response.data.data);
    }

    const openEditPasswordModal = (user) => {
        setEditingUser(user);
        setShowEditPasswordModal(true);
    }

    useEffect(() => {
        getDataNguoiDung();
        getDataChucVus();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Quản lý người dùng</h1>
                <div className="flex space-x-2">
                    <button
                        className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg font-medium border border-blue-100 flex items-center hover:bg-blue-100 transition duration-300"
                        onClick={() => openAddModal()}
                    >
                        <Plus className="w-4 h-4 mr-1" />
                        Thêm người dùng
                    </button>
                    <button className="bg-gray-50 text-gray-600 px-4 py-2 rounded-lg font-medium border border-gray-100 flex items-center hover:bg-gray-100 transition duration-300">
                        <Download className="w-4 h-4 mr-1" />
                        Xuất danh sách
                    </button>
                </div>
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
                            placeholder="Tìm kiếm theo tên, email, số điện thoại..."
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
                            <option value="1">Hoạt động</option>
                            <option value="2">Đã khóa</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Bảng danh sách người dùng */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 text-left text-gray-500 text-xs uppercase">
                                <th className="py-4 px-4 font-medium">STT</th>
                                <th className="py-4 px-4 font-medium">Tên người dùng</th>
                                <th className="py-4 px-4 font-medium">Email</th>
                                <th className="py-4 px-4 font-medium">Số điện thoại</th>
                                <th className="py-4 px-4 font-medium">Ngày tham gia</th>
                                <th className="py-4 px-4 font-medium">Số lần thuê</th>
                                <th className="py-4 px-4 font-medium">Trạng thái</th>
                                <th className="py-4 px-4 font-medium">GPLX</th>
                                <th className="py-4 px-4 font-medium">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user, index) => (
                                    <tr key={user.id} className="border-t border-gray-100">
                                        <td className="py-4 px-4 font-medium">{index + 1}</td>
                                        <td className="py-4 px-4">{user.hoTen}</td>
                                        <td className="py-4 px-4">{user.email}</td>
                                        <td className="py-4 px-4">{user.soDienThoai}</td>
                                        <td className="py-4 px-4">{formatDate(user.thoiGianTao)}</td>
                                        <td className="py-4 px-4">{user.rentals}</td>
                                        <td className="py-4 px-4">{renderStatus(user.trangThai, user.id)}</td>
                                        <td className="py-4 px-4">
                                            {user.anhBangLaiXe ?
                                                <span className="text-green-600"><CheckCircle className="w-5 h-5" /></span> :
                                                <span className="text-red-600"><XCircle className="w-5 h-5" /></span>}
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex space-x-2">
                                                <button
                                                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                                    title="Xem chi tiết"
                                                    onClick={() => openEditPasswordModal(user)}
                                                >
                                                    <Key className="w-4 h-4" />
                                                </button>
                                                <button
                                                    className="p-1 text-green-600 hover:bg-green-50 rounded"
                                                    title="Chỉnh sửa"
                                                    onClick={() => openEditModal(user)}
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                                                    title="Xóa"
                                                    onClick={() => handleDelete(user.id)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="10" className="py-8 text-center text-gray-500">
                                        Không tìm thấy người dùng nào phù hợp
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Phân trang */}
                <div className="py-4 px-6 border-t border-gray-100 flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                        {users && users.length > 0 ? `Hiển thị ${filteredUsers.length} / ${users.length} người dùng` : 'Không có người dùng'}
                    </div>
                    <div className="flex space-x-1">
                        <button className="px-3 py-1 border border-gray-300 rounded text-sm bg-white text-gray-500 hover:bg-gray-50">
                            Trước
                        </button>
                        <button className="px-3 py-1 border border-blue-600 rounded text-sm bg-blue-600 text-white">
                            1
                        </button>
                        <button className="px-3 py-1 border border-gray-300 rounded text-sm bg-white text-gray-500 hover:bg-gray-50">
                            Sau
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal thêm/sửa người dùng */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>

                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <form onSubmit={handleSubmit}>
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="mb-4">
                                        <h3 className="text-lg font-medium text-gray-900">
                                            {editingUser ? 'Chỉnh sửa thông tin người dùng' : 'Thêm người dùng mới'}
                                        </h3>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                                Họ tên
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    name="hoTen"
                                                    id="hoTen"
                                                    required
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                                    value={formData.hoTen}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                                Email
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                    <Mail className="w-5 h-5 text-gray-400" />
                                                </div>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    id="email"
                                                    required
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-4 py-2.5"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                                Số điện thoại
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                    <Phone className="w-5 h-5 text-gray-400" />
                                                </div>
                                                <input
                                                    type="tel"
                                                    name="soDienThoai"
                                                    id="soDienThoai"
                                                    required
                                                    pattern="[0-9]{10}"
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-4 py-2.5"
                                                    value={formData.soDienThoai}
                                                    onChange={handleChange}
                                                    placeholder="0901234567"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="trangThai" className="block text-sm font-medium text-gray-700 mb-1">
                                                Trạng thái
                                            </label>
                                            <select
                                                name="trangThai"
                                                id="trangThai"
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                                value={formData.trangThai}
                                                onChange={handleChange}
                                            >
                                                <option value="1">Hoạt động</option>
                                                <option value="0">Chờ xác nhận</option>
                                                <option value="2">Đã khóa</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label htmlFor="idChucVu" className="block text-sm font-medium text-gray-700 mb-1">
                                                Chức Vụ
                                            </label>
                                            <select
                                                name="idChucVu"
                                                id="idChucVu"
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                                value={formData.idChucVu}
                                                onChange={handleChange}
                                            >
                                                {positions.map((chucVu) => (
                                                    <option key={chucVu.id} value={chucVu.id}>
                                                        {chucVu.tenChucVu}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                name="anhBangLaiXe"
                                                id="anhBangLaiXe"
                                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                                checked={formData.anhBangLaiXe}
                                                onChange={handleChange}
                                            />
                                            <label htmlFor="licenseVerified" className="ml-2 text-sm font-medium text-gray-700">
                                                Đã xác minh giấy phép lái xe
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button type="submit"
                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                                    >
                                        {editingUser ? 'Cập nhật' : 'Thêm mới'}
                                    </button>
                                    <button
                                        type="button"
                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                        onClick={() => setShowAddModal(false)}
                                    >
                                        Hủy
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal xoá */}
            {showAddModalDelete && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>&#8203;
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <form onSubmit={handleDeleteConfirm}>
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <h3 className="text-lg font-medium text-gray-900">
                                        Bạn có chắc muốn xóa chức vụ này?
                                    </h3>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button
                                        type="submit"
                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-6 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm min-w-[120px]"
                                    >
                                        Xoá chức vụ
                                    </button>
                                    <button
                                        type="button"
                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-6 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm min-w-[120px]"
                                        onClick={() => setShowAddModalDelete(false)}
                                    >
                                        Hủy
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Đổi mật khẩu */}
            {showEditPasswordModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>&#8203;
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <form onSubmit={handleEditPassword}>
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="mb-4">
                                        <h3 className="text-lg font-medium text-gray-900">
                                            Đổi mật khẩu cho người dùng
                                        </h3>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                                Mật Khẩu Mới
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    name="password_new"
                                                    id="password_new"
                                                    required
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                                    value={password_new}
                                                    onChange={(e) => setPassword_new(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button
                                        type="submit"
                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-6 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm min-w-[120px]"
                                    >
                                        Đổi mật khẩu
                                    </button>
                                    <button
                                        type="button"
                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-6 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm min-w-[120px]"
                                        onClick={() => setShowEditPasswordModal(false)}
                                    >
                                        Hủy
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
