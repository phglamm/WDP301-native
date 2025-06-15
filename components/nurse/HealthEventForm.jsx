// Enhanced HealthEventForm Component - Fixed Android DateTimePicker Issue
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Platform,
  ActionSheetIOS,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  ArrowRight,
  Calendar,
  CheckCircle,
  Clock,
  Heart,
  FileText,
  Stethoscope,
} from "lucide-react-native";
import { createHealthEvent } from "../../services/nurseService";

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

  // UI state - Fixed: Better state management for Android
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [tempDate, setTempDate] = useState(null); // For iOS date picker handling
  const [datePickerMode, setDatePickerMode] = useState("date"); // 'date' or 'time'

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

  const formatDisplayDate = (date) => {
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const showDateActionSheet = () => {
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          title: "Chọn ngày khám sức khỏe",
          options: ["Hủy", "Chọn ngày giờ"],
          cancelButtonIndex: 0,
          userInterfaceStyle: "light",
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            setTempDate(formData.date);
            setDatePickerMode("datetime");
            setShowDatePicker(true);
          }
        }
      );
    } else {
      // For Android, show date picker first, then time picker
      setDatePickerMode("date");
      setShowDatePicker(true);
    }
  };

  // Fixed: Improved date change handler with proper error handling
  const handleDateChange = (event, selectedDate) => {
    console.log("Date change event:", event.type, selectedDate);

    if (Platform.OS === "android") {
      // Android behavior: always hide current picker after selection/dismissal
      if (datePickerMode === "date") {
        setShowDatePicker(false);
      } else {
        setShowTimePicker(false);
      }

      if (event.type === "set" && selectedDate) {
        if (datePickerMode === "date") {
          // User selected a date, now show time picker
          const newDate = new Date(formData.date);
          newDate.setFullYear(selectedDate.getFullYear());
          newDate.setMonth(selectedDate.getMonth());
          newDate.setDate(selectedDate.getDate());

          setFormData((prev) => ({
            ...prev,
            date: newDate,
          }));

          // Show time picker after a short delay to prevent conflicts
          setTimeout(() => {
            setDatePickerMode("time");
            setShowTimePicker(true);
          }, 100);
        } else {
          // User selected a time
          const newDate = new Date(formData.date);
          newDate.setHours(selectedDate.getHours());
          newDate.setMinutes(selectedDate.getMinutes());

          setFormData((prev) => ({
            ...prev,
            date: newDate,
          }));
        }
      }
      // If event.type === "dismissed", do nothing (user cancelled)
    } else {
      // iOS behavior: update temp date while picker is showing
      if (selectedDate) {
        setTempDate(selectedDate);
      }
    }
  };

  // iOS-specific handlers
  const handleIOSDateConfirm = () => {
    if (tempDate) {
      setFormData((prev) => ({
        ...prev,
        date: tempDate,
      }));
    }
    setShowDatePicker(false);
    setTempDate(null);
  };

  const handleIOSDateCancel = () => {
    setShowDatePicker(false);
    setTempDate(null);
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
            <View className="flex-row items-center mb-3">
              <Calendar size={20} color="#6B7280" />
              <Text className="text-lg font-semibold text-gray-800 ml-2">
                Ngày khám sức khỏe *
              </Text>
            </View>
            <View className="relative">
              <TouchableOpacity
                className="border-2 border-gray-200 rounded-2xl px-4 py-4 bg-white focus:border-emerald-500 flex-row items-center"
                onPress={showDateActionSheet}
              >
                <Calendar size={20} color="#6B7280" />
                <Text className="text-base text-gray-800 ml-3 flex-1">
                  {formatDisplayDate(formData.date)}
                </Text>
              </TouchableOpacity>
              <View className="absolute right-4 top-4">
                <CheckCircle size={20} color="#22C55E" />
              </View>
            </View>
            <Text className="text-gray-500 text-sm mt-2">
              {Platform.OS === "android"
                ? "Chọn ngày trước, sau đó chọn giờ khám sức khỏe"
                : "Chọn ngày và giờ thực hiện khám sức khỏe"}
            </Text>
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
                • Ngày khám: {formatDisplayDate(formData.date)}
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

      {/* Fixed: Separate Date and Time Pickers for Android to prevent conflicts */}
      {showDatePicker && Platform.OS === "android" && (
        <DateTimePicker
          value={formData.date}
          mode="date"
          display="default"
          onChange={handleDateChange}
          minimumDate={new Date()}
        />
      )}

      {showTimePicker && Platform.OS === "android" && (
        <DateTimePicker
          value={formData.date}
          mode="time"
          display="default"
          onChange={handleDateChange}
        />
      )}

      {/* iOS Date Picker with Modal-like behavior */}
      {showDatePicker && Platform.OS === "ios" && (
        <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200">
          <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
            <TouchableOpacity onPress={handleIOSDateCancel}>
              <Text className="text-red-500 font-semibold">Hủy</Text>
            </TouchableOpacity>
            <Text className="text-lg font-semibold text-gray-800">
              Chọn ngày giờ
            </Text>
            <TouchableOpacity onPress={handleIOSDateConfirm}>
              <Text className="text-emerald-600 font-semibold">Xong</Text>
            </TouchableOpacity>
          </View>
          <DateTimePicker
            value={tempDate || formData.date}
            mode="datetime"
            display="spinner"
            onChange={handleDateChange}
            minimumDate={new Date()}
          />
        </View>
      )}
    </View>
  );
}
