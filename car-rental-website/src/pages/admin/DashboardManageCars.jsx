import React, { useEffect, useState } from 'react';
import { Search, Filter, Download, Plus, Edit, Trash2, Eye, CheckCircle, XCircle, AlertCircle, UserCheck } from 'lucide-react';
import axios from 'axios';
import Api from '@/utils/Api';
import { toast } from 'react-toastify';

const DashboardManageCars = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [cars, setCars] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingCar, setEditingCar] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [carToDelete, setCarToDelete] = useState(null);
    
    // Mock data cho hãng xe và loại xe
    const [brands, setBrands] = useState([]);
    
    const [carTypes, setCarTypes] = useState([]);

    // Form state cho thêm/sửa xe
    const [formData, setFormData] = useState({
        tenXe: '',
        bienSoXe: '',
        idHangXe: 1,
        idLoaiXe: 1,
        namSanXuat: new Date().getFullYear(),
        sucChua: 5,
        nhienlieu: 'Xăng',
        giaTheoNgay: 1000000,
        giaTheoGio: 100000,
        trangThai: 1,
        hinhAnh: ''
    });

    // Lọc danh sách xe
    const filteredCars = cars && cars.length > 0 ? cars.filter(car => {
        // Lọc theo trạng thái
        if (filterStatus !== 'all' && car.trangThai !== parseInt(filterStatus)) {
            return false;
        }

        // Tìm kiếm theo tên xe hoặc biển số
        if (searchTerm && !car.tenXe.toLowerCase().includes(searchTerm.toLowerCase()) &&
            !car.bienSoXe.toLowerCase().includes(searchTerm.toLowerCase())) {
            return false;
        }
        return true;
    }) : [];

    // Reset form
    const resetForm = () => {
        setFormData({
            tenXe: '',
            bienSoXe: '',
            idHangXe: 1,
            idLoaiXe: 1,
            namSanXuat: new Date().getFullYear(),
            sucChua: 5,
            nhienlieu: 'Xăng',
            giaTheoNgay: 1000000,
            giaTheoGio: 100000,
            trangThai: 1,
            hinhAnh: ''
        });
    };

    // Mở modal chỉnh sửa
    const openEditModal = (car) => {
        setEditingCar(car);
        setFormData({ ...car });
        setShowAddModal(true);
    };

    // Mở modal thêm xe
    const openAddModal = () => {
        setEditingCar(null);
        resetForm();
        setShowAddModal(true);
    };

    // Xử lý thay đổi form
    const handleChange = (e) => {
        const { name, value } = e.target;
        let processedValue = value;

        // Xử lý giá trị số
        if (name === 'giaTheoNgay' || name === 'giaTheoGio' || name === 'namSanXuat' || name === 'sucChua' || name === 'idHangXe' || name === 'idLoaiXe' || name === 'trangThai') {
            processedValue = Number(value);
        }

        setFormData(prev => ({
            ...prev,
            [name]: processedValue
        }));
    };

    // Xử lý submit form
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingCar) {
                const res = await Api.post(`admin/xe/update`, formData);
                if (res.data.status) {
                    toast.success(res.data.message);
                    getDataXe();
                } else {
                    toast.error(res.data.message);
                }
            } else {
                const res = await Api.post(`admin/xe/create`, formData);
                if (res.data.status) {
                    toast.success(res.data.message);
                    getDataXe();
                } else {
                    toast.error(res.data.message);
                }
            }
            setShowAddModal(false);
            resetForm();
        } catch (error) {
            console.log(error);
            toast.error(error.data.message ?? 'Có lỗi xảy ra, vui lòng thử lại');
        }
    };

    // Xử lý xóa xe
    const handleDelete = (car) => {
        setCarToDelete(car);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async (e) => {
        e.preventDefault();
        try {
            const res = await Api.delete(`admin/xe/delete/${carToDelete.id}`);
            if (res.data.status) {
                toast.success(res.data.message);
                setShowDeleteModal(false);
                getDataXe();
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra, vui lòng thử lại');
        }
    };

    // Định dạng tiền VNĐ
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const getDataXe = async () => {
        try {
            const res = await Api.get('/admin/xe/get-all');
            setCars(res.data.data);
        } catch (error) {
            toast.error('Có lỗi khi tải dữ liệu xe');
        }
    }

    const getDataHangXe = async () => {
        try {
            const res = await Api.get('/admin/hang-xe/data');
            setBrands(res.data.data);
        } catch (error) {
            toast.error('Có lỗi khi tải dữ liệu hãng xe');
        }
    }

    const getDataLoaiXe = async () => {
        try {
            const res = await Api.get('/admin/loai-xe/get-all');
            setCarTypes(res.data.data);
        } catch (error) {
            toast.error('Có lỗi khi tải dữ liệu loại xe');
        }
    }

    useEffect(() => {
        getDataXe();
        getDataHangXe();
        getDataLoaiXe();
    }, []);

    // Hiển thị trạng thái xe
    const renderStatus = (status, id) => {
        switch (status) {
            case 1:
                return (
                    <span onClick={() => handleChangeStatus(id)} className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 flex items-center justify-center cursor-pointer">
                        <CheckCircle className="w-3 h-3 mr-1" /> Sẵn sàng
                    </span>
                );
            case 2:
                return (
                    <span onClick={() => handleChangeStatus(id)} className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 flex items-center justify-center cursor-pointer">
                        <UserCheck className="w-3 h-3 mr-1" /> Đang thuê
                    </span>
                );
            case 0:
                return (
                    <span onClick={() => handleChangeStatus(id)} className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 flex items-center justify-center cursor-pointer">
                        <AlertCircle className="w-3 h-3 mr-1" /> Bảo dưỡng
                    </span>
                );
            default:
                return status;
        }
    };

    const handleChangeStatus = async (id) => {
        try {
            const res = await Api.get(`admin/xe/change-status/${id}`);
            if (res.data.status) {
                getDataXe();
                toast.success(res.data.message);
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra, vui lòng thử lại');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Quản lý xe</h1>
                <div className="flex space-x-2">
                    <button
                        className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg font-medium border border-blue-100 flex items-center hover:bg-blue-100 transition duration-300"
                        onClick={() => openAddModal()}
                    >
                        <Plus className="w-4 h-4 mr-1" />
                        Thêm xe mới
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
                            placeholder="Tìm kiếm theo tên xe, biển số..."
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
                            <option value="1">Sẵn sàng</option>
                            <option value="2">Đang thuê</option>
                            <option value="0">Bảo dưỡng</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Bảng danh sách xe */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 text-left text-gray-500 text-xs uppercase">
                                <th className="py-4 px-4 font-medium">STT</th>
                                <th className="py-4 px-4 font-medium">Hình ảnh</th>
                                <th className="py-4 px-4 font-medium">Tên xe</th>
                                <th className="py-4 px-4 font-medium">Biển số</th>
                                <th className="py-4 px-4 font-medium">Hãng xe</th>
                                <th className="py-4 px-4 font-medium">Loại xe</th>
                                <th className="py-4 px-4 font-medium">Năm SX</th>
                                <th className="py-4 px-4 font-medium">Số ghế</th>
                                <th className="py-4 px-4 font-medium">Giá thuê/ngày</th>
                                <th className="py-4 px-4 font-medium">Giá thuê/giờ</th>
                                <th className="py-4 px-4 font-medium text-center w-32">Trạng thái</th>
                                <th className="py-4 px-4 font-medium text-center">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredCars.map((car, index) => (
                                <tr key={car.id} className="hover:bg-gray-50">
                                    <td className="py-3 px-4 text-sm">{index + 1}</td>
                                    <td className="py-3 px-4 text-sm">
                                        <div className="w-14 h-10 rounded bg-gray-100 flex items-center justify-center overflow-hidden">
                                            {car.hinhAnh ? (
                                                <img src={car.hinhAnh} alt={car.tenXe} className="object-cover w-full h-full" />
                                            ) : (
                                                <span className="text-gray-400 text-xs">No image</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-sm font-medium">{car.tenXe}</td>
                                    <td className="py-3 px-4 text-sm">{car.bienSoXe}</td>
                                    <td className="py-3 px-4 text-sm">{car.HangXe.tenHangXe}</td>
                                    <td className="py-3 px-4 text-sm">{car.LoaiXe.tenLoaiXe}</td>
                                    <td className="py-3 px-4 text-sm">{car.namSanXuat}</td>
                                    <td className="py-3 px-4 text-sm">{car.sucChua}</td>
                                    <td className="py-3 px-4 text-sm">{formatCurrency(car.giaTheoNgay)}</td>
                                    <td className="py-3 px-4 text-sm">{formatCurrency(car.giaTheoGio)}</td>
                                    <td className="py-3 px-4 text-sm text-center">{renderStatus(car.trangThai, car.id)}</td>
                                    <td className="py-3 px-4 text-sm text-center">
                                        <div className="flex space-x-2 justify-center">
                                            <button 
                                                className="text-gray-600 hover:text-gray-800"
                                                onClick={() => {}}
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button 
                                                className="text-blue-600 hover:text-blue-800"
                                                onClick={() => openEditModal(car)}
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button 
                                                className="text-red-600 hover:text-red-800"
                                                onClick={() => handleDelete(car)}
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

            {/* Modal thêm/sửa xe */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>&#8203;
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
                            <form onSubmit={handleSubmit}>
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="mb-4">
                                        <h3 className="text-lg font-medium text-gray-900">
                                            {editingCar ? 'Chỉnh sửa thông tin xe' : 'Thêm xe mới'}
                                        </h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Tên xe
                                            </label>
                                            <input
                                                type="text"
                                                name="tenXe"
                                                value={formData.tenXe}
                                                onChange={handleChange}
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Biển số
                                            </label>
                                            <input
                                                type="text"
                                                name="bienSoXe"
                                                value={formData.bienSoXe}
                                                onChange={handleChange}
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Hãng xe
                                            </label>
                                            <select
                                                name="idHangXe"
                                                value={formData.idHangXe}
                                                onChange={handleChange}
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                            >
                                                {brands.map(brand => (
                                                    <option key={brand.id} value={brand.id}>{brand.tenHangXe}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Loại xe
                                            </label>
                                            <select
                                                name="idLoaiXe"
                                                value={formData.idLoaiXe}
                                                onChange={handleChange}
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                            >
                                                {carTypes.map(type => (
                                                    <option key={type.id} value={type.id}>{type.tenLoaiXe}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Năm sản xuất
                                            </label>
                                            <input
                                                type="number"
                                                name="namSanXuat"
                                                value={formData.namSanXuat}
                                                onChange={handleChange}
                                                min="2000"
                                                max="2030"
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Số ghế
                                            </label>
                                            <input
                                                type="number"
                                                name="sucChua"
                                                value={formData.sucChua}
                                                onChange={handleChange}
                                                min="2"
                                                max="16"
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Nhiên liệu
                                            </label>
                                            <select
                                                name="nhienlieu"
                                                value={formData.nhienlieu}
                                                onChange={handleChange}
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                            >
                                                <option value="Xăng">Xăng</option>
                                                <option value="Dầu">Dầu</option>
                                                <option value="Điện">Điện</option>
                                                <option value="Hybrid">Hybrid</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Giá thuê / ngày (VNĐ)
                                            </label>
                                            <input
                                                type="number"
                                                name="giaTheoNgay"
                                                value={formData.giaTheoNgay}
                                                onChange={handleChange}
                                                min="100000"
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Giá thuê / giờ (VNĐ)
                                            </label>
                                            <input
                                                type="number"
                                                name="giaTheoGio"
                                                value={formData.giaTheoGio}
                                                onChange={handleChange}
                                                min="100000"
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
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
                                                <option value="1">Sẵn sàng</option>
                                                <option value="2">Đang thuê</option>
                                                <option value="0">Bảo dưỡng</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                URL hình ảnh
                                            </label>
                                            <input
                                                type="text"
                                                name="hinhAnh"
                                                value={formData.hinhAnh}
                                                onChange={handleChange}
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button
                                        type="submit"
                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                                    >
                                        {editingCar ? 'Cập nhật' : 'Thêm mới'}
                                    </button>
                                    <button
                                        type="button"
                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
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

            {/* Modal xóa xe */}
            {showDeleteModal && (
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
                                        Bạn có chắc muốn xóa xe này?
                                    </h3>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button
                                        type="submit"
                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                                    >
                                        Xoá xe
                                    </button>
                                    <button
                                        type="button"
                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                                        onClick={() => setShowDeleteModal(false)}
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

export default DashboardManageCars; 