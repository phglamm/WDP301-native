// Enhanced Medicine Request Screen Component
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
import {
  ArrowLeft,
  Plus,
  Calendar,
  Activity,
  Clock,
  Pill,
  FileText,
  ChevronRight,
  User,
  AlertCircle,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import {
  getMedicineRequestToday,
  getMedicineRequestHistory,
} from "../../services/nurseService";
import MedicineRequestCard from "../../components/nurse/MedicineRequestCard";
import { SafeAreaView } from "react-native-safe-area-context";
import MedicineRequestHistory from "../../components/nurse/MedicineRequestHistory";

export default function MedicineRequestScreen() {
  const router = useRouter();

  // State management
  const [currentView, setCurrentView] = useState("main");
  const [medicineRequests, setMedicineRequests] = useState([]);
  const [allMedicineRequests, setAllMedicineRequests] = useState([]);
  const [loading, setLoading] = useState({
    requests: false,
    refreshing: false,
    history: false,
  });

  // Load data on component mount
  useEffect(() => {
    loadMedicineRequests();
    loadMedicineRequestHistory();
  }, []);

  // Statistics calculations
  const getTotalRequests = () => {
    return allMedicineRequests.length;
  };

  const getTodayRequests = () => {
    const today = new Date().toDateString();
    return medicineRequests.filter((request) => {
      const requestDate = new Date(request.date).toDateString();
      return requestDate === today;
    }).length;
  };

  // API Functions
  const loadMedicineRequests = async () => {
    setLoading((prev) => ({ ...prev, requests: true }));
    try {
      const response = await getMedicineRequestToday();
      if (response && response.data) {
        setMedicineRequests(response.data);
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể tải danh sách yêu cầu thuốc");
      console.error("Load medicine requests error:", error);
    } finally {
      setLoading((prev) => ({ ...prev, requests: false }));
    }
  };

  const loadMedicineRequestHistory = async () => {
    setLoading((prev) => ({ ...prev, history: true }));
    try {
      const response = await getMedicineRequestHistory();
      if (response && response.data) {
        setAllMedicineRequests(response.data);
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể tải lịch sử yêu cầu thuốc");
      console.error("Load medicine request history error:", error);
    } finally {
      setLoading((prev) => ({ ...prev, history: false }));
    }
  };

  const onRefresh = async () => {
    setLoading((prev) => ({ ...prev, refreshing: true }));
    if (currentView === "main") {
      await loadMedicineRequests();
    } else if (currentView === "history") {
      await loadMedicineRequestHistory();
    }
    setLoading((prev) => ({ ...prev, refreshing: false }));
  };

  const handleRequestPress = (request) => {
    // Navigate to medicine request detail screen
    router.push({
      pathname: "/medicine-request-detail",
      params: { requestId: request.id },
    });
  };

  const handleViewHistory = async () => {
    setCurrentView("history");
    if (allMedicineRequests.length === 0) {
      await loadMedicineRequestHistory();
    }
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

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
      case "chờ xử lý":
        return {
          bg: "bg-yellow-100",
          text: "text-yellow-700",
          border: "border-yellow-200",
        };
      case "approved":
      case "đã duyệt":
        return {
          bg: "bg-green-100",
          text: "text-green-700",
          border: "border-green-200",
        };
      case "rejected":
      case "từ chối":
        return {
          bg: "bg-red-100",
          text: "text-red-700",
          border: "border-red-200",
        };
      case "completed":
      case "hoàn thành":
        return {
          bg: "bg-blue-100",
          text: "text-blue-700",
          border: "border-blue-200",
        };
      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-700",
          border: "border-gray-200",
        };
    }
  };

  // History view
  if (currentView === "history") {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <MedicineRequestHistory
          medicineRequests={allMedicineRequests}
          setCurrentView={setCurrentView}
          handleViewRequestDetail={handleRequestPress}
          refreshing={loading.refreshing}
          handleRefresh={onRefresh}
          formatDateTime={formatDateTime}
          getStatusColor={getStatusColor}
          loading={loading.history}
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
                Yêu cầu thuốc
              </Text>
              <Text className="text-gray-500 mt-1">
                Quản lý và theo dõi các yêu cầu thuốc từ phụ huynh
              </Text>
            </View>
          </View>

          {/* Enhanced Stats Cards */}
          <View className="flex-row gap-3">
            <View className="flex-1 bg-blue-50 p-4 rounded-xl border border-blue-100">
              <View className="flex-row items-center mb-2">
                <Pill size={18} color="#3B82F6" />
                <Text className="text-blue-600 font-semibold ml-2 text-sm">
                  Tổng yêu cầu
                </Text>
              </View>
              <Text className="text-2xl font-bold text-blue-700">
                {getTotalRequests()}
              </Text>
              <Text className="text-blue-500 text-xs">yêu cầu</Text>
            </View>

            <View className="flex-1 bg-green-50 p-4 rounded-xl border border-green-100">
              <View className="flex-row items-center mb-2">
                <Calendar size={18} color="#10B981" />
                <Text className="text-green-600 font-semibold ml-2 text-sm">
                  Hôm nay
                </Text>
              </View>
              <Text className="text-2xl font-bold text-green-700">
                {getTodayRequests()}
              </Text>
              <Text className="text-green-500 text-xs">yêu cầu</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="px-6 py-4">
          <View className="flex-row gap-4">
            <TouchableOpacity
              onPress={() => router.push("/(nurse)/slot")}
              className="flex-1 bg-blue-500 border-2 border-gray-200 py-4 rounded-2xl flex-row items-center justify-center active:scale-95"
            >
              <Calendar size={22} color="white" />
              <Text className="text-white font-bold ml-2 text-base">
                Phát thuốc
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleViewHistory}
              className="flex-1 bg-white border-2 border-gray-200 py-4 rounded-2xl flex-row items-center justify-center active:scale-95"
            >
              <Clock size={22} color="#6B7280" />
              <Text className="text-gray-700 font-bold ml-2 text-base">
                Lịch sử ({allMedicineRequests.length})
              </Text>
            </TouchableOpacity>
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
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-800 mb-4">
              Yêu cầu thuốc hôm nay
            </Text>
            {loading.requests ? (
              <ActivityIndicator
                size="large"
                color="#3B82F6"
                className="my-8"
              />
            ) : medicineRequests.length > 0 ? (
              medicineRequests.map((request, index) => (
                <MedicineRequestCard
                  key={request.id || index}
                  request={request}
                  onPress={() => handleRequestPress(request)}
                  formatDateTime={formatDateTime}
                />
              ))
            ) : (
              <View className="bg-white p-6 rounded-xl border border-gray-200 items-center">
                <View className="bg-gray-100 p-4 rounded-full mb-3">
                  <Pill size={24} color="#9CA3AF" />
                </View>
                <Text className="text-gray-500 font-semibold">
                  Chưa có yêu cầu thuốc nào
                </Text>
                <Text className="text-gray-400 text-sm mt-1 text-center">
                  Các yêu cầu thuốc từ phụ huynh sẽ hiển thị ở đây
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
