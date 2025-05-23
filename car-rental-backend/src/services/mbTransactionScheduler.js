const axios = require('axios');

const API_URL = 'https://api-mb.dzmid.io.vn/api/transactions';

const payload = {
    "USERNAME": "THANHTRUONG2311",
    "PASSWORD": "TruongCuaMaiLinh2809",
    "DAY_BEGIN": "23/04/2024",
    "DAY_END": "23/04/2024",
    "NUMBER_MB": "1910061030119"
};

async function fetchTransactions() {
    try {
        const res = await axios.post(API_URL, payload, {
            headers: { 'Content-Type': 'application/json' }
        });
        console.log('Transaction data:', res.data);
    } catch (err) {
        console.error('Lỗi lấy transaction:', err.message);
    }
}

setInterval(fetchTransactions, 5000);
