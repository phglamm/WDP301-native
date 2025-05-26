import axiosInstance from "../config/axiosInstance";

export const createAccidentEvent = async (accidentData) => {
  try {
    const response = await axiosInstance.post("/accident", accidentData);
    if (response.code === 201 && response.status) {
      return response;
    }
    return null;
  } catch (error) {
    console.log("Error at createAccidentEvent: ", error);
    throw error.response?.data || error.message;
  }
};

export const getAccidentHistory = async () => {
  try {
    const response = await axiosInstance.get(`/accident`);
    return response;
  } catch (error) {
    console.log("Error at getAccidentHistory: ", error);
    throw error.response?.data || error.message;
  }
};

export const getAccidentById = async (accidentId) => {
  try {
    const response = await axiosInstance.get(`/accident/${accidentId}`);
    return response;
  } catch (error) {
    console.log("Error at getAccidentById: ", error);
    throw error.response?.data || error.message;
  }
};
