import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import envConfig from './envConfig';

const axiosInstance = axios.create({
  baseURL: envConfig.EXPO_PUBLIC_API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      const accessToken = await SecureStore.getItemAsync('accessToken');
      if (accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
      }
      return config;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    // ERROR NETWORK
    if (!error.response) {
      return Promise.reject({
        message: 'Không thể kết nối đến máy chủ.',
        status: 500,
      });
    }

    // ERROR 401
    if (error.response.status === 401) {
      await SecureStore.deleteItemAsync('accessToken');
    }

    // ERROR OTHER
    return Promise.reject({
      message: error.response?.data?.message || 'Đã xảy ra lỗi',
      status: error.response?.status,
      data: error.response?.data,
    });
  }
);

export default axiosInstance;
