import api from './api';

const getTeamMembers = async (clubId) => {
    const response = await api.get(`/api/team-members/club/${clubId}`);
    return response.data;
};

const createTeamMember = async (teamData) => {
    const response = await api.post('/api/team-members', teamData);
    return response.data;
};

const updateTeamMember = async (id, teamData) => {
    const response = await api.put(`/api/team-members/${id}`, teamData);
    return response.data;
};

const deleteTeamMember = async (id) => {
    const response = await api.delete(`/api/team-members/${id}`);
    return response.data;
};

export default {
    getTeamMembers,
    createTeamMember,
    updateTeamMember,
    deleteTeamMember
};
