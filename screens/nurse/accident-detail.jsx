import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Share,
  ActivityIndicator,
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
import { getAccidentById } from "../../services/nurseService"; // You'll need to create this function

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
          // If you have a getAccidentById service function
          const response = await getAccidentById(params.accidentId);
          if (response.status && response.data) {
            setAccident(response.data);
          } else {
            throw new Error("Failed to fetch accident details");
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
          student: { fullName: "Đang tải...", studentCode: "" },
          nurse: { fullName: "Đang tải..." },
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

  const handleShare = async () => {
    if (!accident) return;

    try {
      const shareContent = `
📋 Báo cáo tai nạn

🏥 Loại: ${accident.type || "Không xác định"}
📝 Mô tả: ${accident.summary || "Không có mô tả"}

👤 Học sinh:
• Tên: ${accident.student?.fullName || "Không xác định"}
• Mã số: ${accident.student?.studentCode || "N/A"}
• Địa chỉ: ${accident.student?.address || "Không có"}

⚕️ Y tá xử lý:
• Tên: ${accident.nurse?.fullName || "Không xác định"}
• Số điện thoại: ${accident.nurse?.phone || "Không có"}
• Email: ${accident.nurse?.email || "Không có"}

📅 Thời gian: ${formatDate(accident.date)}

💊 Thuốc đã sử dụng: ${accident.accidentMedicines?.length || 0} loại
      `.trim();

      await Share.share({
        message: shareContent,
        title: "Báo cáo tai nạn",
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const handleEdit = () => {
    // Navigate to edit screen with accident data
    router.push({
      pathname: "/(nurse)/accident-edit",
      params: { accident: JSON.stringify(accident) },
    });
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

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white shadow-sm border-b border-gray-100 px-6 py-4">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => router.back()}
              className="p-2 rounded-full bg-gray-100 active:bg-gray-200 mr-3"
            >
              <ArrowLeft size={20} color="#6B7280" />
            </TouchableOpacity>
            <View>
              <Text className="text-xl font-montserratBold text-gray-800">
                Chi tiết tai nạn
              </Text>
              <Text className="text-gray-500 font-montserratRegular text-sm">
                ID: #{accident.id}
              </Text>
            </View>
          </View>

          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={handleShare}
              className="p-2 rounded-full bg-blue-100 active:bg-blue-200"
            >
              <Share2 size={20} color="#3B82F6" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleEdit}
              className="p-2 rounded-full bg-green-100 active:bg-green-200"
            >
              <Edit3 size={20} color="#22C55E" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Accident Type & Summary */}
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

        {/* Student Information */}
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

        {/* Nurse Information */}
        <View className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-gray-100">
          <View className="flex-row items-center mb-4">
            <View className="bg-green-100 p-2 rounded-full mr-3">
              <Activity size={20} color="#22C55E" />
            </View>
            <Text className="text-lg font-montserratBold text-gray-800">
              Y tá xử lý
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
                className={`self-start px-3 py-1 rounded-full ${
                  accident.nurse?.role === "nurse"
                    ? "bg-green-100"
                    : "bg-gray-100"
                }`}
              >
                <Text
                  className={`text-sm font-semibold ${
                    accident.nurse?.role === "nurse"
                      ? "text-green-700"
                      : "text-gray-700"
                  }`}
                >
                  {accident.nurse?.role === "nurse"
                    ? "Y tá"
                    : accident.nurse?.role || "Không xác định"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Medicines Used */}
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
    </SafeAreaView>
  );
}
