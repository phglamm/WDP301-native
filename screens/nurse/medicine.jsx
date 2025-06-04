import {
  View,
  Text,
  Platform,
  KeyboardAvoidingView,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Alert,
  TextInput,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeft,
  Pill,
  Plus,
  Activity,
  Package,
  ChevronRight,
  Search,
  AlertTriangle,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import { getMedicine } from "../../services/nurseService";

export default function MedicineScreen() {
  const router = useRouter();
  const [medicines, setMedicines] = useState([]);
  const [loadingMedicines, setLoadingMedicines] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filteredMedicines, setFilteredMedicines] = useState([]);
  // Calculate statistics from medicines data
  const getTotalMedicines = () => {
    return medicines.length;
  };

  const getTotalQuantity = () => {
    return medicines.reduce((total, medicine) => total + medicine.quantity, 0);
  };

  const getLowStockCount = () => {
    // Consider medicines with quantity < 100 as low stock
    return medicines.filter((medicine) => medicine.quantity < 100).length;
  };

  const loadMedicine = async () => {
    setLoadingMedicines(true);
    try {
      const response = await getMedicine();
      setMedicines(response.data || []);
      console.log("Medicines loaded successfully:", response.data);
    } catch (error) {
      Alert.alert("Lỗi", "Không thể tải danh sách thuốc");
      console.error("Load medicine error:", error);
    } finally {
      setLoadingMedicines(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const response = await getMedicine();
      setMedicines(response.data || []);
    } catch (error) {
      console.error("Error refreshing medicines:", error);
      Alert.alert("Lỗi", "Không thể làm mới danh sách thuốc");
    } finally {
      setRefreshing(false);
    }
  };

  const handleAddMedicine = () => {
    // Navigate to add medicine screen or show form
    Alert.alert("Thông báo", "Chức năng thêm thuốc đang phát triển");
  };

  const handleViewMedicineDetail = (medicine) => {
    // Navigate to medicine detail screen
    Alert.alert(
      "Chi tiết thuốc",
      `Tên: ${medicine.name}\nHãng SX: ${medicine.manufacturer}\nMô tả: ${medicine.description}\nSố lượng: ${medicine.quantity} ${medicine.type}`
    );
  };
  const filterMedicines = medicines.filter((medicine) =>
    medicine.name.toLowerCase().includes(searchText.toLowerCase())
  );
  const getMedicineTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case "viên":
        return {
          bg: "bg-blue-100",
          text: "text-blue-700",
          border: "border-blue-200",
          icon: "#3B82F6",
        };
      case "bột":
        return {
          bg: "bg-green-100",
          text: "text-green-700",
          border: "border-green-200",
          icon: "#22C55E",
        };
      case "siro":
      case "xi-rô":
        return {
          bg: "bg-purple-100",
          text: "text-purple-700",
          border: "border-purple-200",
          icon: "#8B5CF6",
        };
      case "thuốc tiêm":
        return {
          bg: "bg-red-100",
          text: "text-red-700",
          border: "border-red-200",
          icon: "#EF4444",
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

  const getStockStatusColor = (quantity) => {
    if (quantity < 50) {
      return {
        bg: "bg-red-100",
        text: "text-red-700",
        status: "Sắp hết",
      };
    } else if (quantity < 100) {
      return {
        bg: "bg-orange-100",
        text: "text-orange-700",
        status: "Ít",
      };
    } else {
      return {
        bg: "bg-green-100",
        text: "text-green-700",
        status: "Đủ",
      };
    }
  };

  useEffect(() => {
    loadMedicine();
  }, []);

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
              onPress={() => router.push("/(nurse)/home")}
              className="p-2 rounded-full bg-gray-100 active:bg-gray-200"
            >
              <ArrowLeft size={20} color="#6B7280" />
            </TouchableOpacity>
            <View className="flex-1">
              <Text className="text-2xl font-montserratBold text-gray-800">
                Quản lý thuốc
              </Text>
              <Text className="text-gray-500 font-montserratRegular mt-1">
                Theo dõi và quản lý kho thuốc y tế
              </Text>
            </View>
          </View>

          {/* Stats Cards */}
          <View className="flex-row gap-4 mt-4">
            <View className="flex-1 bg-blue-50 p-4 rounded-xl border border-blue-100">
              <View className="flex-row items-center">
                <Package size={20} color="#3B82F6" />
                <Text className="text-blue-600 font-semibold ml-2">
                  Tổng số
                </Text>
              </View>
              <Text className="text-2xl font-bold text-blue-700 mt-1">
                {getTotalMedicines()}
              </Text>
              <Text className="text-blue-500 text-xs">loại thuốc</Text>
            </View>
            <View className="flex-1 bg-green-50 p-4 rounded-xl border border-green-100">
              <View className="flex-row items-center">
                <Activity size={20} color="#22C55E" />
                <Text className="text-green-600 font-semibold ml-2">
                  Tổng SL
                </Text>
              </View>
              <Text className="text-2xl font-bold text-green-700 mt-1">
                {getTotalQuantity()}
              </Text>
              <Text className="text-green-500 text-xs">đơn vị</Text>
            </View>
            <View className="flex-1 bg-orange-50 p-4 rounded-xl border border-orange-100">
              <View className="flex-row items-center">
                <AlertTriangle size={20} color="#F97316" />
                <Text className="text-orange-600 font-semibold ml-2">
                  Sắp hết
                </Text>
              </View>
              <Text className="text-2xl font-bold text-orange-700 mt-1">
                {getLowStockCount()}
              </Text>
              <Text className="text-orange-500 text-xs">loại thuốc</Text>
            </View>
          </View>
        </View>

        {/* Enhanced Action Buttons */}
        <View className="px-6 py-4">
          <View className="flex-row gap-4">
            <TouchableOpacity
              onPress={handleAddMedicine}
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
                Thêm thuốc
              </Text>
            </TouchableOpacity>

            <View className="flex-1 bg-white border border-gray-300 rounded-2xl flex-row items-center px-4 py-3 focus:border-blue-500 focus:shadow-lg transition-all duration-200">
              <Search size={20} color="#9CA3AF" />
              <TextInput
                className="flex-1 text-gray-800 text-base font-medium ml-3"
                placeholder="Tìm kiếm"
                placeholderTextColor="#9CA3AF"
                value={searchText}
                onChangeText={(text) => setSearchText(text)}
                returnKeyType="search"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
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
            {/* Medicine List Section */}
            <View className="mb-6">
              <Text className="text-lg font-montserratSemiBold text-gray-800 mb-4">
                Danh sách thuốc ({medicines.length})
              </Text>

              {loadingMedicines ? (
                <View className="bg-white p-6 rounded-xl border border-gray-200">
                  <View className="items-center">
                    <Text className="text-gray-500 font-medium">
                      Đang tải dữ liệu...
                    </Text>
                  </View>
                </View>
              ) : filterMedicines.length === 0 ? (
                <View className="bg-white p-6 rounded-xl border border-gray-200">
                  <View className="items-center">
                    <View className="bg-gray-100 p-4 rounded-full mb-3">
                      <Pill size={24} color="#6B7280" />
                    </View>
                    <Text className="text-gray-500 font-medium">
                      Chưa có thuốc nào
                    </Text>
                    <Text className="text-gray-400 text-sm mt-1 text-center">
                      Thêm thuốc mới để bắt đầu quản lý kho
                    </Text>
                  </View>
                </View>
              ) : (
                <View className="space-y-3">
                  {filterMedicines.map((medicine, index) => {
                    const typeColors = getMedicineTypeColor(medicine.type);
                    const stockStatus = getStockStatusColor(medicine.quantity);

                    return (
                      <TouchableOpacity
                        key={medicine.id || index}
                        onPress={() => handleViewMedicineDetail(medicine)}
                        className="bg-white p-4 rounded-xl border border-gray-200 active:bg-gray-50 mb-5"
                      >
                        <View className="flex-row items-center justify-between">
                          <View className="flex-1">
                            <View className="flex-row items-center mb-2">
                              <View
                                className={`px-3 py-1 rounded-full ${typeColors.bg} mr-2`}
                              >
                                <Text
                                  className={`text-sm font-semibold ${typeColors.text}`}
                                >
                                  {medicine.type}
                                </Text>
                              </View>
                              <View
                                className={`px-2 py-1 rounded-full ${stockStatus.bg}`}
                              >
                                <Text
                                  className={`text-xs font-medium ${stockStatus.text}`}
                                >
                                  {stockStatus.status}
                                </Text>
                              </View>
                            </View>

                            <Text className="font-bold text-gray-800 text-lg mb-1">
                              {medicine.name}
                            </Text>

                            <Text className="text-sm text-gray-600 mb-1">
                              Hãng SX: {medicine.manufacturer}
                            </Text>

                            <Text className="text-sm text-gray-500 mb-2">
                              {medicine.description}
                            </Text>

                            <View className="flex-row items-center">
                              <Package size={14} color="#6B7280" />
                              <Text className="text-sm font-semibold text-gray-700 ml-1">
                                Còn lại: {medicine.quantity}{" "}
                                {medicine.type.toLowerCase()}
                              </Text>
                            </View>
                          </View>
                          <ChevronRight size={20} color="#9CA3AF" />
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>

            {/* Low Stock Alert Section */}
            {getLowStockCount() > 0 && (
              <View className="mb-6">
                <Text className="text-lg font-montserratSemiBold text-gray-800 mb-4">
                  Cảnh báo tồn kho thấp
                </Text>

                <View className="bg-orange-50 p-4 rounded-xl border border-orange-200">
                  <View className="flex-row items-center mb-2">
                    <AlertTriangle size={20} color="#F97316" />
                    <Text className="text-orange-700 font-semibold ml-2">
                      {getLowStockCount()} loại thuốc sắp hết
                    </Text>
                  </View>
                  <Text className="text-orange-600 text-sm">
                    Vui lòng kiểm tra và bổ sung kho thuốc kịp thời
                  </Text>
                </View>
              </View>
            )}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
