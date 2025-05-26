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
import React, { useState, useRef, useEffect, use } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeft,
  Clock,
  Plus,
  Activity,
  AlertCircle,
  Calendar,
  User,
  FileText,
  ChevronRight,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import AccidentDeclareForm from "../../components/nurse/AccidentDeclareForm";
import {
  createAccidentEvent,
  getAccidentHistory,
} from "../../services/nurseService";
import { set } from "zod";
import AccidentHistory from "../../components/nurse/AccidentHistory";

export default function AccidentScreen() {
  const router = useRouter();
  const [currentView, setCurrentView] = useState("select");
  const [accidents, setAccidents] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [formData, setFormData] = useState({
    studentCode: "",
    summary: "",
    type: "",
  });

  // Calculate statistics from accidents data
  const getTodayAccidents = () => {
    const today = new Date().toDateString();
    return accidents.filter((accident) => {
      const accidentDate = new Date(accident.date).toDateString();
      return accidentDate === today;
    }).length;
  };

  const getWeekAccidents = () => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return accidents.filter((accident) => {
      const accidentDate = new Date(accident.date);
      return accidentDate >= oneWeekAgo;
    }).length;
  };
  const fetchAccidents = async () => {
    try {
      const response = await getAccidentHistory();
      setAccidents(response.data || []);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching accidents:", error);
      Alert.alert("Lỗi", "Không thể tải dữ liệu tai nạn.");
    }
  };
  useEffect(() => {
    fetchAccidents();
  }, []);

  const handleSubmitAccident = async () => {
    setIsSubmitting(true);
    try {
      const accidentData = {
        studentCode: formData.studentCode || "",
        summary: formData.summary || "",
        type: formData.type || "",
      };

      const response = await createAccidentEvent(accidentData);
      if (response.code === 201 && response.status) {
        Alert.alert("Thành công", "Sự kiện đã được lưu thành công!", [
          {
            text: "OK",
            onPress: () => {
              setCurrentView("select");
              // Reset form data
              setFormData({
                studentCode: "",
                summary: "",
                type: "",
              });
              // Refresh accidents list
              fetchAccidents();
            },
          },
        ]);
      }
    } catch (err) {
      Alert.alert("Lỗi", "Không thể lưu tai nạn. Vui lòng thử lại.");
      console.error("Error submitting accident:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartDeclarationAccident = () => {
    setCurrentView("form");
    setFormData({
      studentCode: "",
      summary: "",
      type: "",
    });
  };

  const handleViewHistory = () => {
    setCurrentView("history");
  };

  const handleViewAccidentDetail = (accident) => {
    // Navigate to accident detail screen with accident data
    router.push({
      pathname: "/(nurse)/accident-detail",
      params: { accidentId: accident.id },
    });
    console.log("accidentId", accident.id);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const response = await getAccidentHistory();
      setAccidents(response.data || []);
    } catch (error) {
      console.error("Error refreshing accidents:", error);
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

  const getAccidentTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case "chấn thương":
        return {
          bg: "bg-red-100",
          text: "text-red-700",
          border: "border-red-200",
          icon: "#EF4444",
        };
      case "bệnh tật":
        return {
          bg: "bg-orange-100",
          text: "text-orange-700",
          border: "border-orange-200",
          icon: "#F97316",
        };
      case "vật lý":
        return {
          bg: "bg-blue-100",
          text: "text-blue-700",
          border: "border-blue-200",
          icon: "#3B82F6",
        };
      case "khẩn cấp":
        return {
          bg: "bg-purple-100",
          text: "text-purple-700",
          border: "border-purple-200",
          icon: "#8B5CF6",
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
          <AccidentDeclareForm
            formData={formData}
            setFormData={setFormData}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmitAccident}
            onBack={() => setCurrentView("select")}
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  // History view
  if (currentView === "history") {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <AccidentHistory
          accidents={accidents}
          setCurrentView={setCurrentView}
          handleViewAccidentDetail={handleViewAccidentDetail}
          refreshing={refreshing}
          handleRefresh={handleRefresh}
          formatDate={formatDate}
          getAccidentTypeColor={getAccidentTypeColor}
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
          <View className="flex-row items-center justify-start gap-4 mb-4">
            <TouchableOpacity
              onPress={() => router.push("/home")}
              className="p-2 rounded-full bg-gray-100 active:bg-gray-200"
            >
              <ArrowLeft size={20} color="#6B7280" />
            </TouchableOpacity>
            <View className="flex-1">
              <Text className="text-2xl font-montserratBold text-gray-800">
                Sự kiện tai nạn
              </Text>
              <Text className="text-gray-500 font-montserratRegular mt-1">
                Quản lý và theo dõi tai nạn trong trường
              </Text>
            </View>
          </View>

          {/* Stats Cards */}
          <View className="flex-row gap-4 mt-4">
            <View className="flex-1 bg-red-50 p-4 rounded-xl border border-red-100">
              <View className="flex-row items-center">
                <AlertCircle size={20} color="#EF4444" />
                <Text className="text-red-600 font-semibold ml-2">Hôm nay</Text>
              </View>
              <Text className="text-2xl font-bold text-red-700 mt-1">
                {getTodayAccidents()}
              </Text>
              <Text className="text-red-500 text-xs">tai nạn</Text>
            </View>
            <View className="flex-1 bg-blue-50 p-4 rounded-xl border border-blue-100">
              <View className="flex-row items-center">
                <Activity size={20} color="#3B82F6" />
                <Text className="text-blue-600 font-semibold ml-2">
                  Tuần này
                </Text>
              </View>
              <Text className="text-2xl font-bold text-blue-700 mt-1">
                {getWeekAccidents()}
              </Text>
              <Text className="text-blue-500 text-xs">tai nạn</Text>
            </View>
          </View>
        </View>

        {/* Enhanced Action Buttons */}
        <View className="px-6 py-4">
          <View className="flex-row gap-4">
            <TouchableOpacity
              onPress={handleStartDeclarationAccident}
              className="flex-1 bg-blue-500 py-4 rounded-2xl flex-row items-center justify-center shadow-lg active:scale-95"
              style={{
                shadowColor: "#3B82F6",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 8,
              }}
            >
              <Plus size={22} color="white" />
              <Text className="text-white font-bold ml-2 text-base">
                Tạo sự kiện mới
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleViewHistory}
              className="flex-1 bg-white border-2 border-gray-200 py-4 rounded-2xl flex-row items-center justify-center active:scale-95"
            >
              <Clock size={22} color="#6B7280" />
              <Text className="text-gray-700 font-bold ml-2 text-base">
                Lịch sử ({accidents.length})
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Content Area */}
        <View className="flex-1">
          <ScrollView
            className="flex-1 px-6"
            contentContainerStyle={{ paddingTop: 10, paddingBottom: 30 }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
              />
            }
            showsVerticalScrollIndicator={false}
          >
            {/* Quick Actions Section */}
            {/* <View className="mb-6">
              <Text className="text-lg font-montserratSemiBold text-gray-800 mb-4">
                Hành động nhanh
              </Text>

              <View className="space-y-3">
                <TouchableOpacity className="bg-white p-4 rounded-xl border border-gray-200 flex-row items-center justify-between active:bg-gray-50">
                  <View className="flex-row items-center">
                    <View className="bg-orange-100 p-2 rounded-lg">
                      <AlertCircle size={20} color="#F97316" />
                    </View>
                    <View className="ml-3">
                      <Text className="font-semibold text-gray-800">
                        Báo cáo khẩn cấp
                      </Text>
                      <Text className="text-sm text-gray-500">
                        Tai nạn cần xử lý ngay
                      </Text>
                    </View>
                  </View>
                  <ArrowLeft
                    size={20}
                    color="#9CA3AF"
                    style={{ transform: [{ rotate: "180deg" }] }}
                  />
                </TouchableOpacity>

                <TouchableOpacity className="bg-white p-4 rounded-xl border border-gray-200 flex-row items-center justify-between active:bg-gray-50">
                  <View className="flex-row items-center">
                    <View className="bg-green-100 p-2 rounded-lg">
                      <Activity size={20} color="#22C55E" />
                    </View>
                    <View className="ml-3">
                      <Text className="font-semibold text-gray-800">
                        Thống kê tuần
                      </Text>
                      <Text className="text-sm text-gray-500">
                        Xem báo cáo chi tiết
                      </Text>
                    </View>
                  </View>
                  <ArrowLeft
                    size={20}
                    color="#9CA3AF"
                    style={{ transform: [{ rotate: "180deg" }] }}
                  />
                </TouchableOpacity>
              </View>
            </View> */}

            {/* Recent Activity Section */}
            <View className="mb-6">
              <Text className="text-lg font-montserratSemiBold text-gray-800 mb-4">
                Hoạt động gần đây
              </Text>

              {accidents.length === 0 ? (
                <View className="bg-white p-6 rounded-xl border border-gray-200">
                  <View className="items-center">
                    <View className="bg-gray-100 p-4 rounded-full mb-3">
                      <Clock size={24} color="#6B7280" />
                    </View>
                    <Text className="text-gray-500 font-medium">
                      Chưa có hoạt động nào
                    </Text>
                    <Text className="text-gray-400 text-sm mt-1 text-center">
                      Các sự kiện tai nạn sẽ hiển thị ở đây
                    </Text>
                  </View>
                </View>
              ) : (
                <View className="space-y-3">
                  {accidents.slice(0, 3).map((accident, index) => {
                    const typeColors = getAccidentTypeColor(accident.type);
                    return (
                      <TouchableOpacity
                        key={accident.id || index}
                        onPress={() => handleViewAccidentDetail(accident)}
                        className="bg-white p-4 rounded-xl border border-gray-200 active:bg-gray-50"
                      >
                        <View className="flex-row items-center justify-between">
                          <View className="flex-1">
                            <View
                              className={`self-start px-3 py-1 rounded-full ${typeColors.bg} mb-1`}
                            >
                              <Text
                                className={`text-sm font-semibold ${typeColors.text}`}
                              >
                                {accident.type}
                              </Text>
                            </View>
                            <Text className="font-semibold text-gray-800">
                              {accident.summary}
                            </Text>
                            <Text className="text-sm text-gray-500 mt-1">
                              {accident.student?.fullName} •{" "}
                              {formatDate(accident.date)}
                            </Text>
                          </View>
                          <ChevronRight size={16} color="#9CA3AF" />
                        </View>
                      </TouchableOpacity>
                    );
                  })}

                  {accidents.length > 3 && (
                    <TouchableOpacity
                      onPress={handleViewHistory}
                      className="bg-blue-50 p-3 rounded-xl border border-blue-100 active:bg-blue-100"
                    >
                      <Text className="text-blue-600 font-semibold text-center">
                        Xem tất cả {accidents.length} sự kiện
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
