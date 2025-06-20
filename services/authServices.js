import axiosInstance from '../config/axiosInstance';

export const loginService = async (phone, password) => {
  try {
    const response = await axiosInstance.post('/auth/login', {
      phone,
      password,
    });
    return response;
  } catch (error) {
    console.log('Error at authServices: ', error);
    throw error;
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
