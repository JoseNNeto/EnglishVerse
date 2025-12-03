import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

api.interceptors.request.use(async (config) => {
  // Adiciona o header para pular o aviso do ngrok
  config.headers['ngrok-skip-browser-warning'] = 'true';

  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    // console.log("Token found in localStorage:", token);
    // console.log("Authorization header set:", config.headers.Authorization);
  } else {
    console.log("No token found in localStorage.");
  }
  return config;
});

export default api;
