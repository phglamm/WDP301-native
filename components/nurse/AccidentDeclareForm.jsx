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
} from "react-native";
import {
  ArrowRight,
  User,
  FileText,
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  Search,
} from "lucide-react-native";
import { getAllStudent } from "../../services/nurseService";

const AccidentDeclareForm = ({
  formData,
  setFormData,
  isSubmitting,
  onSubmit,
  onBack,
}) => {
  const [students, setStudents] = useState([]);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await getAllStudent();
        setStudents(response.data);
      } catch (error) {
        console.error("Error fetching student data:", error);
        Alert.alert("Lỗi", "Không thể tải thông tin học sinh.");
      }
    };
    fetchStudentData();
  }, []);

  // Filter students based on search query
  const filteredStudents = students.filter(
    (student) =>
      student.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.studentCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
    setFormData((prev) => ({ ...prev, studentCode: student.studentCode }));
    setShowStudentModal(false);
    setSearchQuery("");
  };

  const handleSubmit = () => {
    if (!formData.studentCode || !formData.summary || !formData.type) {
      Alert.alert("Thông báo", "Vui lòng điền đầy đủ thông tin bắt buộc.");
      return;
    }
    onSubmit();
  };

  const TYPE_OPTIONS = [
    {
      label: "Bệnh tật",
      color: "purple",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      textColor: "text-purple-600",
    },
    {
      label: "Vật lý",
      color: "red",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      textColor: "text-red-600",
    },
    {
      label: "Thần kinh",
      color: "blue",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      textColor: "text-blue-600",
    },
  ];

  const renderStudentItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleStudentSelect(item)}
      className="p-4 border-b border-gray-100 bg-white active:bg-gray-50"
    >
      <Text className="font-semibold text-gray-800 text-base">
        {item.fullName}
      </Text>
      <Text className="text-gray-500 text-sm mt-1">
        Mã số: {item.studentCode}
      </Text>
      <Text className="text-gray-400 text-xs mt-1" numberOfLines={1}>
        {item.address}
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
              Khai báo tai nạn
            </Text>
            <Text className="text-gray-500 font-montserratRegular mt-1">
              Điền thông tin chi tiết về sự cố
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
          <View className="bg-red-500 p-6 rounded-2xl mb-6">
            <View className="flex-row items-center">
              <View className="bg-red bg-opacity-20 p-3 rounded-full">
                <AlertTriangle size={35} color="white" />
              </View>
              <View className="ml-4 flex-1">
                <Text className="text-white text-xl font-bold">
                  📝 Báo cáo tai nạn
                </Text>
                <Text className="text-white text-opacity-90 mt-1">
                  Vui lòng cung cấp thông tin chính xác
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Form Fields */}
        <View className="px-6">
          {/* Student Selection Field */}
          <View className="mb-6">
            <View className="flex-row items-center mb-3">
              <User size={20} color="#6B7280" />
              <Text className="text-lg font-semibold text-gray-800 ml-2">
                Chọn Học Sinh *
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setShowStudentModal(true)}
              className="border-2 border-gray-200 rounded-2xl px-4 py-4 bg-white flex-row items-center justify-between focus:border-blue-500"
            >
              <View className="flex-1">
                {selectedStudent ? (
                  <View>
                    <Text className="text-base font-semibold text-gray-800">
                      {selectedStudent.fullName}
                    </Text>
                    <Text className="text-sm text-gray-500 mt-1">
                      Mã số: {selectedStudent.studentCode}
                    </Text>
                  </View>
                ) : (
                  <Text className="text-base text-gray-400">
                    Chọn học sinh từ danh sách
                  </Text>
                )}
              </View>
              <View className="flex-row items-center">
                {selectedStudent && (
                  <CheckCircle size={20} color="#22C55E" className="mr-2" />
                )}
                <ChevronDown size={20} color="#6B7280" />
              </View>
            </TouchableOpacity>
          </View>

          {/* Summary Field */}
          <View className="mb-6">
            <View className="flex-row items-center mb-3">
              <FileText size={20} color="#6B7280" />
              <Text className="text-lg font-semibold text-gray-800 ml-2">
                Mô tả chi tiết *
              </Text>
            </View>
            <View className="relative">
              <TextInput
                className="border-2 border-gray-200 rounded-2xl px-4 py-4 text-base bg-white focus:border-blue-500 min-h-24"
                placeholder="Mô tả chi tiết về tai nạn, thời gian, địa điểm..."
                value={formData.summary}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, summary: text }))
                }
                multiline
                textAlignVertical="top"
                placeholderTextColor="#9CA3AF"
              />
              {formData.summary && (
                <View className="absolute right-4 top-4">
                  <CheckCircle size={20} color="#22C55E" />
                </View>
              )}
            </View>
            <Text className="text-gray-500 text-sm mt-2">
              {formData.summary.length}/500 ký tự
            </Text>
          </View>

          {/* Type Selection */}
          <View className="mb-8">
            <View className="flex-row items-center mb-4">
              <AlertTriangle size={20} color="#6B7280" />
              <Text className="text-lg font-semibold text-gray-800 ml-2">
                Loại tai nạn *
              </Text>
            </View>

            <Text className="text-gray-600 mb-4">
              Chọn loại tai nạn phù hợp nhất:
            </Text>

            {TYPE_OPTIONS.map((option) => {
              const isSelected = formData.type === option.label;

              return (
                <TouchableOpacity
                  key={option.label}
                  onPress={() =>
                    setFormData((prev) => ({ ...prev, type: option.label }))
                  }
                  className={`p-4 rounded-2xl border-2 flex-row items-center justify-between mt-5 ${
                    isSelected
                      ? `${option.bgColor} ${option.borderColor}`
                      : "bg-white border-gray-200"
                  }`}
                >
                  <View className="flex-row items-center">
                    <View
                      className={`w-4 h-4 rounded-full border-2 ${
                        isSelected
                          ? `bg-${option.color}-500 border-${option.color}-500`
                          : "border-gray-300"
                      }`}
                    ></View>
                    <Text
                      className={`font-semibold ml-3 ${
                        isSelected ? option.textColor : "text-gray-600"
                      }`}
                    >
                      {option.label}
                    </Text>
                  </View>
                  {isSelected && (
                    <CheckCircle
                      size={20}
                      color={`#${option.color === "blue" ? "3B82F6" : option.color === "red" ? "EF4444" : "8B5CF6"}`}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Submit Button */}
          <View className="mb-6">
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={isSubmitting}
              className={`py-4 rounded-2xl flex-row items-center justify-center ${
                isSubmitting
                  ? "bg-gray-300"
                  : "bg-blue-600 shadow-lg active:scale-98"
              }`}
              style={
                !isSubmitting
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
              {isSubmitting ? (
                <View className="flex-row items-center">
                  <ActivityIndicator color="white" size="small" />
                  <Text className="text-white font-bold text-lg ml-2">
                    Đang lưu...
                  </Text>
                </View>
              ) : (
                <View className="flex-row items-center">
                  <CheckCircle size={20} color="white" />
                  <Text className="text-white font-bold text-lg ml-2">
                    Lưu tai nạn
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
              • Cung cấp thông tin chính xác và chi tiết{"\n"}• Liên hệ y tế
              khẩn cấp nếu cần thiết{"\n"}• Thông tin sẽ được bảo mật và xử lý
              theo quy định
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Student Selection Modal */}
      <Modal
        visible={showStudentModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View className="flex-1 bg-white">
          {/* Modal Header */}
          <View className="bg-white p-4 border-b border-gray-200 shadow-sm">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-xl font-bold text-gray-800">
                Chọn Học Sinh
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setShowStudentModal(false);
                  setSearchQuery("");
                }}
                className="p-2 rounded-full bg-gray-100"
              >
                <Text className="text-gray-600 font-semibold">Đóng</Text>
              </TouchableOpacity>
            </View>

            {/* Search Input */}
            <View className="relative">
              <TextInput
                className="border border-gray-300 rounded-xl px-4 py-3 pr-10 bg-gray-50"
                placeholder="Tìm kiếm theo tên hoặc mã số..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor="#9CA3AF"
              />
              <View className="absolute right-3 top-3">
                <Search size={20} color="#6B7280" />
              </View>
            </View>
          </View>

          {/* Student List */}
          <FlatList
            data={filteredStudents}
            renderItem={renderStudentItem}
            keyExtractor={(item) => item.id.toString()}
            className="flex-1"
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View className="p-8 items-center">
                <User size={48} color="#9CA3AF" />
                <Text className="text-gray-500 text-center mt-4 text-base">
                  {searchQuery
                    ? "Không tìm thấy học sinh nào"
                    : "Chưa có dữ liệu học sinh"}
                </Text>
              </View>
            }
          />
        </View>
      </Modal>
    </View>
  );
};

export default AccidentDeclareForm;
