// Medicine Request Card Component
import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import {
  User,
  Calendar,
  FileText,
  ChevronRight,
  Phone,
  MapPin,
  Camera,
} from "lucide-react-native";

export default function MedicineRequestCard({
  request,
  onPress,
  formatDateTime,
}) {
  const hasImage = request.image && request.image.trim() !== "";

  return (
    <TouchableOpacity
      className="bg-white rounded-2xl p-5 mb-4 border border-gray-200 shadow-sm active:bg-gray-50"
      onPress={onPress}
    >
      {/* Request Header */}
      <View className="flex-row items-start justify-between mb-4">
        <View className="flex-1">
          <View className="flex-row items-center mb-2">
            <User size={16} color="#6B7280" />
            <Text className="text-lg font-bold text-gray-800 ml-2 flex-1">
              {request.student?.fullName || "Tên học sinh"}
            </Text>
          </View>
          <Text className="text-blue-600 font-semibold">
            Mã HS: {request.student?.studentCode || "N/A"}
          </Text>
        </View>
        <View className="ml-4">
          <ChevronRight size={20} color="#9CA3AF" />
        </View>
      </View>

      {/* Request Time */}
      <View className="flex-row items-center mb-3">
        <Calendar size={16} color="#6B7280" />
        <Text className="text-gray-600 ml-2">
          {formatDateTime(request.date)}
        </Text>
      </View>

      {/* Parent Information */}
      <View className="bg-gray-50 rounded-xl p-4 mb-4">
        <Text className="text-sm font-semibold text-gray-700 mb-2">
          Thông tin phụ huynh
        </Text>
        <View className="flex-row items-center mb-1">
          <User size={14} color="#6B7280" />
          <Text className="text-gray-600 ml-2 text-sm">
            {request.parent?.fullName || "Tên phụ huynh"}
          </Text>
        </View>
        <View className="flex-row items-center">
          <Phone size={14} color="#6B7280" />
          <Text className="text-gray-600 ml-2 text-sm">
            {request.parent?.phone || "Số điện thoại"}
          </Text>
        </View>
      </View>

      {/* Request Note */}
      {request.note && (
        <View className="mb-4">
          <View className="flex-row items-center mb-2">
            <FileText size={16} color="#6B7280" />
            <Text className="text-gray-700 font-semibold ml-2">Ghi chú:</Text>
          </View>
          <Text className="text-gray-600 bg-gray-50 p-3 rounded-lg">
            {request.note}
          </Text>
        </View>
      )}

      {/* Image Indicator */}
      {hasImage && (
        <View className="flex-row items-center justify-between bg-blue-50 p-3 rounded-xl">
          <View className="flex-row items-center">
            <Camera size={16} color="#3B82F6" />
            <Text className="text-blue-600 font-semibold ml-2">
              Có hình ảnh đính kèm
            </Text>
          </View>
          <View className="bg-blue-100 px-2 py-1 rounded-full">
            <Text className="text-blue-600 text-xs font-semibold">1 ảnh</Text>
          </View>
        </View>
      )}

      {/* Student Address */}
      {request.student?.address && (
        <View className="flex-row items-start mt-3 pt-3 border-t border-gray-100">
          <MapPin size={14} color="#6B7280" className="mt-1" />
          <Text className="text-gray-500 ml-2 text-sm flex-1">
            {request.student.address}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
