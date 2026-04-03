const axios = require('axios');
const { LichSuGiaoDich, DonHang } = require('../models');

const API_URL = process.env.MB_TRANSACTION_API_URL || 'https://api-mb.dzmid.io.vn/api/transactions';
const SCHEDULER_INTERVAL_MS = Number(process.env.MB_SCHEDULER_INTERVAL_MS || 30000);

function getCurrentDate() {
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, '0');
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const yyyy = String(now.getFullYear());
    return `${dd}/${mm}/${yyyy}`;
}

function buildRequestPayload() {
    return {
        USERNAME: process.env.MB_USERNAME,
        PASSWORD: process.env.MB_PASSWORD,
        DAY_BEGIN: getCurrentDate(),
        DAY_END: getCurrentDate(),
        NUMBER_MB: process.env.MB_ACCOUNT_NO,
    };
}

function hasRequiredConfig() {
    return Boolean(process.env.MB_USERNAME && process.env.MB_PASSWORD && process.env.MB_ACCOUNT_NO);
}

function extractOrderCode(description) {
    const match = String(description || '').match(/DH\d+/i);
    return match ? match[0].toUpperCase() : null;
}

async function saveTransactionIfMissing(item) {
    const transaction = await LichSuGiaoDich.findOne({
        where: { soTaiKhoanChuyen: item.refNo },
    });

    if (transaction) {
        return;
    }

    await LichSuGiaoDich.create({
        nganHang: item.bankName || 'Tai Khoan So',
        soTaiKhoanChuyen: item.refNo,
        noiDungChuyenKhoan: `${item.description || ''}, Amount: ${item.amount || 0}`,
    });
}

async function markOrderAsPaid(item) {
    const maDonHang = extractOrderCode(item.description);

    if (!maDonHang) {
        return;
    }

    const donHang = await DonHang.findOne({
        where: {
            maDonHang,
            trangThai: DonHang.DA_TAO_DON_HANG,
            isThanhToan: DonHang.CHUA_THANH_TOAN_IS,
        },
    });

    if (!donHang) {
        return;
    }

    donHang.trangThai = DonHang.DA_THANH_TOAN;
    donHang.isThanhToan = DonHang.DA_THANH_TOAN_IS;
    await donHang.save();
}

async function fetchTransactions() {
    if (!hasRequiredConfig()) {
        console.warn(
            '[mbTransactionScheduler] Missing MB_USERNAME/MB_PASSWORD/MB_ACCOUNT_NO, skipping run.'
        );
        return;
    }

    try {
        const response = await axios.post(API_URL, buildRequestPayload(), {
            headers: { 'Content-Type': 'application/json' },
        });

        const transactions = response.data?.data?.transactionHistoryList || [];

        for (const item of transactions) {
            await saveTransactionIfMissing(item);
            await markOrderAsPaid(item);
        }
    } catch (error) {
        console.error('[mbTransactionScheduler] Failed to fetch transactions:', error.message);
    }
}

fetchTransactions();
setInterval(fetchTransactions, SCHEDULER_INTERVAL_MS);

module.exports = {
    fetchTransactions,
};
