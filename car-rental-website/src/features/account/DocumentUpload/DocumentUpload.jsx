import React, { useState, useEffect } from "react";
import documentService from "../../../services/documentService";

// Constants to avoid magic strings
const DOCUMENT_TYPES = {
  DRIVING_LICENSE: "drivingLicense",
  IDENTITY_CARD: "identityCard"
};

const FILE_SIZE_LIMIT = 5 * 1024 * 1024; // 5MB
const VALID_FILE_FORMATS = ["image/jpeg", "image/png", "image/jpg"];

const DocumentUpload = ({ user, onDocumentUpdate }) => {
  const [documents, setDocuments] = useState({
    [DOCUMENT_TYPES.DRIVING_LICENSE]: null,
    [DOCUMENT_TYPES.IDENTITY_CARD]: null
  });
  
  const [previews, setPreviews] = useState({
    [DOCUMENT_TYPES.DRIVING_LICENSE]: null,
    [DOCUMENT_TYPES.IDENTITY_CARD]: null
  });
  
  const [isUploading, setIsUploading] = useState({
    [DOCUMENT_TYPES.DRIVING_LICENSE]: false,
    [DOCUMENT_TYPES.IDENTITY_CARD]: false
  });
  
  const [status, setStatus] = useState({
    [DOCUMENT_TYPES.DRIVING_LICENSE]: { message: "", type: "" },
    [DOCUMENT_TYPES.IDENTITY_CARD]: { message: "", type: "" }
  });

  // Update previews from user prop
  useEffect(() => {
    if (user) {
      if (user.maAnhCanCuoc) {
        setPreviews(prev => ({
          ...prev,
          [DOCUMENT_TYPES.IDENTITY_CARD]: user.maAnhCanCuoc
        }));
      }
      
      if (user.maAnhBangLaiXe) {
        setPreviews(prev => ({
          ...prev,
          [DOCUMENT_TYPES.DRIVING_LICENSE]: user.maAnhBangLaiXe
        }));
      }
    }
  }, [user]);

  // Helper function to get document display name
  const getDocumentDisplayName = (type) => {
    return type === DOCUMENT_TYPES.DRIVING_LICENSE ? 'bằng lái xe' : 'CMND/CCCD';
  };

  // Validate file
  const validateFile = (file, type) => {
    if (!VALID_FILE_FORMATS.includes(file.type)) {
      updateStatus(type, "Chỉ chấp nhận file hình ảnh (JPEG, PNG, JPG)", "error");
      return false;
    }
    
    if (file.size > FILE_SIZE_LIMIT) {
      updateStatus(type, "Kích thước file không được vượt quá 5MB", "error");
      return false;
    }
    
    return true;
  };

  // Update status helper
  const updateStatus = (type, message, statusType) => {
    setStatus(prev => ({
      ...prev,
      [type]: { message, type: statusType }
    }));
  };

  // Handle file selection
  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!validateFile(file, type)) return;
    
    const previewUrl = URL.createObjectURL(file);
    setPreviews(prev => ({
      ...prev,
      [type]: previewUrl
    }));
    
    setDocuments(prev => ({
      ...prev,
      [type]: file
    }));
    
    updateStatus(type, "", "");
  };

  // Handle document upload
  const handleUpload = async (type) => {
    if (!documents[type]) {
      updateStatus(type, `Vui lòng chọn file ${getDocumentDisplayName(type)} trước`, "error");
      return;
    }
    
    try {
      setIsUploading(prev => ({
        ...prev,
        [type]: true
      }));
      
      const formData = new FormData();
      formData.append("document", documents[type]);
      formData.append("documentType", type);
      
      const response = await documentService.uploadDocument(formData);
      
      updateStatus(
        type, 
        response.message || `Tải lên ${getDocumentDisplayName(type)} thành công`, 
        "success"
      );
      
      // Update preview with URL from server
      setPreviews(prev => ({
        ...prev,
        [type]: response.documentUrl
      }));
      
      // Call callback to update parent component state (if needed)
      if (onDocumentUpdate) {
        const fieldName = type === DOCUMENT_TYPES.DRIVING_LICENSE ? 'maAnhBangLaiXe' : 'maAnhCanCuoc';
        onDocumentUpdate({
          ...user,
          [fieldName]: response.documentUrl
        });
      }
    } catch (error) {
      console.error(`Lỗi khi tải lên ${type}:`, error);
      updateStatus(
        type, 
        error.message || `Đã xảy ra lỗi khi tải lên ${getDocumentDisplayName(type)}`, 
        "error"
      );
    } finally {
      setIsUploading(prev => ({
        ...prev,
        [type]: false
      }));
    }
  };

  // Reusable document section component
  const DocumentSection = ({ type, title }) => {
    const displayName = getDocumentDisplayName(type);
    
    return (
      <div className={type === DOCUMENT_TYPES.IDENTITY_CARD ? "" : "border-t border-gray-200 pt-6"}>
        <h3 className="text-lg font-medium text-gray-700 mb-4">{title}</h3>
        
        {/* Preview */}
        {previews[type] && (
          <div className="mb-4">
            <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
              <img 
                src={previews[type]} 
                alt={`${title} Preview`} 
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        )}
        
        {/* Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chọn ảnh {displayName}
            {type === DOCUMENT_TYPES.IDENTITY_CARD && " (Mặt trước)"}
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, type)}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border file:border-gray-300 file:text-gray-700 file:bg-white hover:file:bg-gray-100 cursor-pointer"
          />
          <p className="mt-1 text-xs text-gray-500">
            Hình ảnh định dạng JPG, JPEG, PNG. Kích thước tối đa 5MB.
          </p>
        </div>
        
        {/* Status message */}
        {status[type].message && (
          <div className={`p-3 rounded mb-4 ${
            status[type].type === "success" 
              ? "bg-green-100 text-green-700" 
              : "bg-red-100 text-red-700"
          }`}>
            {status[type].message}
          </div>
        )}
        
        {/* Upload button */}
        <button
          onClick={() => handleUpload(type)}
          disabled={isUploading[type] || !documents[type]}
          className={`bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors ${
            (isUploading[type] || !documents[type]) ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {isUploading[type] ? "Đang tải lên..." : `Tải lên ${displayName}`}
        </button>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200">
        Tải lên giấy tờ
      </h2>
      
      <div className="space-y-8">
        {/* CMND/CCCD Section */}
        <DocumentSection 
          type={DOCUMENT_TYPES.IDENTITY_CARD} 
          title="CMND/CCCD" 
        />
        
        {/* Driving License Section */}
        <DocumentSection 
          type={DOCUMENT_TYPES.DRIVING_LICENSE} 
          title="Bằng lái xe" 
        />
      </div>
      
      <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              <strong>Lưu ý:</strong> Vui lòng tải lên ảnh CMND/CCCD và bằng lái xe rõ ràng, không bị mờ hoặc cắt xén. Các giấy tờ này sẽ được sử dụng để xác minh danh tính của bạn khi thuê xe.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentUpload;
