import axios from 'axios';

const api = axios.create({
    baseURL: 'https://campusconnect-8aw8.onrender.com',
    withCredentials: true,
});

// Request interceptor for adding auth token
api.interceptors.request.use(
    (config) => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            const { token } = JSON.parse(userInfo);
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for handling common errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Only redirect to login if it's a 401 and we're not ALREADY on a login/auth page
        if (error.response?.status === 401 && !error.config.url.includes('/api/auth/login')) {
            localStorage.removeItem('userInfo');
            // If the error specifically says notVerified, don't redirect to login
            if (!error.response.data?.notVerified) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;