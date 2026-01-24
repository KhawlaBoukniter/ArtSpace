import axios from "axios";

// Use environment variable with fallback to localhost
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || "http://localhost:8000/api",
});

// Request interceptor: add auth token if available
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    // Do not attach token for login/register endpoints to avoid issues
    if (token && !config.url?.includes("/login") && !config.url?.includes("/register")) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor: handle errors gracefully
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Normalize error object for consistent handling
        const normalizedError = {
            message: error.response?.data?.message || error.message || "An error occurred",
            status: error.response?.status,
            data: error.response?.data,
        };

        // Log friendly error for debugging
        console.error(`[API Error] ${normalizedError.message}`, {
            status: normalizedError.status,
            data: normalizedError.data,
            url: error.config?.url
        });

        return Promise.reject(normalizedError);
    }
);

export default api;