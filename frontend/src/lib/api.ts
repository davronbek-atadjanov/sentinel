import axios from "axios";

// Access token configuration
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Access token handler
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Token refresh and error handling logic
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }
        
        const response = await axios.post(`${API_URL}/auth/token/refresh/`, {
          refresh: refreshToken,
        });
        
        const { access } = response.data;
        
        localStorage.setItem("accessToken", access);
        
        // Update header for current request
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${access}`;
        }
        
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, clearly log out the user
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/";
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);
