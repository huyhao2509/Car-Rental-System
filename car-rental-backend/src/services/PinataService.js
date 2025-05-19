// src/services/PinataService.js
const pinataSDK = require('@pinata/sdk');
const FormData = require('form-data');
const { Readable } = require('stream');

class PinataService {
  constructor() {
    this.pinataClient = new pinataSDK(
      process.env.PINATA_API_KEY, 
      process.env.PINATA_API_SECRET
    );
  }

  async uploadImage(fileBuffer, fileName, userId, documentType) {
    try {
      // Tạo readable stream từ buffer
      const fileStream = Readable.from(fileBuffer);
      fileStream.path = fileName;

      // Upload 
      const response = await this.pinataClient.pinFileToIPFS(fileStream, {
        pinataMetadata: {
          name: fileName,
          keyvalues: {
            userId: userId,
            documentType: documentType
          }
        }
      });

      return {
        ipfsHash: response.IpfsHash,
        gatewayUrl: `https://gateway.pinata.cloud/ipfs/${response.IpfsHash}`
      };
    } catch (error) {
      console.error('Lỗi upload file lên Pinata:', error);
      throw new Error(`Không thể upload file lên Pinata: ${error.message}`);
    }
  }

  async deleteFile(ipfsHash) {
    try {
      await this.pinataClient.unpin(ipfsHash);
      return true;
    } catch (error) {
      console.error('Lỗi xóa file khỏi Pinata:', error);
      throw new Error('Không thể xóa file khỏi Pinata');
    }
  }
}

module.exports = new PinataService();
