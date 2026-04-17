import api from './api';

const API_URL = '/api/events';

const getEvents = async () => {
    const response = await api.get(API_URL);
    return response.data;
};

const getAllEventsForAdmin = async () => {
    const response = await api.get(`${API_URL}/admin`);
    return response.data;
};

const getClubEvents = async () => {
    const response = await api.get(`${API_URL}/manage`);
    return response.data;
};

const getEventById = async (id) => {
    const response = await api.get(`${API_URL}/${id}`);
    return response.data;
};

const createEvent = async (eventData) => {
    const response = await api.post(API_URL, eventData);
    return response.data;
};

const updateEvent = async (id, eventData) => {
    const response = await api.put(`${API_URL}/${id}`, eventData);
    return response.data;
};

const updateEventStatus = async (id, status) => {
    const response = await api.put(`${API_URL}/${id}/status`, { status });
    return response.data;
};

const registerForEvent = async (id) => {
    const response = await api.post(`${API_URL}/${id}/register`);
    return response.data;
};

const deleteEvent = async (id) => {
    const response = await api.delete(`${API_URL}/${id}`);
    return response.data;
};

const eventService = {
    getEvents,
    getAllEventsForAdmin,
    getClubEvents,
    getEventById,
    createEvent,
    updateEvent,
    updateEventStatus,
    registerForEvent,
    deleteEvent,
};

export default eventService;
