import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token && token !== 'undefined') {
      config.headers.Authorization = Bearer ;
    } else {
      localStorage.removeItem('authToken');
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem('authToken');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const api = {
  async getHabits() {
    const response = await apiClient.get('/habits');
    return Array.isArray(response.data) ? response.data : response.data.habits || [];
  },

  async createHabit(habitData) {
    const response = await apiClient.post('/habits', habitData);
    return response.data;
  },

  async deleteHabit(habitId) {
    const response = await apiClient.delete(/habits/);
    return response.data;
  },

  async updateHabit(habitId, habitData) {
    const response = await apiClient.patch(/habits/, habitData);
    return response.data;
  },

  async checkHabit(habitId) {
    const response = await apiClient.patch(/habits//check);
    return response.data;
  },

  async getCategories() {
    const response = await apiClient.get('/categories');
    return response.data;
  },

  async createCategory(categoryData) {
    const response = await apiClient.post('/categories', categoryData);
    return response.data;
  },

  async updateCategory(categoryId, categoryData) {
    const response = await apiClient.patch(/categories/, categoryData);
    return response.data;
  },

  async deleteCategory(categoryId) {
    await apiClient.delete(/categories/);
  },

  async login(credentials) {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },

  async register(userData) {
    await apiClient.post('/auth/register', userData);
  },
};
