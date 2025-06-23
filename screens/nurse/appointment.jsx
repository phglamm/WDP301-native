import {
  View,
  Text,
  Platform,
  KeyboardAvoidingView,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Alert,
  Animated,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeft,
  Clock,
  Plus,
  Calendar,
  AlertCircle,
  Video,
  User,
  FileText,
  ChevronRight,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import {
  createAppointment,
  getAppointmentHistory,
  getAppointmentToday,
} from "../../services/nurseService";
import AppointmentHistory from "../../components/nurse/AppointmentHistory";
import AppointmentDeclareForm from "../../components/nurse/AppointmentDeclareForm ";
import AppointmentCalendar from "../../components/nurse/AppointmentCalendar";

export default function AppointmentScreen() {
  const router = useRouter();
  const [currentView, setCurrentView] = useState("calendar"); // Changed default to calendar
  const [appointments, setAppointments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [formData, setFormData] = useState({
    appointmentTime: "",
    purpose: "",
    parentId: "",
    duration: 45,
  });

  // Calculate statistics from appointments data
  const getTodayAppointments = () => {
    const today = new Date().toDateString();
    return appointments.filter((appointment) => {
      const appointmentDate = new Date(
        appointment.appointmentTime
      ).toDateString();
      return appointmentDate === today;
    }).length;
  };

  const getWeekAppointments = () => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return appointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.appointmentTime);
      return appointmentDate >= oneWeekAgo;
    }).length;
  };
  const fetchAppointments = async () => {
    try {
      // Fetch all appointments for calendar view
      const response = await getAppointmentHistory();
      setAppointments(response.data || []);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      Alert.alert("Lỗi", "Không thể tải dữ liệu cuộc hẹn.");
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleSubmitAppointment = async () => {
    setIsSubmitting(true);
    try {
      const appointmentData = {
        appointmentTime: formData.appointmentTime || "",
        purpose: formData.purpose || "",
        parentId: formData.parentId || "",
        duration: formData.duration || 45,
      };

      const response = await createAppointment(appointmentData);
      if (response.code === 201 && response.status) {
        Alert.alert("Thành công", "Cuộc hẹn đã được tạo thành công!", [
          {
            text: "OK",
            onPress: () => {
              setCurrentView("calendar");
              // Reset form data
              setFormData({
                appointmentTime: "",
                purpose: "",
                parentId: "",
                duration: 45,
              });
              // Refresh appointments list
              fetchAppointments();
            },
          },
        ]);
      }
    } catch (err) {
      Alert.alert("Lỗi", "Không thể tạo cuộc hẹn. Vui lòng thử lại.");
      console.error("Error submitting appointment:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartDeclarationAppointment = () => {
    setCurrentView("form");
    setFormData({
      appointmentTime: "",
      purpose: "",
      parentId: "",
      duration: 45,
    });
  };

  const handleViewHistory = () => {
    setCurrentView("history");
  };

  const handleViewAppointmentDetail = (appointment) => {
    // Navigate to appointment detail screen with appointment data
    router.push({
      pathname: "/(nurse)/appointment-detail",
      params: { appointmentId: appointment.id },
    });
    console.log("appointmentId", appointment.id);
  };
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const response = await getAppointmentHistory();
      setAppointments(response.data || []);
    } catch (error) {
      console.error("Error refreshing appointments:", error);
    } finally {
      setRefreshing(false);
    }
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

  // If showing form, render the form component
  if (currentView === "form") {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <AppointmentDeclareForm
            formData={formData}
            setFormData={setFormData}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmitAppointment}
            onBack={() => setCurrentView("select")}
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  } // History view
  if (currentView === "history") {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <AppointmentHistory
          setCurrentView={setCurrentView}
          handleViewAppointmentDetail={handleViewAppointmentDetail}
          formatDate={formatDate}
          getAppointmentStatusColor={getAppointmentStatusColor}
        />
      </SafeAreaView>
    );
  }

  // Calendar view
  if (currentView === "calendar") {
    return (
      <SafeAreaView className="flex-1 bg-white">
        {/* Header */}
        <View className="bg-white shadow-sm border-b border-gray-100 p-6">
          <View className="flex-row items-center justify-start gap-4 mb-4">
            <TouchableOpacity
              onPress={() => router.push("/home")}
              className="p-2 rounded-full bg-gray-100 active:bg-gray-200"
            >
              <ArrowLeft size={20} color="#6B7280" />
            </TouchableOpacity>
            <View className="flex-1">
              <Text className="text-2xl font-montserratBold text-gray-800">
                Lịch cuộc hẹn
              </Text>
              <Text className="text-gray-500 font-montserratRegular mt-1">
                Xem cuộc hẹn theo lịch
              </Text>
            </View>
          </View>

          {/* Stats Cards */}
          <View className="flex-row gap-4 mt-4">
            <View className="flex-1 bg-blue-50 p-4 rounded-xl border border-blue-100">
              <View className="flex-row items-center">
                <Calendar size={20} color="#3B82F6" />
                <Text className="text-blue-600 font-semibold ml-2">
                  Hôm nay
                </Text>
              </View>
              <Text className="text-2xl font-bold text-blue-700 mt-1">
                {getTodayAppointments()}
              </Text>
              <Text className="text-blue-500 text-xs">cuộc hẹn</Text>
            </View>
            <View className="flex-1 bg-green-50 p-4 rounded-xl border border-green-100">
              <View className="flex-row items-center">
                <Video size={20} color="#22C55E" />
                <Text className="text-green-600 font-semibold ml-2">
                  Tuần này
                </Text>
              </View>
              <Text className="text-2xl font-bold text-green-700 mt-1">
                {getWeekAppointments()}
              </Text>
              <Text className="text-green-500 text-xs">cuộc hẹn</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View className="flex-row gap-4 mt-4">
            <TouchableOpacity
              onPress={handleStartDeclarationAppointment}
              className="flex-1 bg-green-500 py-3 rounded-xl flex-row items-center justify-center"
            >
              <Plus size={18} color="white" />
              <Text className="text-white font-bold ml-2 text-sm">
                Tạo cuộc hẹn
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleViewHistory}
              className="flex-1 bg-white border border-gray-200 py-3 rounded-xl flex-row items-center justify-center"
            >
              <Clock size={18} color="#6B7280" />
              <Text className="text-gray-700 font-bold ml-2 text-sm">
                Lịch sử
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Calendar Component */}
        <AppointmentCalendar
          refreshing={refreshing}
          onRefresh={handleRefresh}
          appointments={appointments}
          onAppointmentPress={handleViewAppointmentDetail}
          getAppointmentStatusColor={getAppointmentStatusColor}
          formatDate={formatDate}
        />
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        {/* This is a fallback view - should not be reached */}
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-500">Unknown view state</Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
