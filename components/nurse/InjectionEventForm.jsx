// Enhanced InjectionEventForm Component
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Modal,
  Platform,
  ActionSheetIOS,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  ArrowRight,
  Calendar,
  ChevronRight,
  CheckCircle,
  Clock,
  DollarSign,
  Syringe,
  FileText,
  AlertTriangle,
} from "lucide-react-native";
import { createInjectionEvent } from "../../services/nurseService";

export default function InjectionEventForm({
  vaccinations,
  loading,
  setLoading,
  onBack,
  onSuccess,
}) {
  // Form state
  const [formData, setFormData] = useState({
    vaccinationId: "",
    vaccinationName: "",
    registrationOpenDate: new Date(),
    registrationCloseDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    price: "",
  });

  // UI state
  const [showVaccinationModal, setShowVaccinationModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState({
    type: null,
    visible: false,
  });

  const handleSubmit = async () => {
    if (!formData.vaccinationId || !formData.date || !formData.price) {
      Alert.alert("Thông báo", "Vui lòng điền đầy đủ thông tin bắt buộc.");
      return;
    }

    setLoading((prev) => ({ ...prev, creating: true }));
    try {
      const eventData = {
        vaccinationId: String(formData.vaccinationId),
        registrationOpenDate: formData.registrationOpenDate.toISOString(),
        registrationCloseDate: formData.registrationCloseDate.toISOString(),
        date: formData.date.toISOString(),
        price: parseInt(formData.price),
      };

      const response = await createInjectionEvent(eventData);
      if (response.status) {
        Alert.alert(
          "Thành công",
          response.message || "Sự kiện tiêm chủng đã được tạo thành công",
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
          response.message || "Không thể tạo sự kiện tiêm chủng"
        );
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể tạo sự kiện tiêm chủng");
      console.error("Create event error:", error);
    } finally {
      setLoading((prev) => ({ ...prev, creating: false }));
    }
  };

  const selectVaccination = (vaccination) => {
    setFormData((prev) => ({
      ...prev,
      vaccinationId: vaccination.id.toString(),
      vaccinationName: vaccination.name,
    }));
    setShowVaccinationModal(false);
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

  const showDateActionSheet = (dateType) => {
    const getDateTypeTitle = (type) => {
      switch (type) {
        case "registrationOpenDate":
          return "Ngày mở đăng ký";
        case "registrationCloseDate":
          return "Ngày đóng đăng ký";
        case "date":
          return "Ngày tiêm";
        default:
          return "Chọn ngày";
      }
    };

    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          title: getDateTypeTitle(dateType),
          options: ["Hủy", "Chọn ngày giờ"],
          cancelButtonIndex: 0,
          userInterfaceStyle: "light",
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            setShowDatePicker({ type: dateType, visible: true });
          }
        }
      );
    } else {
      // For Android, directly show date picker
      setShowDatePicker({ type: dateType, visible: true });
    }
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || formData[showDatePicker.type];
    setShowDatePicker({ type: null, visible: false });

    if (selectedDate) {
      setFormData((prev) => ({
        ...prev,
        [showDatePicker.type]: currentDate,
      }));
    }
  };

  const renderVaccinationModal = () => (
    <Modal
      visible={showVaccinationModal}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View className="flex-1 bg-white">
        <View className="flex-row justify-between items-center px-6 py-4 border-b border-gray-200">
          <TouchableOpacity onPress={() => setShowVaccinationModal(false)}>
            <Text className="text-red-500 font-semibold text-base">Hủy</Text>
          </TouchableOpacity>
          <Text className="text-lg font-bold text-gray-800">Chọn Vaccine</Text>
          <View style={{ width: 60 }} />
        </View>

        <ScrollView className="flex-1 px-6 py-4">
          {loading.vaccinations ? (
            <ActivityIndicator size="large" color="#3B82F6" className="my-8" />
          ) : (
            vaccinations.map((vaccination, index) => (
              <TouchableOpacity
                key={vaccination.id || index}
                className={`flex-row items-center justify-between bg-white border rounded-2xl p-4 mb-3 ${
                  formData.vaccinationId === vaccination.id.toString()
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200"
                }`}
                onPress={() => selectVaccination(vaccination)}
              >
                <View className="flex-1">
                  <Text className="text-base font-semibold text-gray-800 mb-1">
                    {vaccination.name}
                  </Text>
                  <Text className="text-sm text-gray-600 mb-1">
                    {vaccination.description}
                  </Text>
                  <Text className="text-xs text-gray-500">
                    Số mũi: {vaccination.numberOfDoses}
                  </Text>
                </View>
                {formData.vaccinationId === vaccination.id.toString() && (
                  <CheckCircle size={24} color="#3B82F6" />
                )}
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </View>
    </Modal>
  );

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
            <Text className="text-2xl font-montserratBold text-gray-800">
              Tạo sự kiện tiêm chủng
            </Text>
            <Text className="text-gray-500 font-montserratRegular mt-1">
              Thiết lập thông tin sự kiện mới
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
          <View className="bg-blue-500 p-6 rounded-2xl mb-6">
            <View className="flex-row items-center">
              <View className="bg-blue bg-opacity-20 p-3 rounded-full">
                <Syringe size={35} color="white" />
              </View>
              <View className="ml-4 flex-1">
                <Text className="text-white text-xl font-bold">
                  💉 Sự kiện tiêm chủng
                </Text>
                <Text className="text-white text-opacity-90 mt-1">
                  Tạo sự kiện tiêm chủng mới cho học sinh
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Form Fields */}
        <View className="px-6">
          {/* Vaccine Selection */}
          <View className="mb-6">
            <View className="flex-row items-center mb-3">
              <Syringe size={20} color="#6B7280" />
              <Text className="text-lg font-semibold text-gray-800 ml-2">
                Chọn Vaccine *
              </Text>
            </View>
            <View className="relative">
              <TouchableOpacity
                className="border-2 border-gray-200 rounded-2xl px-4 py-4 bg-white focus:border-blue-500 flex-row items-center justify-between"
                onPress={() => setShowVaccinationModal(true)}
              >
                <Text
                  className={`flex-1 text-base ${
                    formData.vaccinationName ? "text-gray-800" : "text-gray-400"
                  }`}
                >
                  {formData.vaccinationName || "Chọn loại vaccine"}
                </Text>
                <ChevronRight size={20} color="#9CA3AF" />
              </TouchableOpacity>
              {formData.vaccinationName && (
                <View className="absolute right-4 top-4">
                  <CheckCircle size={20} color="#22C55E" />
                </View>
              )}
            </View>
          </View>

          {/* Registration Open Date */}
          <View className="mb-6">
            <View className="flex-row items-center mb-3">
              <Calendar size={20} color="#6B7280" />
              <Text className="text-lg font-semibold text-gray-800 ml-2">
                Ngày mở đăng ký
              </Text>
            </View>
            <View className="relative">
              <TouchableOpacity
                className="border-2 border-gray-200 rounded-2xl px-4 py-4 bg-white focus:border-blue-500 flex-row items-center"
                onPress={() => showDateActionSheet("registrationOpenDate")}
              >
                <Calendar size={20} color="#6B7280" />
                <Text className="text-base text-gray-800 ml-3 flex-1">
                  {formatDisplayDate(formData.registrationOpenDate)}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Registration Close Date */}
          <View className="mb-6">
            <View className="flex-row items-center mb-3">
              <Calendar size={20} color="#6B7280" />
              <Text className="text-lg font-semibold text-gray-800 ml-2">
                Ngày đóng đăng ký
              </Text>
            </View>
            <View className="relative">
              <TouchableOpacity
                className="border-2 border-gray-200 rounded-2xl px-4 py-4 bg-white focus:border-blue-500 flex-row items-center"
                onPress={() => showDateActionSheet("registrationCloseDate")}
              >
                <Calendar size={20} color="#6B7280" />
                <Text className="text-base text-gray-800 ml-3 flex-1">
                  {formatDisplayDate(formData.registrationCloseDate)}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Injection Date */}
          <View className="mb-6">
            <View className="flex-row items-center mb-3">
              <Clock size={20} color="#6B7280" />
              <Text className="text-lg font-semibold text-gray-800 ml-2">
                Ngày tiêm *
              </Text>
            </View>
            <View className="relative">
              <TouchableOpacity
                className="border-2 border-gray-200 rounded-2xl px-4 py-4 bg-white focus:border-blue-500 flex-row items-center"
                onPress={() => showDateActionSheet("date")}
              >
                <Clock size={20} color="#6B7280" />
                <Text className="text-base text-gray-800 ml-3 flex-1">
                  {formatDisplayDate(formData.date)}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Price */}
          <View className="mb-6">
            <View className="flex-row items-center mb-3">
              <DollarSign size={20} color="#6B7280" />
              <Text className="text-lg font-semibold text-gray-800 ml-2">
                Giá tiền (VND) *
              </Text>
            </View>
            <View className="relative">
              <View className="border-2 border-gray-200 rounded-2xl px-4 py-4 bg-white focus:border-blue-500 flex-row items-center">
                <DollarSign size={20} color="#6B7280" />
                <TextInput
                  className="text-base text-gray-800 ml-3 flex-1"
                  value={formData.price}
                  onChangeText={(text) =>
                    setFormData((prev) => ({ ...prev, price: text }))
                  }
                  placeholder="Nhập giá tiền"
                  keyboardType="numeric"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
              {formData.price && (
                <View className="absolute right-4 top-4">
                  <CheckCircle size={20} color="#22C55E" />
                </View>
              )}
            </View>
            <Text className="text-gray-500 text-sm mt-2">
              Nhập số tiền không bao gồm dấu phẩy
            </Text>
          </View>

          {/* Form Summary */}
          {formData.vaccinationName && formData.price && (
            <View className="bg-blue-50 p-4 rounded-2xl border border-blue-200 mb-6">
              <Text className="text-blue-800 font-semibold mb-2">
                📋 Tóm tắt sự kiện:
              </Text>
              <Text className="text-blue-700">
                • Vaccine: {formData.vaccinationName}
              </Text>
              <Text className="text-blue-700">
                • Giá: {parseInt(formData.price || 0).toLocaleString()} VND
              </Text>
              <Text className="text-blue-700">
                • Ngày tiêm: {formatDisplayDate(formData.date)}
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
                  : "bg-blue-600 shadow-lg active:scale-98"
              }`}
              style={
                !loading.creating
                  ? {
                      shadowColor: "#3B82F6",
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
                    Tạo sự kiện
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Help Text */}
          <View className="bg-green-50 p-4 rounded-2xl border border-green-200">
            <Text className="text-green-800 font-semibold mb-2">
              💡 Lưu ý quan trọng
            </Text>
            <Text className="text-green-700 text-sm leading-5">
              • Kiểm tra kỹ thông tin trước khi tạo sự kiện{"\n"}• Đảm bảo ngày
              tiêm sau ngày đóng đăng ký{"\n"}• Giá tiền phải chính xác theo quy
              định{"\n"}• Thông tin sự kiện sẽ được thông báo đến phụ huynh
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Date Picker */}
      {showDatePicker.visible && (
        <DateTimePicker
          value={formData[showDatePicker.type]}
          mode="datetime"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleDateChange}
          // minimumDate={new Date()}
        />
      )}

      {renderVaccinationModal()}
    </View>
  );
}
