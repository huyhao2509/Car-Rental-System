import Api from '@/utils/Api';

export const loginUser = async (email, password) => {
  return await Api.post('/nguoi-dung/login', {
    email, 
    password });
};

export const checkUserProfile = async (token) => {
  return await Api.get('/nguoi-dung/profile', {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const sendOTPRequest = async (email) => {
  return await Api.post('/nguoi-dung/send-otp', { email });
};

export const verifyOTPRequest = async (email, otp) => {
  return await Api.post('/nguoi-dung/verify-otp', { email, otp });
};

export const registerUser = async (userData) => {
  return await Api.post('/nguoi-dung/register', userData);
};
