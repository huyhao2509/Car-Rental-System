const baseURL = "/api/";
import axios from "axios";
import { toast } from "react-toastify";

const Api = axios.create({
    baseURL : baseURL,
    headers: {
        "Content-Type": "application/json",
    },
});

Api.interceptors.request.use(
    async (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error.response);
    }
);

Api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            const { status, data } = error.response;
            console.log(data);

            switch (status) {
                case 401:
                    // Token hết hạn hoặc không hợp lệ
                    toast.error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                    break;

                case 403:
                    // Không có quyền truy cập
                    toast.error(data.message || 'Bạn không có quyền thực hiện chức năng này');
                    break;

                case 404:
                    // Không tìm thấy tài nguyên
                    toast.error(data.message || 'Không tìm thấy dữ liệu yêu cầu');
                    break;

                case 500:
                    // Lỗi server
                    toast.error(data.message || 'Lỗi hệ thống, vui lòng thử lại sau');
                    break;

                default:
                    // Các lỗi khác
                    toast.error(data.message || 'Có lỗi xảy ra, vui lòng thử lại');
                    break;
            }
        } else if (error.request) {
            // Không nhận được response
            toast.error('Không thể kết nối đến server');
        } else {
            // Lỗi trong quá trình gửi request
            toast.error('Có lỗi xảy ra, vui lòng thử lại');
        }
        return Promise.reject(error.response);
    }
);   

export default Api;
