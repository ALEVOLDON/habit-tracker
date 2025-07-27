import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Создаём axios-инстанс с базовым URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Перехватчик для обработки ошибок авторизации
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

// Регистрация пользователя, возвращает токен
export const register = async (email, password) => {
  const response = await api.post('/auth/register', { email, password });
  return response.data.token;
};

// Вход пользователя, возвращает токен
export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data.token;
};

// Получить все привычки пользователя
export const getHabits = async (token) => {
  const response = await api.get('/habits', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// Добавить новую привычку
export const addHabit = async (token, title, frequency) => {
  const response = await api.post('/habits', 
    { title, frequency },
    { headers: { Authorization: `Bearer ${token}` }}
  );
  return response.data;
};

// Отметить привычку как выполненную
export const checkHabit = async (token, habitId) => {
  const response = await api.patch(`/habits/${habitId}/check`,
    {},
    { headers: { Authorization: `Bearer ${token}` }}
  );
  return response.data;
};

// Обновить привычку (название, частота)
export const updateHabit = async (token, habitId, updates) => {
  const response = await api.patch(`/habits/${habitId}`,
    updates,
    { headers: { Authorization: `Bearer ${token}` }}
  );
  return response.data;
};

// Удалить привычку
export const deleteHabit = async (token, habitId) => {
  const response = await api.delete(`/habits/${habitId}`,
    { headers: { Authorization: `Bearer ${token}` }}
  );
  return response.data;
};

// Получить все категории пользователя
export const getCategories = async (token) => {
  const response = await api.get('/categories', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// Создать новую категорию
export const createCategory = async (token, name, color) => {
  const response = await api.post('/categories',
    { name, color },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

// Обновить категорию (название, цвет)
export const updateCategory = async (token, categoryId, updates) => {
  const response = await api.patch(`/categories/${categoryId}`,
    updates,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

// Удалить категорию
export const deleteCategory = async (token, categoryId) => {
  const response = await api.delete(`/categories/${categoryId}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};
