import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { loginService } from '../services/authServices';
import envConfig from '../config/envConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

let TOKEN_KEY = envConfig.EXPO_PUBLIC_TOKEN_KEY;
let USER_KEY = envConfig.EXPO_PUBLIC_USER_KEY;

export const useAuthStore = create((set) => ({
  user: null,
  access_token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (phone, password) => {
    set({ isLoading: true });
    try {
      const response = await loginService(phone, password);
      console.log('🚀 ~ login: ~ response:', response);
      // response = { code, status, message, data }
      if (response.code === 200 && response.status) {
        const { user, access_token } = response.data;

        await SecureStore.setItemAsync(TOKEN_KEY, access_token);
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));

        set({
          user,
          access_token,
          isAuthenticated: true,
        });
      } else {
        throw new Error('Dữ liệu đăng nhập không hợp lệ');
      }

      return response;
    } catch (error) {
      console.log('Error at useAuthStore: ', error);
      set({
        error: error?.message || JSON.stringify(error) || 'Đăng nhập thất bại',
      });

      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    try {
      // await logoutService();
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await AsyncStorage.removeItem(USER_KEY);
      set({
        user: null,
        access_token: null,
        isAuthenticated: false,
      });
    } catch (error) {
      console.log('Error at useAuthStore: ', error);
      set({ error: error || 'Đăng xuất thất bại' });
      throw error;
    }
  },

  initialize: async () => {
    set({ isLoading: true });
    try {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      const userString = await AsyncStorage.getItem(USER_KEY);
      const user = userString ? JSON.parse(userString) : null;

      if (token && user) {
        set({
          access_token: token,
          user: user,
          isAuthenticated: true,
        });
      }
    } catch (e) {
      console.log('Failed to load auth data from storage', e);
    } finally {
      set({ isLoading: false });
    }
  },
}));
