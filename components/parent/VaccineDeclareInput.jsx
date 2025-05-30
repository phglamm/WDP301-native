import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { CheckCircle, Syringe, User, AlertCircle } from 'lucide-react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { ActivityIndicator } from 'react-native';

export default function VaccineDeclareInput({
  selectedSon,
  selectedVaccine,
  doses,
  setDoses,
  handleSubmit,
  isSubmitting,
  setCurrentStep,
}) {
  return (
    <View className='flex-1 bg-white'>
      {/* Header */}
      <View className='flex-row items-center justify-between p-4 bg-white border-b border-gray-200'>
        <TouchableOpacity
          onPress={() => setCurrentStep('select')}
          className='p-1'
        >
          <Ionicons name='arrow-back' size={20} color='#407CE2' />
        </TouchableOpacity>
        <Text className='text-lg font-semibold text-gray-900'>
          Khai báo tiêm chủng
        </Text>
        <View className='w-8' />
      </View>

      <ScrollView className='flex-1 p-4'>
        {/* Student Info */}
        <View className='bg-blue-50 rounded-2xl p-4 mb-6'>
          <View className='flex-row items-center'>
            <View className='w-12 h-12 bg-blue-500 rounded-full items-center justify-center mr-3'>
              <User size={24} color='#fff' />
            </View>
            <View className='flex-1'>
              <Text className='text-sm text-blue-600'>Học sinh</Text>
              <Text className='text-lg font-bold text-blue-900'>
                {selectedSon.fullName}
              </Text>
              <Text className='text-blue-700 text-sm'>
                {selectedSon.studentCode}
              </Text>
            </View>
          </View>
        </View>

        {/* Selected Vaccine */}
        <View className='bg-white border border-gray-200 rounded-2xl p-4 mb-6'>
          <Text className='text-lg font-bold text-gray-900 mb-3'>
            Vaccine được chọn
          </Text>

          <View className='flex-row items-start'>
            <View className='w-10 h-10 bg-green-100 rounded-full items-center justify-center mr-3'>
              <Syringe size={20} color='#10B981' />
            </View>
            <View className='flex-1'>
              <Text className='text-base font-semibold text-gray-900 mb-1'>
                {selectedVaccine.name}
              </Text>
              <Text className='text-gray-600 text-sm mb-2'>
                {selectedVaccine.description}
              </Text>
              <Text className='text-green-600 text-sm'>
                Khuyến nghị: {selectedVaccine.numberOfDoses} liều
              </Text>
            </View>
          </View>
        </View>

        {/* Doses Input */}
        <View className='bg-white border border-gray-200 rounded-2xl p-4 mb-6'>
          <Text className='text-lg font-bold text-gray-900 mb-3'>
            Số liều đã tiêm
          </Text>

          <View className='mb-4'>
            <Text className='text-gray-700 mb-2'>
              Nhập số liều vaccine đã tiêm *
            </Text>
            <TextInput
              value={doses}
              onChangeText={setDoses}
              keyboardType='numeric'
              placeholder='Ví dụ: 2'
              className='border border-gray-300 rounded-xl px-4 py-3 text-base'
              style={{ fontSize: 16 }}
            />
          </View>

          <View className='bg-yellow-50 border border-yellow-200 rounded-xl p-3'>
            <View className='flex-row items-start'>
              <AlertCircle size={16} color='#F59E0B' className='mt-0.5' />
              <Text className='text-yellow-800 text-sm ml-2 flex-1'>
                Vui lòng nhập chính xác số liều vaccine đã tiêm cho con em
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Submit Button */}
      <View className='px-4 py-4 border-t border-gray-200 bg-white'>
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={isSubmitting || !doses}
          className={`p-4 rounded-xl flex-row items-center justify-center ${
            isSubmitting || !doses ? 'bg-gray-300' : 'bg-blue-500'
          }`}
        >
          {isSubmitting ? (
            <ActivityIndicator color='#fff' className='mr-2' />
          ) : (
            <CheckCircle size={20} color='#fff' className='mr-2' />
          )}
          <Text className='text-white text-lg font-semibold'>
            {isSubmitting ? 'Đang lưu...' : 'Xác nhận khai báo'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
