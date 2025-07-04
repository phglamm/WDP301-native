// Enhanced Health Event Screen Component with Tailwind CSS
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
} from "react-native";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import {
  ArrowLeft,
  Plus,
  Calendar,
  Activity,
  Download,
  Clock,
  Heart,
  Users,
  Stethoscope,
} from "lucide-react-native";
import { useRouter } from "expo-router";

import { SafeAreaView } from "react-native-safe-area-context";
import HealthEventForm from "../../components/nurse/HealthEventForm";
import { getHealthEvents } from "../../services/nurseService";

export default function HealthEvent() {
  const router = useRouter();

  // State management
  const [currentView, setCurrentView] = useState("main");
  const [healthEvents, setHealthEvents] = useState([]);

  const [loading, setLoading] = useState({
    events: false,
    creating: false,
    downloading: false,
  });
  const [refreshing, setRefreshing] = useState(false);

  // Load data on component mount
  useEffect(() => {
    loadHealthEvents();
  }, []);

  // Statistics calculations
  const getActiveEvents = () => {
    const now = new Date();
    return healthEvents.filter((event) => {
      const eventDate = new Date(event.date);
      return eventDate >= now;
    }).length;
  };

  const getThisMonthEvents = () => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return healthEvents.filter((event) => {
      const eventDate = new Date(event.date);
      return eventDate >= startOfMonth && eventDate <= endOfMonth;
    }).length;
  };

  // API Functions
  const loadHealthEvents = async () => {
    setLoading((prev) => ({ ...prev, events: true }));
    try {
      const response = await getHealthEvents();
      if (response.status && response.data) {
        setHealthEvents(response.data);
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể tải danh sách sự kiện khám sức khỏe");
      console.error("Load health events error:", error);
    } finally {
      setLoading((prev) => ({ ...prev, events: false }));
    }
  };

  // Download Functions
  // const downloadStudentsList = async (eventId) => {
  //   try {
  //     setLoading((prev) => ({ ...prev, downloading: true }));
  //     const downloadUrl = `https://wdp301-se1752-be.onrender.com/health-event/${eventId}/students`;
  //     const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  //     const fileName = `health_students_data_event_${eventId}_${timestamp}.xlsx`;
  //     const fileUri = FileSystem.documentDirectory + fileName;

  //     const downloadResult = await FileSystem.downloadAsync(
  //       downloadUrl,
  //       fileUri,
  //       {
  //         headers: { Accept: "*/*" },
  //       }
  //     );

  //     if (downloadResult.status === 200) {
  //       const sharingAvailable = await Sharing.isAvailableAsync();
  //       if (sharingAvailable) {
  //         await Sharing.shareAsync(downloadResult.uri, {
  //           mimeType:
  //             "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  //           dialogTitle: "Lưu dữ liệu học sinh khám sức khỏe",
  //           UTI: "com.microsoft.excel.xlsx",
  //         });
  //         Alert.alert(
  //           "Thành công",
  //           "File đã được tải xuống và chia sẻ thành công."
  //         );
  //       } else {
  //         Alert.alert(
  //           "Hoàn thành",
  //           "File đã được tải xuống nhưng không thể chia sẻ trên thiết bị này."
  //         );
  //       }
  //     } else {
  //       throw new Error(`Tải xuống thất bại với mã: ${downloadResult.status}`);
  //     }
  //   } catch (error) {
  //     console.error("Download error:", error);
  //     Alert.alert("Lỗi", `Không thể tải xuống file: ${error.message}`);
  //   } finally {
  //     setLoading((prev) => ({ ...prev, downloading: false }));
  //   }
  // };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadHealthEvents();
    setRefreshing(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Chưa xác định";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getEventStatusColor = (event) => {
    const now = new Date();
    const eventDate = new Date(event.date);

    if (eventDate < now) {
      return {
        bg: "bg-gray-100",
        text: "text-gray-600",
        status: "Đã hoàn thành",
      };
    } else {
      return {
        bg: "bg-green-100",
        text: "text-green-700",
        status: "Sắp diễn ra",
      };
    }
  };

  const renderEventCard = (event, index) => {
    const statusInfo = getEventStatusColor(event);

    return (
      <View
        key={index}
        className="bg-white rounded-2xl p-5 mb-4 border border-gray-200 shadow-sm"
      >
        {/* Event Header */}
        <View className="mb-4">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-lg font-bold text-gray-800 flex-1 pr-2">
              {event.name}
            </Text>
            <View className={`px-3 py-1 rounded-full ${statusInfo.bg}`}>
              <Text className={`text-xs font-semibold ${statusInfo.text}`}>
                {statusInfo.status}
              </Text>
            </View>
          </View>
          {event.description && (
            <Text className="text-gray-600 text-sm mb-2">
              {event.description}
            </Text>
          )}
        </View>

        {/* Event Details */}
        <View className="mb-4 space-y-2">
          <View className="flex-row items-center">
            <Calendar size={16} color="#6B7280" />
            <Text className="text-gray-600 ml-2">
              Ngày khám: {formatDate(event.date)}
            </Text>
          </View>
          <View className="flex-row items-center">
            <Stethoscope size={16} color="#6B7280" />
            <Text className="text-gray-600 ml-2">Khám sức khỏe định kỳ</Text>
          </View>
        </View>

        {/* Action Button */}
        {/* <TouchableOpacity
          className="bg-emerald-500 rounded-xl py-3 flex-row items-center justify-center active:bg-emerald-600"
          onPress={() => downloadStudentsList(event.id)}
          disabled={loading.downloading}
        >
          <Download size={16} color="#fff" />
          <Text className="text-white font-semibold ml-2">
            {loading.downloading ? "Đang tải..." : "Tải xuống danh sách"}
          </Text>
        </TouchableOpacity> */}
      </View>
    );
  };

  // Handle create event success
  const handleCreateEventSuccess = () => {
    setCurrentView("main");
    loadHealthEvents();
  };

  // If showing form, render the form component
  if (currentView === "form") {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <HealthEventForm
            loading={loading}
            setLoading={setLoading}
            onBack={() => setCurrentView("main")}
            onSuccess={handleCreateEventSuccess}
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        {/* Enhanced Header */}
        <View className="bg-white shadow-sm border-b border-gray-100 p-6">
          <View className="flex-row items-start gap-4 mb-4">
            <TouchableOpacity
              className="p-2 rounded-full bg-gray-100 active:bg-gray-200"
              onPress={() => router.push("/home")}
            >
              <ArrowLeft size={20} color="#6B7280" />
            </TouchableOpacity>
            <View className="flex-1">
              <Text className="text-2xl font-bold text-gray-800">
                Sự kiện khám sức khỏe
              </Text>
              <Text className="text-gray-500 mt-1">
                Quản lý và theo dõi các sự kiện khám sức khỏe
              </Text>
            </View>
          </View>

          {/* Enhanced Stats Cards */}
          <View className="flex-row gap-3">
            <View className="flex-1 bg-emerald-50 p-4 rounded-xl border border-emerald-100">
              <View className="flex-row items-center mb-2">
                <Heart size={18} color="#10B981" />
                <Text className="text-emerald-600 font-semibold ml-2 text-sm">
                  Đang hoạt động
                </Text>
              </View>
              <Text className="text-2xl font-bold text-emerald-700">
                {getActiveEvents()}
              </Text>
              <Text className="text-emerald-500 text-xs">sự kiện</Text>
            </View>

            <View className="flex-1 bg-purple-50 p-4 rounded-xl border border-purple-100">
              <View className="flex-row items-center mb-2">
                <Clock size={18} color="#8B5CF6" />
                <Text className="text-purple-600 font-semibold ml-2 text-sm">
                  Tháng này
                </Text>
              </View>
              <Text className="text-2xl font-bold text-purple-700">
                {getThisMonthEvents()}
              </Text>
              <Text className="text-purple-500 text-xs">sự kiện</Text>
            </View>
          </View>
        </View>

        {/* Action Button */}
        <View className="px-6 py-4">
          <TouchableOpacity
            className="bg-emerald-500 rounded-2xl py-4 flex-row items-center justify-center active:bg-emerald-600 shadow-lg"
            onPress={() => setCurrentView("form")}
            style={{
              shadowColor: "#10B981",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
            }}
          >
            <Plus size={22} color="white" />
            <Text className="text-white font-bold ml-2 text-base">
              Tạo sự kiện khám sức khỏe
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView
          className="flex-1 px-6"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 30 }}
        >
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-800 mb-4">
              Sự kiện có sẵn
            </Text>
            {loading.events ? (
              <ActivityIndicator
                size="large"
                color="#10B981"
                className="my-8"
              />
            ) : healthEvents.length > 0 ? (
              healthEvents.map(renderEventCard)
            ) : (
              <View className="bg-white p-6 rounded-xl border border-gray-200 items-center">
                <View className="bg-gray-100 p-4 rounded-full mb-3">
                  <Heart size={24} color="#9CA3AF" />
                </View>
                <Text className="text-gray-500 font-semibold">
                  Chưa có sự kiện nào
                </Text>
                <Text className="text-gray-400 text-sm mt-1 text-center">
                  Các sự kiện khám sức khỏe sẽ hiển thị ở đây
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
