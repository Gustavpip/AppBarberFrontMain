import axios from 'axios';

let apiUrl = import.meta.env.VITE_API_URL;

if (!apiUrl) {
  apiUrl = 'http://localhost:3000';
}

const api = axios.create({
  baseURL: apiUrl,
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.location.href = '/entrar';
      } else if (error.response.status >= 500) {
        console.error('Erro no servidor, tente novamente mais tarde.');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
