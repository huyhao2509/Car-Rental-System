// src/services/documentService.js
import Api from '@/utils/Api';

const documentService = {
    uploadDocument: async (formData) => {
        try {
            const response = await Api.post(
                '/documents/upload',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || new Error('Lỗi upload tài liệu');
        }
    }
};

export default documentService;
