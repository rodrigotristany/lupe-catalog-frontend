import axios from 'axios';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('lupe_admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRequest = error.config?.url?.includes('/admin/login');
    if (error.response?.status === 401 && !isLoginRequest) {
      localStorage.removeItem('lupe_admin_token');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export default client;
