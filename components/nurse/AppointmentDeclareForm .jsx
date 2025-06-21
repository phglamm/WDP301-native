import React, { useRef, useEffect, useState } from "react";
import {
  Text,
  ScrollView,
  TouchableOpacity,
  View,
  TextInput,
  ActivityIndicator,
  Alert,
  Modal,
  FlatList,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  ArrowRight,
  User,
  FileText,
  Calendar,
  CheckCircle,
  ChevronDown,
  Search,
  Clock,
  Video,
  X,
} from "lucide-react-native";
import { getAllParents } from "../../services/nurseService";

const AppointmentDeclareForm = ({
  formData,
  setFormData,
  isSubmitting,
  onSubmit,
  onBack,
}) => {
  const [parents, setParents] = useState([]);
  const [showParentModal, setShowParentModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedParent, setSelectedParent] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [tempDate, setTempDate] = useState(new Date());

  useEffect(() => {
    const fetchParentData = async () => {
      try {
        const response = await getAllParents();
        setParents(response.data);
      } catch (error) {
        console.error("Error fetching parent data:", error);
        Alert.alert("Lỗi", "Không thể tải thông tin phụ huynh.");
      }
    };
    fetchParentData();
  }, []);

  // Filter parents based on search query
  const filteredParents = parents.filter(
    (parent) =>
      parent.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      parent.phone.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleParentSelect = (parent) => {
    setSelectedParent(parent);
    setFormData((prev) => ({ ...prev, parentId: parent.id.toString() }));
    setShowParentModal(false);
    setSearchQuery("");
  };

  const handleDateTimeChange = (event, selectedDate) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
      setShowTimePicker(false);
    }

    if (selectedDate) {
      if (showDatePicker) {
        setTempDate(selectedDate);
        if (Platform.OS === "ios") {
          const formattedDateTime = formatDateTimeForAPI(selectedDate);
          setFormData((prev) => ({
            ...prev,
            appointmentTime: formattedDateTime,
          }));
        } else {
          setShowTimePicker(true);
        }
      } else if (showTimePicker) {
        const combinedDateTime = new Date(tempDate);
        combinedDateTime.setHours(selectedDate.getHours());
        combinedDateTime.setMinutes(selectedDate.getMinutes());

        const formattedDateTime = formatDateTimeForAPI(combinedDateTime);
        setFormData((prev) => ({
          ...prev,
          appointmentTime: formattedDateTime,
        }));
      }
    }
  };

  const formatDateTimeForAPI = (date) => {
    // Format: "27-06-2025 12:00:00"
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${day}-${month}-${year} ${hours}:${minutes}:00`;
  };

  const formatDisplayDateTime = (dateTimeString) => {
    if (!dateTimeString) return "Chọn ngày và giờ";

    try {
      // Parse the format "27-06-2025 12:00:00"
      const [datePart, timePart] = dateTimeString.split(" ");
      const [day, month, year] = datePart.split("-");
      const [hours, minutes] = timePart.split(":");

      const date = new Date(year, month - 1, day, hours, minutes);

      return date.toLocaleDateString("vi-VN", {
        weekday: "long",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "Chọn ngày và giờ";
    }
  };

  const handleSubmit = () => {
    if (!formData.parentId || !formData.purpose || !formData.appointmentTime) {
      Alert.alert("Thông báo", "Vui lòng điền đầy đủ thông tin bắt buộc.");
      return;
    }
    onSubmit();
  };

  const DURATION_OPTIONS = [
    { label: "30 phút", value: 30 },
    { label: "45 phút", value: 45 },
    { label: "60 phút", value: 60 },
    { label: "90 phút", value: 90 },
  ];

  const renderParentItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleParentSelect(item)}
      className="p-4 border-b border-gray-100 bg-white active:bg-gray-50"
    >
      <Text className="font-semibold text-gray-800 text-base">
        {item.fullName}
      </Text>
      <Text className="text-gray-500 text-sm mt-1">SĐT: {item.phone}</Text>
      <Text className="text-gray-400 text-xs mt-1" numberOfLines={1}>
        {item.email}
      </Text>
    </TouchableOpacity>
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
              Tạo cuộc hẹn
            </Text>
            <Text className="text-gray-500 font-montserratRegular mt-1">
              Lên lịch gặp gỡ với phụ huynh
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
          <View className="bg-green-500 p-6 rounded-2xl mb-6">
            <View className="flex-row items-center">
              <View className="bg-green bg-opacity-20 p-3 rounded-full">
                <Calendar size={35} color="white" />
              </View>
              <View className="ml-4 flex-1">
                <Text className="text-white text-xl font-bold">
                  📅 Đặt lịch hẹn
                </Text>
                <Text className="text-white text-opacity-90 mt-1">
                  Tạo cuộc hẹn với phụ huynh học sinh
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Form Fields */}
        <View className="px-6">
          {/* Parent Selection Field */}
          <View className="mb-6">
            <View className="flex-row items-center mb-3">
              <User size={20} color="#6B7280" />
              <Text className="text-lg font-semibold text-gray-800 ml-2">
                Chọn Phụ Huynh *
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setShowParentModal(true)}
              className="border-2 border-gray-200 rounded-2xl px-4 py-4 bg-white flex-row items-center justify-between focus:border-green-500"
            >
              <View className="flex-1">
                {selectedParent ? (
                  <View>
                    <Text className="text-base font-semibold text-gray-800">
                      {selectedParent.fullName}
                    </Text>
                    <Text className="text-sm text-gray-500 mt-1">
                      SĐT: {selectedParent.phone}
                    </Text>
                  </View>
                ) : (
                  <Text className="text-base text-gray-400">
                    Chọn phụ huynh từ danh sách
                  </Text>
                )}
              </View>
              <View className="flex-row items-center">
                {selectedParent && (
                  <CheckCircle size={20} color="#22C55E" className="mr-2" />
                )}
                <ChevronDown size={20} color="#6B7280" />
              </View>
            </TouchableOpacity>
          </View>

          {/* Date Time Selection */}
          <View className="mb-6">
            <View className="flex-row items-center mb-3">
              <Calendar size={20} color="#6B7280" />
              <Text className="text-lg font-semibold text-gray-800 ml-2">
                Ngày và Giờ *
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              className="border-2 border-gray-200 rounded-2xl px-4 py-4 bg-white flex-row items-center justify-between focus:border-green-500"
            >
              <View className="flex-1">
                <Text
                  className={`text-base ${formData.appointmentTime ? "text-gray-800 font-semibold" : "text-gray-400"}`}
                >
                  {formatDisplayDateTime(formData.appointmentTime)}
                </Text>
              </View>
              <View className="flex-row items-center">
                {formData.appointmentTime && (
                  <CheckCircle size={20} color="#22C55E" className="mr-2" />
                )}
                <Clock size={20} color="#6B7280" />
              </View>
            </TouchableOpacity>
          </View>

          {/* Duration Selection */}
          <View className="mb-6">
            <View className="flex-row items-center mb-4">
              <Clock size={20} color="#6B7280" />
              <Text className="text-lg font-semibold text-gray-800 ml-2">
                Thời lượng
              </Text>
            </View>

            <View className="flex-row flex-wrap gap-3">
              {DURATION_OPTIONS.map((option) => {
                const isSelected = formData.duration === option.value;
                return (
                  <TouchableOpacity
                    key={option.value}
                    onPress={() =>
                      setFormData((prev) => ({
                        ...prev,
                        duration: option.value,
                      }))
                    }
                    className={`px-4 py-3 rounded-xl border-2 ${
                      isSelected
                        ? "bg-green-50 border-green-200"
                        : "bg-white border-gray-200"
                    }`}
                  >
                    <Text
                      className={`font-semibold ${
                        isSelected ? "text-green-600" : "text-gray-600"
                      }`}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Purpose Field */}
          <View className="mb-6">
            <View className="flex-row items-center mb-3">
              <FileText size={20} color="#6B7280" />
              <Text className="text-lg font-semibold text-gray-800 ml-2">
                Mục đích cuộc hẹn *
              </Text>
            </View>
            <View className="relative">
              <TextInput
                className="border-2 border-gray-200 rounded-2xl px-4 py-4 text-base bg-white focus:border-green-500 min-h-24"
                placeholder="Mô tả mục đích của cuộc hẹn, nội dung thảo luận..."
                value={formData.purpose}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, purpose: text }))
                }
                multiline
                textAlignVertical="top"
                placeholderTextColor="#9CA3AF"
                maxLength={500}
              />
              {formData.purpose && (
                <View className="absolute right-4 top-4">
                  <CheckCircle size={20} color="#22C55E" />
                </View>
              )}
            </View>
            <Text className="text-gray-500 text-sm mt-2">
              {formData.purpose?.length || 0}/500 ký tự
            </Text>
          </View>

          {/* Submit Button */}
          <View className="mb-6">
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={isSubmitting}
              className={`py-4 rounded-2xl flex-row items-center justify-center ${
                isSubmitting
                  ? "bg-gray-300"
                  : "bg-green-600 shadow-lg active:scale-98"
              }`}
              style={
                !isSubmitting
                  ? {
                      shadowColor: "#22C55E",
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.25,
                      shadowRadius: 8,
                      elevation: 8,
                    }
                  : {}
              }
            >
              {isSubmitting ? (
                <>
                  <ActivityIndicator size="small" color="white" />
                  <Text className="text-white font-semibold text-lg ml-2">
                    Đang tạo cuộc hẹn...
                  </Text>
                </>
              ) : (
                <>
                  <Calendar size={24} color="white" />
                  <Text className="text-white font-semibold text-lg ml-2">
                    Tạo Cuộc Hẹn
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Parent Selection Modal */}
      <Modal
        visible={showParentModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowParentModal(false)}
      >
        <View className="flex-1 bg-gray-50">
          {/* Modal Header */}
          <View className="bg-white p-4 border-b border-gray-200 shadow-sm">
            <View className="flex-row items-center justify-between">
              <Text className="text-xl font-bold text-gray-800">
                Chọn Phụ Huynh
              </Text>
              <TouchableOpacity
                onPress={() => setShowParentModal(false)}
                className="p-2 rounded-full bg-gray-100 active:bg-gray-200"
              >
                <X size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <View className="mt-4 relative">
              <View className="absolute left-3 top-4 z-10">
                <Search size={20} color="#6B7280" />
              </View>
              <TextInput
                className="bg-gray-100 border border-gray-200 rounded-xl pl-12 pr-4 py-3 text-base"
                placeholder="Tìm kiếm theo tên hoặc số điện thoại..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          {/* Parent List */}
          <FlatList
            data={filteredParents}
            renderItem={renderParentItem}
            keyExtractor={(item) => item.id.toString()}
            className="flex-1"
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View className="flex-1 justify-center items-center p-8">
                <User size={48} color="#9CA3AF" />
                <Text className="text-gray-500 text-lg font-semibold mt-4">
                  Không tìm thấy phụ huynh
                </Text>
                <Text className="text-gray-400 text-center mt-2">
                  {searchQuery
                    ? "Thử tìm kiếm với từ khóa khác"
                    : "Danh sách phụ huynh trống"}
                </Text>
              </View>
            }
          />
        </View>
      </Modal>

      {/* Date Time Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={tempDate}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleDateTimeChange}
          minimumDate={new Date()}
          maximumDate={new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)} // 90 days from now
        />
      )}

      {showTimePicker && (
        <DateTimePicker
          value={tempDate}
          mode="time"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleDateTimeChange}
          is24Hour={true}
        />
      )}
    </View>
  );
};

export default AppointmentDeclareForm;
