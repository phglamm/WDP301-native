import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { ArrowLeft } from 'lucide-react-native';

export default function ParentHeader({ title, description, onBack }) {
  return (
    <View className='flex-row items-center justify-start gap-4 p-4 mb-4'>
      <TouchableOpacity onPress={onBack}>
        <ArrowLeft size={24} color='#6B7280' />
      </TouchableOpacity>
      <View>
        <Text className='text-2xl text-gray-800 font-montserratBold'>
          {title}
        </Text>
        <Text className='text-gray-500 font-montserratRegular'>
          {description}
        </Text>
      </View>
    </View>
  );
}
