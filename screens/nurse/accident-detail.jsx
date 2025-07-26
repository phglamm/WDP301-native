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
  Button,
  Modal,
  TextInput,
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
  Plus,
  X,
  ChevronDown,
  CheckCircle,
} from "lucide-react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  createAccidentMedicine,
  getAccidentById,
  getMedicine,
  updateAccidentEvent,
} from "../../services/nurseService";
import { create } from "zustand";

export default function AccidentDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [accident, setAccident] = useState(null);
  const [loading, setLoading] = useState(true);
  const [medicines, setMedicines] = useState([]);
  const [loadingMedicines, setLoadingMedicines] = useState(false);

  // Modal and form states
  const [showModal, setShowModal] = useState(false);
  const [selectedMedicines, setSelectedMedicines] = useState([]);
  const [showMedicineDropdown, setShowMedicineDropdown] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Status update states
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const loadMedicine = async () => {
    setLoadingMedicines(true);
    try {
      const response = await getMedicine();
      setMedicines(response.data);
      // console.log("Medicines loaded successfully:", response.data);
    } catch (error) {
      Alert.alert("Lỗi", "Không thể tải danh sách Thuốc");
      console.error("Load Thuốc error:", error);
    } finally {
      setLoadingMedicines(false);
    }
  };
  const fetchAccidentDetails = async () => {
    if (params.accidentId) {
      try {
        setLoading(true);
        const response = await getAccidentById(params.accidentId);

        // Handle the API response structure

        // Since API returns an array, take the first element
        const accidentData = response.data;

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
          status: accidentData.status || "pending",
        };

        console.log(accidentData);
        setAccident(mappedAccident);
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
  useEffect(() => {
    fetchAccidentDetails();
    loadMedicine();
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

  const getStatusDisplay = (status) => {
    switch (status?.toLowerCase()) {
      case "medical_room":
        return {
          text: "Học sinh đang ở phòng y tế",
          bg: "bg-blue-100",
          textColor: "text-blue-700",
          borderColor: "border-blue-200",
          icon: "#3B82F6",
        };
      case "parent_pickup":
        return {
          text: "Phụ huynh đón về",
          bg: "bg-green-100",
          textColor: "text-green-700",
          borderColor: "border-green-200",
          icon: "#22C55E",
        };
      case "hospital":
        return {
          text: "Đã chuyển đến bệnh viện",
          bg: "bg-red-100",
          textColor: "text-red-700",
          borderColor: "border-red-200",
          icon: "#EF4444",
        };
      default:
        return {
          text: status || "Đang xử lý",
          bg: "bg-gray-100",
          textColor: "text-gray-700",
          borderColor: "border-gray-200",
          icon: "#6B7280",
        };
    }
  };

  // Medicine form functions
  const addMedicine = () => {
    setSelectedMedicines([
      ...selectedMedicines,
      { medicineId: "", quantity: 1 },
    ]);
  };

  const removeMedicine = (index) => {
    const updated = selectedMedicines.filter((_, i) => i !== index);
    setSelectedMedicines(updated);
  };

  const updateMedicine = (index, field, value) => {
    const updated = [...selectedMedicines];
    updated[index][field] = value;
    setSelectedMedicines(updated);
  };

  const selectMedicine = (index, medicineId) => {
    updateMedicine(index, "medicineId", medicineId);
    setShowMedicineDropdown(false);
  };

  const handleSubmitMedicines = async () => {
    if (selectedMedicines.length === 0) {
      Alert.alert("Lỗi", "Vui lòng thêm ít nhất một loại thuốc");
      return;
    }

    // Validate all medicines have been selected and have quantity
    const invalidMedicines = selectedMedicines.filter(
      (med) => !med.medicineId || med.quantity < 1
    );

    if (invalidMedicines.length > 0) {
      Alert.alert(
        "Lỗi",
        "Vui lòng chọn thuốc và nhập số lượng hợp lệ cho tất cả các mục"
      );
      return;
    }

    setSubmitting(true);
    try {
      const requestBody = {
        accidentId: accident.id.toString(),
        medicines: selectedMedicines.map((med) => ({
          medicineId: med.medicineId.toString(),
          quantity: parseInt(med.quantity),
        })),
      };

      const response = await createAccidentMedicine(requestBody);
      console.log("Accident medicine created:", response);

      Alert.alert("Thành công", "Đã thêm thuốc cho tai nạn", [
        {
          text: "OK",
          onPress: () => {
            setShowModal(false);
            setSelectedMedicines([]);
            // Refresh accident details to show new medicines
            fetchAccidentDetails();
          },
        },
      ]);
    } catch (error) {
      console.error("Error creating accident medicine:", error);
      Alert.alert("Lỗi", "Không thể thêm thuốc cho tai nạn này");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setSelectedMedicines([]);
    setShowModal(false);
  };

  // Status update functions
  const handleStatusUpdate = async (newStatus) => {
    setUpdatingStatus(true);
    try {
      const response = await updateAccidentEvent(accident.id, newStatus);
      console.log("Status updated:", response);

      // Update local state
      setAccident((prev) => ({
        ...prev,
        status: newStatus,
      }));

      const statusText = getStatusDisplay(newStatus).text;
      Alert.alert("Thành công", `Đã cập nhật trạng thái thành: ${statusText}`, [
        {
          text: "OK",
          onPress: () => {
            setShowStatusModal(false);
          },
        },
      ]);
    } catch (error) {
      console.error("Error updating status:", error);
      Alert.alert("Lỗi", "Không thể cập nhật trạng thái tai nạn");
    } finally {
      setUpdatingStatus(false);
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
                onPress={() => router.push("/(nurse)/accident")}
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
          {/* Accident Details */}
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

          {/* Current Status */}
          <View className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-gray-100">
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-row items-center">
                <View className="bg-yellow-100 p-2 rounded-full mr-3">
                  <CheckCircle size={20} color="#F59E0B" />
                </View>
                <Text className="text-lg font-montserratBold text-gray-800">
                  Tình trạng hiện tại
                </Text>
              </View>

              {accident.status === "medical_room" && (
                <TouchableOpacity
                  onPress={() => setShowStatusModal(true)}
                  className="bg-blue-600 px-4 py-2 rounded-lg flex-row items-center"
                >
                  <Edit3 size={16} color="white" />
                  <Text className="text-white font-montserratSemiBold ml-2 text-sm">
                    Cập nhật
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            <View
              className={`px-4 py-3 rounded-xl ${
                getStatusDisplay(accident.status).bg
              } ${getStatusDisplay(accident.status).borderColor} border`}
            >
              <Text
                className={`font-montserratSemiBold text-lg ${
                  getStatusDisplay(accident.status).textColor
                }`}
              >
                {getStatusDisplay(accident.status).text}
              </Text>
            </View>

            {accident.status === "medical_room" && (
              <View className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                <Text className="text-blue-800 font-montserratSemiBold text-sm mb-1">
                  💡 Thông tin
                </Text>
                <Text className="text-blue-700 text-sm">
                  Học sinh đang được chăm sóc tại phòng y tế. Bạn có thể cập
                  nhật trạng thái khi có thay đổi.
                </Text>
              </View>
            )}
          </View>

          {/* Student Info */}
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

          {/* Nurse Info */}
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

          {/* Medicines Section */}
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
              <View className="space-y-4">
                {accident.accidentMedicines.map((medicine, index) => (
                  <View
                    key={index}
                    className="bg-gray-50 p-4 rounded-xl border border-gray-200 mt-5"
                  >
                    <Text className="font-montserratSemiBold text-gray-800">
                      {medicine?.medicine.name || `Thuốc ${index + 1}`}
                    </Text>
                    {medicine?.quantity && (
                      <Text className="text-gray-600 text-sm mt-1">
                        Liều lượng: {medicine?.quantity}
                      </Text>
                    )}
                    {medicine?.notes && (
                      <Text className="text-gray-600 text-sm mt-1">
                        Ghi chú: {medicine?.notes}
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
                <Text className="text-gray-500 font-montserratMedium mb-2">
                  Chưa sử dụng thuốc nào
                </Text>
                <Text className="text-gray-400 text-sm mb-6 text-center">
                  Thông tin về thuốc sẽ hiển thị ở đây
                </Text>

                {/* Add Medicine Button */}
                <TouchableOpacity
                  onPress={() => setShowModal(true)}
                  className="bg-purple-600 px-6 py-3 rounded-xl flex-row items-center"
                >
                  <Plus size={20} color="white" />
                  <Text className="text-white font-montserratSemiBold ml-2">
                    Thêm thuốc
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Medicine Modal */}
        <Modal
          visible={showModal}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setShowModal(false)}
        >
          <SafeAreaView className="flex-1 bg-white">
            {/* Modal Header */}
            <View className="bg-white shadow-sm border-b border-gray-100 p-6">
              <View className="flex-row items-center justify-between">
                <Text className="text-xl font-montserratBold text-gray-800">
                  Thêm thuốc cho tai nạn
                </Text>
                <TouchableOpacity
                  onPress={resetForm}
                  className="p-2 rounded-full bg-gray-100"
                >
                  <X size={20} color="#6B7280" />
                </TouchableOpacity>
              </View>
            </View>

            <ScrollView className="flex-1 p-6">
              {/* Medicine Form */}
              <View className="space-y-4">
                {selectedMedicines.map((medicine, index) => (
                  <View
                    key={index}
                    className="bg-gray-50 p-4 rounded-xl border border-gray-200"
                  >
                    <View className="flex-row items-center justify-between mb-3">
                      <Text className="font-montserratSemiBold text-gray-800">
                        Thuốc #{index + 1}
                      </Text>
                      {selectedMedicines.length > 1 && (
                        <TouchableOpacity
                          onPress={() => removeMedicine(index)}
                          className="p-1 rounded-full bg-red-100"
                        >
                          <X size={16} color="#EF4444" />
                        </TouchableOpacity>
                      )}
                    </View>

                    {/* Medicine Selector */}
                    <View className="mb-3">
                      <Text className="text-gray-600 font-montserratMedium text-sm mb-2">
                        Chọn thuốc
                      </Text>
                      <TouchableOpacity
                        onPress={() =>
                          setShowMedicineDropdown(
                            showMedicineDropdown === index ? false : index
                          )
                        }
                        className="border border-gray-300 rounded-lg p-3 flex-row items-center justify-between bg-white"
                      >
                        <Text
                          className={
                            medicine.medicineId
                              ? "text-gray-800"
                              : "text-gray-400"
                          }
                        >
                          {medicine.medicineId
                            ? medicines.find(
                                (m) => m.id.toString() === medicine.medicineId
                              )?.name || "Chọn thuốc"
                            : "Chọn thuốc"}
                        </Text>
                        <ChevronDown size={20} color="#6B7280" />
                      </TouchableOpacity>

                      {/* Dropdown */}
                      {showMedicineDropdown === index && (
                        <View className="border border-gray-300 rounded-lg mt-1 bg-white max-h-40">
                          <ScrollView>
                            {medicines.map((med) => (
                              <TouchableOpacity
                                key={med.id}
                                onPress={() =>
                                  selectMedicine(index, med.id.toString())
                                }
                                className="p-3 border-b border-gray-100"
                              >
                                <Text className="text-gray-800">
                                  {med.name}
                                </Text>
                                {med.description && (
                                  <Text className="text-gray-500 text-sm mt-1">
                                    {med.description}
                                  </Text>
                                )}
                              </TouchableOpacity>
                            ))}
                          </ScrollView>
                        </View>
                      )}
                    </View>

                    {/* Quantity Input */}
                    <View>
                      <Text className="text-gray-600 font-montserratMedium text-sm mb-2">
                        Số lượng
                      </Text>
                      <TextInput
                        value={medicine.quantity.toString()}
                        onChangeText={(text) =>
                          updateMedicine(
                            index,
                            "quantity",
                            parseInt(text) || ""
                          )
                        }
                        keyboardType="numeric"
                        className="border border-gray-300 rounded-lg p-3 bg-white"
                        placeholder="Nhập số lượng"
                      />
                    </View>
                  </View>
                ))}

                {/* Add More Medicine Button */}
                <TouchableOpacity
                  onPress={addMedicine}
                  className="border-2 border-dashed border-purple-300 rounded-xl p-4 items-center"
                >
                  <Plus size={24} color="#8B5CF6" />
                  <Text className="text-purple-600 font-montserratMedium mt-2">
                    Thêm thuốc khác
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>

            {/* Modal Footer */}
            <View className="p-6 border-t border-gray-100">
              <View className="flex-row justify-between gap-5">
                <TouchableOpacity
                  onPress={resetForm}
                  className="flex-1 bg-gray-100 py-3 rounded-xl items-center"
                >
                  <Text className="text-gray-600 font-montserratSemiBold">
                    Hủy
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleSubmitMedicines}
                  disabled={submitting || selectedMedicines.length === 0}
                  className={`flex-1 py-3 rounded-xl items-center ${
                    submitting || selectedMedicines.length === 0
                      ? "bg-gray-300"
                      : "bg-purple-600"
                  }`}
                >
                  {submitting ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Text className="text-white font-montserratSemiBold">
                      Lưu thuốc
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </Modal>

        {/* Status Update Modal */}
        <Modal
          visible={showStatusModal}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setShowStatusModal(false)}
        >
          <SafeAreaView className="flex-1 bg-white">
            {/* Modal Header */}
            <View className="bg-white shadow-sm border-b border-gray-100 p-6">
              <View className="flex-row items-center justify-between">
                <Text className="text-xl font-montserratBold text-gray-800">
                  Cập nhật trạng thái
                </Text>
                <TouchableOpacity
                  onPress={() => setShowStatusModal(false)}
                  className="p-2 rounded-full bg-gray-100"
                >
                  <X size={20} color="#6B7280" />
                </TouchableOpacity>
              </View>
            </View>

            <ScrollView className="flex-1 p-6">
              <View className="bg-blue-50 p-4 rounded-xl border border-blue-200 mb-6">
                <Text className="text-blue-800 font-montserratSemiBold mb-2">
                  📋 Trạng thái hiện tại
                </Text>
                <Text className="text-blue-700">
                  {getStatusDisplay(accident.status).text}
                </Text>
              </View>

              <Text className="text-lg font-montserratBold text-gray-800 mb-4">
                Chọn trạng thái mới:
              </Text>

              <View className="space-y-4">
                {/* Parent Pickup Option */}
                <TouchableOpacity
                  onPress={() => handleStatusUpdate("parent_pickup")}
                  disabled={updatingStatus}
                  className="bg-white border-2 border-green-200 rounded-xl p-4 flex-row items-center justify-between active:bg-green-50"
                >
                  <View className="flex-row items-center">
                    <View className="bg-green-100 p-3 rounded-full">
                      <User size={20} color="#22C55E" />
                    </View>
                    <View className="ml-4">
                      <Text className="font-montserratBold text-gray-800">
                        Ba mẹ đón về
                      </Text>
                      <Text className="text-gray-600 text-sm mt-1">
                        Phụ huynh đã đến đón học sinh về nhà
                      </Text>
                    </View>
                  </View>
                  <ArrowLeft
                    size={20}
                    color="#22C55E"
                    style={{ transform: [{ rotate: "180deg" }] }}
                  />
                </TouchableOpacity>

                {/* Hospital Transfer Option */}
                <TouchableOpacity
                  onPress={() => handleStatusUpdate("hospital")}
                  disabled={updatingStatus}
                  className="bg-white border-2 border-red-200 rounded-xl p-4 flex-row items-center justify-between active:bg-red-50"
                >
                  <View className="flex-row items-center">
                    <View className="bg-red-100 p-3 rounded-full">
                      <Activity size={20} color="#EF4444" />
                    </View>
                    <View className="ml-4">
                      <Text className="font-montserratBold text-gray-800">
                        Chuyển đến bệnh viện
                      </Text>
                      <Text className="text-gray-600 text-sm mt-1">
                        Học sinh cần chăm sóc y tế chuyên sâu
                      </Text>
                    </View>
                  </View>
                  <ArrowLeft
                    size={20}
                    color="#EF4444"
                    style={{ transform: [{ rotate: "180deg" }] }}
                  />
                </TouchableOpacity>
              </View>

              {updatingStatus && (
                <View className="mt-6 p-4 bg-gray-50 rounded-xl flex-row items-center justify-center">
                  <ActivityIndicator size="small" color="#3B82F6" />
                  <Text className="text-gray-600 font-montserratMedium ml-2">
                    Đang cập nhật trạng thái...
                  </Text>
                </View>
              )}

              <View className="mt-6 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                <Text className="text-yellow-800 font-montserratSemiBold mb-2">
                  ⚠️ Lưu ý quan trọng
                </Text>
                <Text className="text-yellow-700 text-sm leading-5">
                  • Vui lòng đảm bảo thông tin chính xác trước khi cập nhật
                  {"\n"}• Trạng thái sẽ được ghi nhận và không thể hoàn tác
                  {"\n"}• Thông báo sẽ được gửi đến các bên liên quan
                </Text>
              </View>
            </ScrollView>
          </SafeAreaView>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
