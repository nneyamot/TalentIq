// import axios from "axios";

// const axiosInstance = axios.create({
//   baseURL: import.meta.env.VITE_API_URL,
//   withCredentials: true, // by adding this field browser will send the cookies to server automatically, on every single req
// });

// export default axiosInstance;

// import axios from "axios";

// // Get base URL from environment or default to local/Render backend
// const rawBaseUrl = import.meta.env.VITE_API_URL || "https://backend-iq.onrender.com";

// // Ensure the URL always ends with "/api" regardless of environment settings
// const baseURL = rawBaseUrl.endsWith("/api") 
//   ? rawBaseUrl 
//   : `${rawBaseUrl.replace(/\/$/, "")}/api`;

// const axiosInstance = axios.create({
//   baseURL,
//   withCredentials: true,
// });

// export default axiosInstance;

import axios from "axios";

// Get base URL from environment or fallback to your live Render backend
const rawBaseUrl = import.meta.env.VITE_API_URL || "https://backend-iq.onrender.com";

// Ensure the URL always ends with "/api" regardless of formatting
const baseURL = rawBaseUrl.endsWith("/api") 
  ? rawBaseUrl 
  : `${rawBaseUrl.replace(/\/$/, "")}/api`;

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});

// Attach Clerk Session Token to headers on every request
axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      // Check if Clerk is loaded on the window object
      if (window.Clerk && window.Clerk.session) {
        const token = await window.Clerk.session.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (error) {
      console.error("Error attaching Clerk token to request:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;