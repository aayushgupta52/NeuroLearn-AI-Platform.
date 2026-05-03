import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-refresh token on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const { data } = await axios.post(`${API_URL}/auth/refresh-token`, { refreshToken });
          localStorage.setItem('accessToken', data.accessToken);
          localStorage.setItem('refreshToken', data.refreshToken);
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
          return api(originalRequest);
        }
      } catch (err) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// Courses
export const courseAPI = {
  getAll: (params) => api.get('/courses', { params }),
  getById: (id) => api.get(`/courses/${id}`),
  enroll: (id) => api.post(`/courses/${id}/enroll`),
  getEnrolled: () => api.get('/courses/enrolled'),
  create: (data) => api.post('/courses', data),
};

// Lessons
export const lessonAPI = {
  getById: (id) => api.get(`/lessons/${id}`),
  complete: (id, data) => api.post(`/lessons/${id}/complete`, data),
  getByModule: (moduleId) => api.get(`/lessons/module/${moduleId}`),
};

// Quiz
export const quizAPI = {
  getById: (id) => api.get(`/quiz/${id}`),
  submit: (id, data) => api.post(`/quiz/${id}/submit`, data),
  getHistory: () => api.get('/quiz/history'),
};

// AI
export const aiAPI = {
  chat: (data) => api.post('/ai/chat', data),
  generateQuiz: (data) => api.post('/ai/generate-quiz', data),
  generateStudyPlan: (data) => api.post('/ai/study-plan', data),
  suggestVideos: (data) => api.post('/ai/suggest-videos', data),
  getSessions: () => api.get('/ai/sessions'),
  getMessages: (sessionId) => api.get(`/ai/sessions/${sessionId}/messages`),
};

// Analytics
export const analyticsAPI = {
  getOverview: () => api.get('/analytics/overview'),
  getPerformance: () => api.get('/analytics/performance'),
  getWeakAreas: () => api.get('/analytics/weak-areas'),
};

// Users
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  changePassword: (data) => api.put('/users/password', data),
  getAchievements: () => api.get('/users/achievements'),
  getLeaderboard: () => api.get('/users/leaderboard'),
};

// Study Plans
export const studyPlanAPI = {
  getAll: () => api.get('/study-plans'),
  getById: (id) => api.get(`/study-plans/${id}`),
  updateStatus: (id, status) => api.put(`/study-plans/${id}/status`, { status }),
};

export default api;
