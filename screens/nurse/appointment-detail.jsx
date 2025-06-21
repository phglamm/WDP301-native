import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Linking,
  RefreshControl,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeft,
  Clock,
  Calendar,
  Video,
  User,
  ExternalLink,
  Edit3,
  Trash2,
  MapPin,
  FileText,
  Phone,
  Mail,
} from "lucide-react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { getAppointmentById } from "../../services/nurseService";

export default function AppointmentDetailScreen() {
  const router = useRouter();
  const { appointmentId } = useLocalSearchParams();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAppointmentDetail = async () => {
    setLoading(true);
    try {
      const response = await getAppointmentById(appointmentId);
      setAppointment(response.data);
    } catch (error) {
      console.error("Error fetching appointment detail:", error);
      Alert.alert("Lỗi", "Không thể tải thông tin cuộc hẹn.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (appointmentId) {
      fetchAppointmentDetail();
    }
  }, [appointmentId]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAppointmentDetail();
    setRefreshing(false);
  };

  const formatDate = (dateString) => {
    if (!dateString || dateString === "Invalid Date") {
      return "Không xác định";
    }
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getAppointmentStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "scheduled":
        return {
          bg: "bg-blue-100",
          text: "text-blue-700",
          border: "border-blue-200",
          icon: "#3B82F6",
        };
      case "completed":
        return {
          bg: "bg-green-100",
          text: "text-green-700",
          border: "border-green-200",
          icon: "#22C55E",
        };
      case "cancelled":
        return {
          bg: "bg-red-100",
          text: "text-red-700",
          border: "border-red-200",
          icon: "#EF4444",
        };
      case "in-progress":
        return {
          bg: "bg-orange-100",
          text: "text-orange-700",
          border: "border-orange-200",
          icon: "#F97316",
        };
      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-700",
          border: "border-gray-200",
          icon: "#6B7280",
        };
    }
  };

  const formatStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case "scheduled":
        return "Đã lên lịch";
      case "completed":
        return "Hoàn thành";
      case "cancelled":
        return "Đã hủy";
      case "in-progress":
        return "Đang diễn ra";
      default:
        return status;
    }
  };

  const handleJoinMeeting = async (meetLink) => {
    if (meetLink) {
      try {
        await Linking.openURL(meetLink);
      } catch (error) {
        Alert.alert("Lỗi", "Không thể mở liên kết Google Meet");
      }
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-500">Đang tải thông tin cuộc hẹn...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!appointment) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-500">
            Không tìm thấy thông tin cuộc hẹn
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/(nurse)/appointment")}
            className="mt-4 bg-green-500 px-6 py-3 rounded-xl"
          >
            <Text className="text-white font-semibold">Quay lại</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const statusColors = getAppointmentStatusColor(appointment?.status);

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="bg-white shadow-sm border-b border-gray-100 p-6">
          <View className="flex-row items-center justify-between">
            <TouchableOpacity
              onPress={() => router.push("/(nurse)/appointment")}
              className="p-2 rounded-full bg-gray-100 active:bg-gray-200"
            >
              <ArrowLeft size={20} color="#6B7280" />
            </TouchableOpacity>
            <View className="flex-1 ml-4">
              <Text className="text-2xl font-montserratBold text-gray-800">
                Chi tiết cuộc hẹn
              </Text>
              <Text className="text-gray-500 font-montserratRegular mt-1">
                ID: {appointment?.id}
              </Text>
            </View>
          </View>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 30 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          showsVerticalScrollIndicator={false}
        >
          {/* Status Card */}
          <View className="p-6">
            <View
              className={`p-4 rounded-2xl ${statusColors.bg} ${statusColors.border} border`}
            >
              <View className="flex-row items-center justify-between">
                <Text
                  className={`text-lg font-montserratSemiBold ${statusColors.text}`}
                >
                  {formatStatusText(appointment?.status)}
                </Text>
                <Calendar size={24} color={statusColors.icon} />
              </View>
            </View>
          </View>

          {/* Main Information */}
          <View className="px-6 space-y-6">
            {/* Purpose */}
            <View className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
              <View className="flex-row items-center mb-3">
                <FileText size={20} color="#6B7280" />
                <Text className="text-gray-600 font-montserratSemiBold ml-3">
                  Mục đích cuộc hẹn
                </Text>
              </View>
              <Text className="text-lg font-montserratSemiBold text-gray-800">
                {appointment?.purpose}
              </Text>
            </View>

            {/* Date & Time */}
            <View className="bg-white p-5 mt-5 rounded-2xl border border-gray-200 shadow-sm">
              <View className="flex-row items-center mb-3">
                <Clock size={20} color="#6B7280" />
                <Text className="text-gray-600 font-montserratSemiBold ml-3">
                  Thời gian
                </Text>
              </View>
              <Text className="text-lg font-montserratSemiBold text-gray-800">
                {formatDate(appointment?.appointmentTime)}
              </Text>
            </View>

            {/* Nurse Information */}
            {appointment?.nurse && (
              <View className="bg-white mt-5 p-5 rounded-2xl border border-gray-200 shadow-sm">
                <View className="flex-row items-center mb-3">
                  <User size={20} color="#6B7280" />
                  <Text className="text-gray-600 font-montserratSemiBold ml-3">
                    Thông tin y tá
                  </Text>
                </View>
                <View className="space-y-2">
                  <Text className="text-lg font-montserratSemiBold text-gray-800">
                    {appointment?.nurse?.fullName}
                  </Text>
                  <View className="flex-row items-center">
                    <Phone size={16} color="#6B7280" />
                    <Text className="text-gray-600 ml-2">
                      {appointment?.nurse?.phone}
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <Mail size={16} color="#6B7280" />
                    <Text className="text-gray-600 ml-2">
                      {appointment?.nurse?.email}
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {/* Google Meet Link */}
            {appointment.googleMeetLink && (
              <View className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm mt-5">
                <View className="flex-row items-center mb-3">
                  <Video size={20} color="#3B82F6" />
                  <Text className="text-gray-600 font-montserratSemiBold ml-3">
                    Liên kết cuộc họp
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => handleJoinMeeting(appointment.googleMeetLink)}
                  className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex-row items-center justify-center"
                >
                  <ExternalLink size={20} color="#3B82F6" />
                  <Text className="text-blue-600 font-semibold ml-2 text-lg">
                    Tham gia Google Meet
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Timestamps */}
            <View className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm mt-5">
              <View className="flex-row items-center mb-3">
                <Calendar size={20} color="#6B7280" />
                <Text className="text-gray-600 font-montserratSemiBold ml-3">
                  Thông tin tạo
                </Text>
              </View>
              <View className="space-y-2">
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Ngày tạo:</Text>
                  <Text className="font-montserratSemiBold text-gray-800">
                    {formatDate(appointment.createdAt)}
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Cập nhật lần cuối:</Text>
                  <Text className="font-montserratSemiBold text-gray-800">
                    {formatDate(appointment.updatedAt)}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
