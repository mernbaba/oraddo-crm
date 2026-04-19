import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5001",
  headers: {
    "Content-Type": "application/json"
  }
});

// ── JWT Auth Interceptor ────────────────────────────────────────────────────
// Reads the JWT token from localStorage (set on login) and injects it into
// every outgoing request as: Authorization: Bearer <token>
api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("authToken") ||
      localStorage.getItem("adminToken");
    if (token) {
      config.headers = config.headers ?? {};
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Global Response Error Handler ──────────────────────────────────────────
// If the server returns 401 (token expired / invalid), clear storage so the
// user gets redirected to login on the next navigation cycle.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("authToken");
      localStorage.removeItem("adminToken");
      // Optional: trigger a redirect — uncomment if your app uses React Router
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;