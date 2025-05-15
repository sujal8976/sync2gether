// axiosInstance.ts
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { useUserStore } from "@/store/user";

export const baseURL = `${import.meta.env.VITE_API_URL}/api/v1`;

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});

// Correct request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Example: Attach authorization headers if needed
    // config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Correct response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const response = await axios.post(
          `${baseURL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newAccessToken: string = response.data.newAccessToken;
        if (newAccessToken)
          useUserStore.getState().setAccessToken(newAccessToken);

        return api(originalRequest); // Retry the original request after token refresh
      } catch (refreshError) {

        useUserStore.getState().removeUser();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
