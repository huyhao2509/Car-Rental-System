const axios = require('axios');
const { LichSuGiaoDich, DonHang } = require('../models');

// 🔑 API CONFIGURATION

const API_URL = 'https://api-mb.dzmid.io.vn/api/transactions';

const payload = {
    "USERNAME": "0935815924",
    "PASSWORD": "Huyhaonguyen258@@",
    "DAY_BEGIN": getCurrentDate(),
    "DAY_END": getCurrentDate(),
    "NUMBER_MB": "98998998899999"
};
// 📅 GET CURRENT DATE FORMAT DD/MM/YYYY
function getCurrentDate() {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
    const yyyy = today.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
}
// 🔍 FETCH TRANSACTIONS FROM MB BANK API
async function fetchTransactions() {
    try {
        const res = await axios.post(API_URL, payload, {
            headers: { 'Content-Type': 'application/json' }
        });
        const data = res.data.data.transactionHistoryList;
        // xử lí từng transaction
        data.forEach(async (item) => {
            const transaction = await LichSuGiaoDich.findOne({ where: { soTaiKhoanChuyen: item.refNo } });
            if (!transaction) {
                await LichSuGiaoDich.create({
                    nganHang: item.bankName ?? "Tài Khoản Số",
                    soTaiKhoanChuyen: item.refNo,
                    noiDungChuyenKhoan: item.description + ", Amount: " + item.amount,
                });
            }
             // 🔍 TÌM MÃ ĐƠN HÀNG TRONG NỘI DUNG
            const text = item.description;
            const match = text.match(/DH\d+/);
            if (match) {
                const maDonHang = match[0];
                const donHang = await DonHang.findOne({ where: { maDonHang: maDonHang, trangThai: DonHang.DA_TAO_DON_HANG, isThanhToan: DonHang.CHUA_THANH_TOAN_IS } });
                if (donHang) {
                    donHang.trangThai = DonHang.DA_THANH_TOAN;
                    donHang.isThanhToan = DonHang.DA_THANH_TOAN_IS;
                    await donHang.save();
                }
            }
        });
    } catch (err) {
        console.error('Lỗi lấy transaction:', err.message);
    }
}

setInterval(fetchTransactions, 5000);
