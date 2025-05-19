// src/services/documentService.js
import axios from 'axios';

const documentService = {
    uploadDocument: async (formData) => {
        try {
            const response = await axios.post(
                'http://localhost:5000/api/documents/upload',
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
