import {
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  StatusBar,
  Alert,
} from "react-native";
import {
  Pill,
  ArrowRight,
  BellRing,
  Cross,
  Syringe,
  ShieldAlert,
  Activity,
  Calendar,
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "../../stores/useAuthStore";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import {
  getAccidentHistory,
  getAvailableEvent,
  getMedicineRequestToday,
} from "../../services/nurseService";

export default function HomeScreen() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [accidents, setAccidents] = useState([]);
  const [availableEvents, setAvailableEvents] = useState([]);
  const [medicineRequest, setMedicineRequest] = useState([]);
  const [loading, setLoading] = useState({
    accidents: false,
    events: false,
  });
  const fetchAccidents = async () => {
    setLoading((prev) => ({ ...prev, accidents: true }));
    try {
      const response = await getAccidentHistory();
      setAccidents(response.data || []);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching accidents:", error);
      Alert.alert("Lỗi", "Không thể tải dữ liệu tai nạn.");
    } finally {
      setLoading((prev) => ({ ...prev, accidents: false }));
    }
  };
  const loadAvailableEvents = async () => {
    setLoading((prev) => ({ ...prev, events: true }));
    try {
      const response = await getAvailableEvent();
      if (response.status && response.data) {
        setAvailableEvents(response.data);
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể tải danh sách sự kiện");
      console.error("Load events error:", error);
    } finally {
      setLoading((prev) => ({ ...prev, events: false }));
    }
  };

  const loadMedicalRequestToday = async () => {
    setLoading((prev) => ({ ...prev, medicineRequest: true }));
    try {
      const response = await getMedicineRequestToday();
      if (response.status && response.data) {
        setMedicineRequest(response.data);
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể tải Yêu cầu");
      console.error("Load medicineRequest error:", error);
    } finally {
      setLoading((prev) => ({ ...prev, medicineRequest: false }));
    }
  };
  useEffect(() => {
    fetchAccidents();
    loadAvailableEvents();
    loadMedicalRequestToday();
  }, []);
  const menuItems = [
    {
      title: "Tai nạn",
      icon: ShieldAlert,
      color: "#EF4444",
      bgColor: "#FEF2F2",
      borderColor: "#FECACA",
      route: "/(nurse)/accident",
    },
    {
      title: "Yêu cầu từ bố mẹ",
      icon: BellRing,
      color: "#F59E0B",
      bgColor: "#FFFBEB",
      borderColor: "#FDE68A",
      route: "/(nurse)/medicine-request",
    },
    {
      title: "Tiêm Chủng",
      icon: Syringe,
      color: "#10B981",
      bgColor: "#ECFDF5",
      borderColor: "#A7F3D0",
      route: "/(nurse)/injection",
    },
    {
      title: "Khám Sức Khỏe",
      icon: Cross,
      color: "#8B5CF6",
      bgColor: "#F5F3FF",
      borderColor: "#DDD6FE",
      route: "/(nurse)/health-event",
    },
  ];
  const getTodayAccidents = () => {
    const today = new Date().toDateString();
    return accidents.filter((accident) => {
      const accidentDate = new Date(accident.date).toDateString();
      return accidentDate === today;
    }).length;
  };
  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1"
        contentInsetAdjustmentBehavior="automatic"
      >
        {/* Header with Gradient Background */}
        <View className="bg-white dark:bg-gray-800 shadow-sm">
          <View className="px-6 pt-6 pb-8">
            <View className="flex-row items-center justify-between mb-6">
              <View className="flex-row items-center">
                <View className="w-12 h-12 rounded-full bg-blue-100 items-center justify-center mr-4 shadow-sm">
                  <Image
                    source={require("../../assets/images/icon-removebg.png")}
                    className="w-8 h-8"
                    resizeMode="contain"
                  />
                </View>
                <View>
                  <Text className="text-2xl font-bold text-gray-900 dark:text-white">
                    CampusMedix
                  </Text>
                  <Text className="text-sm text-gray-500 dark:text-gray-400">
                    Hệ thống quản lý y tế
                  </Text>
                </View>
              </View>

              {/* Notification Badge */}
              <TouchableOpacity className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 items-center justify-center">
                <BellRing size={20} color="#6B7280" />
                <View className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 items-center justify-center">
                  <Text className="text-xs text-white font-bold">3</Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Welcome Section */}
            <View>
              <Text className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Chào mừng trở lại
              </Text>
              <Text className="text-3xl font-bold text-gray-900 dark:text-white">
                Nurse {user?.fullName}
              </Text>
            </View>
          </View>
        </View>

        {/* Content */}
        <View className="px-6 pt-6 pb-24">
          {/* Stats Card */}
          <View className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-lg font-semibold text-gray-900 dark:text-white">
                Tổng quan hôm nay
              </Text>
              <Activity size={24} color="#6B7280" />
            </View>
            <View className="flex-row justify-between">
              <View className="items-center">
                <Text className="text-2xl font-bold text-blue-600">
                  {getTodayAccidents()}
                </Text>
                <Text className="text-sm text-gray-500 dark:text-gray-400">
                  Tai nạn
                </Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold text-green-600">
                  {availableEvents.length}
                </Text>
                <Text className="text-sm text-gray-500 dark:text-gray-400">
                  Sự Kiện
                </Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold text-orange-600">
                  {medicineRequest.length}
                </Text>
                <Text className="text-sm text-gray-500 dark:text-gray-400">
                  Yêu cầu
                </Text>
              </View>
            </View>
          </View>

          {/* Medicine Management - Featured Card */}
          <TouchableOpacity
            className="bg-blue-500 rounded-2xl p-6 mb-6 shadow-lg"
            activeOpacity={0.8}
            onPress={() => router.push("/(nurse)/medicine")}
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-white text-lg font-semibold mb-2">
                  Quản lý kho thuốc
                </Text>
                <Text className="text-blue-100 text-sm mb-4">
                  Theo dõi tồn kho và vật tư y tế
                </Text>
                <View className="flex-row items-end"></View>
              </View>
              <View className="items-center">
                <View className="w-16 h-16 rounded-full bg-white/20 items-center justify-center mb-2">
                  <Pill size={32} color="#FFFFFF" strokeWidth={1.5} />
                </View>
                <ArrowRight size={24} color="#FFFFFF" />
              </View>
            </View>
          </TouchableOpacity>

          {/* Quick Actions Grid */}
          <View>
            <Text className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Chức năng chính
            </Text>

            {/* 4 widgets in 2x2 grid */}
            <View className="flex-row flex-wrap justify-between mb-4">
              {menuItems.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  className="w-[48%] mb-4"
                  activeOpacity={0.8}
                  onPress={() => router.push(item.route)}
                >
                  <View
                    className="rounded-2xl p-6 items-center shadow-sm border"
                    style={{
                      backgroundColor: item.bgColor,
                      borderColor: item.borderColor,
                    }}
                  >
                    <View
                      className="w-14 h-14 rounded-full items-center justify-center mb-4"
                      style={{ backgroundColor: `${item.color}15` }}
                    >
                      <item.icon
                        size={28}
                        color={item.color}
                        strokeWidth={1.5}
                      />
                    </View>
                    <Text
                      className="text-center font-medium text-sm leading-5"
                      style={{ color: item.color }}
                    >
                      {item.title}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            {/* Big Lịch hẹn widget - Full width */}
            <TouchableOpacity
              className="w-full"
              activeOpacity={0.8}
              onPress={() => router.push("/(nurse)/appointment")}
            >
              <View className="rounded-2xl p-6 shadow-sm border bg-indigo-50 border-indigo-200">
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <View className="flex-row items-center mb-3">
                      <View className="w-12 h-12 rounded-full bg-indigo-100 items-center justify-center mr-4">
                        <Calendar size={24} color="#6366F1" strokeWidth={1.5} />
                      </View>
                      <View>
                        <Text className="text-lg font-semibold text-indigo-900">
                          Lịch hẹn
                        </Text>
                        <Text className="text-sm text-indigo-600">
                          Quản lý lịch hẹn với phụ huynh
                        </Text>
                      </View>
                    </View>
                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center"></View>
                      <View className="flex-row items-center">
                        <Text className="text-sm text-indigo-600 mr-2">
                          Xem chi tiết
                        </Text>
                        <ArrowRight size={20} color="#6366F1" />
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
