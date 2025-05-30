import axiosInstance from '../config/axiosInstance';

export const getMySonService = async () => {
  try {
    const response = await axiosInstance.get('/student/parent');
    return response;
  } catch (error) {
    console.log('Error at parentServices: ', error);
    throw error;
  }
};

export const createHealthProfileService = async (healthData) => {
  try {
    const response = await axiosInstance.post('/health-profile', healthData);
    if (response.code === 201 && response.status) {
      return response;
    }
    return null;
  } catch (error) {
    console.log('Error creating health profile: ', error);
    throw error;
  }
};

export const getHealthProfileHistoryService = async (studentId) => {
  try {
    const response = await axiosInstance.get(
      `/health-profile/student/${studentId}?id=${studentId}`
    );
    return response;
  } catch (error) {
    console.log('Error getting health profile history: ', error);
    throw error;
  }
};

export const sendMedicineRequestService = async (imageUri, studentId, note) => {
  try {
    const formData = new FormData();

    const filename = imageUri.split('/').pop();
    const match = /\.(\w+)$/.exec(filename ?? '');
    const type = match ? `image/${match[1]}` : `image`;

    formData.append('image', {
      uri: imageUri,
      name: filename,
      type,
    });

    formData.append('studentId', studentId);
    if (note && note.trim()) {
      formData.append('note', note);
    }
    const response = await axiosInstance.post('/medicine-request', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  } catch (error) {
    console.log('Error sending medicine request: ', error);
    throw error;
  }
};

export const getSendMedicineRequestHistoryService = async () => {
  try {
    const response = await axiosInstance.get('/medicine-request/parent');
    return response;
  } catch (error) {
    console.log('Error getting send medicine request history: ', error);
    throw error;
  }
};

export const getChatHistoryService = async () => {
  try {
    const response = await axiosInstance.get('/chat-ai');
    return response;
  } catch (error) {
    console.log('Error getting chat history: ', error);
    throw error;
  }
};

export const sendChatMessageService = async (message) => {
  try {
    const response = await axiosInstance.post('/chat-ai', {
      content: message,
    });
    return response;
  } catch (error) {
    console.log('Error sending chat message: ', error);
    throw error;
  }
};

// Vaccine Services
export const getVaccinationsService = async () => {
  try {
    const response = await axiosInstance.get('/vaccination');
    return response;
  } catch (error) {
    console.log('Error getting vaccinations: ', error);
    throw error;
  }
};

export const declareVaccinationService = async (vaccinationData) => {
  try {
    const response = await axiosInstance.post(
      '/vaccination/student',
      vaccinationData
    );
    return response;
  } catch (error) {
    console.log('Error creating vaccination record: ', error);
    throw error;
  }
};
