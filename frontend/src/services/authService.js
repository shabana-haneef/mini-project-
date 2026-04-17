import api from './api';

const API_URL = '/api/auth';

const login = async (email, password) => {
    const response = await api.post(`${API_URL}/login`, { email, password });
    return response.data;
};

const signup = async (userData) => {
    const response = await api.post(`${API_URL}/signup`, userData);
    return response.data;
};

const logout = async () => {
    const response = await api.post(`${API_URL}/logout`);
    return response.data;
};

const updateProfile = async (userData) => {
    const response = await api.put(`${API_URL}/profile`, userData);
    return response.data;
};

const authService = {
    login,
    signup,
    logout,
    updateProfile,
};

export default authService;
