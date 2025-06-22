import {
  View,
  Text,
  Platform,
  TouchableOpacity,
  KeyboardAvoidingView,
  RefreshControl,
  ScrollView,
} from "react-native";
import React from "react";
import {
  Activity,
  ArrowLeft,
  Calendar,
  ChevronRight,
  User,
} from "lucide-react-native";

export default function AccidentHistory({
  accidents,
  setCurrentView,
  handleViewAccidentDetail,
  refreshing,
  handleRefresh,
  formatDate,
  getAccidentTypeColor,
}) {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      {/* Header */}
      <View className="bg-white shadow-sm border-b border-gray-100 p-6">
        <View className="flex-row items-center justify-start gap-4 mb-4">
          <TouchableOpacity
            onPress={() => setCurrentView("select")}
            className="p-2 rounded-full bg-gray-100 active:bg-gray-200"
          >
            <ArrowLeft size={20} color="#6B7280" />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-2xl font-montserratBold text-gray-800">
              Lịch sử tai nạn
            </Text>
            <Text className="text-gray-500 font-montserratRegular mt-1">
              {accidents.length} sự kiện đã ghi nhận
            </Text>
          </View>
        </View>
      </View>

      {/* Accidents List */}
      <ScrollView
        className="flex-1 px-6"
        contentContainerStyle={{ paddingTop: 20, paddingBottom: 30 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {accidents.length === 0 ? (
          <View className="bg-white p-6 rounded-xl border border-gray-200 mt-4">
            <View className="items-center">
              <View className="bg-gray-100 p-4 rounded-full mb-3">
                <FileText size={24} color="#6B7280" />
              </View>
              <Text className="text-gray-500 font-medium">
                Chưa có tai nạn nào
              </Text>
              <Text className="text-gray-400 text-sm mt-1 text-center">
                Các sự kiện tai nạn sẽ hiển thị ở đây
              </Text>
            </View>
          </View>
        ) : (
          <View className="space-y-4">
            {accidents.map((accident, index) => {
              const typeColors = getAccidentTypeColor(accident.type);
              return (
                <TouchableOpacity
                  key={accident.id || index}
                  onPress={() => handleViewAccidentDetail(accident)}
                  className="bg-white p-4 rounded-xl border border-gray-200 active:bg-gray-50"
                >
                  <View className="flex-row items-start justify-between">
                    <View className="flex-1">
                      {/* Accident Type Badge */}
                      <View
                        className={`self-start px-3 py-1 rounded-full ${typeColors.bg} ${typeColors.border} border mb-2`}
                      >
                        <Text
                          className={`text-xs font-semibold ${typeColors.text}`}
                        >
                          {accident.type || "Không xác định"}
                        </Text>
                      </View>

                      {/* Summary */}
                      <Text className="text-lg font-semibold text-gray-800 mb-2">
                        {accident.summary || "Không có mô tả"}
                      </Text>

                      {/* Student Info */}
                      <View className="flex-row items-center mb-2">
                        <User size={16} color="#6B7280" />
                        <Text className="text-gray-600 ml-2 font-medium">
                          {accident.student?.fullName || "Không xác định"}
                        </Text>
                        <Text className="text-gray-500 ml-2">
                          ({accident.student?.studentCode || "N/A"})
                        </Text>
                      </View>

                      {/* Date */}
                      <View className="flex-row items-center">
                        <Calendar size={16} color="#6B7280" />
                        <Text className="text-gray-500 ml-2">
                          {formatDate(accident.date)}
                        </Text>
                      </View>

                      {/* Nurse Info */}
                      <View className="flex-row items-center mt-2">
                        <Activity size={16} color="#6B7280" />
                        <Text className="text-gray-500 ml-2">
                          Xử lý bởi:
                          {accident.nurse?.fullName || "Không xác định"}
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
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
