// Medicine Request Detail Screen Component
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
  Image,
  Dimensions,
  Modal,
  RefreshControl,
} from "react-native";
import {
  ArrowLeft,
  User,
  Calendar,
  FileText,
  Phone,
  Mail,
  MapPin,
  Camera,
  ZoomIn,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  Pill,
  Sun,
  Moon,
} from "lucide-react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  approveMedicineRequest,
  getMedicineRequestDetail,
  rejectMedicineRequest,
} from "../../services/nurseService";
import { SafeAreaView } from "react-native-safe-area-context";

const { width: screenWidth } = Dimensions.get("window");

export default function MedicineRequestDetailScreen() {
  const router = useRouter();
  const { requestId } = useLocalSearchParams();
  // State management
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [processingAction, setProcessingAction] = useState(false);

  // Mock data based on your API response structure
  useEffect(() => {
    loadRequestDetail();
  }, [requestId]);

  const loadRequestDetail = async () => {
    setLoading(true);
    try {
      // Simulate API call - replace with actual API call
      const response = await getMedicineRequestDetail(requestId);

      // Mock data for demonstration
      setRequest(response.data);
    } catch (error) {
      Alert.alert("Lỗi", "Không thể tải chi tiết yêu cầu");
      console.error("Load request detail error:", error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const response = await getMedicineRequestDetail(requestId);
      setRequest(response.data);
    } catch (error) {
      Alert.alert("Lỗi", "Không thể làm mới dữ liệu");
      console.error("Refresh error:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "Chưa xác định";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Chưa xác định";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case "pending":
        return {
          bg: "bg-yellow-100",
          text: "text-yellow-700",
          label: "Đang chờ xử lý",
          icon: Clock,
        };
      case "approved":
        return {
          bg: "bg-green-100",
          text: "text-green-700",
          label: "Đã phê duyệt",
          icon: CheckCircle,
        };
      case "rejected":
        return {
          bg: "bg-red-100",
          text: "text-red-700",
          label: "Đã từ chối",
          icon: XCircle,
        };
      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-700",
          label: "Không xác định",
          icon: Clock,
        };
    }
  };

  const getSessionIcon = (session) => {
    switch (session.toLowerCase()) {
      case "sáng":
        return Sun;
      case "chiều":
        return Sun;
      case "tối":
        return Moon;
      default:
        return Clock;
    }
  };

  const getSessionColor = (session) => {
    switch (session.toLowerCase()) {
      case "sáng":
        return "#F59E0B"; // Yellow for morning
      case "chiều":
        return "#EF4444"; // Red for afternoon
      case "tối":
        return "#6366F1"; // Indigo for evening
      default:
        return "#6B7280"; // Gray for default
    }
  };

  const handleApprove = async () => {
    Alert.alert("Xác nhận", "Bạn có chắc chắn muốn phê duyệt yêu cầu này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Phê duyệt",
        style: "default",
        onPress: async () => {
          setProcessingAction(true);
          try {
            // API call to approve request
            // await approveMedicineRequest(requestId);
            const response = await approveMedicineRequest(requestId);
            console.log("Approve response:", response);
            loadRequestDetail(requestId);
            Alert.alert("Thành công", "Yêu cầu đã được phê duyệt");
          } catch (error) {
            Alert.alert("Lỗi", "Không thể phê duyệt yêu cầu");
          } finally {
            setProcessingAction(false);
          }
        },
      },
    ]);
  };

  const handleReject = async () => {
    Alert.alert("Xác nhận", "Bạn có chắc chắn muốn từ chối yêu cầu này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Từ chối",
        style: "destructive",
        onPress: async () => {
          setProcessingAction(true);
          try {
            // API call to reject request
            const response = await rejectMedicineRequest(requestId);
            console.log("Rejected response:", response);
            loadRequestDetail(requestId);
            Alert.alert("Thành công", "Yêu cầu đã được từ chối");
          } catch (error) {
            Alert.alert("Lỗi", "Không thể từ chối yêu cầu");
          } finally {
            setProcessingAction(false);
          }
        },
      },
    ]);
  };

  const renderMedicineSlots = () => {
    if (!request.slots || request.slots.length === 0) {
      return null;
    }

    return (
      <View className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm mb-6">
        <View className="flex-row items-center mb-4">
          <Pill size={20} color="#10B981" />
          <Text className="text-lg font-bold text-gray-800 ml-2">
            Lịch uống thuốc
          </Text>
        </View>

        <View className="space-y-4">
          {request?.slots?.map((slot, index) => {
            const SessionIcon = getSessionIcon(slot.session);
            const sessionColor = getSessionColor(slot.session);

            return (
              <View
                key={slot.id || index}
                className="bg-gray-50 rounded-xl p-4 border border-gray-100"
              >
                {/* Session Header */}
                <View className="flex-row items-center mb-3">
                  <View
                    className="p-2 rounded-full"
                    style={{ backgroundColor: `${sessionColor}20` }}
                  >
                    <SessionIcon size={16} color={sessionColor} />
                  </View>
                  <Text
                    className="text-base font-bold ml-3"
                    style={{ color: sessionColor }}
                  >
                    Buổi {slot.session}
                  </Text>
                  <View className="flex-1" />
                  <View
                    className={`px-2 py-1 rounded-full ${
                      slot.status ? "bg-green-100" : "bg-yellow-100"
                    }`}
                  >
                    <Text
                      className={`text-xs font-semibold ${
                        slot.status ? "text-green-700" : "text-yellow-700"
                      }`}
                    >
                      {slot.status ? "Đã uống" : "Chưa uống"}
                    </Text>
                  </View>
                </View>

                {/* Medicines List */}
                <View className="space-y-3">
                  {slot?.medicines?.map((medicine, medIndex) => (
                    <View
                      key={medicine.id || medIndex}
                      className="bg-white rounded-lg p-3 border border-gray-200"
                    >
                      <View className="flex-row items-start">
                        <View className="bg-blue-100 p-2 rounded-lg">
                          <Pill size={14} color="#3B82F6" />
                        </View>
                        <View className="flex-1 ml-3">
                          <Text className="text-gray-800 font-semibold text-sm leading-5">
                            {medicine.name}
                          </Text>
                          {medicine.description && (
                            <Text className="text-gray-500 text-xs mt-1">
                              {medicine.description}
                            </Text>
                          )}
                          <View className="flex-row items-center mt-2">
                            <Text className="text-blue-600 text-xs font-semibold">
                              Số lượng: {medicine.quantity}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>

                {/* Slot Note */}
                {slot.note && (
                  <View className="mt-3 bg-blue-50 p-3 rounded-lg">
                    <Text className="text-blue-600 text-xs font-semibold mb-1">
                      Ghi chú buổi uống:
                    </Text>
                    <Text className="text-blue-800 text-sm">{slot.note}</Text>
                  </View>
                )}

                {/* Slot Image */}
                {slot.image && (
                  <View className="mt-3">
                    <Text className="text-gray-500 text-xs mb-2">
                      Hình ảnh xác nhận:
                    </Text>
                    <Image
                      source={{ uri: slot.image }}
                      className="w-20 h-20 rounded-lg border border-gray-200"
                      resizeMode="cover"
                    />
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* Summary */}
        <View className="mt-4 bg-blue-50 p-4 rounded-xl">
          <Text className="text-blue-600 font-semibold text-sm mb-2">
            Tổng quan lịch uống thuốc
          </Text>
          <View className="flex-row justify-between">
            <Text className="text-blue-800 text-sm">
              Tổng số buổi: {request.slots.length}
            </Text>
            <Text className="text-blue-800 text-sm">
              Đã hoàn thành:{" "}
              {request.slots.filter((slot) => slot.status).length}/
              {request.slots.length}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text className="text-gray-500 mt-4">Đang tải chi tiết...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!request) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-500">Không tìm thấy yêu cầu</Text>
          <TouchableOpacity
            className="mt-4 bg-blue-500 px-6 py-3 rounded-lg"
            onPress={() => router.navigate("(nurse)/medicine-request")}
          >
            <Text className="text-white font-semibold">Quay lại</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const statusInfo = getStatusInfo(request.status);
  const StatusIcon = statusInfo.icon;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        {/* Header */}
        <View className="bg-white shadow-sm border-b border-gray-100 p-6">
          <View className="flex-row items-center gap-4">
            <TouchableOpacity
              className="p-2 rounded-full bg-gray-100 active:bg-gray-200"
              onPress={() => router.navigate("(nurse)/medicine-request")}
            >
              <ArrowLeft size={20} color="#6B7280" />
            </TouchableOpacity>
            <View className="flex-1">
              <Text className="text-xl font-bold text-gray-800">
                Chi tiết yêu cầu thuốc
              </Text>
              <Text className="text-gray-500 text-sm">ID: #{request.id}</Text>
            </View>
            <View
              className={`px-3 py-2 rounded-full ${statusInfo.bg} flex-row items-center`}
            >
              <StatusIcon
                size={14}
                color={statusInfo.text.replace("text-", "#")}
              />
              <Text className={`text-xs font-semibold ml-1 ${statusInfo.text}`}>
                {statusInfo.label}
              </Text>
            </View>
          </View>
        </View>

        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 30 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#3B82F6"]} // Android
              tintColor="#3B82F6" // iOS
              title="Đang làm mới..." // iOS
              titleColor="#6B7280" // iOS
            />
          }
        >
          {/* Request Information */}
          <View className="p-6">
            <View className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm mb-6">
              <View className="flex-row items-center mb-4">
                <Calendar size={20} color="#3B82F6" />
                <Text className="text-lg font-bold text-gray-800 ml-2">
                  Thông tin yêu cầu
                </Text>
              </View>

              <View className="bg-blue-50 p-4 rounded-xl">
                <Text className="text-blue-600 font-semibold text-sm mb-1">
                  Thời gian gửi yêu cầu
                </Text>
                <Text className="text-blue-800 font-bold">
                  {formatDateTime(request.date)}
                </Text>
              </View>
            </View>

            {/* Student Information */}
            <View className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm mb-6">
              <View className="flex-row items-center mb-4">
                <User size={20} color="#10B981" />
                <Text className="text-lg font-bold text-gray-800 ml-2">
                  Thông tin học sinh
                </Text>
              </View>

              <View className="space-y-4">
                <View>
                  <Text className="text-gray-500 text-sm mb-1">Họ và tên</Text>
                  <Text className="text-gray-800 font-semibold">
                    {request.student.fullName}
                  </Text>
                </View>

                <View>
                  <Text className="text-gray-500 text-sm mb-1">
                    Mã học sinh
                  </Text>
                  <Text className="text-blue-600 font-semibold">
                    {request.student.studentCode}
                  </Text>
                </View>

                {request.student.class && (
                  <View>
                    <Text className="text-gray-500 text-sm mb-1">Lớp</Text>
                    <Text className="text-gray-800 font-semibold">
                      {request.student.class}
                    </Text>
                  </View>
                )}

                {request.student.gender && (
                  <View>
                    <Text className="text-gray-500 text-sm mb-1">
                      Giới tính
                    </Text>
                    <Text className="text-gray-800 font-semibold">
                      {request.student.gender}
                    </Text>
                  </View>
                )}

                {request.student.dob && (
                  <View>
                    <Text className="text-gray-500 text-sm mb-1">
                      Ngày sinh
                    </Text>
                    <Text className="text-gray-800 font-semibold">
                      {formatDate(request.student.dob)}
                    </Text>
                  </View>
                )}

                {request.student.address && (
                  <View>
                    <View className="flex-row items-center mb-2">
                      <MapPin size={16} color="#6B7280" />
                      <Text className="text-gray-500 text-sm ml-2">
                        Địa chỉ
                      </Text>
                    </View>
                    <Text className="text-gray-700 leading-5">
                      {request.student.address}
                    </Text>
                  </View>
                )}
              </View>
            </View>

            {/* Parent Information */}
            <View className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm mb-6">
              <View className="flex-row items-center mb-4">
                <User size={20} color="#8B5CF6" />
                <Text className="text-lg font-bold text-gray-800 ml-2">
                  Thông tin phụ huynh
                </Text>
              </View>

              <View className="space-y-4">
                <View>
                  <Text className="text-gray-500 text-sm mb-1">Họ và tên</Text>
                  <Text className="text-gray-800 font-semibold">
                    {request.parent.fullName}
                  </Text>
                </View>

                <View className="flex-row items-center">
                  <Phone size={16} color="#6B7280" />
                  <View className="ml-3 flex-1">
                    <Text className="text-gray-500 text-sm">Số điện thoại</Text>
                    <Text className="text-gray-800 font-semibold">
                      {request.parent.phone}
                    </Text>
                  </View>
                </View>

                <View className="flex-row items-center">
                  <Mail size={16} color="#6B7280" />
                  <View className="ml-3 flex-1">
                    <Text className="text-gray-500 text-sm">Email</Text>
                    <Text className="text-gray-800 font-semibold">
                      {request.parent.email}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Medicine Slots Section */}
            {renderMedicineSlots()}

            {/* Request Note */}
            {request.note && (
              <View className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm mb-6">
                <View className="flex-row items-center mb-4">
                  <FileText size={20} color="#F59E0B" />
                  <Text className="text-lg font-bold text-gray-800 ml-2">
                    Ghi chú từ phụ huynh
                  </Text>
                </View>

                <View className="bg-amber-50 p-4 rounded-xl">
                  <Text className="text-gray-700 leading-6">
                    {request.note}
                  </Text>
                </View>
              </View>
            )}

            {/* Request Image */}
            {request.image && (
              <View className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm mb-6">
                <View className="flex-row items-center mb-4">
                  <Camera size={20} color="#EF4444" />
                  <Text className="text-lg font-bold text-gray-800 ml-2">
                    Hình ảnh đính kèm
                  </Text>
                </View>

                <TouchableOpacity
                  className="relative"
                  onPress={() => setImageModalVisible(true)}
                >
                  <Image
                    source={{ uri: request.image }}
                    className="w-full h-48 rounded-xl"
                    resizeMode="cover"
                  />
                  <View className="absolute inset-0 bg-black bg-opacity-20 rounded-xl flex items-center justify-center">
                    <View className="bg-white bg-opacity-80 p-2 rounded-full">
                      <ZoomIn size={20} color="#374151" />
                    </View>
                  </View>
                </TouchableOpacity>

                <Text className="text-gray-500 text-sm text-center mt-2">
                  Nhấn để xem ảnh lớn
                </Text>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Action Buttons */}
        {request.status === "pending" && (
          <View className="p-6 bg-white border-t border-gray-100">
            <View className="flex-row gap-4">
              <TouchableOpacity
                className="flex-1 bg-red-500 rounded-xl py-4 flex-row items-center justify-center active:bg-red-600"
                onPress={handleReject}
                disabled={processingAction}
              >
                <XCircle size={18} color="white" />
                <Text className="text-white font-bold ml-2">
                  {processingAction ? "Đang xử lý..." : "Từ chối"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 bg-green-500 rounded-xl py-4 flex-row items-center justify-center active:bg-green-600"
                onPress={handleApprove}
                disabled={processingAction}
              >
                <CheckCircle size={18} color="white" />
                <Text className="text-white font-bold ml-2">
                  {processingAction ? "Đang xử lý..." : "Phê duyệt"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Image Modal */}
        <Modal
          visible={imageModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setImageModalVisible(false)}
        >
          <View className="flex-1 bg-black bg-opacity-90 justify-center items-center">
            <TouchableOpacity
              className="absolute top-12 right-6 z-10 bg-white bg-opacity-20 p-3 rounded-full"
              onPress={() => setImageModalVisible(false)}
            >
              <XCircle size={24} color="white" />
            </TouchableOpacity>

            {request.image && (
              <Image
                source={{ uri: request.image }}
                style={{
                  width: screenWidth - 40,
                  height: screenWidth - 40,
                }}
                resizeMode="contain"
                className="rounded-xl"
              />
            )}

            <Text className="text-white text-center mt-4 px-6">
              Hình ảnh đính kèm từ phụ huynh
            </Text>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
