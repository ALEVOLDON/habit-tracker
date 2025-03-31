import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor for error handling
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

export const register = async (email, password) => {
  const response = await api.post('/auth/register', { email, password });
  return response.data.token;
};

export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data.token;
};

export const getHabits = async (token) => {
  const response = await api.get('/habits', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const addHabit = async (token, title, frequency) => {
  const response = await api.post('/habits', 
    { title, frequency },
    { headers: { Authorization: `Bearer ${token}` }}
  );
  return response.data;
};

export const checkHabit = async (token, habitId) => {
  const response = await api.patch(`/habits/${habitId}/check`,
    {},
    { headers: { Authorization: `Bearer ${token}` }}
  );
  return response.data;
};
