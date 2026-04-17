import axios from 'axios';

const API_URL = '/api/notifications';

const getNotifications = async () => {
    const { data } = await axios.get(API_URL);
    return data;
};

const markAsRead = async (id) => {
    const { data } = await axios.put(`${API_URL}/${id}/read`);
    return data;
};

const deleteNotification = async (id) => {
    const { data } = await axios.delete(`${API_URL}/${id}`);
    return data;
};

export default {
    getNotifications,
    markAsRead,
    deleteNotification,
};
