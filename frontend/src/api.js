import axios from 'axios';

const backend = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
});

export const getCSRFToken = () => {
  return document.cookie
      .split("; ")
      .find(row => row.startsWith("csrftoken="))
      ?.split("=")[1];
};

backend.interceptors.request.use(config => {
  config.withCredentials = true;
  if (['post', 'put', 'delete'].includes(config.method?.toLowerCase())) {
    config.headers['X-CSRFToken'] = getCSRFToken();
  }
  return config;
});

export default backend;
