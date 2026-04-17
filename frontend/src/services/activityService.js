import api from './api';

const API_URL = '/api/activity-posts';

const getPosts = async (clubId) => {
    const url = clubId ? `${API_URL}?clubId=${clubId}` : API_URL;
    const response = await api.get(url);
    return response.data;
};

const createPost = async (postData) => {
    const response = await api.post(API_URL, postData);
    return response.data;
};

const deletePost = async (id) => {
    const response = await api.delete(`${API_URL}/${id}`);
    return response.data;
};

const activityService = {
    getPosts,
    createPost,
    deletePost,
};

export default activityService;
