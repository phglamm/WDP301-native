import { Text, View, ScrollView, Image, TouchableOpacity } from "react-native";
import {
  Pill,
  ArrowRight,
  BellRing,
  Cross,
  Syringe,
  ShieldAlert,
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "../../stores/useAuthStore";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const { user } = useAuthStore();
  const router = useRouter();
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      className="flex-1 bg-white dark:bg-gray-900"
      contentInsetAdjustmentBehavior="automatic"
    >
      {/* Header */}
      <View className="px-6 pt-4 flex-row justify-center items-center text-center">
        <View className="flex-row items-center">
          <View className="w-10 h-10 rounded-full items-center justify-center mr-2">
            <Image
              source={require("../../assets/images/icon-removebg.png")}
              className="w-14 h-14"
              resizeMode="contain"
            />
          </View>
          <Text className="text-2xl font-bold text-gray-800 dark:text-white">
            CampusMedix
          </Text>
        </View>
      </View>
      {/* Welcome Section */}
      <View className="px-6 pt-4 my-3">
        <Text className="text-4xl font-bold text-gray-800 dark:text-white shadow-sm">
          Nurse, {user?.fullName}
        </Text>
        <Text className="text-2xl text-gray-500 dark:text-white">
          Hệ thống quản lý y tế học đường
        </Text>
      </View>
      {/* Cards Section */}
      <View className="px-6 pt-6 pb-24">
        {/* Quản lý thuốc và vật tư */}
        <TouchableOpacity
          className="bg-blue-100 rounded-xl p-4 py-6 mb-8 flex-row justify-between items-center  border-2 border-blue-200"
          activeOpacity={0.7}
          onPress={() => router.push("/(nurse)/medicine")}
        >
          <View className="flex-1 flex-col items-start justify-between gap-4">
            <Text className="text-2xl font-semibold max-w-52">
              Quản lý kho thuốc và vật tư
            </Text>
            <View className="flex-1 flex-row justify-between items-end gap-2">
              <Text className="text-4xl font-bold text-gray-800">105</Text>
              <Text className="mb-1 text-xl">loại</Text>
            </View>
          </View>
          <View className="flex-row items-end">
            <View className="h-32 w-32 justify-center items-center">
              <Pill size={140} color="#000" strokeWidth={1} />
            </View>
            <View className="text-2xl ml-5 mb-[-15px]">
              <ArrowRight size={32} color="#000" />
            </View>
          </View>
        </TouchableOpacity>

        {/* Two Cards in a Row */}
        <View className="flex-row justify-between mb-8 min-h-[150px]">
          {/* Tạo sự kiện y tế */}
          <TouchableOpacity
            className="bg-pink-100 rounded-xl p-6 w-[48%] items-center  border-2 border-pink-200"
            activeOpacity={0.7}
            onPress={() => router.push("/(nurse)/accident")}
          >
            <View className="h-12 w-12 rounded-full justify-center items-center mb-4">
              <ShieldAlert size={48} color="#B83280" />
            </View>
            <Text className="text-center text-xl font-medium text-gray-700">
              Tai nạn
            </Text>
          </TouchableOpacity>

          {/* Yêu cầu của parents */}
          <TouchableOpacity
            className="bg-yellow-50 rounded-xl p-6 w-[48%] items-center border-2 border-yellow-200"
            activeOpacity={0.7}
            onPress={() => router.push("/(nurse)/medicine-request")}
          >
            <View className="h-12 w-12 rounded-full justify-center items-center mb-4">
              <BellRing size={48} color="#D69E2E" />
            </View>
            <Text className="text-center text-xl font-medium text-gray-700">
              Yêu cầu từ bố mẹ
            </Text>
          </TouchableOpacity>
        </View>

        {/* Two Cards in a Row */}
        <View className="flex-row justify-between mb-8 min-h-[150px]">
          {/* New Accident Event */}
          <TouchableOpacity
            className="bg-green-100 rounded-xl p-6 w-[48%] items-center border-2 border-green-200"
            activeOpacity={0.7}
            onPress={() => router.push("/(nurse)/injection")}
          >
            <View className="h-12 w-12 rounded-full justify-center items-center mb-4">
              <Syringe size={48} color="#48BB78" />
            </View>
            <Text className="text-center text-xl font-medium text-gray-700">
              Tiêm Chủng
            </Text>
          </TouchableOpacity>

          {/* Medical Request */}
          <TouchableOpacity
            className="bg-purple-100 rounded-xl p-6 w-[48%] items-center  border-2 border-purple-200"
            activeOpacity={0.7}
          >
            <View className="h-12 w-12 rounded-full justify-center items-center mb-4">
              <Cross size={48} color="#9F7AEA" />
            </View>
            <Text className="text-center text-xl font-medium text-gray-700">
              Khám Sức Khỏe
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
