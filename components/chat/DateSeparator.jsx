import React from 'react';
import { View, Text } from 'react-native';

const DateSeparator = ({ date }) => {
  return (
    <View className='flex-row items-center my-4 px-5'>
      <View className='flex-1 h-px bg-gray-200' />
      <View className='bg-gray-50 px-3 py-1 rounded-xl mx-3'>
        <Text className='text-xs text-gray-500 font-medium'>{date}</Text>
      </View>
      <View className='flex-1 h-px bg-gray-200' />
    </View>
  );
};

export default DateSeparator;
