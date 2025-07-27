// Report Injection Screen Component
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
  User,
  Calendar,
  Thermometer,
  Clock,
  AlertTriangle,
  FileText,
  MapPin,
  Activity,
  Shield,
  CheckCircle,
  XCircle,
} from "lucide-react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { getInjectionReports } from "../../services/nurseService";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ReportInjectionScreen() {
  const router = useRouter();
  const { eventId } = useLocalSearchParams();

  // State management
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (eventId) {
      loadReports();
    }
  }, [eventId]);

  const loadReports = async () => {
    setLoading(true);
    try {
      const response = await getInjectionReports(eventId);
      if (response.status && response.data) {
        setReports(response.data);
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể tải báo cáo sau tiêm");
      console.error("Load reports error:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadReports();
    setRefreshing(false);
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

  const getSeverityInfo = (severityLevel) => {
    switch (severityLevel?.toLowerCase()) {
      case "low":
        return {
          bg: "bg-yellow-100",
          text: "text-yellow-700",
          label: "Nhẹ",
          icon: AlertTriangle,
          color: "#F59E0B",
        };
      case "medium":
        return {
          bg: "bg-orange-100",
          text: "text-orange-700",
          label: "Trung bình",
          icon: AlertTriangle,
          color: "#EA580C",
        };
      case "high":
        return {
          bg: "bg-red-100",
          text: "text-red-700",
          label: "Nghiêm trọng",
          icon: AlertTriangle,
          color: "#DC2626",
        };
      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-700",
          label: "Không xác định",
          icon: AlertTriangle,
          color: "#6B7280",
        };
    }
  };

  const renderReportCard = (report, index) => {
    const severityInfo = getSeverityInfo(report.severityLevel);

    const SeverityIcon = severityInfo.icon;

    return (
      <View
        key={report.id || index}
        className="bg-white rounded-2xl p-5 mb-4 border border-gray-200 shadow-sm"
      >
        {/* Report Header */}
        <View className="flex-row items-start justify-between mb-4">
          <View className="flex-1">
            <View className="flex-row items-center mb-2">
              <View
                className="p-2 rounded-full mr-3"
                style={{ backgroundColor: `${severityInfo.color}20` }}
              >
                <SeverityIcon size={16} color={severityInfo.color} />
              </View>
              <Text className="text-lg font-bold text-gray-800 flex-1">
                Báo cáo phản ứng sau tiêm
              </Text>
            </View>
            <View className="flex-row items-center gap-2">
              <View className={`px-3 py-1 rounded-full ${severityInfo.bg}`}>
                <Text className={`text-xs font-semibold ${severityInfo.text}`}>
                  Mức độ: {severityInfo.label}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Student Information */}
        <View className="bg-blue-50 rounded-xl p-4 mb-4">
          <View className="flex-row items-center mb-3">
            <User size={18} color="#3B82F6" />
            <Text className="text-blue-700 font-semibold ml-2">
              Thông tin học sinh
            </Text>
          </View>
          <View className="space-y-2">
            <View className="flex-row justify-between">
              <Text className="text-blue-600 text-sm">Họ tên:</Text>
              <Text className="text-blue-800 font-semibold text-sm">
                {report.injectionRecord.student.fullName}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-blue-600 text-sm">Mã HS:</Text>
              <Text className="text-blue-800 font-semibold text-sm">
                {report.injectionRecord.student.studentCode}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-blue-600 text-sm">Lớp:</Text>
              <Text className="text-blue-800 font-semibold text-sm">
                {report.injectionRecord.student.class}
              </Text>
            </View>
            {report.injectionRecord.student.gender && (
              <View className="flex-row justify-between">
                <Text className="text-blue-600 text-sm">Giới tính:</Text>
                <Text className="text-blue-800 font-semibold text-sm">
                  {report.injectionRecord.student.gender}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Report Details */}
        <View className="space-y-3 mb-4">
          <View className="flex-row items-center">
            <Thermometer size={16} color="#EF4444" />
            <Text className="text-gray-600 ml-2 flex-1">
              Nhiệt độ hiện tại:
            </Text>
            <Text className="text-gray-800 font-semibold">
              {report.temperature}°C
            </Text>
          </View>

          <View className="flex-row items-center">
            <Clock size={16} color="#F59E0B" />
            <Text className="text-gray-600 ml-2 flex-1">
              Thời gian sau tiêm:
            </Text>
            <Text className="text-gray-800 font-semibold">
              {report.hoursPostInjection} giờ
            </Text>
          </View>

          <View className="flex-row items-center">
            <Calendar size={16} color="#8B5CF6" />
            <Text className="text-gray-600 ml-2 flex-1">
              Thời gian báo cáo:
            </Text>
            <Text className="text-gray-800 font-semibold text-sm">
              {formatDate(report.createdAt)}
            </Text>
          </View>
        </View>

        {/* Description */}
        {report.description && (
          <View className="bg-amber-50 rounded-xl p-4 mb-4">
            <View className="flex-row items-center mb-2">
              <FileText size={16} color="#F59E0B" />
              <Text className="text-amber-700 font-semibold ml-2">
                Mô tả triệu chứng
              </Text>
            </View>
            <Text className="text-amber-800 leading-5">
              {report.description}
            </Text>
          </View>
        )}

        {/* Injection Record Details */}
        <View className="bg-gray-50 rounded-xl p-4">
          <View className="flex-row items-center mb-3">
            <Shield size={16} color="#10B981" />
            <Text className="text-gray-700 font-semibold ml-2">
              Thông tin tiêm chủng
            </Text>
          </View>
          <View className="space-y-2">
            <View className="flex-row justify-between">
              <Text className="text-gray-500 text-sm">Ngày tiêm:</Text>
              <Text className="text-gray-700 font-medium text-sm">
                {formatDate(report.injectionRecord.registrationDate)}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-500 text-sm">Vị trí tiêm:</Text>
              <Text className="text-gray-700 font-medium text-sm">
                {report.injectionRecord.injectionSite || "Chưa xác định"}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-500 text-sm">
                Nhiệt độ trước tiêm:
              </Text>
              <Text className="text-gray-700 font-medium text-sm">
                {report.injectionRecord.preInjectionTemperature}°C
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-500 text-sm">Nhiệt độ sau tiêm:</Text>
              <Text className="text-gray-700 font-medium text-sm">
                {report.injectionRecord.postInjectionTemperature}°C
              </Text>
            </View>
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
          <Text className="text-gray-500 mt-4">Đang tải báo cáo...</Text>
        </View>
      </SafeAreaView>
    );
  }

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
              onPress={() => router.back()}
            >
              <ArrowLeft size={20} color="#6B7280" />
            </TouchableOpacity>
            <View className="flex-1">
              <Text className="text-xl font-bold text-gray-800">
                Báo cáo Sau tiêm
              </Text>
              <Text className="text-gray-500 text-sm">
                Sự kiện ID: #{eventId}
              </Text>
            </View>
            <View className="bg-orange-100 px-3 py-2 rounded-full">
              <Text className="text-orange-700 font-semibold text-sm">
                {reports.length} báo cáo
              </Text>
            </View>
          </View>
        </View>

        <ScrollView
          className="flex-1 px-6"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 20, paddingBottom: 30 }}
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
          {reports.length > 0 ? (
            <View className="mb-6">
              <Text className="text-lg font-semibold text-gray-800 mb-4">
                Danh sách báo cáo phản ứng
              </Text>
              {reports.map(renderReportCard)}
            </View>
          ) : (
            <View className="bg-white p-6 rounded-xl border border-gray-200 items-center">
              <View className="bg-gray-100 p-4 rounded-full mb-3">
                <Activity size={24} color="#9CA3AF" />
              </View>
              <Text className="text-gray-500 font-semibold">
                Chưa có báo cáo nào
              </Text>
              <Text className="text-gray-400 text-sm mt-1 text-center">
                Các báo cáo phản ứng sau tiêm sẽ hiển thị ở đây
              </Text>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
