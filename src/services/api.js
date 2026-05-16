import axios from 'axios';

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api', timeout: 30000 });

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.dispatchEvent(new Event('auth-error'));
    }
    if (err.response?.status === 500) {
      console.error('Server Error:', err.response?.data?.message || err.message);
    }
    return Promise.reject(err);
  }
);

export default API;
