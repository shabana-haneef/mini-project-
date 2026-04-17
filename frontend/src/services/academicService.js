import api from "./api";

const API_URL = "/api/academic";
const CONTENT_API_URL = "/api/academic-content";

const getUniversities = async () => {
  const response = await api.get(`${API_URL}/universities`);
  return response.data;
};

const getSchemes = async (university) => {
  const response = await api.get(
    `${API_URL}/schemes?university=${university}`,
  );
  return response.data;
};

const getStreams = async (university, scheme) => {
  const response = await api.get(
    `${API_URL}/streams?university=${university}&scheme=${scheme}`,
  );
  return response.data;
};

const getSemesters = async (university, scheme, stream) => {
  const response = await api.get(
    `${API_URL}/semesters?university=${university}&scheme=${scheme}&stream=${stream}`,
  );
  return response.data;
};

const getSubjects = async (university, scheme, stream, semester) => {
  const response = await api.get(
    `${API_URL}/subjects?university=${university}&scheme=${scheme}&stream=${stream}&semester=${semester}`,
  );
  return response.data;
};

const searchContent = async (filters) => {
  const params = new URLSearchParams(filters).toString();
  const response = await api.get(`${CONTENT_API_URL}/search?${params}`);
  return response.data;
};

const getAllContent = async (mentorId = null) => {
  const params = mentorId ? `?mentor=${mentorId}` : "";
  const response = await api.get(`${CONTENT_API_URL}/search${params}`);
  return response.data;
};

const getSubjectContent = async (subjectId) => {
  const response = await api.get(`${CONTENT_API_URL}/subject/${subjectId}`);
  return response.data;
};

const deleteContent = async (id) => {
  const response = await api.delete(`${CONTENT_API_URL}/${id}`);
  return response.data;
};

const trackDownload = async (id) => {
  const response = await api.post(`${CONTENT_API_URL}/download/${id}`);
  return response.data;
};

const getMyDownloads = async () => {
  const response = await api.get(`${CONTENT_API_URL}/my-downloads`);
  return response.data;
};

const removeDownload = async (id) => {
  const response = await axios.delete(`${CONTENT_API_URL}/download/${id}`);
  return response.data;
};

const addComment = async (contentId, text) => {
  const response = await api.post(`${CONTENT_API_URL}/${contentId}/comment`, { text });
  // The API returns the updated comments array
  return response.data;
};

// getComments might not be needed anymore since comments are in the document,
// but keeping it as a stub or modifying if a specific route is needed later.
const getComments = async (contentId) => {
  // Return empty array for now or you can implement a separate GET route if desired
  return [];
};

const toggleLike = async (contentId) => {
  const response = await api.post(`${CONTENT_API_URL}/${contentId}/like`);
  return response.data;
};

const deleteComment = async (commentId) => {
  const response = await api.delete(`/api/comments/${commentId}`);
  return response.data;
};

const rateContent = async (contentId, rating) => {
  const response = await api.post(`${CONTENT_API_URL}/${contentId}/rate`, { rating });
  return response.data;
};

const academicService = {
  getUniversities,
  getSchemes,
  getStreams,
  getSemesters,
  getSubjects,
  searchContent,
  getSubjectContent,
  getAllContent,
  deleteContent,
  trackDownload,
  getMyDownloads,
  removeDownload,
  addComment,
  getComments,
  deleteComment,
  getMentorAnalytics: async () => {
    const response = await api.get(`${CONTENT_API_URL}/mentor-analytics`);
    return response.data;
  },
  toggleLike,
  rateContent,
};

export default academicService;
