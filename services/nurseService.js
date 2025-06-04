import axiosInstance from "../config/axiosInstance";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as MediaLibrary from "expo-media-library";
import { Alert, Platform } from "react-native";

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

export const updateAccidentEvent = async (accidentId, accidentData) => {
  try {
    const response = await axiosInstance.put(
      `/accident/${accidentId}`,
      accidentData
    );
    return response;
  } catch (error) {
    console.log("Error at updateAccidentEvent: ", error);
    throw error.response?.data || error.message;
  }
};

export const deleteAccidentEvent = async (accidentId) => {
  try {
    const response = await axiosInstance.delete(`/accident/${accidentId}`);
    return response;
  } catch (error) {
    console.log("Error at deleteAccidentEvent: ", error);
    throw error.response?.data || error.message;
  }
};

export const getRegisteredStudents = async (id) => {
  try {
    const response = await axiosInstance.get(`/injection-event/${id}/students`);
    return response;
  } catch (error) {
    console.log("Error at getRegisteredStudents: ", error);
    throw error.response?.data || error.message;
  }
};

export const getAvailableEvent = async () => {
  try {
    const response = await axiosInstance.get("/injection-event/available");
    return response;
  } catch (error) {
    console.log("Error at getAvailableEvent: ", error);
    throw error.response?.data || error.message;
  }
};

export const createInjectionEvent = async (eventData) => {
  try {
    const response = await axiosInstance.post(`/injection-event`, eventData);
    return response;
  } catch (error) {
    console.log("Error at registerStudentToEvent: ", error);
    throw error.response?.data || error.message;
  }
};

export const getVaccination = async () => {
  try {
    const response = await axiosInstance.get(`/vaccination`);
    return response;
  } catch (error) {
    console.log("Error at getVaccination: ", error);
    throw error.response?.data || error.message;
  }
};

export const downloadStudentsList = async (eventId) => {
  try {
    // Show loading state
    setLoading((prev) => ({ ...prev, downloading: true }));

    // Define the download URL
    const downloadUrl = `https://wdp301-se1752-be.onrender.com/injection-event/${eventId}/students`;

    // Create file name with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const fileName = `students_data_event_${eventId}_${timestamp}.xlsx`;

    // Define file URI (temporary location)
    const fileUri = FileSystem.documentDirectory + fileName;

    console.log("Starting download from:", downloadUrl);
    console.log("Saving to:", fileUri);

    // Download the file
    const downloadResult = await FileSystem.downloadAsync(
      downloadUrl,
      fileUri,
      {
        headers: {
          Accept: "*/*",
          // Add authorization header if needed
          // 'Authorization': `Bearer ${yourAuthToken}`,
        },
      }
    );

    if (downloadResult.status === 200) {
      console.log("Download completed successfully");

      // Check if sharing is available
      const sharingAvailable = await Sharing.isAvailableAsync();

      if (sharingAvailable) {
        // Option 1: Share the file (recommended for most cases)
        await Sharing.shareAsync(downloadResult.uri, {
          mimeType:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          dialogTitle: "Save Students Data",
          UTI: "com.microsoft.excel.xlsx",
        });

        Alert.alert(
          "Download Complete",
          "File has been downloaded and shared. You can save it to your device from the share menu."
        );
      } else {
        // Fallback if sharing is not available
        Alert.alert(
          "Download Complete",
          "File downloaded successfully but sharing is not available on this device."
        );
      }
    } else {
      throw new Error(`Download failed with status: ${downloadResult.status}`);
    }
  } catch (error) {
    console.error("Download error:", error);
    Alert.alert(
      "Download Failed",
      `Could not download the file: ${error.message}`
    );
  } finally {
    setLoading((prev) => ({ ...prev, downloading: false }));
  }
};

// Alternative method: Save to device's Downloads folder (Android) or Photos (iOS)
export const downloadAndSaveToDevice = async (eventId) => {
  try {
    setLoading((prev) => ({ ...prev, downloading: true }));

    // Request permissions for media library (needed to save files)
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Permission to access media library is required to save files."
      );
      return;
    }

    const downloadUrl = `https://wdp301-se1752-be.onrender.com/injection-event/${eventId}/students`;
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const fileName = `students_data_event_${eventId}_${timestamp}.xlsx`;
    const fileUri = FileSystem.documentDirectory + fileName;

    // Download the file
    const downloadResult = await FileSystem.downloadAsync(
      downloadUrl,
      fileUri,
      {
        headers: {
          Accept: "*/*",
          // Add authorization if needed
        },
      }
    );

    if (downloadResult.status === 200) {
      if (Platform.OS === "android") {
        // On Android, save to Downloads folder
        const asset = await MediaLibrary.createAssetAsync(downloadResult.uri);
        const album = await MediaLibrary.getAlbumAsync("Download");

        if (album == null) {
          await MediaLibrary.createAlbumAsync("Download", asset, false);
        } else {
          await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
        }

        Alert.alert("Success", "File saved to Downloads folder");
      } else {
        // On iOS, use sharing
        await Sharing.shareAsync(downloadResult.uri);
      }
    } else {
      throw new Error(`Download failed with status: ${downloadResult.status}`);
    }
  } catch (error) {
    console.error("Download and save error:", error);
    Alert.alert("Error", `Failed to download and save file: ${error.message}`);
  } finally {
    setLoading((prev) => ({ ...prev, downloading: false }));
  }
};

export const getMedicineRequestToday = async () => {
  try {
    const response = await axiosInstance.get(`/medicine-request/today`);
    return response;
  } catch (error) {
    console.log("Error at getVaccination: ", error);
    throw error.response?.data || error.message;
  }
};

export const getMedicineRequestDetail = async (requestId) => {
  try {
    const response = await axiosInstance.get(`/medicine-request/${requestId}`);
    return response;
  } catch (error) {
    console.log("Error at getMedicineRequestById: ", error);
    throw error.response?.data || error.message;
  }
};

export const getAllStudent = async () => {
  try {
    const response = await axiosInstance.get(`/student`);
    return response;
  } catch (error) {
    console.log("Error at getAllStudents: ", error);
    throw error.response?.data || error.message;
  }
};

export const getMedicine = async () => {
  try {
    const response = await axiosInstance.get(`/medicine`);
    return response;
  } catch (error) {
    console.log("Error at getStudentById: ", error);
    throw error.response?.data || error.message;
  }
};

export const createAccidentMedicine = async (requestData) => {
  try {
    const response = await axiosInstance.post(
      `/accident-medicine`,
      requestData
    );
    return response;
  } catch (error) {
    console.log("Error at createMedicineRequest: ", error);
    throw error.response?.data || error.message;
  }
};
