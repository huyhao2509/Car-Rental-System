const BASE_URL = process.env.SMOKE_BASE_URL || 'http://localhost:5000';
const PASSWORD = process.env.SMOKE_TEST_PASSWORD || 'Aa123456!';

async function apiRequest(path, options = {}) {
    const response = await fetch(`${BASE_URL}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {}),
        },
    });

    const text = await response.text();
    let body = null;
    try {
        body = text ? JSON.parse(text) : null;
    } catch {
        body = { raw: text };
    }

    return {
        ok: response.ok,
        status: response.status,
        body,
    };
}

function assertCondition(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

async function run() {
    const now = Date.now();
    const email = `smoke_${now}@example.com`;
    const phone = `09${String(now).slice(-8)}`;
    let token = '';
    let cartOrderId = null;

    console.log(`Running smoke E2E against ${BASE_URL}`);

    const root = await apiRequest('/');
    assertCondition(root.status === 200, 'Root endpoint is not healthy');

    const register = await apiRequest('/api/nguoi-dung/register', {
        method: 'POST',
        body: JSON.stringify({
            hoTen: 'Smoke Test User',
            email,
            password: PASSWORD,
            soDienThoai: phone,
        }),
    });
    assertCondition(register.ok, `Register failed: ${JSON.stringify(register.body)}`);

    const login = await apiRequest('/api/nguoi-dung/login', {
        method: 'POST',
        body: JSON.stringify({ email, password: PASSWORD }),
    });
    assertCondition(login.ok, `Login failed: ${JSON.stringify(login.body)}`);
    token = login.body && login.body.data ? login.body.data.token : '';
    assertCondition(Boolean(token), 'Login succeeded but token is missing');

    const checkLogin = await apiRequest('/api/nguoi-dung/check-login', {
        method: 'POST',
        body: JSON.stringify({ token }),
    });
    assertCondition(checkLogin.ok, `Check-login failed: ${JSON.stringify(checkLogin.body)}`);

    const profile = await apiRequest('/api/nguoi-dung/profile', {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
    });
    assertCondition(profile.ok, `Profile fetch failed: ${JSON.stringify(profile.body)}`);

    const carList = await apiRequest('/api/client/xe/get-all-client');
    assertCondition(carList.ok, `Car list failed: ${JSON.stringify(carList.body)}`);
    const cars = Array.isArray(carList.body?.data) ? carList.body.data : [];
    assertCondition(cars.length > 0, 'No car data available for booking smoke step');

    const carId = cars[0].id;
    const startTime = new Date(Date.now() + 60 * 60 * 1000).toISOString();
    const endTime = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString();

    const addToCart = await apiRequest('/api/client/don-hang/them-gio-hang', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({
            idXe: carId,
            thoiGianBatDau: startTime,
            thoiGianKetThuc: endTime,
            soGioThue: 1,
            soNgayThue: 0,
        }),
    });
    assertCondition(addToCart.ok, `Add-to-cart failed: ${JSON.stringify(addToCart.body)}`);

    const cart = await apiRequest('/api/client/don-hang/lay-gio-hang', {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
    });
    assertCondition(cart.ok, `Get cart failed: ${JSON.stringify(cart.body)}`);

    const cartItems = Array.isArray(cart.body?.data) ? cart.body.data : [];
    if (cartItems.length > 0) {
        cartOrderId = cartItems[0].id;
    }

    if (cartOrderId) {
        const removeCart = await apiRequest(`/api/client/don-hang/xoa-gio-hang/${cartOrderId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
        });
        assertCondition(removeCart.ok, `Cleanup cart failed: ${JSON.stringify(removeCart.body)}`);
    }

    console.log('Smoke E2E passed: register -> login -> profile -> car list -> cart add/remove');
}

run().catch((error) => {
    console.error(`Smoke E2E failed: ${error.message}`);
    process.exit(1);
});
