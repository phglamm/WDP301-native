import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Platform,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Calendar, Clock, X } from "lucide-react-native";

const DateTimePickerCustom = ({
  value,
  onChange,
  mode = "datetime", // 'date', 'time', 'datetime'
  minimumDate,
  maximumDate,
  placeholder = "Chọn ngày và giờ",
  required = false,
  disabled = false,
  label,
  containerStyle,
  buttonStyle,
}) => {
  const [pickerState, setPickerState] = useState({
    showDatePicker: false,
    showTimePicker: false,
    showIOSPicker: false,
    tempDate: new Date(),
    currentMode: "date",
  });

  const formatDisplayDateTime = (date, displayMode = mode) => {
    if (!date) return placeholder;

    try {
      const options = {};

      if (displayMode === "date") {
        options.day = "2-digit";
        options.month = "2-digit";
        options.year = "numeric";
      } else if (displayMode === "time") {
        options.hour = "2-digit";
        options.minute = "2-digit";
      } else if (displayMode === "datetime") {
        options.weekday = "long";
        options.day = "2-digit";
        options.month = "2-digit";
        options.year = "numeric";
        options.hour = "2-digit";
        options.minute = "2-digit";
      }

      return date.toLocaleDateString("vi-VN", options);
    } catch (error) {
      console.error("Error formatting date:", error);
      return placeholder;
    }
  };

  const showPicker = () => {
    if (disabled) return;

    const initialDate = value || new Date();

    if (Platform.OS === "ios") {
      // iOS: Show modal with datetime picker
      setPickerState({
        showDatePicker: false,
        showTimePicker: false,
        showIOSPicker: true,
        tempDate: initialDate,
        currentMode: mode,
      });
    } else {
      // Android: Show date picker first (if mode includes date)
      if (mode === "time") {
        setPickerState({
          showDatePicker: false,
          showTimePicker: true,
          showIOSPicker: false,
          tempDate: initialDate,
          currentMode: "time",
        });
      } else {
        setPickerState({
          showDatePicker: true,
          showTimePicker: false,
          showIOSPicker: false,
          tempDate: initialDate,
          currentMode: "date",
        });
      }
    }
  };

  const handleDateTimeChange = (event, selectedDate) => {
    console.log("DateTimePicker change:", event.type, selectedDate);

    if (Platform.OS === "android") {
      if (event.type === "dismissed") {
        // User cancelled
        setPickerState((prev) => ({
          ...prev,
          showDatePicker: false,
          showTimePicker: false,
        }));
        return;
      }

      if (event.type === "set" && selectedDate) {
        if (pickerState.currentMode === "date") {
          if (mode === "date") {
            // Date only mode - we're done
            onChange(selectedDate);
            setPickerState((prev) => ({
              ...prev,
              showDatePicker: false,
            }));
          } else if (mode === "datetime") {
            // Date selected, now show time picker
            const newTempDate = new Date(selectedDate);
            if (value) {
              // Preserve existing time
              newTempDate.setHours(value.getHours());
              newTempDate.setMinutes(value.getMinutes());
            } else {
              // Set default time to 9:00 AM
              newTempDate.setHours(9, 0, 0, 0);
            }

            setPickerState((prev) => ({
              ...prev,
              showDatePicker: false,
              showTimePicker: true,
              tempDate: newTempDate,
              currentMode: "time",
            }));
          }
        } else if (pickerState.currentMode === "time") {
          // Time selected, combine and save
          let finalDateTime;

          if (mode === "time") {
            // Time only mode
            finalDateTime = selectedDate;
          } else {
            // Datetime mode - combine date and time
            finalDateTime = new Date(pickerState.tempDate);
            finalDateTime.setHours(selectedDate.getHours());
            finalDateTime.setMinutes(selectedDate.getMinutes());
          }

          onChange(finalDateTime);
          setPickerState((prev) => ({
            ...prev,
            showTimePicker: false,
          }));
        }
      }
    } else {
      // iOS: Update temp date while picker is open
      if (selectedDate) {
        setPickerState((prev) => ({
          ...prev,
          tempDate: selectedDate,
        }));
      }
    }
  };

  const handleIOSPickerConfirm = () => {
    onChange(pickerState.tempDate);
    setPickerState((prev) => ({
      ...prev,
      showIOSPicker: false,
    }));
  };

  const handleIOSPickerCancel = () => {
    setPickerState((prev) => ({
      ...prev,
      showIOSPicker: false,
    }));
  };

  const getIcon = () => {
    if (mode === "time") return <Clock size={20} color="#6B7280" />;
    return <Calendar size={20} color="#6B7280" />;
  };

  const getPickerMode = () => {
    if (Platform.OS === "ios" && mode === "datetime") return "datetime";
    return pickerState.currentMode;
  };

  return (
    <View style={containerStyle}>
      {label && (
        <View className="flex-row items-center mb-3">
          {getIcon()}
          <Text className="text-lg font-semibold text-gray-800 ml-2">
            {label} {required && "*"}
          </Text>
        </View>
      )}

      <TouchableOpacity
        onPress={showPicker}
        disabled={disabled}
        className={`border-2 border-gray-200 rounded-2xl px-4 py-4 bg-white flex-row items-center justify-between ${
          disabled ? "opacity-50" : "focus:border-blue-500"
        }`}
        style={buttonStyle}
      >
        <View className="flex-1">
          <Text
            className={`text-base ${
              value ? "text-gray-800 font-semibold" : "text-gray-400"
            }`}
          >
            {formatDisplayDateTime(value)}
          </Text>
        </View>
        <View className="flex-row items-center">
          {value && (
            <View className="mr-2">
              <View className="w-2 h-2 bg-green-500 rounded-full" />
            </View>
          )}
          {getIcon()}
        </View>
      </TouchableOpacity>

      {/* Platform-specific help text */}
      <Text className="text-gray-500 text-sm mt-2">
        {Platform.OS === "android" && mode === "datetime"
          ? "Chọn ngày trước, sau đó chọn giờ"
          : mode === "time"
            ? "Chọn thời gian"
            : mode === "date"
              ? "Chọn ngày"
              : "Chọn ngày và giờ"}
      </Text>

      {/* Android Date Picker */}
      {pickerState.showDatePicker && Platform.OS === "android" && (
        <DateTimePicker
          value={pickerState.tempDate}
          mode="date"
          display="default"
          onChange={handleDateTimeChange}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
        />
      )}

      {/* Android Time Picker */}
      {pickerState.showTimePicker && Platform.OS === "android" && (
        <DateTimePicker
          value={pickerState.tempDate}
          mode="time"
          display="default"
          onChange={handleDateTimeChange}
          is24Hour={true}
        />
      )}

      {/* iOS Picker Modal */}
      {pickerState.showIOSPicker && Platform.OS === "ios" && (
        <Modal visible={true} transparent={true} animationType="slide">
          <View className="flex-1 justify-end  bg-opacity-50">
            <View className="bg-white rounded-t-3xl">
              {/* Header */}
              <View className="flex-row justify-between items-center px-6 py-4 border-b border-gray-200">
                <TouchableOpacity onPress={handleIOSPickerCancel}>
                  <Text className="text-red-500 font-semibold text-lg">
                    Hủy
                  </Text>
                </TouchableOpacity>
                <Text className="text-lg font-semibold text-gray-800">
                  {mode === "time"
                    ? "Chọn thời gian"
                    : mode === "date"
                      ? "Chọn ngày"
                      : "Chọn ngày và giờ"}
                </Text>
                <TouchableOpacity onPress={handleIOSPickerConfirm}>
                  <Text className="text-blue-600 font-semibold text-lg">
                    Xong
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Date Time Picker */}
              <View className="px-6 py-4">
                <DateTimePicker
                  value={pickerState.tempDate}
                  mode={getPickerMode()}
                  display="spinner"
                  onChange={handleDateTimeChange}
                  minimumDate={minimumDate}
                  maximumDate={maximumDate}
                  locale="vi-VN"
                />
              </View>

              {/* Preview */}
              <View className="px-6 pb-6">
                <View className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                  <Text className="text-blue-800 font-semibold mb-1">
                    📅 Thời gian được chọn:
                  </Text>
                  <Text className="text-blue-700 text-lg">
                    {formatDisplayDateTime(pickerState.tempDate)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default DateTimePickerCustom;
