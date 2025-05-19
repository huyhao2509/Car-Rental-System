import React, { useEffect, useState } from 'react';
import { Search, Filter, Download, Plus, Edit, Trash2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';
import Api from '@/utils/Api';
import { toast } from 'react-toastify';

const DashboardManageCarTypes = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [carTypes, setCarTypes] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingCarType, setEditingCarType] = useState(null);
    const [showAddModalDelete, setShowAddModalDelete] = useState(false);
    const [carTypeDelete, setCarTypeDelete] = useState(null);

    const [formData, setFormData] = useState({
        tenLoaiXe: '',
        trangThai: 1
    });

    const getDataCarTypes = async () => {
        const res = await Api.get(`admin/loai-xe/get-all`);
        setCarTypes(res.data.data);
    }

    useEffect(() => {
        getDataCarTypes();
    }, []);

    const filteredCarTypes = carTypes && carTypes.length > 0 ? carTypes.filter(carType => {
        if (searchTerm && !carType.tenLoaiXe.toLowerCase().includes(searchTerm.toLowerCase())) {
            return false;
        }
        return true;
    }) : [];

    const resetForm = () => {
        setFormData({
            tenLoaiXe: '',
            trangThai: 1
        });
    };

    const openEditModal = (carType) => {
        setEditingCarType(carType);
        setFormData({ ...carType });
        setShowAddModal(true);
    };

    const openAddModal = () => {
        setEditingCarType(null);
        resetForm();
        setShowAddModal(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editingCarType) {
            const res = await Api.post(`admin/loai-xe/update`, formData);
            if (res.data.status) {
                toast.success(res.data.message);
                setCarTypes(carTypes.map(carType => carType.id === editingCarType.id ? { ...formData, id: carType.id } : carType));
                setShowAddModal(false);
                resetForm();
            } else {
                toast.error(res.data.message);
            }
        } else {
            const res = await Api.post(`admin/loai-xe/create`, formData);
            if (res.data.status) {
                toast.success(res.data.message);
                getDataCarTypes();
                setShowAddModal(false);
                resetForm();
            } else {
                toast.error(res.data.message);
            }
        }
       
    };

    const handleDeleteConfirm = async (e) => {
        e.preventDefault();
        const res = await Api.delete(`admin/loai-xe/delete/${carTypeDelete.id}`);
        if (res.data.status) {
            toast.success(res.data.message);
            setShowAddModalDelete(false);
            getDataCarTypes();
        } else {
            toast.error(res.data.message);
        }
    };

    const handleDelete = (carType) => {
        setShowAddModalDelete(true);
        setCarTypeDelete(carType);
    };

    const handleChangeStatus = async (id) => {
        const res = await Api.get(`admin/loai-xe/change-status/${id}`);
        if (res.data.status) {
            getDataCarTypes();
            toast.success(res.data.message);
        } else {
            toast.error(res.data.message);
        }
    }

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
                    <span onClick={() => handleChangeStatus(id)} className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 flex items-center">
                        <XCircle className="w-3 h-3 mr-1" /> Ngừng hoạt động
                    </span>
                );
            default:
                return status;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Quản lý loại xe</h1>
                <div className="flex space-x-2">
                    <button
                        className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg font-medium border border-blue-100 flex items-center hover:bg-blue-100 transition duration-300"
                        onClick={() => openAddModal()}
                    >
                        <Plus className="w-4 h-4 mr-1" />
                        Thêm loại xe mới
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
                            placeholder="Tìm kiếm theo tên hoặc mô tả loại xe..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Bảng danh sách loại xe */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 text-left text-gray-500 text-xs uppercase">
                                <th className="py-4 px-4 font-medium">ID</th>
                                <th className="py-4 px-4 font-medium">Tên loại xe</th>
                                <th className="py-4 px-4 font-medium text-center w-32">Trạng thái</th>
                                <th className="py-4 px-4 font-medium text-center">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredCarTypes.map(carType => (
                                <tr key={carType.id} className="hover:bg-gray-50">
                                    <td className="py-3 px-4 text-sm">{carType.id}</td>
                                    <td className="py-3 px-4 text-sm font-medium">{carType.tenLoaiXe}</td>
                                    <td className="py-3 px-4 text-sm text-center">{renderStatus(carType.trangThai, carType.id)}</td>
                                    <td className="py-3 px-4 text-sm text-center">
                                        <div className="flex space-x-2 justify-center">
                                            <button 
                                                className="text-blue-600 hover:text-blue-800"
                                                onClick={() => openEditModal(carType)}
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button 
                                                className="text-red-600 hover:text-red-800"
                                                onClick={() => handleDelete(carType)}
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

            {/* Modal thêm/sửa loại xe */}
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
                                            {editingCarType ? 'Chỉnh sửa loại xe' : 'Thêm loại xe mới'}
                                        </h3>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Tên loại xe
                                            </label>
                                            <input
                                                type="text"
                                                name="tenLoaiXe"
                                                value={formData.tenLoaiXe}
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
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button
                                        type="submit"
                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                                    >
                                        {editingCarType ? 'Cập nhật' : 'Thêm mới'}
                                    </button>
                                    <button
                                        type="button"
                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                                        onClick={() => {
                                            setShowAddModal(false);
                                            resetForm();
                                        }}
                                    >
                                        Hủy
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal xoá hãng xe */}
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
                                        Bạn có chắc muốn xóa loại xe này?
                                    </h3>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button
                                        type="submit"
                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                                    >
                                        Xoá loại xe
                                    </button>
                                    <button
                                        type="button"
                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
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

export default DashboardManageCarTypes; 