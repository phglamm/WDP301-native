import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { CheckCircle, Syringe, FileText, User } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function VaccineDeclareSuccess({
  selectedSon,
  selectedVaccine,
  doses,
}) {
  return (
    <SafeAreaView className='flex-1 bg-white'>
      <View className='flex-1 items-center justify-center px-6'>
        <View className='w-20 h-20 bg-green-100 rounded-full items-center justify-center mb-6'>
          <CheckCircle size={40} color='#10B981' />
        </View>

        <Text className='text-2xl font-bold text-gray-900 mb-3 text-center'>
          Khai báo thành công!
        </Text>

        <Text className='text-gray-600 text-center mb-8 leading-6'>
          Thông tin tiêm chủng của {selectedSon.fullName} đã được ghi nhận
        </Text>

        <View className='bg-gray-50 rounded-2xl p-4 w-full mb-8'>
          <View className='flex-row items-center mb-2'>
            <User size={16} color='#6B7280' />
            <Text className='text-gray-600 ml-2'>Học sinh:</Text>
            <Text className='text-gray-900 font-semibold ml-1'>
              {selectedSon.fullName}
            </Text>
          </View>

          <View className='flex-row items-center mb-2'>
            <Syringe size={16} color='#6B7280' />
            <Text className='text-gray-600 ml-2'>Vaccine:</Text>
            <Text className='text-gray-900 font-semibold ml-1 flex-1'>
              {selectedVaccine.name}
            </Text>
          </View>

          <View className='flex-row items-center'>
            <FileText size={16} color='#6B7280' />
            <Text className='text-gray-600 ml-2'>Số liều:</Text>
            <Text className='text-gray-900 font-semibold ml-1'>
              {doses} liều
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={handleBackToHome}
          className='bg-blue-500 w-full p-4 rounded-xl'
        >
          <Text className='text-white text-lg font-semibold text-center'>
            Về trang chủ
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
