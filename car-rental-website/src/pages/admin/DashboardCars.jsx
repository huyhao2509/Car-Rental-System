import React, { useState } from 'react';
import { Search, Filter, Download, Plus, Edit, Trash2, Eye, CheckCircle, XCircle, AlertCircle, UserCheck } from 'lucide-react';
import axios from 'axios';

const DashboardCars = ({ cars, setCars, formatCurrency }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingCar, setEditingCar] = useState(null);

    // Lọc danh sách xe
    const filteredCars = cars.filter(car => {
        // Lọc theo trạng thái
        if (filterStatus !== 'all' && car.status !== filterStatus) {
            return false;
        }

        // Tìm kiếm theo tên xe hoặc biển số
        if (searchTerm && !car.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            !car.licensePlate.toLowerCase().includes(searchTerm.toLowerCase())) {
            return false;
        }

        return true;
    });

    // Form state cho thêm/sửa xe
    const [formData, setFormData] = useState({
        name: '',
        licensePlate: '',
        year: new Date().getFullYear(),
        seats: 5,
        fuel: 'Xăng',
        pricePerDay: 1000000,
        status: 'available',
        location: 'Hà Nội'
    });

    // Reset form
    const resetForm = () => {
        setFormData({
            name: '',
            licensePlate: '',
            year: new Date().getFullYear(),
            seats: 5,
            fuel: 'Xăng',
            pricePerDay: 1000000,
            status: 'available',
            location: 'Hà Nội'
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
        if (name === 'pricePerDay' || name === 'year' || name === 'seats') {
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

        if (editingCar) {
            // Cập nhật xe
            setCars(cars.map(car => car.id === editingCar.id ? { ...formData, id: car.id } : car));
        } else {
            // Thêm xe mới
            const newId = Math.max(...cars.map(car => car.id)) + 1;
            setCars([...cars, { ...formData, id: newId }]);
            await axios.post('/api/cars', formData);
        }

        setShowAddModal(false);
        resetForm();0
    };

    // Xử lý xóa xe
    const handleDelete = (id) => {
        if (window.confirm('Bạn có chắc muốn xóa xe này?')) {
            setCars(cars.filter(car => car.id !== id));
        }
    };

    // Hiển thị trạng thái xe
    const renderStatus = (status) => {
        switch (status) {
            case 'available':
                return (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 flex items-center">
                        <CheckCircle className="w-3 h-3 mr-1" /> Sẵn sàng
                    </span>
                );
            case 'rented':
                return (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 flex items-center">
                        <UserCheck className="w-3 h-3 mr-1" /> Đang thuê
                    </span>
                );
            case 'maintenance':
                return (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" /> Bảo dưỡng
                    </span>
                );
            default:
                return status;
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
                            <option value="available">Sẵn sàng</option>
                            <option value="rented">Đang thuê</option>
                            <option value="maintenance">Bảo dưỡng</option>
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
                                <th className="py-4 px-4 font-medium">ID</th>
                                <th className="py-4 px-4 font-medium">Tên xe</th>
                                <th className="py-4 px-4 font-medium">Biển số</th>
                                <th className="py-4 px-4 font-medium">Năm SX</th>
                                <th className="py-4 px-4 font-medium">Số ghế</th>
                                <th className="py-4 px-4 font-medium">Nhiên liệu</th>
                                <th className="py-4 px-4 font-medium">Giá thuê/ngày</th>
                                <th className="py-4 px-4 font-medium">Trạng thái</th>
                                <th className="py-4 px-4 font-medium">Khu vực</th>
                                <th className="py-4 px-4 font-medium">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCars.length > 0 ? (
                                filteredCars.map((car) => (
                                    <tr key={car.id} className="border-t border-gray-100">
                                        <td className="py-4 px-4 font-medium">{car.id}</td>
                                        <td className="py-4 px-4">{car.name}</td>
                                        <td className="py-4 px-4">{car.licensePlate}</td>
                                        <td className="py-4 px-4">{car.year}</td>
                                        <td className="py-4 px-4">{car.seats}</td>
                                        <td className="py-4 px-4">{car.fuel}</td>
                                        <td className="py-4 px-4 font-medium">{formatCurrency(car.pricePerDay)}</td>
                                        <td className="py-4 px-4">{renderStatus(car.status)}</td>
                                        <td className="py-4 px-4">{car.location}</td>
                                        <td className="py-4 px-4">
                                            <div className="flex space-x-2">
                                                <button
                                                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                                    title="Xem chi tiết"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    className="p-1 text-green-600 hover:bg-green-50 rounded"
                                                    title="Chỉnh sửa"
                                                    onClick={() => openEditModal(car)}
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                                                    title="Xóa"
                                                    onClick={() => handleDelete(car.id)}
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
                                        Không tìm thấy xe nào phù hợp
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Phân trang */}
                <div className="py-4 px-6 border-t border-gray-100 flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                        Hiển thị {filteredCars.length} / {cars.length} xe
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

            {/* Modal thêm/sửa xe */}
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
                                            {editingCar ? 'Chỉnh sửa thông tin xe' : 'Thêm xe mới'}
                                        </h3>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div className="col-span-2">
                                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                                Tên xe
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                id="name"
                                                required
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                                value={formData.name}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="licensePlate" className="block text-sm font-medium text-gray-700 mb-1">
                                                Biển số
                                            </label>
                                            <input
                                                type="text"
                                                name="licensePlate"
                                                id="licensePlate"
                                                required
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                                value={formData.licensePlate}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
                                                Năm sản xuất
                                            </label>
                                            <input
                                                type="number"
                                                name="year"
                                                id="year"
                                                required
                                                min="1950"
                                                max={new Date().getFullYear()}
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                                value={formData.year}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="seats" className="block text-sm font-medium text-gray-700 mb-1">
                                                Số ghế
                                            </label>
                                            <input
                                                type="number"
                                                name="seats"
                                                id="seats"
                                                required
                                                min="2"
                                                max="50"
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                                value={formData.seats}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="fuel" className="block text-sm font-medium text-gray-700 mb-1">
                                                Nhiên liệu
                                            </label>
                                            <select
                                                name="fuel"
                                                id="fuel"
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                                value={formData.fuel}
                                                onChange={handleChange}
                                            >
                                                <option value="1">Xăng</option>
                                                <option value="2">Dầu</option>
                                                <option value="3">Điện</option>
                                                <option value="4">Hybrid</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label htmlFor="pricePerDay" className="block text-sm font-medium text-gray-700 mb-1">
                                                Giá thuê/ngày
                                            </label>
                                            <input
                                                type="number"
                                                name="pricePerDay"
                                                id="pricePerDay"
                                                required
                                                min="100000"
                                                step="10000"
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                                value={formData.pricePerDay}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                                                Trạng thái
                                            </label>
                                            <select
                                                name="status"
                                                id="status"
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                                value={formData.status}
                                                onChange={handleChange}
                                            >
                                                <option value="available">Sẵn sàng</option>
                                                <option value="rented">Đang thuê</option>
                                                <option value="maintenance">Bảo dưỡng</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                                                Khu vực
                                            </label>
                                            <select
                                                name="location"
                                                id="location"
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                                value={formData.location}
                                                onChange={handleChange}
                                            >
                                                <option value="Hà Nội">Hà Nội</option>
                                                <option value="Hồ Chí Minh">Hồ Chí Minh</option>
                                                <option value="Đà Nẵng">Đà Nẵng</option>
                                                <option value="Nha Trang">Nha Trang</option>
                                                <option value="Đà Lạt">Đà Lạt</option>
                                            </select>
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
        </div>
    );
};

export default DashboardCars;
