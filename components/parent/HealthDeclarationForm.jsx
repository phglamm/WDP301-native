import React from 'react';
import {
  Text,
  ScrollView,
  TouchableOpacity,
  View,
  TextInput,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  User,
  Scale,
  Ruler,
  Droplet,
  Eye,
  Ear,
  AlertTriangle,
  FileText,
  ArrowLeft,
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const BLOOD_TYPE_OPTIONS = ['A', 'B', 'AB', 'O'];

const HealthDeclarationForm = ({
  selectedSon,
  formData,
  setFormData,
  isSubmitting,
  onSubmit,
  onBack,
}) => {
  const handleSubmit = () => {
    // Validation
    if (!formData.weight || parseFloat(formData.weight) <= 0) {
      Alert.alert('Thông báo', 'Vui lòng nhập cân nặng hợp lệ');
      return;
    }
    if (!formData.height || parseFloat(formData.height) <= 0) {
      Alert.alert('Thông báo', 'Vui lòng nhập chiều cao hợp lệ');
      return;
    }
    if (!formData.bloodType) {
      Alert.alert('Thông báo', 'Vui lòng chọn nhóm máu');
      return;
    }
    if (
      !formData.vision ||
      parseFloat(formData.vision) < 0 ||
      parseFloat(formData.vision) > 10
    ) {
      Alert.alert('Thông báo', 'Vui lòng nhập thị lực từ 0-10');
      return;
    }
    if (
      !formData.hearing ||
      parseFloat(formData.hearing) < 0 ||
      parseFloat(formData.hearing) > 10
    ) {
      Alert.alert('Thông báo', 'Vui lòng nhập thính giác từ 0-10');
      return;
    }

    onSubmit();
  };

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className='flex-1'
      >
        <View className='flex-1'>
          {/* Header */}
          <View className='flex-row justify-between items-center p-4 bg-white border-b border-gray-200'>
            <TouchableOpacity onPress={onBack} className='p-1'>
              <ArrowLeft size={20} color='#407CE2' />
            </TouchableOpacity>
            <Text className='text-lg font-semibold text-gray-900'>
              Khai báo hồ sơ
            </Text>
            <View className='w-8' />
          </View>

          {/* Profile */}
          <View className='px-6 py-4 bg-white border-b border-gray-100'>
            <View className='flex-row gap-8 items-start'>
              <View
                className={`justify-center items-center w-12 h-12 bg-blue-500 rounded-full`}
              >
                <User size={24} color={'#fff'} />
              </View>
              <View className='flex-1 justify-start items-start'>
                <Text
                  className={`text-blue-800 font-montserratSemiBold`}
                  numberOfLines={1}
                >
                  {selectedSon.fullName || 'Học sinh'}
                </Text>

                <Text className='text-sm text-gray-500 font-montserratSemiBold'>
                  MSSV: {selectedSon.studentCode || 'Mã HS'}
                </Text>
              </View>
            </View>
          </View>

          {/* Form */}
          <ScrollView className='flex-1 px-6'>
            <Text className='py-6 mb-2 text-2xl text-center font-montserratSemiBold'>
              📝 Khai báo hồ sơ
            </Text>
            {/* Cân nặng */}
            <View className='mb-6'>
              <Text className='mb-3 text-lg font-semibold text-gray-800'>
                <Scale size={18} color='#3B82F6' /> Cân nặng (kg) *
              </Text>
              <TextInput
                className='px-4 py-3 text-base rounded-xl border border-gray-300'
                placeholder='Ví dụ: 60'
                value={formData.weight}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, weight: text }))
                }
                keyboardType='numeric'
                placeholderTextColor='#9CA3AF'
              />
            </View>

            {/* Chiều cao */}
            <View className='mb-6'>
              <Text className='mb-3 text-lg font-semibold text-gray-800'>
                <Ruler size={18} color='#10B981' /> Chiều cao (cm) *
              </Text>
              <TextInput
                className='px-4 py-3 text-base rounded-xl border border-gray-300'
                placeholder='Ví dụ: 160'
                value={formData.height}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, height: text }))
                }
                keyboardType='numeric'
                placeholderTextColor='#9CA3AF'
              />
            </View>

            {/* Nhóm máu */}
            <View className='mb-6'>
              <Text className='mb-3 text-lg font-semibold text-gray-800'>
                <Droplet size={18} color='#EF4444' /> Nhóm máu *
              </Text>
              <View className='flex-row flex-wrap'>
                {BLOOD_TYPE_OPTIONS.map((type) => {
                  const isSelected = formData.bloodType === type;

                  return (
                    <TouchableOpacity
                      key={type}
                      onPress={() =>
                        setFormData((prev) => ({ ...prev, bloodType: type }))
                      }
                      className={`mr-3 mb-3 px-6 py-3 rounded-xl border-2 ${
                        isSelected
                          ? 'bg-red-100 border-red-500'
                          : 'bg-gray-100 border-gray-300'
                      }`}
                    >
                      <Text
                        className={`font-medium text-center min-w-8 ${
                          isSelected ? 'text-red-600' : 'text-gray-600'
                        }`}
                      >
                        {type}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Thị lực */}
            <View className='mb-6'>
              <Text className='mb-3 text-lg font-semibold text-gray-800'>
                <Eye size={18} color='#8B5CF6' /> Thị lực (0-10) *
              </Text>
              <TextInput
                className='px-4 py-3 text-base rounded-xl border border-gray-300'
                placeholder='Ví dụ: 10 (10 = tốt nhất)'
                value={formData.vision}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, vision: text }))
                }
                keyboardType='numeric'
                placeholderTextColor='#9CA3AF'
              />
              <Text className='mt-2 text-sm text-gray-500'>
                Thang điểm từ 0 (kém nhất) đến 10 (tốt nhất)
              </Text>
            </View>

            {/* Thính giác */}
            <View className='mb-6'>
              <Text className='mb-3 text-lg font-semibold text-gray-800'>
                <Ear size={18} color='#F59E0B' /> Thính giác (0-10) *
              </Text>
              <TextInput
                className='px-4 py-3 text-base rounded-xl border border-gray-300'
                placeholder='Ví dụ: 10 (10 = tốt nhất)'
                value={formData.hearing}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, hearing: text }))
                }
                keyboardType='numeric'
                placeholderTextColor='#9CA3AF'
              />
              <Text className='mt-2 text-sm text-gray-500'>
                Thang điểm từ 0 (kém nhất) đến 10 (tốt nhất)
              </Text>
            </View>

            {/* Dị ứng */}
            <View className='mb-6'>
              <Text className='mb-3 text-lg font-bold text-gray-800'>
                <AlertTriangle size={18} color='#EF4444' /> Dị ứng (nếu có)
              </Text>
              <TextInput
                className='px-4 py-3 text-base rounded-xl border border-gray-300'
                placeholder='Ví dụ: Hải sản, phấn hoa, thuốc...'
                value={formData.allergies}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, allergies: text }))
                }
                placeholderTextColor='#9CA3AF'
              />
            </View>

            {/* Ghi chú */}
            <View className='mb-6'>
              <Text className='mb-3 text-lg font-bold text-gray-800'>
                <FileText size={18} color='#6B7280' /> Ghi chú thêm
              </Text>
              <TextInput
                className='px-4 py-3 text-base rounded-xl border border-gray-300'
                placeholder='Thông tin bổ sung về tình trạng sức khỏe...'
                value={formData.note}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, note: text }))
                }
                multiline
                numberOfLines={4}
                textAlignVertical='top'
                placeholderTextColor='#9CA3AF'
              />
            </View>

            {/* BMI Calculator */}
            {formData.weight && formData.height && (
              <View className='p-4 mb-6 bg-blue-50 rounded-2xl border border-blue-200'>
                <Text className='mb-2 font-bold text-blue-800'>Chỉ số BMI</Text>
                {(() => {
                  const weight = parseFloat(formData.weight);
                  const height = parseFloat(formData.height) / 100; // convert to meters
                  const bmi = weight / (height * height);
                  const bmiRounded = Math.round(bmi * 10) / 10;

                  let bmiStatus = '';
                  let bmiColor = '';

                  if (bmi < 18.5) {
                    bmiStatus = 'Thiếu cân';
                    bmiColor = 'text-yellow-600';
                  } else if (bmi < 25) {
                    bmiStatus = 'Bình thường';
                    bmiColor = 'text-green-600';
                  } else if (bmi < 30) {
                    bmiStatus = 'Thừa cân';
                    bmiColor = 'text-orange-600';
                  } else {
                    bmiStatus = 'Béo phì';
                    bmiColor = 'text-red-600';
                  }

                  return (
                    <View>
                      <Text className='text-lg font-bold text-blue-600'>
                        {bmiRounded}
                      </Text>
                      <Text className={`font-medium ${bmiColor}`}>
                        {bmiStatus}
                      </Text>
                    </View>
                  );
                })()}
              </View>
            )}

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={isSubmitting}
              className={`py-4 rounded-2xl mb-6 ${
                isSubmitting ? 'bg-gray-400' : 'bg-blue-500'
              }`}
            >
              {isSubmitting ? (
                <ActivityIndicator color='white' />
              ) : (
                <Text className='text-lg font-bold text-center text-white'>
                  Lưu hồ sơ sức khỏe
                </Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default HealthDeclarationForm;
