import axios from 'axios';
const API_URL = 'http://localhost:3000/api';

export const loginUser = async (email, password) => {
  return await axios.post(`${API_URL}/auth/login`, { 
    email, 
    password });
};

export const checkUserProfile = async (token) => {
  return await axios.get(`${API_URL}/auth/profile`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const sendOTPRequest = async (email) => {
  return await axios.post(`${API_URL}/auth/send-otp`, { email });
};

export const verifyOTPRequest = async (email, otp) => {
  return await axios.post(`${API_URL}/nguoi-dung/verify-otp`, { email, otp });
};

export const registerUser = async (userData) => {
  return await axios.post(`${API_URL}/nguoi-dung/register`, userData);
};