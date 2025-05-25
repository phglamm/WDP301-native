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
