import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { loginService } from '../services/authServices';

const useAuthStore = create((get, set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await loginService(email, password);
      const { user, accessToken } = response.data;

      await SecureStore.setItemAsync('accessToken', accessToken);

      set({
        user: user,
        accessToken,
        isAuthenticated: true,
        isLoading: false,
      });

      return response;
    } catch (error) {
      set({
        error: error.message || 'Đăng nhập thất bại',
        isLoading: false,
      });
      throw error;
    }
  },

  logout: async () => {
    await SecureStore.deleteItemAsync('accessToken');
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
    });
  },

  setUser: (user) => set({ user }),
  setAccessToken: (token) => set({ accessToken: token }),
}));

export default useAuthStore;
