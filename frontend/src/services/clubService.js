import api from './api';

const API_URL = '/api/clubs';

const getAllClubs = async () => {
    const response = await api.get(API_URL);
    return response.data;
};

const getClubById = async (id) => {
    const response = await api.get(`${API_URL}/${id}`);
    return response.data;
};

const getMyClubProfile = async () => {
    const response = await api.get(`${API_URL}/myprofile`);
    return response.data;
};

const updateClubProfile = async (profileData) => {
    // profileData can be FormData for image uploads
    const response = await api.post(API_URL, profileData);
    return response.data;
};

const clubService = {
    getAllClubs,
    getClubById,
    getMyClubProfile,
    updateClubProfile,
};

export default clubService;
