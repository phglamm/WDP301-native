import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import envConfig from './envConfig';

let API_URL = envConfig.EXPO_PUBLIC_API_URL;
let TOKEN_KEY = envConfig.EXPO_PUBLIC_TOKEN_KEY;

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 100000,
  // Bỏ default Content-Type để tránh xung đột với multipart/form-data
  // headers: {
  //   'Content-Type': 'application/json',
  // },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  async (response) => {
    const { code, status, message, data } = response.data;

    if ((code === 200 || code === 201) && status === true) {
      if (data?.access_token) {
        await SecureStore.setItemAsync(TOKEN_KEY, data.access_token);
      }
      return response.data;
    }

    // unauthorized
    if (code === 401) {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      return Promise.reject({
        message: message || 'Unauthorized',
        statusCode: 401,
        data,
      });
    }

    // other non-success codes
    return Promise.reject({
      message: message || 'Đã xảy ra lỗi',
      statusCode: code,
      data,
    });
  },
  async (error) => {
    // Network or no response
    if (!error.response) {
      return Promise.reject({
        message: 'Không thể kết nối đến máy chủ.',
        statusCode: 500,
      });
    }

    // In case backend sends non-200 HTTP, fallback to old logic
    const { data, status } = error.response;

    if (status === 401) {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    }

    return Promise.reject({
      message: data?.message || 'Đã xảy ra lỗi',
      statusCode: status,
      data,
    });
  }
);

export default axiosInstance;
