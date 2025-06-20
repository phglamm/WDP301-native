import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import {
  getVaccinationsService,
  declareVaccinationService,
  getVaccineHadDeclaredService,
} from '../../services/parentServices';
import {
  Syringe,
  User,
  ChevronRight,
  CheckCircle,
  AlertCircle,
} from 'lucide-react-native';
import StudentDeclareCard from './StudentDeclareCard';
import LoadingCustom from '../common/LoadingCustom';
import VaccineDeclareSuccess from './VaccineDeclareSuccess';
import ParentHeaderSub from '../layouts/ParentHeaderSub';
import { useFocusEffect } from 'expo-router';

export default function VaccineDeclareForm({ selectedSon, onBack }) {
  const [vaccinations, setVaccinations] = useState([]);
  const [vaccineHadDeclared, setVaccineHadDeclared] = useState([]);
  const [selectedVaccine, setSelectedVaccine] = useState(null);
  const [doses, setDoses] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState('select');
  const [refetch, setRefetch] = useState(false);

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

  const fetchVaccineHadDeclared = async () => {
    try {
      const response = await getVaccineHadDeclaredService(selectedSon.id);
      if (response.data) {
        setVaccineHadDeclared(response.data);
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tải danh sách vaccine đã khai báo');
      console.error('Error fetching vaccine had declared:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchVaccinations();
      fetchVaccineHadDeclared();
    }, [])
  );

  const handleSelectVaccine = (vaccine) => {
    setSelectedVaccine(vaccine);
    setCurrentStep('form');
  };

  const handleBackToSelect = () => {
    setSelectedVaccine(null);
    setDoses('');
    setCurrentStep('select');
  };

  const handleRefresh = () => {
    setRefetch(true);
    fetchVaccinations();
    fetchVaccineHadDeclared();
    setRefetch(false);
  };

  // Xử lý khai báo vaccine
  const handleSubmit = async () => {
    if (!selectedVaccine || !doses) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập đầy đủ thông tin');
      return;
    }

    const dosesNumber = parseInt(doses);
    if (dosesNumber < 0 || dosesNumber > selectedVaccine.numberOfDoses) {
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
        fetchVaccineHadDeclared();
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

  // Thêm function kiểm tra vaccine đã được khai báo chưa
  const isVaccineDeclared = (vaccineId) => {
    return vaccineHadDeclared.some(
      (declared) => declared.vaccination.id === vaccineId
    );
  };

  // Lấy thông tin vaccine đã khai báo
  const getDeclaredVaccineInfo = (vaccineId) => {
    return vaccineHadDeclared.find(
      (declared) => declared.vaccination.id === vaccineId
    );
  };

  const renderVaccineCard = (vaccine) => {
    const isDeclared = isVaccineDeclared(vaccine.id);
    const declaredInfo = getDeclaredVaccineInfo(vaccine.id);

    return (
      <TouchableOpacity
        key={vaccine.id}
        onPress={() => (isDeclared ? null : handleSelectVaccine(vaccine))}
        disabled={isDeclared}
        className={`p-4 mb-4 border-2 rounded-2xl ${
          isDeclared
            ? 'bg-gray-100 border-gray-300 opacity-60'
            : 'bg-white border-gray-200'
        }`}
      >
        <View className='flex-row items-start'>
          <View
            className={`items-center justify-center w-12 h-12 mr-4 rounded-full ${
              isDeclared ? 'bg-gray-200' : 'bg-blue-100'
            }`}
          >
            {isDeclared ? (
              <CheckCircle size={24} color='#10B981' />
            ) : (
              <Syringe size={24} color='#3B82F6' />
            )}
          </View>

          <View className='flex-1'>
            <View className='flex-row justify-between items-center mb-2'>
              <Text
                className={`text-lg font-bold ${
                  isDeclared ? 'text-gray-500' : 'text-gray-900'
                }`}
              >
                {vaccine.name}
              </Text>
              {isDeclared && (
                <View className='px-2 py-1 bg-green-100 rounded-full'>
                  <Text className='text-xs font-medium text-green-800'>
                    Đã khai báo
                  </Text>
                </View>
              )}
            </View>

            <Text
              className={`mb-3 text-sm leading-5 ${
                isDeclared ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              {vaccine.description}
            </Text>

            <View className='flex-row justify-between items-center'>
              <View className='flex-row items-center'>
                <Syringe size={16} color={isDeclared ? '#9CA3AF' : '#6B7280'} />
                <Text
                  className={`ml-2 text-sm ${
                    isDeclared ? 'text-gray-400' : 'text-gray-500'
                  }`}
                >
                  {vaccine.numberOfDoses} liều khuyến nghị
                </Text>
              </View>

              {isDeclared ? (
                <View className='flex-row items-center'>
                  <Text className='mr-2 text-sm font-medium text-green-600'>
                    {declaredInfo.doses} liều đã tiêm
                  </Text>
                  <CheckCircle size={16} color='#10B981' />
                </View>
              ) : (
                <View className='flex-row items-center'>
                  <Text className='mr-2 text-sm font-medium text-blue-600'>
                    Chọn vaccine
                  </Text>
                  <ChevronRight size={16} color='#3B82F6' />
                </View>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (currentStep === 'success') {
    return (
      <VaccineDeclareSuccess
        selectedSon={selectedSon}
        selectedVaccine={selectedVaccine}
        doses={doses}
        handleBackToHome={handleBackToSelect}
      />
    );
  }

  if (currentStep === 'form') {
    return (
      <View className='flex-1 bg-white'>
        {/* Header */}
        <ParentHeaderSub onBack={handleBackToSelect} title='Chọn vaccine' />
        <ScrollView className='flex-1 p-4'>
          {/* Student Info */}
          <View className='p-4 mb-6 bg-blue-50 rounded-2xl'>
            <View className='flex-row items-center'>
              <View className='justify-center items-center mr-3 w-12 h-12 bg-blue-500 rounded-full'>
                <User size={24} color='#fff' />
              </View>
              <View className='flex-1'>
                <Text className='text-sm text-blue-600'>Học sinh</Text>
                <Text className='text-lg font-bold text-blue-900'>
                  {selectedSon.fullName}
                </Text>
                <Text className='text-sm text-blue-700'>
                  {selectedSon.studentCode}
                </Text>
              </View>
            </View>
          </View>

          {/* Selected Vaccine */}
          <View className='p-4 mb-6 bg-white rounded-2xl border border-gray-200'>
            <Text className='mb-3 text-lg font-bold text-gray-900'>
              Vaccine được chọn
            </Text>

            <View className='flex-row items-start'>
              <View className='justify-center items-center mr-3 w-10 h-10 bg-green-100 rounded-full'>
                <Syringe size={20} color='#10B981' />
              </View>
              <View className='flex-1'>
                <Text className='mb-1 text-base font-semibold text-gray-900'>
                  {selectedVaccine.name}
                </Text>
                <Text className='mb-2 text-sm text-gray-600'>
                  {selectedVaccine.description}
                </Text>
                <Text className='text-sm text-green-600'>
                  Khuyến nghị: {selectedVaccine.numberOfDoses} liều
                </Text>
              </View>
            </View>
          </View>

          {/* Doses Input */}
          <View className='p-4 mb-6 bg-white rounded-2xl border border-gray-200'>
            <Text className='mb-3 text-lg font-bold text-gray-900'>
              Số liều đã tiêm
            </Text>

            <View className='mb-4'>
              <Text className='mb-2 text-gray-700'>
                Nhập số liều vaccine đã tiêm *
              </Text>
              <TextInput
                value={doses}
                onChangeText={setDoses}
                keyboardType='numeric'
                placeholder='Ví dụ: 1'
                className='px-4 py-3 text-base rounded-xl border border-gray-300'
                style={{ fontSize: 16 }}
              />
            </View>

            <View className='p-3 bg-yellow-50 rounded-xl border border-yellow-200'>
              <View className='flex-row items-start'>
                <AlertCircle size={16} color='#F59E0B' className='mt-0.5' />
                <Text className='flex-1 ml-2 text-sm text-yellow-800'>
                  Vui lòng nhập chính xác số liều vaccine đã tiêm cho con em
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Submit Button */}
        <View className='px-4 py-4 bg-white border-t border-gray-200'>
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
            <Text className='text-lg font-semibold text-white'>
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
      <ParentHeaderSub onBack={onBack} title='Chọn vaccine' />

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
          refreshControl={
            <RefreshControl refreshing={refetch} onRefresh={handleRefresh} />
          }
        >
          <View className='mb-4'>
            <Text className='text-lg font-bold text-gray-900'>
              Danh sách vaccine đã khai báo
            </Text>
            <View className='flex-row items-center mt-1'>
              <Text className='text-sm text-gray-600'>
                • {vaccinations.filter((v) => !isVaccineDeclared(v.id)).length}{' '}
                chưa khai báo
              </Text>
              {vaccineHadDeclared.length > 0 && (
                <Text className='p-2 ml-2 text-sm text-green-600 bg-green-50 rounded-lg'>
                  • {vaccineHadDeclared.length} đã khai báo
                </Text>
              )}
            </View>
          </View>

          {vaccinations.length === 0 ? (
            <View className='items-center py-12'>
              <Syringe size={64} color='#D1D5DB' />
              <Text className='mt-4 mb-2 text-lg text-gray-500'>
                Chưa có vaccine nào
              </Text>
              <Text className='text-center text-gray-400'>
                Danh sách vaccine sẽ được cập nhật
              </Text>
            </View>
          ) : vaccinations.filter((v) => !isVaccineDeclared(v.id)).length ===
            0 ? (
            <View className='flex-1'>
              <View className='items-center py-8 mb-6 bg-green-50 rounded-2xl'>
                <CheckCircle size={48} color='#10B981' />
                <Text className='mt-4 mb-2 text-xl font-bold text-green-700'>
                  Hoàn thành khai báo
                </Text>
                <Text className='px-4 text-center text-green-600'>
                  {selectedSon.fullName} đã khai báo tất cả vaccine có sẵn
                </Text>
              </View>

              <Text className='mb-4 text-lg font-bold text-gray-900'>
                Danh sách vaccine đã khai báo
              </Text>

              <View className='gap-2 space-y-4'>
                {vaccineHadDeclared.map((declared) => (
                  <View
                    key={declared.id}
                    className='p-4 bg-white rounded-2xl border-2 border-green-300'
                  >
                    <View className='flex-row items-start'>
                      <View className='justify-center items-center mr-4 w-12 h-12 bg-green-100 rounded-full'>
                        <CheckCircle size={24} color='#10B981' />
                      </View>

                      <View className='flex-1'>
                        <View className='flex-row justify-between items-center mb-2'>
                          <Text className='text-lg font-bold text-gray-900'>
                            {declared.vaccination.name}
                          </Text>
                          <View className='px-2 py-1 bg-green-100 rounded-full'>
                            <Text className='text-xs font-medium text-green-800'>
                              Đã khai báo
                            </Text>
                          </View>
                        </View>

                        <Text className='mb-3 text-sm leading-5 text-gray-600'>
                          {declared.vaccination.description}
                        </Text>

                        <View className='flex-row justify-between items-center'>
                          <View className='flex-row items-center'>
                            <Syringe size={16} color='#6B7280' />
                            <Text className='ml-2 text-sm text-gray-500'>
                              {declared.vaccination.numberOfDoses} liều khuyến
                              nghị
                            </Text>
                          </View>

                          <View className='flex-row items-center'>
                            <Text className='mr-2 text-sm font-medium text-green-600'>
                              {declared.doses} liều đã tiêm
                            </Text>
                            <CheckCircle size={16} color='#10B981' />
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          ) : (
            vaccinations.map((vaccine) => renderVaccineCard(vaccine))
          )}
        </ScrollView>
      )}
    </View>
  );
}
