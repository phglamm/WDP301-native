import axiosInstance from '../config/axiosInstance';

export const loginService = async (email, password) => {
  try {
    const response = await axiosInstance.post('/api/auth/login', {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.log('Error at authServices: ', error);
    throw error.response?.data || error.message;
  }
};

export const logoutService = async () => {
  try {
    const response = await axiosInstance.post('/api/auth/logout');
    return response.data;
  } catch (error) {
    console.log('Error at authServices: ', error);
    throw error.response?.data || error.message;
  }
};
