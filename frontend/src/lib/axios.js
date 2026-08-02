// import axios from "axios";

// const axiosInstance = axios.create({
//   baseURL: import.meta.env.VITE_API_URL,
//   withCredentials: true, // by adding this field browser will send the cookies to server automatically, on every single req
// });

// export default axiosInstance;

import axios from "axios";

// Get base URL from environment or default to local/Render backend
const rawBaseUrl = import.meta.env.VITE_API_URL || "https://backend-iq.onrender.com";

// Ensure the URL always ends with "/api" regardless of environment settings
const baseURL = rawBaseUrl.endsWith("/api") 
  ? rawBaseUrl 
  : `${rawBaseUrl.replace(/\/$/, "")}/api`;

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});

export default axiosInstance;