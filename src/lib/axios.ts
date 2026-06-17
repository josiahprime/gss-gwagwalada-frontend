import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { useAuthStore } from '../store/auth/useAuthStore';
import socket from './socket';

// export const axiosInstance = axios.create({
//   // ✅ Change this to a relative path. Next.js rewrites will handle the rest!
//   baseURL: 'https://gss-gwagwalada-backend-production.up.railway.app/api',
//   withCredentials: true,
// });

export const axiosInstance = axios.create({
  // ✅ Change this to a relative path. Next.js rewrites will handle the rest!
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  withCredentials: true,
});


let isRefreshing = false;
let failedQueue: { resolve: (value?: unknown) => void; reject: (reason?: unknown) => void }[] = [];

const processQueue = (error: Error | null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(true);
  });
  failedQueue = [];
};

interface RetryAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

// Request interceptor: pass through
axiosInstance.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// Response interceptor for auto-refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryAxiosRequestConfig;
    const store = useAuthStore.getState();
    console.log('store.isloggedout state', store.isLoggedOut)

    // If user is already logged out, don't retry
    if (store.isLoggedOut) {
      return Promise.reject(error);
    }

    // Avoid retry loops
    if (originalRequest?._retry || originalRequest?.url?.includes('/auth/refresh')) {
      return Promise.reject(error);
    }

    // Handle 401 (unauthorized)
    if (error.response?.status === 401) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => axiosInstance(originalRequest));
      }

      isRefreshing = true;

      try {
        const res = await axiosInstance.get('/auth/refresh');
        const newToken = res.data.accessToken;

        store.setAccessToken?.(newToken); // update in-memory token
        if (socket.connected) {
          socket.disconnect().connect(); 
        }
        processQueue(null);

        originalRequest._retry = true;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as Error);

        // Automatic logout: mark reason as 'auto' to suppress toasts
        store.logout?.('auto');
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;




