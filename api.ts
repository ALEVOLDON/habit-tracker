import axios from 'axios';

// Настраиваем базовый клиент axios
const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api', // Укажите URL вашего бэкенда
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

export interface Category {
  _id: string;
  name: string;
}

export const api = {
  getHabits: async () => {
    const response = await apiClient.get('/habits');
    return response.data;
  },

  createHabit: async (habitData: NewHabitData) => {
    const response = await apiClient.post('/habits', habitData);
    return response.data;
  },

  deleteHabit: async (habitId: string) => {
    const response = await apiClient.delete(`/habits/${habitId}`);
    return response.data;
  },

  updateHabit: async (habitId: string, habitData: UpdateHabitData) => {
    const response = await apiClient.patch(`/habits/${habitId}`, habitData);
    return response.data;
  },

  checkHabit: async (habitId: string) => {
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