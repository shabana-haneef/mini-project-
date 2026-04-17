import api from './api';

const getPendingEvents = async () => {
    const response = await api.get('/api/admin/events/pending');
    return response.data;
};

const updateEventStatus = async (id, status) => {
    const response = await api.put(`/api/admin/events/${id}/status`, { status });
    return response.data;
};

const getPendingClubs = async () => {
    const response = await api.get('/api/admin/clubs/pending');
    return response.data;
};

const updateClubStatus = async (id, status) => {
    const response = await api.put(`/api/admin/clubs/${id}/status`, { status });
    return response.data;
};

const getAllUsers = async () => {
    const response = await api.get('/api/admin/users');
    return response.data;
};

const deleteUser = async (id) => {
    const response = await api.delete(`/api/admin/users/${id}`);
    return response.data;
};

export default {
    getPendingEvents,
    updateEventStatus,
    getPendingClubs,
    updateClubStatus,
    getAllUsers,
    deleteUser,
};
