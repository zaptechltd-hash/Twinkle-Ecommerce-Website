import axios from "axios";
import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
  clearTokens,
} from "../utils/token";
import { AuthEndpointsV1 } from "./auth/constants";

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

let isRefreshing = false;
let failedQueue: {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token!);
  });
  failedQueue = [];
};

// ─── Request Interceptor ───────────────────────────────────────────────────
axiosClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Response Interceptor ──────────────────────────────────────────────────
axiosClient.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    // If not a 401 or already retried, just reject
    if (err.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(err);
    }

    // Skip refresh for auth endpoints
    const isAuthEndpoint = Object.values(AuthEndpointsV1).some((url) =>
      originalRequest.url?.includes(url),
    );
    if (isAuthEndpoint) {
      return Promise.reject(err);
    }

    originalRequest._retry = true;

    // If a refresh is already in progress, queue this request
    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosClient(originalRequest);
        })
        .catch((e) => Promise.reject(e));
    }

    isRefreshing = true;

    try {
      const refreshToken = getRefreshToken();

      const payload = refreshToken
        ? JSON.parse(atob(refreshToken.split(".")[1]))
        : null;

      const refreshEndpoint =
        payload?.role === "admin"
          ? AuthEndpointsV1.adminRefresh
          : AuthEndpointsV1.customerRefresh;

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}${refreshEndpoint}`,
        {},
        { headers: { Authorization: `Bearer ${refreshToken}` } },
      );

      const newAccessToken: string = res.data.accessToken;
      const newRefreshToken: string = res.data.refreshToken; 

      setAccessToken(newAccessToken);
      setRefreshToken(newRefreshToken); 
      axiosClient.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;

      processQueue(null, newAccessToken);

      return axiosClient(originalRequest);
  } catch (refreshError) {
  processQueue(refreshError, null);

  // Determine role BEFORE clearing tokens
  const refreshToken = getRefreshToken();
  const payload = refreshToken
    ? (() => {
        try {
          return JSON.parse(atob(refreshToken.split(".")[1]));
        } catch {
          return null;
        }
      })()
    : null;

  clearTokens();

  if (typeof window !== "undefined") {
    const isAdminRoute = window.location.pathname.startsWith("/admin");
    const isAdmin = payload?.role === "admin" || isAdminRoute;
    window.location.href = isAdmin ? "/admin/login" : "/";
  }

  return Promise.reject(refreshError);
}finally {
      isRefreshing = false;
    }
  },
);

export default axiosClient;
