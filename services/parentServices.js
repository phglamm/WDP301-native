import axiosInstance from '../config/axiosInstance';

// My Son - Danh sách con
export const getMySonService = async () => {
  try {
    const response = await axiosInstance.get('/student/parent');
    return response;
  } catch (error) {
    console.log('Error at parentServices: ', error);
    throw error;
  }
};

// Health Profile - Tạo hồ sơ sức khỏe
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
// Health Profile - Lịch sử hồ sơ sức khỏe
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

// Medicine Request - Gửi ảnh yêu cầu thuốc
export const sendMedicineRequestImageService = async (imageUri) => {
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
    const response = await axiosInstance.post(
      '/medicine-request/image',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response;
  } catch (error) {
    console.log('Error sending medicine request image: ', error);
    throw error;
  }
};

// Medicine Request - Gửi yêu cầu thuốc
export const sendMedicineRequestService = async (data) => {
  try {
    const response = await axiosInstance.post('/medicine-request', data);
    return response;
  } catch (error) {
    console.log('Error sending medicine request: ', error);
    throw error;
  }
};
// Medicine Request - Lịch sử yêu cầu thuốc
export const getSendMedicineRequestHistoryService = async () => {
  try {
    const response = await axiosInstance.get('/medicine-request/parent');
    return response;
  } catch (error) {
    console.log('Error getting send medicine request history: ', error);
    throw error;
  }
};

// Chat AI - Lịch sử chat
export const getChatHistoryService = async () => {
  try {
    const response = await axiosInstance.get('/chat-ai');
    return response;
  } catch (error) {
    console.log('Error getting chat history: ', error);
    throw error;
  }
};
// Chat AI - Gửi tin nhắn
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

// Injection Event - Danh sách all event đang mở đăng ký
export const getAvailableInjectionEventService = async () => {
  try {
    const response = await axiosInstance.get('/injection-event/available');
    return response;
  } catch (error) {
    console.log('Error getting available injection event: ', error);
    throw error;
  }
};
// Injection Event - Danh sách event ba mẹ đã đăng ký cho student đó
export const getInjectionEventHadRegisteredService = async (studentId) => {
  try {
    const response = await axiosInstance.get(
      `/injection-record/student/${studentId}`
    );
    return response;
  } catch (error) {
    console.log('Error getting injection event had registered: ', error);
    throw error;
  }
};
// Injection Event - Đăng ký event
export const registerInjectionEventService = async (
  studentId,
  injectionEventId
) => {
  const studentIdString = studentId.toString();
  const injectionEventIdString = injectionEventId.toString();
  try {
    const response = await axiosInstance.post(`/injection-event/register`, {
      studentId: studentIdString,
      injectionEventId: injectionEventIdString,
    });
    return response;
  } catch (error) {
    console.log('Error registering injection event: ', error);
    throw error;
  }
};
// Injection Event - Kết quả tiêm
export const getInjectionEventResultService = async (studentId) => {
  try {
    const response = await axiosInstance.get(
      `/injection-record/student/${studentId}`
    );
    return response;
  } catch (error) {
    console.log('Error getting injection event result: ', error);
    throw error;
  }
};
// Injection Event Report History - Lịch sử báo cáo sau tiêm
export const getInjectionEventReportHistoryService = async (injectionId) => {
  try {
    const response = await axiosInstance.get(
      `/post-injection-report/injection-record/${injectionId}`
    );
    return response;
  } catch (error) {
    console.log('Error getting injection event report history: ', error);
    throw error;
  }
};
// Injection Event Report - Báo cáo sau tiêm
export const createInjectionEventReportService = async (reportData) => {
  try {
    const response = await axiosInstance.post(
      `/post-injection-report`,
      reportData
    );
    return response;
  } catch (error) {
    console.log('Error creating injection event report: ', error);
    throw error;
  }
};

// Vaccine Declaration - Danh sách all vaccine
export const getVaccinationsService = async () => {
  try {
    const response = await axiosInstance.get('/vaccination');
    return response;
  } catch (error) {
    console.log('Error getting vaccinations: ', error);
    throw error;
  }
};
// Vaccine Declaration - Danh sách vaccine đã khai báo
export const getVaccineHadDeclaredService = async (studentId) => {
  try {
    const response = await axiosInstance.get(
      `/vaccination/student/${studentId}`
    );
    return response;
  } catch (error) {
    console.log('Error getting vaccine had declared: ', error);
    throw error;
  }
};
// Vaccine Declaration - Khai báo tiêm chủng
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

// Appoinment - Danh sách lịch hẹn
export const getAppointmentService = async () => {
  try {
    const response = await axiosInstance.get('/appointment/user');
    return response;
  } catch (error) {
    console.log('Error getting appointment: ', error);
    throw error;
  }
};
// Appoinment - Chi tiết lịch hẹn
export const getAppointmentDetailService = async (appointmentId) => {
  try {
    const response = await axiosInstance.get(`/appointment/${appointmentId}`);
    return response;
  } catch (error) {
    console.log('Error getting appointment detail: ', error);
    throw error;
  }
};
// Appoinment - Cập nhật lịch hẹn
export const updateAppointmentDateService = async (
  appointmentId,
  appointmentDate
) => {
  try {
    const response = await axiosInstance.put(`/appointment/${appointmentId}`, {
      appointmentTime: appointmentDate,
    });
    return response;
  } catch (error) {
    console.log('Error updating appointment: ', error);
    throw error;
  }
};
