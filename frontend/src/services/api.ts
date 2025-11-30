import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

api.interceptors.request.use(async (config) => {
  // O nome da chave do token pode ser ajustado conforme a sua implementação de login
  const token = localStorage.getItem('authToken'); 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("Token found in localStorage:", token);
    console.log("Authorization header set:", config.headers.Authorization);
  } else {
    console.log("No token found in localStorage.");
  }
  return config;
});

export default api;
