import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Alert,
  Linking,
} from "react-native";
import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Clock,
  Calendar,
  Video,
  ChevronRight,
  Filter,
  ExternalLink,
  MapPin,
  User,
} from "lucide-react-native";
import { getAppointmentHistory } from "../../services/nurseService";

export default function AppointmentHistory({
  setCurrentView,
  handleViewAppointmentDetail,
  formatDate,
  getAppointmentStatusColor,
}) {
  const [appointments, setAppointments] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, scheduled, completed, cancelled

  const fetchAppointmentHistory = async () => {
    try {
      setLoading(true);
      const response = await getAppointmentHistory();
      setAppointments(response.data || []);
    } catch (error) {
      console.error("Error fetching appointment history:", error);
      Alert.alert("Lỗi", "Không thể tải lịch sử cuộc hẹn.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointmentHistory();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAppointmentHistory();
    setRefreshing(false);
  };

  const filteredAppointments = appointments.filter((appointment) => {
    if (filter === "all") return true;
    return appointment.status === filter;
  });

  const getFilterCount = (status) => {
    if (status === "all") return appointments.length;
    return appointments.filter((appointment) => appointment.status === status)
      .length;
  };

  const handleJoinMeeting = async (meetLink) => {
    if (meetLink) {
      try {
        await Linking.openURL(meetLink);
      } catch (error) {
        Alert.alert("Lỗi", "Không thể mở liên kết Google Meet");
      }
    }
  };

  const formatStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case "scheduled":
        return "Đã lên lịch";
      case "completed":
        return "Hoàn thành";
      case "cancelled":
        return "Đã hủy";
      case "in-progress":
        return "Đang diễn ra";
      default:
        return status;
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-white shadow-sm border-b border-gray-100 p-6">
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity
            onPress={() => setCurrentView("select")}
            className="p-2 rounded-full bg-gray-100 active:bg-gray-200"
          >
            <ArrowLeft size={20} color="#6B7280" />
          </TouchableOpacity>
          <View className="flex-1 ml-4">
            <Text className="text-2xl font-montserratBold text-gray-800">
              Lịch sử cuộc hẹn
            </Text>
            <Text className="text-gray-500 font-montserratRegular mt-1">
              {appointments.length} cuộc hẹn tổng cộng
            </Text>
          </View>
        </View>

        {/* Filter Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mt-4"
        >
          <View className="flex-row gap-3">
            {[
              { key: "all", label: "Tất cả" },
              { key: "scheduled", label: "Đã lên lịch" },
              { key: "completed", label: "Hoàn thành" },
              { key: "cancelled", label: "Đã hủy" },
            ].map((filterOption) => (
              <TouchableOpacity
                key={filterOption.key}
                onPress={() => setFilter(filterOption.key)}
                className={`px-4 py-2 rounded-full border ${
                  filter === filterOption.key
                    ? "bg-green-500 border-green-500"
                    : "bg-white border-gray-300"
                }`}
              >
                <Text
                  className={`font-semibold ${
                    filter === filterOption.key ? "text-white" : "text-gray-600"
                  }`}
                >
                  {filterOption.label} ({getFilterCount(filterOption.key)})
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Content */}
      <ScrollView
        className="flex-1 px-6"
        contentContainerStyle={{ paddingTop: 20, paddingBottom: 30 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View className="flex-1 justify-center items-center py-20">
            <Text className="text-gray-500">Đang tải...</Text>
          </View>
        ) : filteredAppointments.length === 0 ? (
          <View className="flex-1 justify-center items-center py-20">
            <View className="bg-gray-100 p-6 rounded-full mb-4">
              <Calendar size={32} color="#6B7280" />
            </View>
            <Text className="text-gray-500 font-montserratSemiBold text-lg">
              {filter === "all"
                ? "Chưa có cuộc hẹn nào"
                : `Không có cuộc hẹn ${
                    filter === "scheduled"
                      ? "đã lên lịch"
                      : filter === "completed"
                        ? "hoàn thành"
                        : filter === "cancelled"
                          ? "đã hủy"
                          : ""
                  }`}
            </Text>
            <Text className="text-gray-400 text-sm mt-2 text-center">
              {filter === "all"
                ? "Các cuộc hẹn sẽ hiển thị ở đây khi được tạo"
                : "Thử chọn bộ lọc khác để xem cuộc hẹn"}
            </Text>
          </View>
        ) : (
          <View className="space-y-4">
            {filteredAppointments.map((appointment, index) => {
              const statusColors = getAppointmentStatusColor(
                appointment.status
              );
              return (
                <TouchableOpacity
                  key={appointment.id || index}
                  onPress={() => handleViewAppointmentDetail(appointment)}
                  className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm active:bg-gray-50"
                  style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 3,
                  }}
                >
                  <View className="flex-row items-start justify-between mb-3">
                    <View
                      className={`px-3 py-1 rounded-full ${statusColors.bg} ${statusColors.border}`}
                    >
                      <Text
                        className={`text-sm font-semibold ${statusColors.text}`}
                      >
                        {formatStatusText(appointment.status)}
                      </Text>
                    </View>
                    {appointment.googleMeetLink && (
                      <TouchableOpacity
                        onPress={() =>
                          handleJoinMeeting(appointment.googleMeetLink)
                        }
                        className="bg-blue-100 p-2 rounded-full"
                      >
                        <Video size={16} color="#3B82F6" />
                      </TouchableOpacity>
                    )}
                  </View>

                  <Text className="font-montserratSemiBold text-lg text-gray-800 mb-2">
                    {appointment.purpose}
                  </Text>

                  <View className="flex-row items-center mb-2">
                    <Clock size={16} color="#6B7280" />
                    <Text className="text-gray-600 font-montserratRegular ml-2">
                      {formatDate(appointment.appointmentTime)}
                    </Text>
                  </View>

                  <View className="flex-row items-center justify-between mt-3">
                    <View className="flex-row items-center">
                      <User size={16} color="#6B7280" />
                      <Text className="text-gray-500 text-sm ml-2">
                        ID: {appointment.id}
                      </Text>
                    </View>
                    <ChevronRight size={20} color="#9CA3AF" />
                  </View>

                  {appointment.googleMeetLink && (
                    <TouchableOpacity
                      onPress={() =>
                        handleJoinMeeting(appointment.googleMeetLink)
                      }
                      className="flex-row items-center justify-center mt-3 bg-blue-50 p-3 rounded-xl border border-blue-100"
                    >
                      <ExternalLink size={16} color="#3B82F6" />
                      <Text className="text-blue-600 font-semibold ml-2">
                        Tham gia Google Meet
                      </Text>
                    </TouchableOpacity>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
