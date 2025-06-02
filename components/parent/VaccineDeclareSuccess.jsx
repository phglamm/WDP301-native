import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { CheckCircle, Syringe, FileText, User } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function VaccineDeclareSuccess({
  selectedSon,
  selectedVaccine,
  doses,
  handleBackToHome,
}) {
  return (
    <SafeAreaView className='flex-1 bg-white'>
      <View className='items-center justify-center flex-1 px-6'>
        <View className='items-center justify-center w-20 h-20 mb-6 bg-green-100 rounded-full'>
          <CheckCircle size={40} color='#10B981' />
        </View>

        <Text className='mb-3 text-2xl font-bold text-center text-gray-900'>
          Khai báo thành công!
        </Text>

        <Text className='mb-8 leading-6 text-center text-gray-600'>
          Thông tin tiêm chủng của {selectedSon.fullName} đã được ghi nhận
        </Text>

        <View className='w-full p-4 mb-8 bg-gray-50 rounded-2xl'>
          <View className='flex-row items-center mb-2'>
            <User size={16} color='#6B7280' />
            <Text className='ml-2 text-gray-600'>Học sinh:</Text>
            <Text className='ml-1 font-semibold text-gray-900'>
              {selectedSon.fullName}
            </Text>
          </View>

          <View className='flex-row items-center mb-2'>
            <Syringe size={16} color='#6B7280' />
            <Text className='ml-2 text-gray-600'>Vaccine:</Text>
            <Text className='flex-1 ml-1 font-semibold text-gray-900'>
              {selectedVaccine.name}
            </Text>
          </View>

          <View className='flex-row items-center'>
            <FileText size={16} color='#6B7280' />
            <Text className='ml-2 text-gray-600'>Số liều:</Text>
            <Text className='ml-1 font-semibold text-gray-900'>
              {doses} liều
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={handleBackToHome}
          className='w-full p-4 bg-blue-500 rounded-xl'
        >
          <Text className='text-lg font-semibold text-center text-white'>
            Về trang chủ
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
