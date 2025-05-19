const baseURL = "http://localhost:3000/api/";
import axios from "axios";

const Api = axios.create({
    baseURL : baseURL,
    headers: {
        "Content-Type": "application/json",
    },
});

Api.interceptors.request.use(
    async (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error.response);
    }
);

Api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        return Promise.reject(error.response);
    }
);
   


export default Api;
