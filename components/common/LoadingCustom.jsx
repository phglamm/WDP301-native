import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

export default function LoadingCustom({ isLoading, message = 'Loading...' }) {
  if (!isLoading) return null;
  return (
    <View className='flex-1 bg-white justify-center items-center'>
      <View className='p-6 bg-gray-100 rounded-xl shadow-lg items-center'>
        <ActivityIndicator size='large' color='#3B82F6' />
        <Text className='text-gray-600 mt-3 text-base font-semibold'>
          {message}
        </Text>
      </View>
    </View>
  );
}
