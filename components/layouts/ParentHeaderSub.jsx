import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { ArrowLeft } from 'lucide-react-native';

export default function ParentHeaderSub({ onBack, title }) {
  return (
    <View className='flex-row items-center justify-between p-4 bg-white border-b border-gray-200'>
      <TouchableOpacity onPress={onBack} className='p-1'>
        <ArrowLeft size={20} color='#407CE2' />
      </TouchableOpacity>
      <Text className='text-lg font-semibold text-gray-900'>{title}</Text>
      <View className='w-8' />
    </View>
  );
}
