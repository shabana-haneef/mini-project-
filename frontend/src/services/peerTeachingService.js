import axios from "axios";

const API_URL = "/api/peer-teaching";

const getSessions = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

const getAllPeerTeaching = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

const getMySessions = async () => {
  const response = await axios.get(`${API_URL}/my`);
  return response.data;
};

const createSession = async (sessionData) => {
  const response = await axios.post(API_URL, sessionData);
  return response.data;
};

const expressInterest = async (id) => {
  const response = await axios.post(`${API_URL}/${id}/interest`);
  return response.data;
};

const peerTeachingService = {
  getSessions,
  getAllPeerTeaching,
  getMySessions,
  createSession,
  expressInterest,
};

export default peerTeachingService;
