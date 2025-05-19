import React, { useState, useEffect } from "react";
import {
    Search, Filter, ChevronDown, Plus, Edit, Trash2,
    Calendar, Tag, Percent, Clock, X, Check, AlertTriangle,
    Download, MoreHorizontal, Eye, Copy
} from "lucide-react";
import Api from '@/utils/Api';
import { toast } from 'react-toastify';

const DashboardPromotions = ({ formatCurrency }) => {
    // State quản lý danh sách khuyến mãi
    const [promotions, setPromotions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // State cho form thêm/sửa khuyến mãi
    const [showForm, setShowForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentPromotion, setCurrentPromotion] = useState({
        maKhuyenMai: "",
        noiDung: "",
        soTien: 0,
        phanTramGiam: 0,
        trangThai: 1
    });

    // State cho filter và search
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortBy, setSortBy] = useState("id");
    const [sortOrder, setSortOrder] = useState("desc");

    // State cho modal xóa khuyến mãi
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    // Fetch danh sách khuyến mãi khi component được mount
    useEffect(() => {
        fetchPromotions();
    }, []);

    // Hàm lấy danh sách khuyến mãi từ API
    const fetchPromotions = async () => {
        try {
            setIsLoading(true);
            const response = await Api.get('admin/khuyen-mai/lay-khuyen-mai-all');
            if (response.data.status) {
                setPromotions(response.data.data || []);
            }
        } catch (error) {
            console.error('Lỗi khi tải danh sách khuyến mãi:', error);
            toast.error('Không thể tải danh sách khuyến mãi. Vui lòng thử lại sau.');
        } finally {
            setIsLoading(false);
        }
    };

    // Lọc danh sách khuyến mãi theo các điều kiện
    const filteredPromotions = promotions
        .filter(promo =>
            (statusFilter === "all" || promo.trangThai.toString() === statusFilter) &&
            (
                (promo.maKhuyenMai && promo.maKhuyenMai.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (promo.noiDung && promo.noiDung.toLowerCase().includes(searchTerm.toLowerCase()))
            )
        )
        .sort((a, b) => {
            let comparison = 0;
            switch (sortBy) {
                case "maKhuyenMai":
                    comparison = (a.maKhuyenMai || '').localeCompare(b.maKhuyenMai || '');
                    break;
                case "noiDung":
                    comparison = (a.noiDung || '').localeCompare(b.noiDung || '');
                    break;
                case "soTien":
                    comparison = (a.soTien || 0) - (b.soTien || 0);
                    break;
                case "phanTramGiam":
                    comparison = (a.phanTramGiam || 0) - (b.phanTramGiam || 0);
                    break;
                case "id":
                default:
                    comparison = a.id - b.id;
                    break;
            }

            return sortOrder === "asc" ? comparison : -comparison;
        });

    // Hàm mở form thêm khuyến mãi mới
    const handleAddPromotion = () => {
        setCurrentPromotion({
            maKhuyenMai: "",
            noiDung: "",
            soTien: 0,
            phanTramGiam: 0,
            trangThai: 1
        });
        setIsEditing(false);
        setShowForm(true);
    };

    // Hàm mở form sửa khuyến mãi
    const handleEditPromotion = (promotion) => {
        setCurrentPromotion({ ...promotion });
        setIsEditing(true);
        setShowForm(true);
    };

    // Hàm mở modal xác nhận xóa
    const handleDeleteClick = (id) => {
        setDeletingId(id);
        setShowDeleteModal(true);
    };

    // Hàm xóa khuyến mãi
    const handleDeletePromotion = async () => {
        try {
            setIsLoading(true);
            const response = await Api.delete(`admin/khuyen-mai/xoa-khuyen-mai/${deletingId}`);

            if (response.data.status) {
                setPromotions(promotions.filter(promo => promo.id !== deletingId));
                toast.success('Xóa khuyến mãi thành công!');
            } else {
                throw new Error(response.data.message || 'Có lỗi xảy ra');
            }
        } catch (error) {
            console.error('Lỗi khi xóa khuyến mãi:', error);
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi xóa khuyến mãi. Vui lòng thử lại sau.');
        } finally {
            setIsLoading(false);
            setShowDeleteModal(false);
            setDeletingId(null);
        }
    };

    // Hàm submit form thêm/sửa khuyến mãi
    const handleSubmitPromotion = async (e) => {
        e.preventDefault();

        try {
            setIsLoading(true);

            if (isEditing) {
                const response = await Api.post('admin/khuyen-mai/cap-nhat-khuyen-mai', currentPromotion);

                if (response.data.status) {
                    setPromotions(promotions.map(promo =>
                        promo.id === currentPromotion.id ? { ...currentPromotion } : promo
                    ));
                    toast.success('Cập nhật khuyến mãi thành công!');
                } else {
                    throw new Error(response.data.message || 'Có lỗi xảy ra');
                }
            } else {
                const response = await Api.post('admin/khuyen-mai/them-khuyen-mai', currentPromotion);

                if (response.data.status) {
                    const newPromotion = response.data.data;
                    setPromotions([...promotions, newPromotion]);
                    toast.success('Thêm khuyến mãi mới thành công!');
                } else {
                    throw new Error(response.data.message || 'Có lỗi xảy ra');
                }
            }

            setShowForm(false);
        } catch (error) {
            console.error('Lỗi khi lưu khuyến mãi:', error);
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi lưu khuyến mãi. Vui lòng thử lại sau.');
        } finally {
            setIsLoading(false);
        }
    };

    // Hàm thay đổi trạng thái khuyến mãi
    const handleChangeStatus = async (id, newStatus) => {
        try {
            setIsLoading(true);
            const promotionToUpdate = promotions.find(p => p.id === id);
            
            if (!promotionToUpdate) return;
            
            const response = await Api.post('admin/khuyen-mai/cap-nhat-khuyen-mai', {
                ...promotionToUpdate,
                trangThai: newStatus
            });
            
            if (response.data.status) {
                setPromotions(promotions.map(promo => 
                    promo.id === id ? { ...promo, trangThai: newStatus } : promo
                ));
                toast.success('Cập nhật trạng thái khuyến mãi thành công!');
            } else {
                throw new Error(response.data.message || 'Có lỗi xảy ra');
            }
        } catch (error) {
            console.error('Lỗi khi thay đổi trạng thái khuyến mãi:', error);
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi thay đổi trạng thái. Vui lòng thử lại sau.');
        } finally {
            setIsLoading(false);
        }
    };

    // Hàm bật/tắt nhanh trạng thái khuyến mãi
    const togglePromotionStatus = async (promotion) => {
        // Chuyển đổi trạng thái: 1 -> 2 (tắt) hoặc 2 -> 1 (bật)
        const newStatus = promotion.trangThai === 1 ? 2 : 1;
        
        try {
            setIsLoading(true);
            
            const response = await Api.post('admin/khuyen-mai/doi-trang-thai', {
                id: promotion.id,
                trangThai: newStatus
            });
            
            if (response.data.status) {
                setPromotions(promotions.map(promo => 
                    promo.id === promotion.id ? { ...promo, trangThai: newStatus } : promo
                ));
                
                const statusMessage = newStatus === 1 
                    ? 'Đã kích hoạt khuyến mãi thành công!' 
                    : 'Đã ngừng khuyến mãi thành công!';
                
                toast.success(statusMessage);
            } else {
                throw new Error(response.data.message || 'Có lỗi xảy ra');
            }
        } catch (error) {
            console.error('Lỗi khi đổi trạng thái khuyến mãi:', error);
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi đổi trạng thái khuyến mãi. Vui lòng thử lại sau.');
        } finally {
            setIsLoading(false);
        }
    };

    // Hàm sao chép mã khuyến mãi
    const handleCopyCode = (code) => {
        navigator.clipboard.writeText(code)
            .then(() => {
                toast.success(`Đã sao chép mã: ${code}`);
            })
            .catch(err => {
                console.error('Không thể sao chép:', err);
                toast.error('Không thể sao chép mã khuyến mãi');
            });
    };

    // Hàm render trạng thái khuyến mãi
    const renderStatus = (status) => {
        switch (status) {
            case 1:
                return (
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-green-100 text-green-800 whitespace-nowrap">
                        <Check className="w-4 h-4 mr-1.5 flex-shrink-0 stroke-2" /> Hoạt động
                    </span>
                );
            case 2:
                return (
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-red-100 text-red-800 whitespace-nowrap">
                        <X className="w-4 h-4 mr-1.5 flex-shrink-0 stroke-2" /> Ngừng hoạt động
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800 whitespace-nowrap">
                        <AlertTriangle className="w-4 h-4 mr-1.5 flex-shrink-0 stroke-2" /> Không xác định
                    </span>
                );
        }
    };

    // Render form thêm/sửa khuyến mãi
    const renderPromotionForm = () => {
        if (!showForm) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-800">
                            {isEditing ? "Chỉnh sửa khuyến mãi" : "Thêm khuyến mãi mới"}
                        </h2>
                        <button
                            className="text-gray-600 hover:text-gray-800"
                            onClick={() => setShowForm(false)}
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmitPromotion}>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Mã khuyến mãi</label>
                                <input
                                    type="text"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={currentPromotion.maKhuyenMai || ''}
                                    onChange={(e) => setCurrentPromotion({ ...currentPromotion, maKhuyenMai: e.target.value })}
                                    required
                                    placeholder="Nhập mã khuyến mãi..."
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Nội dung khuyến mãi</label>
                                <textarea
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={currentPromotion.noiDung || ''}
                                    onChange={(e) => setCurrentPromotion({ ...currentPromotion, noiDung: e.target.value })}
                                    rows="3"
                                    placeholder="Nhập nội dung khuyến mãi..."
                                ></textarea>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Số tiền giảm (VNĐ)</label>
                                    <input
                                        type="number"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={currentPromotion.soTien || 0}
                                        onChange={(e) => setCurrentPromotion({ ...currentPromotion, soTien: Number(e.target.value) })}
                                        min="0"
                                        placeholder="Nhập số tiền giảm..."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Phần trăm giảm (%)</label>
                                    <input
                                        type="number"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={currentPromotion.phanTramGiam || 0}
                                        onChange={(e) => setCurrentPromotion({ ...currentPromotion, phanTramGiam: Number(e.target.value) })}
                                        min="0"
                                        max="100"
                                        placeholder="Nhập phần trăm giảm..."
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
                                <select
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={currentPromotion.trangThai || 1}
                                    onChange={(e) => setCurrentPromotion({ ...currentPromotion, trangThai: Number(e.target.value) })}
                                >
                                    <option value={1}>Hoạt động</option>
                                    <option value={2}>Ngừng hoạt động</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-2 mt-6">
                            <button
                                type="button"
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50"
                                onClick={() => setShowForm(false)}
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Đang xử lý...' : (isEditing ? 'Cập nhật' : 'Thêm mới')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    // Render modal xác nhận xóa
    const renderDeleteModal = () => {
        if (!showDeleteModal) return null;

        const promotionToDelete = promotions.find(p => p.id === deletingId);

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
                    <div className="text-center mb-6">
                        <div className="mx-auto w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                            <AlertTriangle className="w-6 h-6 text-red-600" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 mb-2">Xác nhận xóa</h2>
                        <p className="text-gray-600">
                            Bạn có chắc chắn muốn xóa khuyến mãi "{promotionToDelete?.maKhuyenMai}"?
                            Hành động này không thể hoàn tác.
                        </p>
                    </div>

                    <div className="flex justify-center space-x-2">
                        <button
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50"
                            onClick={() => setShowDeleteModal(false)}
                        >
                            Hủy
                        </button>
                        <button
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            onClick={handleDeletePromotion}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Đang xử lý...' : 'Xóa'}
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // Hiển thị trạng thái loading
    if (isLoading && promotions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <div className="w-12 h-12 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin mb-4"></div>
                <p className="text-gray-500">Đang tải dữ liệu...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-800">Quản lý khuyến mãi</h1>
                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium flex items-center hover:bg-blue-700 transition duration-300 w-fit"
                    onClick={handleAddPromotion}
                >
                    <Plus className="w-4 h-4 mr-1" /> Thêm khuyến mãi
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="md:flex flex-wrap gap-4 mb-6 items-center">
                    <div className="relative flex-1 mb-4 md:mb-0">
                        <input
                            type="text"
                            placeholder="Tìm kiếm khuyến mãi..."
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <div className="relative">
                            <select
                                className="bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="all">Tất cả trạng thái</option>
                                <option value="1">Hoạt động</option>
                                <option value="2">Ngừng hoạt động</option>
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                        </div>

                        <div className="relative">
                            <select
                                className="bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="id">Sắp xếp theo ID</option>
                                <option value="maKhuyenMai">Sắp xếp theo mã</option>
                                <option value="soTien">Sắp xếp theo số tiền</option>
                                <option value="phanTramGiam">Sắp xếp theo phần trăm</option>
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                        </div>

                        <button
                            className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-700 flex items-center hover:bg-gray-50"
                            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                        >
                            {sortOrder === "asc" ? "Tăng dần" : "Giảm dần"}
                        </button>

                        <button
                            className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg font-medium border border-blue-100 flex items-center hover:bg-blue-100 transition duration-300"
                            onClick={() => console.log('Xuất dữ liệu')}
                        >
                            <Download className="w-4 h-4 mr-1" />
                            Xuất
                        </button>
                    </div>
                </div>

                {isLoading && (
                    <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10">
                        <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin"></div>
                    </div>
                )}

                {filteredPromotions.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                            <AlertTriangle className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-800 mb-2">Không tìm thấy khuyến mãi</h3>
                        <p className="text-gray-500">Không có khuyến mãi nào phù hợp với tiêu chí tìm kiếm của bạn.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto relative">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-gray-500 text-xs uppercase">
                                    <th className="pb-3 px-4">ID</th>
                                    <th className="pb-3 px-4">Mã khuyến mãi</th>
                                    <th className="pb-3 px-4">Nội dung</th>
                                    <th className="pb-3 px-4">Giá trị khuyến mãi</th>
                                    <th className="pb-3 px-4 text-center">Trạng thái</th>
                                    <th className="pb-3 px-4 text-center">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPromotions.map((promotion, index) => (
                                    <tr key={promotion.id} className={`border-t border-gray-100 ${index % 2 === 0 ? 'bg-gray-50' : ''}`}>
                                        <td className="py-4 px-4 font-medium">{promotion.id}</td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center">
                                                <span className="font-medium">{promotion.maKhuyenMai}</span>
                                                <button
                                                    className="ml-2 text-gray-400 hover:text-blue-600"
                                                    onClick={() => handleCopyCode(promotion.maKhuyenMai)}
                                                    title="Sao chép mã"
                                                >
                                                    <Copy className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <p className="font-medium line-clamp-2">{promotion.noiDung || 'Không có nội dung'}</p>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="space-y-1">
                                                {promotion.soTien > 0 && (
                                                    <p className="font-medium">Giảm: {formatCurrency(promotion.soTien)}</p>
                                                )}
                                                {promotion.phanTramGiam > 0 && (
                                                    <p className="font-medium">Giảm: {promotion.phanTramGiam}%</p>
                                                )}
                                                {promotion.soTien === 0 && promotion.phanTramGiam === 0 && (
                                                    <p className="text-gray-500 italic">Chưa thiết lập</p>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 text-center">
                                            {renderStatus(promotion.trangThai)}
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center justify-center space-x-2">
                                                <button
                                                    className="p-2 rounded-md hover:bg-blue-50 text-blue-600"
                                                    onClick={() => handleEditPromotion(promotion)}
                                                    title="Chỉnh sửa"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    className="p-2 rounded-md hover:bg-red-50 text-red-600"
                                                    onClick={() => handleDeleteClick(promotion.id)}
                                                    title="Xóa"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                                {promotion.trangThai === 1 ? (
                                                    <button 
                                                        className="p-2 rounded-md hover:bg-gray-50 text-gray-600"
                                                        onClick={() => togglePromotionStatus(promotion)}
                                                        title="Ngừng hoạt động"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                ) : (
                                                    <button 
                                                        className="p-2 rounded-md hover:bg-green-50 text-green-600"
                                                        onClick={() => togglePromotionStatus(promotion)}
                                                        title="Kích hoạt"
                                                    >
                                                        <Check className="w-4 h-4" />
                                                    </button>
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

            {renderPromotionForm()}
            {renderDeleteModal()}
        </div>
    );
};

export default DashboardPromotions;
