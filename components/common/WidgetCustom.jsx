import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';

export default function WidgetCustom({
  icon,
  title,
  onPress,
  backgroundColor,
  borderColor,
  textColor,
}) {
  return (
    <TouchableOpacity
      className={`${backgroundColor} rounded-xl p-4 items-center shadow-md border-2 ${borderColor} mb-4`}
      style={{ width: '48%' }}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <View className='h-12 w-12 justify-center items-center mb-4'>{icon}</View>
      <Text
        className={`text-center text-lg font-montserratSemiBold ${textColor}`}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}
