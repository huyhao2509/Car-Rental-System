import React, { useEffect, useState } from 'react';
import { Search, Filter, Download, Plus, Edit, Trash2, CheckCircle, XCircle, AlertCircle, Shield, Users } from 'lucide-react';
import axios from 'axios';
import Api from '@/utils/Api';
import { toast } from 'react-toastify';

const DashboardManageRoles = () => {
    // State cho active tab
    const [activeTab, setActiveTab] = useState('positions');

    // State cho chức vụ
    const [positions, setPositions] = useState([]);

    const [showAddModalDelete, setShowAddModalDelete] = useState(false);
    const [chucVuDelete, setChucVuDelete] = useState(null);


    // State cho chức năng
    const [functions, setFunctions] = useState([
        { id: 1, tenChucNang: 'Quản lý người dùng', maChucNang: 'USER_MANAGE', moTa: 'Quản lý tài khoản người dùng trong hệ thống', trangThai: 'active' },
        { id: 2, tenChucNang: 'Quản lý xe', maChucNang: 'CAR_MANAGE', moTa: 'Quản lý danh sách xe trong hệ thống', trangThai: 'active' },
        { id: 3, tenChucNang: 'Đặt xe', maChucNang: 'BOOKING', moTa: 'Đặt và quản lý đơn đặt xe', trangThai: 'active' },
        { id: 4, tenChucNang: 'Phân quyền', maChucNang: 'ROLE_MANAGE', moTa: 'Phân quyền người dùng', trangThai: 'active' },
        { id: 5, tenChucNang: 'Báo cáo thống kê', maChucNang: 'REPORT', moTa: 'Xem báo cáo và thống kê', trangThai: 'inactive' }
    ]);

    // State cho phân quyền
    const [rolePermissions, setRolePermissions] = useState([]);

    // State chung
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        tenChucVu: '',
        trangThai: 1
    });

    // Reset form
    const resetForm = () => {
        setFormData({
            tenChucVu: '',
            trangThai: 1
        });
    };

    // Xử lý thay đổi form
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Xử lý submit form
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (activeTab === 'positions') {
            if (editingItem) {
                updateChucVu();
            } else {
                themMoiChucVu();
            }
        } else if (activeTab === 'functions') {
            if (editingItem) {
                setFunctions(functions.map(func => 
                    func.id === editingItem.id ? { ...formData, id: func.id } : func
                ));
            } else {
                const newId = Math.max(...functions.map(func => func.id)) + 1;
                setFunctions([...functions, { ...formData, id: newId }]);
            }
        }

        setShowAddModal(false);
        resetForm();
    };

    // Xử lý xóa
    const handleDelete = (id) => {
        if (activeTab === 'positions') {
            setShowAddModalDelete(true);
            setChucVuDelete(id);
        } else if (activeTab === 'functions') {
            setShowAddModalDelete(true);
            // setChucNangDelete(id);
        }
    };

    // Xử lý xóa
    const handleDeleteConfirm = async (e) => {
        e.preventDefault();
        if (activeTab === 'positions') {
            xoaChucVu();
        } else if (activeTab === 'functions') {
            // xoaChucNang();
        }
    }

    // Hiển thị trạng thái
    const renderStatus = (status, id, type = 1) => {
        switch (status) {
            case 1:
                return (
                    <span onClick={() => type === 1 ? changeStatusChucVu(id) : changeStatusChucNang(id)} className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 flex items-center min-w-[160px] justify-center">
                        <CheckCircle className="w-3 h-3 mr-1" /> Hoạt động
                    </span>
                );
            case 0:
                return (
                    <span onClick={() => type === 1 ? changeStatusChucVu(id) : changeStatusChucNang(id)} className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 flex items-center min-w-[160px] justify-center">
                        <XCircle className="w-3 h-3 mr-1" /> Ngừng hoạt động
                    </span>
                );
            default:
                return status;
        }
    };

    // Xử lý thay đổi quyền
    const handlePermissionChange = (roleId, functionId, checked) => {
        setRolePermissions(rolePermissions.map(role => {
            if (role.id === roleId) {
                return {
                    ...role,
                    chucNang: role.chucNang.map(func => 
                        func.id === functionId ? { ...func, checked } : func
                    )
                };
            }
            return role;
        }));
    };

    // BEGIN CHỨC VỤ
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
    
    const themMoiChucVu = async () => {
        try {
            const res = await Api.post('/admin/chuc-vu/create', formData)
            if (res.data.status) {
                toast.success(res.data.message);
                setShowAddModal(false);
                getDataChucVus();
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            toast.error("Đã có lỗi xảy ra!");
        }
    }

    const updateChucVu = async () => {
        try {
            const res = await Api.post(`/admin/chuc-vu/update`, formData)
            if (res.data.status) {
                toast.success(res.data.message);
                setShowAddModal(false);
                getDataChucVus();
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            toast.error("Đã có lỗi xảy ra!");
        }
    }

    const xoaChucVu = async () => {
        try {
            const res = await Api.get(`/admin/chuc-vu/delete/${chucVuDelete}`)
            if (res.data.status) {
                toast.success(res.data.message);
                getDataChucVus();
                setShowAddModalDelete(false);
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            toast.error("Đã có lỗi xảy ra!");
        }
    }

    const changeStatusChucVu = async (id) => {
        try {
            const res = await Api.get(`/admin/chuc-vu/change-status/${id}`)
            if (res.data.status) {
                toast.success(res.data.message);
                getDataChucVus();
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            toast.error("Đã có lỗi xảy ra!");
        }
    }
    // END CHỨC VỤ

    // BEGIN CHỨC NĂNG
    const getDataChucNangs = async () => {
        try {
            const res = await Api.get('/admin/chuc-vu/get-all-chuc-nang')
            setFunctions(res.data.data);
        } catch (error) {
            console.error('Error fetching data:', error);   
        }
    }

    const changeStatusChucNang = async (id) => {
        try {
            const res = await Api.get(`/admin/chuc-vu/change-status-chuc-nang/${id}`)
            if (res.data.status) {
                toast.success(res.data.message);
                getDataChucNangs();
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            toast.error("Đã có lỗi xảy ra!");
        }
    }

    // END CHỨC NĂNG
    useEffect(() => {
        getDataChucVus();
        getDataChucNangs();
    }, []);
    // Render nội dung tab
    const renderTabContent = () => {
        switch (activeTab) {
            case 'positions':
                return (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h1 className="text-2xl font-bold text-gray-800">Quản lý chức vụ</h1>
                            <div className="flex space-x-2">
                                <button
                                    className="bg-blue-50 text-blue-600 px-6 py-2 rounded-lg font-medium border border-blue-100 flex items-center hover:bg-blue-100 transition duration-300 min-w-[160px]"
                                    onClick={() => {
                                        setEditingItem(null);
                                        resetForm();
                                        setShowAddModal(true);
                                    }}
                                >
                                    <Plus className="w-4 h-4 mr-1" />
                                    Thêm chức vụ mới
                                </button>
                            </div>
                        </div>

                        {/* Bảng danh sách chức vụ */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gray-50 text-left text-gray-500 text-xs uppercase">
                                            <th className="py-4 px-4 font-medium">STT</th>
                                            <th className="py-4 px-4 font-medium">Tên chức vụ</th>
                                            <th className="py-4 px-4 font-medium text-center w-32">Trạng thái</th>
                                            <th className="py-4 px-4 font-medium text-center">Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {positions && positions.length > 0 && positions.map((position, index) => (
                                            <tr key={position.id} className="hover:bg-gray-50">
                                                <td className="py-3 px-4 text-sm">{index + 1}</td>
                                                <td className="py-3 px-4 text-sm font-medium">{position.tenChucVu}</td>
                                                <td className="py-3 px-4 text-sm text-center">{renderStatus(position.trangThai, position.id)}</td>
                                                <td className="py-3 px-4 text-sm text-center">
                                                    <div className="flex space-x-2 justify-center">
                                                        <button 
                                                            className="text-blue-600 hover:text-blue-800"
                                                            onClick={() => {
                                                                setEditingItem(position);
                                                                setFormData({ ...position });
                                                                setShowAddModal(true);
                                                            }}
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                        <button 
                                                            className="text-red-600 hover:text-red-800"
                                                            onClick={() => handleDelete(position.id)}
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                );

            case 'functions':
                return (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h1 className="text-2xl font-bold text-gray-800">Quản lý chức năng</h1>
                        </div>

                        {/* Bảng danh sách chức năng */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gray-50 text-left text-gray-500 text-xs uppercase">
                                            <th className="py-4 px-4 font-medium">STT</th>
                                            <th className="py-4 px-4 font-medium">Tên chức năng</th>
                                            <th className="py-4 px-4 font-medium text-center w-32">Trạng thái</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {functions && functions.length > 0 && functions.map((func, index) => (
                                            <tr key={func.id} className="hover:bg-gray-50">
                                                <td className="py-3 px-4 text-sm">{index + 1}</td>
                                                <td className="py-3 px-4 text-sm font-medium flex items-center">
                                                    <Shield className="w-4 h-4 mr-2 text-gray-400" />
                                                    {func.tenChucNang}
                                                </td>
                                                <td className="py-3 px-4 text-sm text-center">{renderStatus(func.trangThai, func.id, 2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                );

            case 'permissions':
                return (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h1 className="text-2xl font-bold text-gray-800">Phân quyền</h1>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gray-50 text-left text-gray-500 text-xs uppercase">
                                            <th className="py-4 px-4 font-medium">Chức năng</th>
                                            {positions && positions.length > 0 && positions.map(role => (
                                                <th key={role.id} className="py-4 px-4 font-medium text-center">
                                                    {role.tenChucVu}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {functions.map(func => (
                                            <tr key={func.id} className="hover:bg-gray-50">
                                                <td className="py-3 px-4 text-sm font-medium flex items-center">
                                                    <Shield className="w-4 h-4 mr-2 text-gray-400" />
                                                    {func.tenChucNang}
                                                </td>
                                                {positions && positions.length > 0 && positions.map(role => (
                                                    <td key={role.id} className="py-3 px-4 text-sm text-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={
                                                                (rolePermissions[role.id] && rolePermissions[role.id][func.id]) || false
                                                            }
                                                            onChange={e => {
                                                                setRolePermissions(prev => ({
                                                                    ...prev,
                                                                    [role.id]: {
                                                                        ...prev[role.id],
                                                                        [func.id]: e.target.checked
                                                                    }
                                                                }));
                                                            }}
                                                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                                        />
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="space-y-6">
            {/* Tabs */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab('positions')}
                        className={`${
                            activeTab === 'positions'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                    >
                        <Users className="w-4 h-4 mr-2" />
                        Chức vụ
                    </button>
                    <button
                        onClick={() => setActiveTab('functions')}
                        className={`${
                            activeTab === 'functions'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                    >
                        <Shield className="w-4 h-4 mr-2" />
                        Chức năng
                    </button>
                    <button
                        onClick={() => setActiveTab('permissions')}
                        className={`${
                            activeTab === 'permissions'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                    >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Phân quyền
                    </button>
                </nav>
            </div>

            {/* Tab content */}
            {renderTabContent()}

            {/* Modal thêm/sửa */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>&#8203;
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <form onSubmit={handleSubmit}>
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="mb-4">
                                        <h3 className="text-lg font-medium text-gray-900">
                                            {editingItem ? 'Chỉnh sửa' : 'Thêm mới'} {activeTab === 'positions' ? 'chức vụ' : 'chức năng'}
                                        </h3>
                                    </div>
                                    <div className="space-y-4">
                                        {activeTab === 'positions' ? (
                                            <>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Tên chức vụ
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="tenChucVu"
                                                        value={formData.tenChucVu}
                                                        onChange={handleChange}
                                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Trạng thái
                                                    </label>
                                                    <select
                                                        name="trangThai"
                                                        value={formData.trangThai}
                                                        onChange={handleChange}
                                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                                    >
                                                        <option value="active">Hoạt động</option>
                                                        <option value="inactive">Ngừng hoạt động</option>
                                                    </select>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Tên chức năng
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="tenChucNang"
                                                        value={formData.tenChucNang}
                                                        onChange={handleChange}
                                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Mã chức năng
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="maChucNang"
                                                        value={formData.maChucNang}
                                                        onChange={handleChange}
                                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                                        required
                                                    />
                                                    <p className="mt-1 text-xs text-gray-500">
                                                        Mã chức năng nên viết dạng UPPERCASE_WITH_UNDERSCORE
                                                    </p>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Mô tả
                                                    </label>
                                                    <textarea
                                                        name="moTa"
                                                        value={formData.moTa}
                                                        onChange={handleChange}
                                                        rows="3"
                                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                                    ></textarea>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Trạng thái
                                                    </label>
                                                    <select
                                                        name="trangThai"
                                                        value={formData.trangThai}
                                                        onChange={handleChange}
                                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                                    >
                                                        <option value="active">Hoạt động</option>
                                                        <option value="inactive">Ngừng hoạt động</option>
                                                    </select>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button
                                        type="submit"
                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-6 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm min-w-[120px]"
                                    >
                                        {editingItem ? 'Cập nhật' : 'Thêm mới'}
                                    </button>
                                    <button
                                        type="button"
                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-6 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm min-w-[120px]"
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

            {/* Modal xoá chức vụ */}
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
        </div>
    );
};

export default DashboardManageRoles; 