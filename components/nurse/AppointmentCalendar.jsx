import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  RefreshControl,
} from "react-native";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  Video,
} from "lucide-react-native";

const { width } = Dimensions.get("window");

const AppointmentCalendar = ({
  appointments = [],
  onAppointmentPress,
  getAppointmentStatusColor,
  formatDate,
  refreshing = false,
  onRefresh = () => {},
}) => {
  // Get today's date in local timezone
  const getToday = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  };

  const [currentDate, setCurrentDate] = useState(() => {
    const today = getToday();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  const [selectedDate, setSelectedDate] = useState(null);
  const [todayDate] = useState(getToday);

  // Helper function to create date without time
  const createDateOnly = (year, month, day) => {
    return new Date(year, month, day);
  };

  // Helper function to check if two dates are the same day
  const isSameDay = (date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  // Get appointments for a specific date
  const getAppointmentsForDate = (date) => {
    return appointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.appointmentTime);
      return isSameDay(date, appointmentDate);
    });
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = createDateOnly(year, month, 1);
    const lastDay = createDateOnly(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    console.log("Calendar Debug:", {
      year,
      month: month + 1, // Add 1 for human readable month
      daysInMonth,
      startingDayOfWeek,
      firstDayDate: firstDay.toDateString(),
    });

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = createDateOnly(year, month, day);
      const dayAppointments = getAppointmentsForDate(date);

      days.push({
        date,
        day,
        appointments: dayAppointments,
        isToday: isSameDay(date, todayDate),
        isSelected: selectedDate && isSameDay(date, selectedDate),
        dayOfWeek: date.getDay(), // Add day of week for debugging
      });
    }

    // Add empty cells to complete the last week if needed
    const totalCells = days.length;
    const remainingCells = totalCells % 7;
    if (remainingCells !== 0) {
      const cellsToAdd = 7 - remainingCells;
      for (let i = 0; i < cellsToAdd; i++) {
        days.push(null);
      }
    }

    console.log("Total calendar cells:", days.length);
    console.log("Days with data:", days.filter((d) => d !== null).length);

    return days;
  };

  const calendarDays = generateCalendarDays();
  const weekDays = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

  const monthNames = [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ];

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const handleDayPress = (dayData) => {
    if (dayData) {
      setSelectedDate(dayData.date);
    }
  };

  const getAppointmentDot = (appointments) => {
    if (appointments.length === 0) return null;

    const statusCounts = appointments.reduce((acc, apt) => {
      acc[apt.status] = (acc[apt.status] || 0) + 1;
      return acc;
    }, {});

    // Priority: scheduled > in-progress > completed > cancelled
    const priorityOrder = [
      "scheduled",
      "in-progress",
      "completed",
      "cancelled",
    ];
    const primaryStatus = priorityOrder.find((status) => statusCounts[status]);

    if (primaryStatus) {
      const colors = getAppointmentStatusColor(primaryStatus);
      return colors.icon;
    }

    return "#6B7280";
  };

  const selectedDateAppointments = selectedDate
    ? getAppointmentsForDate(selectedDate)
    : [];

  return (
    <View className="flex-1 bg-white">
      {/* Calendar Header */}
      <View className="bg-white border-b border-gray-200 px-4 py-3">
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity
            onPress={() => navigateMonth(-1)}
            className="p-2 rounded-full bg-gray-100 active:bg-gray-200"
          >
            <ChevronLeft size={20} color="#6B7280" />
          </TouchableOpacity>

          <View className="flex-row items-center">
            <CalendarIcon size={20} color="#3B82F6" />
            <Text className="text-lg font-montserratBold text-gray-800 ml-2">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => navigateMonth(1)}
            className="p-2 rounded-full bg-gray-100 active:bg-gray-200"
          >
            <ChevronRight size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Week Days Header */}
        <View className="flex-row">
          {weekDays.map((day, index) => (
            <View key={index} className="flex-1 items-center py-2">
              <Text className="text-sm font-semibold text-gray-600">{day}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Calendar Grid */}
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="px-4 py-2">
          {/* Render calendar in rows of 7 */}
          {Array.from(
            { length: Math.ceil(calendarDays.length / 7) },
            (_, weekIndex) => (
              <View key={weekIndex} className="flex-row">
                {Array.from({ length: 7 }, (_, dayIndex) => {
                  const cellIndex = weekIndex * 7 + dayIndex;
                  const dayData = calendarDays[cellIndex];

                  if (!dayData) {
                    return (
                      <View
                        key={dayIndex}
                        style={{ width: width / 7 - 8 }}
                        className="h-12 m-1"
                      />
                    );
                  }

                  const dotColor = getAppointmentDot(dayData.appointments);

                  return (
                    <TouchableOpacity
                      key={dayIndex}
                      style={{ width: width / 7 - 8 }}
                      className={`h-12 m-1 rounded-lg items-center justify-center relative ${
                        dayData.isSelected
                          ? "bg-blue-500"
                          : dayData.isToday
                            ? "bg-blue-100 border border-blue-300"
                            : dayData.appointments.length > 0
                              ? "bg-green-50 border border-green-200"
                              : "bg-gray-50"
                      }`}
                      onPress={() => handleDayPress(dayData)}
                    >
                      <Text
                        className={`text-sm font-medium ${
                          dayData.isSelected
                            ? "text-white"
                            : dayData.isToday
                              ? "text-blue-700"
                              : dayData.appointments.length > 0
                                ? "text-green-700"
                                : "text-gray-700"
                        }`}
                      >
                        {dayData.day}
                      </Text>

                      {/* Appointment indicator */}
                      {dayData.appointments.length > 0 && (
                        <View className="justify-center items-center flex-row">
                          <View
                            className="w-1 h-1.5 rounded-full"
                            style={{ backgroundColor: dotColor }}
                          />
                          {dayData.appointments.length > 1 && (
                            <Text className="text-xs text-gray-600 ml-1">
                              +{dayData.appointments.length - 1}
                            </Text>
                          )}
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            )
          )}
        </View>

        {/* Selected Date Appointments */}
        {selectedDate && (
          <View className="px-4 py-4 border-t border-gray-200">
            <Text className="text-lg font-montserratSemiBold text-gray-800 mb-3">
              Cuộc hẹn ngày{" "}
              {selectedDate.toLocaleDateString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </Text>

            {selectedDateAppointments.length === 0 ? (
              <View className="bg-gray-50 p-4 rounded-xl items-center">
                <CalendarIcon size={32} color="#9CA3AF" />
                <Text className="text-gray-500 font-medium mt-2">
                  Không có cuộc hẹn nào
                </Text>
                <Text className="text-gray-400 text-sm mt-1 text-center">
                  Chưa có cuộc hẹn nào được lên lịch cho ngày này
                </Text>
              </View>
            ) : (
              <View className="space-y-3">
                {selectedDateAppointments.map((appointment, index) => {
                  const statusColors = getAppointmentStatusColor(
                    appointment.status
                  );
                  const appointmentTime = new Date(appointment.appointmentTime);

                  return (
                    <TouchableOpacity
                      key={appointment.id || index}
                      onPress={() => onAppointmentPress(appointment)}
                      className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm active:bg-gray-50"
                    >
                      <View className="flex-row items-start justify-between">
                        <View className="flex-1">
                          <View className="flex-row items-center justify-between mb-2">
                            <View
                              className={`px-3 py-1 rounded-full ${statusColors.bg} ${statusColors.border} border`}
                            >
                              <Text
                                className={`text-xs font-semibold ${statusColors.text}`}
                              >
                                {appointment.status === "scheduled"
                                  ? "Đã lên lịch"
                                  : appointment.status === "completed"
                                    ? "Hoàn thành"
                                    : appointment.status === "cancelled"
                                      ? "Đã hủy"
                                      : appointment.status === "in-progress"
                                        ? "Đang diễn ra"
                                        : appointment.status}
                              </Text>
                            </View>
                            {appointment.googleMeetLink && (
                              <TouchableOpacity className="bg-blue-100 p-1 rounded-full">
                                <Video size={14} color="#3B82F6" />
                              </TouchableOpacity>
                            )}
                          </View>

                          <Text className="font-montserratSemiBold text-gray-800 mb-1">
                            {appointment.purpose}
                          </Text>

                          <View className="flex-row items-center">
                            <Clock size={14} color="#6B7280" />
                            <Text className="text-sm text-gray-600 ml-1">
                              {appointmentTime.toLocaleTimeString("vi-VN", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>
        )}

        {/* Legend */}
        <View className="px-4 py-4 border-t border-gray-200">
          <Text className="text-sm font-montserratSemiBold text-gray-700 mb-2">
            Chú thích:
          </Text>
          <View className="flex-row flex-wrap gap-4">
            <View className="flex-row items-center">
              <View className="w-3 h-3 rounded-full bg-blue-500 mr-2" />
              <Text className="text-xs text-gray-600">Đã chọn</Text>
            </View>
            <View className="flex-row items-center">
              <View className="w-3 h-3 rounded-full bg-blue-300 border border-blue-400 mr-2" />
              <Text className="text-xs text-gray-600">Hôm nay</Text>
            </View>
            <View className="flex-row items-center">
              <View className="w-3 h-3 rounded-full bg-green-500 mr-2" />
              <Text className="text-xs text-gray-600">Có cuộc hẹn</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default AppointmentCalendar;
