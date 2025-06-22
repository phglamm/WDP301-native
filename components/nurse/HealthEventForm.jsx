// Enhanced HealthEventForm Component
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import {
  ArrowRight,
  Calendar,
  CheckCircle,
  Heart,
  FileText,
  Stethoscope,
} from "lucide-react-native";
import { createHealthEvent } from "../../services/nurseService";
import DateTimePickerCustom from "../common/DateTimePickerCustom";

export default function HealthEventForm({
  loading,
  setLoading,
  onBack,
  onSuccess,
}) {
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default to 1 week from now
  });

  const handleSubmit = async () => {
    if (!formData.name || !formData.date) {
      Alert.alert("Thông báo", "Vui lòng điền đầy đủ thông tin bắt buộc.");
      return;
    }

    setLoading((prev) => ({ ...prev, creating: true }));
    try {
      const eventData = {
        name: formData.name.trim(),
        description: formData.description.trim() || "",
        date: formData.date.toISOString(),
      };

      const response = await createHealthEvent(eventData);
      if (response.status) {
        Alert.alert(
          "Thành công",
          "Sự kiện khám sức khỏe đã được tạo thành công",
          [
            {
              text: "OK",
              onPress: onSuccess,
            },
          ]
        );
      } else {
        Alert.alert(
          "Lỗi",
          response.message || "Không thể tạo sự kiện khám sức khỏe"
        );
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể tạo sự kiện khám sức khỏe");
      console.error("Create health event error:", error);
    } finally {
      setLoading((prev) => ({ ...prev, creating: false }));
    }
  };

  return (
    <View className="flex-1">
      {/* Enhanced Header */}
      <View className="bg-white p-6 border-b border-gray-100 shadow-sm">
        <View className="flex-row items-center mb-2">
          <TouchableOpacity
            onPress={onBack}
            className="mr-4 p-2 rounded-full bg-gray-100 active:bg-gray-200"
          >
            <ArrowRight
              size={20}
              color="#6B7280"
              style={{ transform: [{ rotate: "180deg" }] }}
            />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-2xl font-bold text-gray-800">
              Tạo sự kiện khám sức khỏe
            </Text>
            <Text className="text-gray-500 mt-1">
              Thiết lập thông tin sự kiện khám sức khỏe mới
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Form Header */}
        <View className="px-6 py-6">
          <View className="bg-emerald-500 p-6 rounded-2xl mb-6">
            <View className="flex-row items-center">
              <View className="bg-white bg-opacity-20 p-3 rounded-full">
                <Heart size={35} color="#10b981" />
              </View>
              <View className="ml-4 flex-1">
                <Text className="text-white text-xl font-bold">
                  🩺 Sự kiện khám sức khỏe
                </Text>
                <Text className="text-white text-opacity-90 mt-1">
                  Tạo sự kiện khám sức khỏe định kỳ cho học sinh
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Form Fields */}
        <View className="px-6">
          {/* Event Name */}
          <View className="mb-6">
            <View className="flex-row items-center mb-3">
              <FileText size={20} color="#6B7280" />
              <Text className="text-lg font-semibold text-gray-800 ml-2">
                Tên sự kiện *
              </Text>
            </View>
            <View className="relative">
              <View className="border-2 border-gray-200 rounded-2xl px-4 py-4 bg-white focus:border-emerald-500 flex-row items-center">
                <FileText size={20} color="#6B7280" />
                <TextInput
                  className="text-base text-gray-800 ml-3 flex-1"
                  value={formData.name}
                  onChangeText={(text) =>
                    setFormData((prev) => ({ ...prev, name: text }))
                  }
                  placeholder="Nhập tên sự kiện khám sức khỏe"
                  placeholderTextColor="#9CA3AF"
                  multiline={false}
                />
              </View>
              {formData.name && (
                <View className="absolute right-4 top-4">
                  <CheckCircle size={20} color="#22C55E" />
                </View>
              )}
            </View>
            <Text className="text-gray-500 text-sm mt-2">
              Ví dụ: Khám sức khỏe đợt 1 2025
            </Text>
          </View>
          {/* Event Description */}
          <View className="mb-6">
            <View className="flex-row items-center mb-3">
              <Stethoscope size={20} color="#6B7280" />
              <Text className="text-lg font-semibold text-gray-800 ml-2">
                Mô tả sự kiện
              </Text>
            </View>
            <View className="relative">
              <View className="border-2 border-gray-200 rounded-2xl px-4 py-4 bg-white focus:border-emerald-500">
                <TextInput
                  className="text-base text-gray-800 min-h-[100px]"
                  value={formData.description}
                  onChangeText={(text) =>
                    setFormData((prev) => ({ ...prev, description: text }))
                  }
                  placeholder="Nhập mô tả chi tiết về sự kiện khám sức khỏe"
                  placeholderTextColor="#9CA3AF"
                  multiline={true}
                  textAlignVertical="top"
                />
              </View>
              {formData.description && (
                <View className="absolute right-4 top-4">
                  <CheckCircle size={20} color="#22C55E" />
                </View>
              )}
            </View>
            <Text className="text-gray-500 text-sm mt-2">
              Mô tả về nội dung khám, quy trình, và các lưu ý đặc biệt
            </Text>
          </View>
          {/* Event Date */}
          <View className="mb-6">
            <DateTimePickerCustom
              value={formData.date}
              onChange={(selectedDate) =>
                setFormData((prev) => ({ ...prev, date: selectedDate }))
              }
              mode="datetime"
              label="Ngày khám sức khỏe"
              placeholder="Chọn ngày và giờ khám sức khỏe"
              required={true}
              minimumDate={new Date()}
            />
          </View>
          {/* Form Summary */}
          {formData.name && (
            <View className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 mb-6">
              <Text className="text-emerald-800 font-semibold mb-2">
                📋 Tóm tắt sự kiện:
              </Text>
              <Text className="text-emerald-700">• Tên: {formData.name}</Text>
              {formData.description && (
                <Text className="text-emerald-700" numberOfLines={2}>
                  • Mô tả: {formData.description}
                </Text>
              )}
              <Text className="text-emerald-700">
                • Ngày khám:
                {formData.date.toLocaleDateString("vi-VN", {
                  weekday: "long",
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </View>
          )}
          {/* Submit Button */}
          <View className="mb-6">
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={loading.creating}
              className={`py-4 rounded-2xl flex-row items-center justify-center ${
                loading.creating
                  ? "bg-gray-300"
                  : "bg-emerald-600 shadow-lg active:scale-98"
              }`}
              style={
                !loading.creating
                  ? {
                      shadowColor: "#10B981",
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.3,
                      shadowRadius: 8,
                      elevation: 8,
                    }
                  : {}
              }
            >
              {loading.creating ? (
                <View className="flex-row items-center">
                  <ActivityIndicator color="white" size="small" />
                  <Text className="text-white font-bold text-lg ml-2">
                    Đang tạo...
                  </Text>
                </View>
              ) : (
                <View className="flex-row items-center">
                  <CheckCircle size={20} color="white" />
                  <Text className="text-white font-bold text-lg ml-2">
                    Tạo sự kiện khám sức khỏe
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
          {/* Help Text */}
          <View className="bg-blue-50 p-4 rounded-2xl border border-blue-200">
            <Text className="text-blue-800 font-semibold mb-2">
              💡 Lưu ý quan trọng
            </Text>
            <Text className="text-blue-700 text-sm leading-5">
              • Kiểm tra kỹ thông tin trước khi tạo sự kiện{"\n"}• Đảm bảo thời
              gian phù hợp với lịch học của học sinh{"\n"}• Chuẩn bị đầy đủ
              trang thiết bị y tế cần thiết{"\n"}• Thông báo trước cho phụ huynh
              về lịch khám sức khỏe{"\n"}• Phối hợp với các bác sĩ chuyên khoa
              khi cần thiết
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
