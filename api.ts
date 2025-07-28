import axios from 'axios';

// Используем переменную окружения для базового URL.
// Если она не задана, по умолчанию используем localhost для локальной разработки.
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
// Настраиваем базовый клиент axios
const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// --- Interceptor для добавления JWT токена ---
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export interface AuthResponse {
  token: string;
  // Можно добавить и другие данные пользователя, если бэкенд их возвращает
}

export interface NewHabitData {
  name: string;
  categoryId?: string;
}

export interface UpdateHabitData {
  name: string;
  // ...другие поля, которые можно обновлять
}

export interface Habit {
  _id: string;
  name: string;
  // ... другие поля, например, история отметок, категория и т.д.
}

export interface Category {
  _id: string;
  name: string;
}

export const api = {
  getHabits: async (): Promise<Habit[]> => {
    const response = await apiClient.get('/habits');
    return response.data;
  },

  createHabit: async (habitData: NewHabitData): Promise<Habit> => {
    const response = await apiClient.post('/habits', habitData);
    return response.data;
  },

  deleteHabit: async (habitId: string) => {
    const response = await apiClient.delete(`/habits/${habitId}`);
    return response.data;
  },

  updateHabit: async (habitId: string, habitData: UpdateHabitData): Promise<Habit> => {
    const response = await apiClient.patch(`/habits/${habitId}`, habitData);
    return response.data;
  },

  checkHabit: async (habitId: string): Promise<Habit> => {
    const response = await apiClient.patch(`/habits/${habitId}/check`);
    return response.data;
  },

  getCategories: async (): Promise<Category[]> => {
    const response = await apiClient.get('/categories');
    return response.data;
  },

  createCategory: async (categoryData: { name: string }): Promise<Category> => {
    const response = await apiClient.post('/categories', categoryData);
    return response.data;
  },

  updateCategory: async (categoryId: string, categoryData: { name: string }): Promise<Category> => {
    const response = await apiClient.patch(`/categories/${categoryId}`, categoryData);
    return response.data;
  },

  deleteCategory: async (categoryId: string): Promise<void> => {
    // Этот эндпоинт обычно не возвращает тело ответа
    await apiClient.delete(`/categories/${categoryId}`);
  },

  login: async (credentials: { email: string, password: string }): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },

  register: async (userData: { name: string, email: string, password: string }): Promise<void> => {
    await apiClient.post('/auth/register', userData);
  },
  // ...здесь будут другие функции для работы с API
};