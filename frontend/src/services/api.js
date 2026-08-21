import axios from 'axios';

const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || `http://${hostname}:5000`;

export const getImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `${BACKEND_URL}${url.startsWith('/') ? '' : '/'}${url}`;
};

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || `${BACKEND_URL}/api`
});

api.interceptors.request.use(

    (config) => {

        const token =
            localStorage.getItem('token');

        if (token) {

            config.headers.Authorization =
                `Bearer ${token}`;

        }

        return config;

    },

    (error) => {

        return Promise.reject(error);

    }

);

export default api;