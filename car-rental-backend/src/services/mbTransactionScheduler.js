const axios = require('axios');

const API_URL = 'https://api-mb.dzmid.io.vn/api/transactions';

const payload = {
    "USERNAME": "0935815924",
    "PASSWORD": "Huyhaonguyen258@@",
    "DAY_BEGIN": "23/04/2024",
    "DAY_END": "23/04/2024",
    "NUMBER_MB": "98998998899999"
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
