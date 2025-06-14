import {
  View,
  Text,
  Platform,
  TouchableOpacity,
  KeyboardAvoidingView,
  RefreshControl,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React from "react";
import {
  Activity,
  ArrowLeft,
  Calendar,
  ChevronRight,
  User,
  Pill,
  FileText,
  Clock,
  Image as ImageIcon,
} from "lucide-react-native";

export default function MedicineRequestHistory({
  medicineRequests,
  setCurrentView,
  handleViewRequestDetail,
  refreshing,
  handleRefresh,
  formatDateTime,
  getStatusColor,
  loading,
}) {
  // Helper function to determine status based on data
  const determineStatus = (record) => {
    if (!record.note || record.note === "string") {
      return "Chờ xử lý";
    }
    // You can add more logic here based on your business rules
    return "Đã ghi nhận";
  };

  // Helper function to get medicine/request name
  const getRequestTitle = (record) => {
    if (!record.note || record.note === "string") {
      return "Yêu cầu y tế";
    }
    return record.note;
  };

  // Helper function to check if there's an attachment
  const hasAttachment = (record) => {
    return !!record.image;
  };

  // Helper function to get attachment type
  const getAttachmentType = (record) => {
    if (!record.image) return null;
    if (record.image.includes(".docx") || record.image.includes(".doc")) {
      return "document";
    }
    return "image";
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      {/* Header */}
      <View className="bg-white shadow-sm border-b border-gray-100 p-6">
        <View className="flex-row items-center justify-start gap-4 mb-4">
          <TouchableOpacity
            onPress={() => setCurrentView("main")}
            className="p-2 rounded-full bg-gray-100 active:bg-gray-200"
          >
            <ArrowLeft size={20} color="#6B7280" />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-2xl font-bold text-gray-800">
              Lịch sử yêu cầu thuốc
            </Text>
            <Text className="text-gray-500 mt-1">
              {medicineRequests.length} yêu cầu đã ghi nhận
            </Text>
          </View>
        </View>
      </View>

      {/* Medicine Requests List */}
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
            <ActivityIndicator size="large" color="#3B82F6" />
            <Text className="text-gray-500 mt-4">Đang tải lịch sử...</Text>
          </View>
        ) : medicineRequests.length === 0 ? (
          <View className="bg-white p-6 rounded-xl border border-gray-200 mt-4">
            <View className="items-center">
              <View className="bg-gray-100 p-4 rounded-full mb-3">
                <FileText size={24} color="#6B7280" />
              </View>
              <Text className="text-gray-500 font-medium">
                Chưa có yêu cầu thuốc nào
              </Text>
              <Text className="text-gray-400 text-sm mt-1 text-center">
                Các yêu cầu thuốc sẽ hiển thị ở đây
              </Text>
            </View>
          </View>
        ) : (
          <View className="space-y-4">
            {medicineRequests.map((record, index) => {
              const status = determineStatus(record);
              const statusColors = getStatusColor(status);
              const requestTitle = getRequestTitle(record);
              const attachmentType = getAttachmentType(record);

              return (
                <TouchableOpacity
                  key={record.id || index}
                  onPress={() => handleViewRequestDetail(record)}
                  className="bg-white p-4 rounded-xl border border-gray-200 active:bg-gray-50"
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1">
                      {/* Status Badge */}
                      <View
                        className={`self-start px-3 py-1 rounded-full ${statusColors.bg} mb-2`}
                      >
                        <Text
                          className={`text-sm font-semibold ${statusColors.text}`}
                        >
                          {status}
                        </Text>
                      </View>

                      {/* Request Title */}
                      <Text className="font-semibold text-gray-800 text-base mb-2">
                        {requestTitle}
                      </Text>

                      {/* Student Info */}
                      <View className="flex-row items-center mb-2">
                        <User size={16} color="#6B7280" />
                        <Text className="text-gray-600 ml-2 font-medium">
                          {record.student?.fullName ||
                            "Học sinh không xác định"}
                        </Text>
                        <Text className="text-gray-500 ml-2 text-sm">
                          • {record.student?.class || "N/A"}
                        </Text>
                      </View>

                      {/* Date and Time */}
                      <View className="flex-row items-center mb-2">
                        <Calendar size={16} color="#6B7280" />
                        <Text className="text-gray-500 ml-2 text-sm">
                          {formatDateTime(record.date)}
                        </Text>
                      </View>

                      {/* Parent Info */}
                      <View className="flex-row items-center mb-2">
                        <Activity size={16} color="#6B7280" />
                        <Text className="text-gray-500 ml-2 text-sm">
                          Từ: {record.parent?.fullName || "Phụ huynh"}
                        </Text>
                        {record.parent?.phone && (
                          <Text className="text-gray-400 ml-2 text-sm">
                            • {record.parent.phone}
                          </Text>
                        )}
                      </View>

                      {/* Attachment Info */}
                      {hasAttachment(record) && (
                        <View className="flex-row items-center mt-2">
                          {attachmentType === "document" ? (
                            <FileText size={16} color="#8B5CF6" />
                          ) : (
                            <ImageIcon size={16} color="#10B981" />
                          )}
                          <Text className="text-purple-600 ml-2 text-sm font-medium">
                            {attachmentType === "document"
                              ? "Tài liệu đính kèm"
                              : "Hình ảnh đính kèm"}
                          </Text>
                        </View>
                      )}

                      {/* Student Code */}
                      <View className="mt-2 pt-2 border-t border-gray-100">
                        <Text className="text-gray-400 text-xs">
                          Mã học sinh: {record.student?.studentCode || "N/A"}
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
