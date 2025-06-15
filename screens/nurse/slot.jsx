import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Platform,
  KeyboardAvoidingView,
  Image,
  Modal,
  TextInput,
} from "react-native";
import {
  ArrowLeft,
  Clock,
  Pill,
  User,
  CheckCircle,
  AlertCircle,
  Calendar,
  FileText,
  Users,
  Sun,
  Sunset,
  Moon,
  Camera,
  X,
  Upload,
} from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { set } from "zod";
import { completeSlotAPI, getSlotsAPI } from "../../services/nurseService";

export default function SlotScreen() {
  const router = useRouter();

  // Session tabs configuration
  const sessionTabs = [
    { key: "Sáng", label: "Sáng", icon: Sun },
    { key: "Trưa", label: "Trưa", icon: Sun },
    { key: "Chiều", label: "Chiều", icon: Sunset },
  ];

  // State management
  const [activeSession, setActiveSession] = useState("Sáng");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  // Slots data and loading state

  const [slotsData, setSlotsData] = useState({});
  const [loading, setLoading] = useState({
    slots: false,
    refreshing: false,
  });

  // Load data on component mount and when session changes
  useEffect(() => {
    loadSlots(activeSession);
  }, [activeSession]);

  // API call with session parameter
  const loadSlots = async (session) => {
    setLoading((prev) => ({ ...prev, slots: true }));
    try {
      const response = await getSlotsAPI(session);
      setSlotsData(response.data);
    } catch (error) {
      Alert.alert("Lỗi", "Không thể tải danh sách phân công phát thuốc");
      console.error("Load slots error:", error);
    } finally {
      setLoading((prev) => ({ ...prev, slots: false }));
    }
  };

  const onRefresh = async () => {
    setLoading((prev) => ({ ...prev, refreshing: true }));
    await loadSlots(activeSession);
    setLoading((prev) => ({ ...prev, refreshing: false }));
  };

  const handleTabPress = (sessionKey) => {
    setActiveSession(sessionKey);
  };

  const handleSlotPress = (slot) => {
    // Open modal instead of direct confirmation
    setSelectedSlot(slot);
    if (slot.status === true) {
      Alert.alert(
        "Thông báo",
        "Phân công này đã được xác nhận phát thuốc trước đó."
      );
      return;
    }
    setModalVisible(true);
    setUploadedImage(null);
  };

  const handleCompleteSlot = async (slot, image) => {
    console.log(image);
    try {
      setIsUploading(true);

      // Create FormData for image upload
      const formData = new FormData();

      const filename = image.split("/").pop();
      const match = /\.(\w+)$/.exec(filename ?? "");
      const type = match ? `image/${match[1]}` : `image`;

      formData.append("image", {
        uri: image,
        name: filename,
        type,
      });
      console.log("formData", formData);
      // API call to complete slot with image
      const response = await completeSlotAPI(slot.id, formData);
      console.log(response);
      // Update local state
      const updatedSlotsData = { ...slotsData };
      Object.keys(updatedSlotsData).forEach((className) => {
        updatedSlotsData[className] = updatedSlotsData[className].map((s) =>
          s.id === slot.id ? { ...s, status: true } : s
        );
      });
      setSlotsData(updatedSlotsData);

      // Close modal and reset state
      setModalVisible(false);
      setSelectedSlot(null);
      setUploadedImage(null);

      Alert.alert("Thành công", "Đã cập nhật trạng thái phát thuốc");
    } catch (error) {
      Alert.alert("Lỗi", "Không thể cập nhật trạng thái");
    } finally {
      setIsUploading(false);
    }
  };

  const pickImage = async () => {
    try {
      // Request camera permissions
      const cameraPermission =
        await ImagePicker.requestCameraPermissionsAsync();
      const mediaLibraryPermission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (
        cameraPermission.status !== "granted" ||
        mediaLibraryPermission.status !== "granted"
      ) {
        Alert.alert(
          "Cần quyền truy cập",
          "Vui lòng cấp quyền truy cập camera và thư viện ảnh"
        );
        return;
      }

      Alert.alert("Chọn ảnh", "Bạn muốn chọn ảnh từ đâu?", [
        {
          text: "Camera",
          onPress: () => openImagePicker("camera"),
        },
        {
          text: "Thư viện",
          onPress: () => openImagePicker("library"),
        },
        {
          text: "Hủy",
          style: "cancel",
        },
      ]);
    } catch (error) {
      console.error("Error requesting permissions:", error);
    }
  };

  const openImagePicker = async (source) => {
    try {
      let result;

      if (source === "camera") {
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.8,
        });
      } else {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.8,
        });
      }

      if (!result.canceled && result.assets && result.assets[0]) {
        setUploadedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Lỗi", "Không thể chọn ảnh");
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedSlot(null);
    setUploadedImage(null);
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "Chưa xác định";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTotalSlots = () => {
    return Object.values(slotsData).reduce(
      (total, slots) => total + slots.length,
      0
    );
  };

  const getCompletedSlots = () => {
    return Object.values(slotsData).reduce(
      (total, slots) => total + slots.filter((slot) => slot.status).length,
      0
    );
  };

  const getPendingSlots = () => {
    return getTotalSlots() - getCompletedSlots();
  };

  const getSessionIcon = (sessionKey) => {
    switch (sessionKey) {
      case "Sáng":
        return Sun;
      case "Trưa":
        return Sun;
      case "Chiều":
        return Sunset;
      default:
        return Sun;
    }
  };

  const getSessionColor = (sessionKey) => {
    switch (sessionKey) {
      case "Sáng":
        return {
          bg: "bg-orange-100",
          text: "text-orange-600",
          border: "border-orange-200",
        };
      case "Trưa":
        return {
          bg: "bg-yellow-100",
          text: "text-yellow-600",
          border: "border-yellow-200",
        };
      case "Chiều":
        return {
          bg: "bg-purple-100",
          text: "text-purple-600",
          border: "border-purple-200",
        };
      default:
        return {
          bg: "bg-blue-100",
          text: "text-blue-600",
          border: "border-blue-200",
        };
    }
  };

  const TabButton = ({ tab, isActive, onPress }) => {
    const IconComponent = tab.icon;
    const colors = getSessionColor(tab.key);

    return (
      <TouchableOpacity
        onPress={() => onPress(tab.key)}
        className={`flex-1 flex-row items-center justify-center py-3 px-4 rounded-lg border-2 ${
          isActive
            ? `${colors.bg} ${colors.border}`
            : "bg-white border-gray-200"
        } active:scale-95`}
      >
        <IconComponent
          size={18}
          color={isActive ? colors.text.replace("text-", "#") : "#9CA3AF"}
        />
        <Text
          className={`ml-2 font-semibold ${
            isActive ? colors.text : "text-gray-500"
          }`}
        >
          {tab.label}
        </Text>
      </TouchableOpacity>
    );
  };

  const SlotCard = ({ slot, className }) => (
    <TouchableOpacity
      onPress={() => handleSlotPress(slot)}
      className={`bg-white rounded-xl border-2 p-4 mb-3 ${
        slot.status ? "border-green-200 bg-green-50" : "border-gray-200"
      } active:scale-98`}
    >
      <View className="flex-row items-start justify-between mb-3">
        <View className="flex-row items-center flex-1">
          <View
            className={`p-2 rounded-full mr-3 ${
              slot.status ? "bg-green-100" : "bg-blue-100"
            }`}
          >
            {slot.status ? (
              <CheckCircle size={20} color="#10B981" />
            ) : (
              <Clock size={20} color="#3B82F6" />
            )}
          </View>
          <View className="flex-1">
            <Text className="font-bold text-gray-800 text-base">
              {slot.medicineRequest.student.fullName}
            </Text>
            <Text className="text-gray-500 text-sm">
              {slot.medicineRequest.student.studentCode} • Lớp {className}
            </Text>
          </View>
        </View>
        <View
          className={`px-3 py-1 rounded-full ${
            slot.status ? "bg-green-100" : "bg-yellow-100"
          }`}
        >
          <Text
            className={`text-xs font-semibold ${
              slot.status ? "text-green-700" : "text-yellow-700"
            }`}
          >
            {slot.status ? "Đã phát" : "Chưa phát"}
          </Text>
        </View>
      </View>

      <View className="bg-gray-50 p-3 rounded-lg mb-3">
        <View className="flex-row items-center mb-2">
          <Pill size={16} color="#6B7280" />
          <Text className="text-gray-600 font-semibold ml-2 text-sm">
            Ca: {slot.session}
          </Text>
        </View>
        <Text className="text-gray-800 font-medium">{slot.note}</Text>
        {slot.medicineRequest.note && (
          <Text className="text-gray-600 text-sm mt-1">
            Ghi chú: {slot.medicineRequest.note}
          </Text>
        )}
      </View>

      {slot.medicineRequest.image && (
        <View className="mb-3">
          <Text className="text-gray-600 text-sm mb-2">
            Hình ảnh đơn thuốc:
          </Text>
          <Image
            source={{ uri: slot.medicineRequest.image }}
            className="w-full h-32 rounded-lg"
            resizeMode="cover"
          />
        </View>
      )}

      <View className="flex-row items-center justify-between pt-2 border-t border-gray-100">
        <Text className="text-gray-500 text-xs">
          Ngày tạo: {formatDateTime(slot.medicineRequest.date)}
        </Text>
        <Text className="text-blue-600 text-sm font-semibold">
          ID: #{slot.id}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const ClassSection = ({ className, slots }) => (
    <View className="mb-6">
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center">
          <View className="bg-blue-100 p-2 rounded-full mr-3">
            <Users size={18} color="#3B82F6" />
          </View>
          <View>
            <Text className="text-lg font-bold text-gray-800">
              Lớp {className}
            </Text>
            <Text className="text-gray-500 text-sm">
              {slots.length} yêu cầu • {slots.filter((s) => s.status).length} đã
              phát
            </Text>
          </View>
        </View>
        <View className="bg-blue-50 px-3 py-1 rounded-full">
          <Text className="text-blue-700 font-semibold text-sm">
            {slots.filter((s) => !s.status).length} còn lại
          </Text>
        </View>
      </View>

      {slots.map((slot) => (
        <SlotCard key={slot.id} slot={slot} className={className} />
      ))}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        {/* Header */}
        <View className="bg-white shadow-sm border-b border-gray-100 p-6">
          <View className="flex-row items-start gap-4 mb-4">
            <TouchableOpacity
              className="p-2 rounded-full bg-gray-100 active:bg-gray-200"
              onPress={() => router.push("/(nurse)/medicine-request")}
            >
              <ArrowLeft size={20} color="#6B7280" />
            </TouchableOpacity>
            <View className="flex-1">
              <Text className="text-2xl font-bold text-gray-800">
                Phân công phát thuốc
              </Text>
              <Text className="text-gray-500 mt-1">
                Quản lý phát thuốc theo từng ca - {activeSession}
              </Text>
            </View>
          </View>

          {/* Session Tabs */}
          <View className="flex-row gap-2 mb-4">
            {sessionTabs.map((tab) => (
              <TabButton
                key={tab.key}
                tab={tab}
                isActive={activeSession === tab.key}
                onPress={handleTabPress}
              />
            ))}
          </View>

          {/* Stats Cards */}
          <View className="flex-row gap-3">
            <View className="flex-1 bg-blue-50 p-4 rounded-xl border border-blue-100">
              <View className="flex-row items-center mb-2">
                <Clock size={18} color="#3B82F6" />
                <Text className="text-blue-600 font-semibold ml-2 text-sm">
                  Tổng số
                </Text>
              </View>
              <Text className="text-2xl font-bold text-blue-700">
                {getTotalSlots()}
              </Text>
              <Text className="text-blue-500 text-xs">phân công</Text>
            </View>

            <View className="flex-1 bg-green-50 p-4 rounded-xl border border-green-100">
              <View className="flex-row items-center mb-2">
                <CheckCircle size={18} color="#10B981" />
                <Text className="text-green-600 font-semibold ml-2 text-sm">
                  Đã phát
                </Text>
              </View>
              <Text className="text-2xl font-bold text-green-700">
                {getCompletedSlots()}
              </Text>
              <Text className="text-green-500 text-xs">phân công</Text>
            </View>

            <View className="flex-1 bg-orange-50 p-4 rounded-xl border border-orange-100">
              <View className="flex-row items-center mb-2">
                <AlertCircle size={18} color="#F59E0B" />
                <Text className="text-orange-600 font-semibold ml-2 text-sm">
                  Chờ phát
                </Text>
              </View>
              <Text className="text-2xl font-bold text-orange-700">
                {getPendingSlots()}
              </Text>
              <Text className="text-orange-500 text-xs">phân công</Text>
            </View>
          </View>
        </View>

        {/* Content */}
        <ScrollView
          className="flex-1 px-6"
          refreshControl={
            <RefreshControl
              refreshing={loading.refreshing}
              onRefresh={onRefresh}
            />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 30, paddingTop: 20 }}
        >
          {loading.slots ? (
            <View className="items-center justify-center py-8">
              <ActivityIndicator size="large" color="#3B82F6" />
              <Text className="text-gray-500 mt-3">
                Đang tải dữ liệu ca {activeSession}...
              </Text>
            </View>
          ) : Object.keys(slotsData).length > 0 ? (
            Object.entries(slotsData).map(([className, slots]) => (
              <ClassSection
                key={className}
                className={className}
                slots={slots}
              />
            ))
          ) : (
            <View className="bg-white p-6 rounded-xl border border-gray-200 items-center">
              <View
                className={`p-4 rounded-full mb-3 ${getSessionColor(activeSession).bg}`}
              >
                {React.createElement(getSessionIcon(activeSession), {
                  size: 24,
                  color: getSessionColor(activeSession).text.includes("orange")
                    ? "#EA580C"
                    : getSessionColor(activeSession).text.includes("yellow")
                      ? "#D97706"
                      : getSessionColor(activeSession).text.includes("purple")
                        ? "#9333EA"
                        : "#3B82F6",
                })}
              </View>
              <Text className="text-gray-500 font-semibold">
                Chưa có phân công phát thuốc ca {activeSession}
              </Text>
              <Text className="text-gray-400 text-sm mt-1 text-center">
                Các phân công phát thuốc ca {activeSession.toLowerCase()} sẽ
                hiển thị ở đây
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Confirmation Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View className="flex-1 justify-end bg-black bg-opacity-50">
            <View className="bg-white rounded-t-3xl p-6 max-h-4/5">
              {/* Modal Header */}
              <View className="flex-row items-center justify-between mb-6">
                <Text className="text-xl font-bold text-gray-800">
                  Xác nhận phát thuốc
                </Text>
                <TouchableOpacity
                  onPress={closeModal}
                  className="p-2 rounded-full bg-gray-100"
                >
                  <X size={20} color="#6B7280" />
                </TouchableOpacity>
              </View>

              {selectedSlot && (
                <ScrollView showsVerticalScrollIndicator={false}>
                  {/* Student Info */}
                  <View className="bg-blue-50 p-4 rounded-xl mb-4">
                    <Text className="text-sm text-blue-600 font-semibold mb-1">
                      Thông tin học sinh
                    </Text>
                    <Text className="text-lg font-bold text-gray-800">
                      {selectedSlot.medicineRequest.student.fullName}
                    </Text>
                    <Text className="text-gray-600">
                      {selectedSlot.medicineRequest.student.studentCode}
                    </Text>
                    <Text className="text-sm text-gray-500 mt-1">
                      Ca: {selectedSlot.session}
                    </Text>
                  </View>

                  {/* Medicine Info */}
                  <View className="bg-gray-50 p-4 rounded-xl mb-4">
                    <Text className="text-sm text-gray-600 font-semibold mb-2">
                      Thông tin thuốc
                    </Text>
                    <Text className="text-gray-800 font-medium mb-2">
                      {selectedSlot.note}
                    </Text>
                    {selectedSlot.medicineRequest.note && (
                      <Text className="text-gray-600 text-sm">
                        Ghi chú: {selectedSlot.medicineRequest.note}
                      </Text>
                    )}
                  </View>

                  {/* Image Upload Section */}
                  <View className="mb-6">
                    <Text className="text-sm font-semibold text-gray-800 mb-3">
                      Hình ảnh xác nhận phát thuốc
                    </Text>

                    {uploadedImage ? (
                      <View className="relative">
                        <Image
                          source={{ uri: uploadedImage.uri }}
                          className="w-full h-48 rounded-xl"
                          resizeMode="cover"
                        />
                        <TouchableOpacity
                          onPress={() => setUploadedImage(null)}
                          className="absolute top-2 right-2 bg-red-500 p-1 rounded-full"
                        >
                          <X size={16} color="white" />
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <TouchableOpacity
                        onPress={pickImage}
                        className="border-2 border-dashed border-gray-300 rounded-xl p-8 items-center justify-center bg-gray-50"
                      >
                        <View className="bg-blue-100 p-3 rounded-full mb-3">
                          <Camera size={24} color="#3B82F6" />
                        </View>
                        <Text className="text-gray-600 font-semibold mb-1">
                          Chụp ảnh xác nhận
                        </Text>
                        <Text className="text-gray-400 text-sm text-center">
                          Chụp ảnh học sinh đã nhận thuốc hoặc chọn từ thư viện
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>

                  {/* Action Buttons */}
                  <View className="flex-row gap-3">
                    <TouchableOpacity
                      onPress={closeModal}
                      className="flex-1 py-4 px-6 rounded-xl border-2 border-gray-200 bg-white"
                      disabled={isUploading}
                    >
                      <Text className="text-center font-semibold text-gray-600">
                        Hủy
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() =>
                        handleCompleteSlot(selectedSlot, uploadedImage)
                      }
                      className="flex-1 py-4 px-6 rounded-xl bg-green-500 flex-row items-center justify-center"
                      disabled={isUploading}
                    >
                      {isUploading ? (
                        <ActivityIndicator size="small" color="white" />
                      ) : (
                        <>
                          <CheckCircle size={18} color="white" />
                          <Text className="text-white font-semibold ml-2">
                            Xác nhận phát thuốc
                          </Text>
                        </>
                      )}
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              )}
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
