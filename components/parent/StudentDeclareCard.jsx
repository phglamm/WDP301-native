import { View, Text } from 'react-native';
import React from 'react';
import { User } from 'lucide-react-native';

export default function StudentDeclareCard({ selectedSon }) {
  return (
    <View className='bg-blue-50 rounded-2xl p-4 mx-4 mt-4'>
      <View className='flex-row items-center'>
        <View className='w-12 h-12 bg-blue-500 rounded-full items-center justify-center mr-3'>
          <User size={24} color='#fff' />
        </View>
        <View className='flex-1'>
          <Text className='text-sm text-blue-600'>Khai báo cho</Text>
          <Text className='text-lg font-bold text-blue-900'>
            {selectedSon.fullName}
          </Text>
          <Text className='text-blue-700 text-sm'>
            {selectedSon.studentCode}
          </Text>
        </View>
      </View>
    </View>
  );
}
