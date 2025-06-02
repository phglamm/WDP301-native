import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Share,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeft,
  Calendar,
  User,
  Activity,
  MapPin,
  Phone,
  Mail,
  FileText,
  Share2,
  Edit3,
  AlertCircle,
  Clock,
  Pill,
} from "lucide-react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { getAccidentById } from "../../services/nurseService";

export default function AccidentDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [accident, setAccident] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccidentDetails = async () => {
      if (params.accidentId) {
        try {
          setLoading(true);
          const response = await getAccidentById(params.accidentId);

          // Handle the API response structure
          if (
            response.status &&
            response.data &&
            Array.isArray(response.data) &&
            response.data.length > 0
          ) {
            // Since API returns an array, take the first element
            const accidentData = response.data[0];

            // Map the API response to match your screen's expected structure
            const mappedAccident = {
              id: accidentData.id,
              summary: accidentData.summary || "",
              type: accidentData.type || "",
              // Handle null date - use current date as fallback or leave as null
              date: accidentData.date || new Date().toISOString(),
              student: {
                fullName: accidentData.student?.fullName || "Không xác định",
                studentCode: accidentData.student?.studentCode || "N/A",
                address: accidentData.student?.address || "",
              },
              nurse: {
                id: accidentData.nurse?.id,
                fullName: accidentData.nurse?.fullName || "Không xác định",
                phone: accidentData.nurse?.phone || "",
                email: accidentData.nurse?.email || "",
                role: accidentData.nurse?.role || "nurse",
              },
              accidentMedicines: accidentData.accidentMedicines || [],
            };

            setAccident(mappedAccident);
          } else {
            throw new Error("No accident data found");
          }
        } catch (error) {
          console.error("Error fetching accident details:", error);
          Alert.alert("Lỗi", "Không thể tải thông tin tai nạn.", [
            { text: "OK", onPress: () => router.push("/(nurse)/accident") },
          ]);
        } finally {
          setLoading(false);
        }
      } else {
        // Fallback: create basic accident object from params for immediate display
        setAccident({
          id: params.accidentId,
          summary: params.summary || "",
          type: params.type || "",
          date: new Date().toISOString(),
          student: { fullName: "Đang tải...", studentCode: "", address: "" },
          nurse: {
            fullName: "Đang tải...",
            phone: "",
            email: "",
            role: "nurse",
          },
          accidentMedicines: [],
        });
        setLoading(false);
      }
    };

    fetchAccidentDetails();
  }, [params.accidentId]);

  const formatDate = (dateString) => {
    if (!dateString || dateString === "Invalid Date") {
      return "Không xác định";
    }
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Không xác định";
    }
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

  const getRoleDisplayText = (role) => {
    switch (role?.toLowerCase()) {
      case "nurse":
        return "Y tá";
      case "parent":
        return "Phụ huynh";
      case "teacher":
        return "Giáo viên";
      case "admin":
        return "Quản trị viên";
      default:
        return role || "Không xác định";
    }
  };

  const getRoleColorClass = (role) => {
    switch (role?.toLowerCase()) {
      case "nurse":
        return { bg: "bg-green-100", text: "text-green-700" };
      case "parent":
        return { bg: "bg-blue-100", text: "text-blue-700" };
      case "teacher":
        return { bg: "bg-purple-100", text: "text-purple-700" };
      case "admin":
        return { bg: "bg-red-100", text: "text-red-700" };
      default:
        return { bg: "bg-gray-100", text: "text-gray-700" };
    }
  };

  if (!accident || loading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text className="text-gray-500 mt-4">
            Đang tải thông tin tai nạn...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const typeColors = getAccidentTypeColor(accident.type);
  const roleColors = getRoleColorClass(accident.nurse?.role);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        {/* Header */}
        <View className="bg-white shadow-sm border-b border-gray-100 p-6">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-4">
              <TouchableOpacity
                onPress={() => router.back()}
                className="p-2 rounded-full bg-gray-100 active:bg-gray-200"
              >
                <ArrowLeft size={20} color="#6B7280" />
              </TouchableOpacity>
              <View>
                <Text className="text-xl font-montserratBold text-gray-800">
                  Chi tiết tai nạn
                </Text>
                <Text className="text-gray-500 font-montserratRegular">
                  #{accident.id}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <ScrollView
          className="flex-1 bg-white"
          contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-gray-100">
            <View className="flex-row items-start justify-between mb-4">
              <View
                className={`px-4 py-2 rounded-full ${typeColors.bg} ${typeColors.border} border`}
              >
                <Text className={`font-semibold ${typeColors.text}`}>
                  {accident.type || "Không xác định"}
                </Text>
              </View>
              <View className="bg-gray-100 p-2 rounded-full">
                <AlertCircle size={20} color={typeColors.icon} />
              </View>
            </View>

            <Text className="text-2xl font-montserratBold text-gray-800 mb-2">
              {accident.summary || "Không có mô tả"}
            </Text>

            <View className="flex-row items-center">
              <Clock size={16} color="#6B7280" />
              <Text className="text-gray-600 ml-2 font-montserratMedium">
                {formatDate(accident.date)}
              </Text>
            </View>
          </View>

          <View className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-gray-100">
            <View className="flex-row items-center mb-4">
              <View className="bg-blue-100 p-2 rounded-full mr-3">
                <User size={20} color="#3B82F6" />
              </View>
              <Text className="text-lg font-montserratBold text-gray-800">
                Thông tin học sinh
              </Text>
            </View>

            <View className="space-y-4">
              <View>
                <Text className="text-gray-500 font-montserratMedium text-sm mb-1">
                  Họ và tên
                </Text>
                <Text className="text-gray-800 font-montserratSemiBold text-lg">
                  {accident.student?.fullName || "Không xác định"}
                </Text>
              </View>

              <View>
                <Text className="text-gray-500 font-montserratMedium text-sm mb-1">
                  Mã số học sinh
                </Text>
                <Text className="text-gray-800 font-montserratSemiBold">
                  {accident.student?.studentCode || "N/A"}
                </Text>
              </View>

              {accident.student?.address && (
                <View>
                  <Text className="text-gray-500 font-montserratMedium text-sm mb-1">
                    Địa chỉ
                  </Text>
                  <View className="flex-row items-start">
                    <MapPin size={16} color="#6B7280" className="mr-2 mt-1" />
                    <Text className="text-gray-800 font-montserratMedium flex-1">
                      {accident.student.address}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </View>

          <View className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-gray-100">
            <View className="flex-row items-center mb-4">
              <View className="bg-green-100 p-2 rounded-full mr-3">
                <Activity size={20} color="#22C55E" />
              </View>
              <Text className="text-lg font-montserratBold text-gray-800">
                Người xử lý
              </Text>
            </View>

            <View className="space-y-4">
              <View>
                <Text className="text-gray-500 font-montserratMedium text-sm mb-1">
                  Họ và tên
                </Text>
                <Text className="text-gray-800 font-montserratSemiBold text-lg">
                  {accident.nurse?.fullName || "Không xác định"}
                </Text>
              </View>

              {accident.nurse?.phone && (
                <View>
                  <Text className="text-gray-500 font-montserratMedium text-sm mb-1">
                    Số điện thoại
                  </Text>
                  <View className="flex-row items-center">
                    <Phone size={16} color="#6B7280" />
                    <Text className="text-gray-800 font-montserratMedium ml-2">
                      {accident.nurse.phone}
                    </Text>
                  </View>
                </View>
              )}

              {accident.nurse?.email && (
                <View>
                  <Text className="text-gray-500 font-montserratMedium text-sm mb-1">
                    Email
                  </Text>
                  <View className="flex-row items-center">
                    <Mail size={16} color="#6B7280" />
                    <Text className="text-gray-800 font-montserratMedium ml-2">
                      {accident.nurse.email}
                    </Text>
                  </View>
                </View>
              )}

              <View>
                <Text className="text-gray-500 font-montserratMedium text-sm mb-1">
                  Vai trò
                </Text>
                <View
                  className={`self-start px-3 py-1 rounded-full ${roleColors.bg}`}
                >
                  <Text className={`text-sm font-semibold ${roleColors.text}`}>
                    {getRoleDisplayText(accident.nurse?.role)}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <View className="flex-row items-center mb-4">
              <View className="bg-purple-100 p-2 rounded-full mr-3">
                <Pill size={20} color="#8B5CF6" />
              </View>
              <Text className="text-lg font-montserratBold text-gray-800">
                Thuốc đã sử dụng
              </Text>
            </View>

            {accident.accidentMedicines &&
            accident.accidentMedicines.length > 0 ? (
              <View className="space-y-3">
                {accident.accidentMedicines.map((medicine, index) => (
                  <View
                    key={index}
                    className="bg-gray-50 p-4 rounded-xl border border-gray-200"
                  >
                    <Text className="font-montserratSemiBold text-gray-800">
                      {medicine.name || `Thuốc ${index + 1}`}
                    </Text>
                    {medicine.dosage && (
                      <Text className="text-gray-600 text-sm mt-1">
                        Liều lượng: {medicine.dosage}
                      </Text>
                    )}
                    {medicine.notes && (
                      <Text className="text-gray-600 text-sm mt-1">
                        Ghi chú: {medicine.notes}
                      </Text>
                    )}
                  </View>
                ))}
              </View>
            ) : (
              <View className="items-center py-8">
                <View className="bg-gray-100 p-4 rounded-full mb-3">
                  <Pill size={24} color="#6B7280" />
                </View>
                <Text className="text-gray-500 font-montserratMedium">
                  Chưa sử dụng thuốc nào
                </Text>
                <Text className="text-gray-400 text-sm mt-1 text-center">
                  Thông tin về thuốc sẽ hiển thị ở đây
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
