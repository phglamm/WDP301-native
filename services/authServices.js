import axiosInstance from '../config/axiosInstance';

export const loginService = async (email, password) => {
  try {
    const response = await axiosInstance.post('/api/auth/login', {
      email,
      password,
    });
    console.log('Response at authServices: ', response.data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
