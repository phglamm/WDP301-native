import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  getVaccinationsService,
  declareVaccinationService,
} from '../../services/parentServices';
import {
  Syringe,
  User,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
} from 'lucide-react-native';
import StudentDeclareCard from './StudentDeclareCard';
import LoadingCustom from '../common/LoadingCustom';
import VaccineDeclareSuccess from './VaccineDeclareSuccess';

export default function VaccineDeclareForm({ selectedSon, onBack }) {
  const [vaccinations, setVaccinations] = useState([]);
  const [selectedVaccine, setSelectedVaccine] = useState(null);
  const [doses, setDoses] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState('select');

  const fetchVaccinations = async () => {
    try {
      setIsLoading(true);
      const response = await getVaccinationsService();
      if (response.data) {
        setVaccinations(response.data);
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tải danh sách vaccine');
      console.error('Error fetching vaccinations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVaccinations();
  }, []);

  const handleSelectVaccine = (vaccine) => {
    setSelectedVaccine(vaccine);
    setCurrentStep('form');
  };

  const handleSubmit = async () => {
    if (!selectedVaccine || !doses) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập đầy đủ thông tin');
      return;
    }

    const dosesNumber = parseInt(doses);
    if (0 >= dosesNumber > 2) {
      Alert.alert('Số liều không hợp lệ', 'Vui lòng nhập số liều hợp lệ');
      return;
    }

    try {
      setIsSubmitting(true);
      const vaccinationData = {
        studentId: selectedSon.id.toString(),
        vaccinationId: selectedVaccine.id.toString(),
        doses: dosesNumber,
      };

      const response = await declareVaccinationService(vaccinationData);

      if (response.code === 201) {
        setCurrentStep('success');
      } else {
        Alert.alert('Lỗi', 'Không thể khai báo tiêm chủng');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi khai báo tiêm chủng');
      console.error('Error submitting vaccination:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToSelect = () => {
    setCurrentStep('select');
  };

  const renderVaccineCard = (vaccine) => (
    <TouchableOpacity
      key={vaccine.id}
      onPress={() => handleSelectVaccine(vaccine)}
      className='bg-white border-2 border-gray-200 rounded-2xl p-4 mb-4'
    >
      <View className='flex-row items-start'>
        <View className='w-12 h-12 bg-blue-100 rounded-full items-center justify-center mr-4'>
          <Syringe size={24} color='#3B82F6' />
        </View>

        <View className='flex-1'>
          <Text className='text-lg font-bold text-gray-900 mb-2'>
            {vaccine.name}
          </Text>
          <Text className='text-gray-600 text-sm mb-3 leading-5'>
            {vaccine.description}
          </Text>

          <View className='flex-row items-center justify-between'>
            <View className='flex-row items-center'>
              <Syringe size={16} color='#6B7280' />
              <Text className='text-gray-500 text-sm ml-2'>
                {vaccine.numberOfDoses} liều khuyến nghị
              </Text>
            </View>

            <View className='flex-row items-center'>
              <Text className='text-blue-600 font-medium text-sm mr-2'>
                Chọn vaccine
              </Text>
              <ChevronRight size={16} color='#3B82F6' />
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (currentStep === 'success') {
    return (
      <VaccineDeclareSuccess
        selectedSon={selectedSon}
        selectedVaccine={selectedVaccine}
        doses={doses}
      />
    );
  }

  if (currentStep === 'form') {
    return (
      <View className='flex-1 bg-white'>
        {/* Header */}
        <View className='flex-row items-center justify-between p-4 bg-white border-b border-gray-200'>
          <TouchableOpacity onPress={handleBackToSelect} className='p-1'>
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

  // Select vaccine step
  return (
    <View className='flex-1'>
      {/* Header */}
      <View className='flex-row items-center justify-between p-4 bg-white border-b border-gray-200'>
        <TouchableOpacity onPress={onBack} className='p-1'>
          <ArrowLeft size={20} color='#407CE2' />
        </TouchableOpacity>
        <Text className='text-lg font-semibold text-gray-900'>
          Chọn vaccine
        </Text>
        <View className='w-8' />
      </View>

      {/* Student Info */}
      <StudentDeclareCard selectedSon={selectedSon} />

      {/* Content */}
      {isLoading ? (
        <LoadingCustom
          isLoading={isLoading}
          message='Đang tải danh sách vaccine...'
        />
      ) : (
        <ScrollView
          className='flex-1 px-4 pt-6'
          showsVerticalScrollIndicator={false}
        >
          <Text className='text-lg font-bold text-gray-900 mb-4'>
            Chọn loại vaccine ({vaccinations.length})
          </Text>

          {vaccinations.length === 0 ? (
            <View className='items-center py-12'>
              <Syringe size={64} color='#D1D5DB' />
              <Text className='text-gray-500 text-lg mt-4 mb-2'>
                Chưa có vaccine nào
              </Text>
              <Text className='text-gray-400 text-center'>
                Danh sách vaccine sẽ được cập nhật
              </Text>
            </View>
          ) : (
            vaccinations.map((vaccine) => renderVaccineCard(vaccine))
          )}
        </ScrollView>
      )}
    </View>
  );
}
