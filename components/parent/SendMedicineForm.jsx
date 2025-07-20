import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
  Modal,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import PlaceholderImage from '../../assets/images/icon.png';
import ImageViewer from '../common/ImageViewer';
import * as ImagePicker from 'expo-image-picker';
import {
  getMySonService,
  sendMedicineRequestImageService,
  sendMedicineRequestService,
} from '../../services/parentServices';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, ChevronDown, Plus, Trash2 } from 'lucide-react-native';

export default function SendMedicineForm({ onClose }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(undefined);
  const [mySons, setMySons] = useState([]);
  const [studentId, setStudentId] = useState('');
  const [note, setNote] = useState('');
  const [slots, setSlots] = useState([
    {
      session: 'Sáng',
      medicines: [{ name: '', description: '', quantity: 1 }],
    },
    {
      session: 'Trưa',
      medicines: [{ name: '', description: '', quantity: 1 }],
    },
    {
      session: 'Chiều',
      medicines: [{ name: '', description: '', quantity: 1 }],
    },
  ]);

  // Dropdown state
  const [showStudentDropdown, setShowStudentDropdown] = useState(false);

  // Thêm state để lưu response data
  const [medicineResponse, setMedicineResponse] = useState(null);

  // Lấy danh sách học sinh
  useEffect(() => {
    const fetchSon = async () => {
      try {
        const res = await getMySonService();
        if (res.data && res.data.length > 0) {
          setMySons(res.data);
        } else {
          Alert.alert('Lỗi', 'Không thể tải danh sách học sinh.');
        }
      } catch (error) {
        console.error('Error fetching sons:', error);
        Alert.alert('Lỗi', 'Không thể tải danh sách học sinh.');
      }
    };
    fetchSon();
  }, []);

  // Generate AI
  const generateWithAI = async () => {
    if (!selectedImage) {
      Alert.alert('Lỗi', 'Vui lòng chọn ảnh trước khi sử dụng AI.');
      return;
    }

    setIsAiLoading(true);
    try {
      const res = await sendMedicineRequestImageService(selectedImage);
      console.log('🚀 ~ generateWithAI ~ res:', res);

      if (res.code === 201 && res.data) {
        // Cập nhật imageUrl từ response
        if (res.data.imageUrl) {
          setSelectedImage(res.data.imageUrl);
        }

        // Fill slots từ AI response
        if (res.data.slots && res.data.slots.length > 0) {
          const newSlots = ['Sáng', 'Trưa', 'Chiều'].map((session) => {
            const aiSlot = res.data.slots.find(
              (slot) => slot.session === session
            );
            return (
              aiSlot || {
                session,
                medicines: [{ name: '', description: '', quantity: 1 }],
              }
            );
          });

          setSlots(newSlots);
          setMedicineResponse(res.data);
          Alert.alert(
            'Thành công! 🎉',
            'AI đã phân tích ảnh và fill dữ liệu vào form.'
          );
        } else {
          Alert.alert(
            'Thông báo',
            'AI không thể phân tích ảnh này. Vui lòng nhập thông tin thủ công.'
          );
        }
      } else {
        Alert.alert(
          'Thông báo',
          'AI không thể phân tích ảnh này. Vui lòng nhập thông tin thủ công.'
        );
      }
    } catch (error) {
      console.error('Error generating with AI:', error);
      Alert.alert(
        'Lỗi AI',
        'Không thể phân tích ảnh. Vui lòng nhập thông tin thủ công.'
      );
    } finally {
      setIsAiLoading(false);
    }
  };

  // Chọn ảnh từ thư viện
  const pickImageAsync = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets?.length > 0) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi chọn ảnh.');
    }
  };

  // Chụp ảnh từ camera
  const takeCameraPhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Lỗi', 'Cần quyền truy cập camera để chụp ảnh.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets?.length > 0) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi chụp ảnh.');
    }
  };

  // Hiển thị các tùy chọn ảnh
  const handleShowImageOptions = () => {
    Alert.alert('Chọn ảnh', 'Bạn muốn chọn ảnh từ đâu?', [
      { text: 'Camera', onPress: takeCameraPhoto },
      { text: 'Thư viện', onPress: pickImageAsync },
      { text: 'Hủy', style: 'cancel' },
    ]);
  };

  // Thêm medicine vào slot
  const handleAddMedicine = (slotIndex) => {
    const newSlots = [...slots];
    newSlots[slotIndex].medicines.push({
      name: '',
      description: '',
      quantity: 1,
    });
    setSlots(newSlots);
  };

  // Xóa medicine khỏi slot
  const handleRemoveMedicine = (slotIndex, medicineIndex) => {
    const newSlots = [...slots];
    if (newSlots[slotIndex].medicines.length > 1) {
      newSlots[slotIndex].medicines.splice(medicineIndex, 1);
      setSlots(newSlots);
    } else {
      Alert.alert('Thông báo', 'Mỗi buổi phải có ít nhất 1 loại thuốc!');
    }
  };

  // Cập nhật thông tin medicine
  const handleUpdateMedicine = (slotIndex, medicineIndex, field, value) => {
    const newSlots = [...slots];
    newSlots[slotIndex].medicines[medicineIndex][field] = value;
    setSlots(newSlots);
  };

  // Validate form
  const validateForm = () => {
    if (!selectedImage) return 'Vui lòng chọn ảnh.';
    if (mySons.length > 0 && !studentId) return 'Vui lòng chọn học sinh.';

    // Kiểm tra có ít nhất một loại thuốc được nhập
    const hasAnyMedicine = slots.some((slot) =>
      slot.medicines.some((medicine) => medicine.name.trim())
    );

    if (!hasAnyMedicine) {
      return 'Vui lòng nhập ít nhất một loại thuốc.';
    }

    // Validate thuốc đã nhập phải có đầy đủ thông tin
    for (const slot of slots) {
      for (const medicine of slot.medicines) {
        if (medicine.name.trim()) {
          // Chỉ validate nếu đã nhập tên thuốc
          if (!medicine.quantity || medicine.quantity < 1) {
            return `Vui lòng nhập số lượng hợp lệ cho thuốc ${medicine.name}`;
          }
        }
      }
    }

    return null;
  };

  // Gửi yêu cầu thuốc
  const handleSubmit = async () => {
    const validationError = validateForm();
    if (validationError) {
      Alert.alert('Lỗi', validationError);
      return;
    }

    setIsLoading(true);
    try {
      // Chỉ gửi slots có thuốc
      const filledSlots = slots
        .map((slot) => ({
          session: slot.session,
          medicines: slot.medicines
            .filter((medicine) => medicine.name.trim())
            .map((medicine) => ({
              name: medicine.name.trim(),
              description: medicine.description || '',
              quantity: parseInt(medicine.quantity),
            })),
        }))
        .filter((slot) => slot.medicines.length > 0);

      const requestData = {
        studentId: String(studentId),
        note: note || '',
        imageUrl: medicineResponse?.imageUrl || selectedImage,
        slots: filledSlots,
      };

      console.log('🚀 ~ handleSubmit ~ requestData:', requestData);
      const res = await sendMedicineRequestService(requestData);
      console.log('🚀 ~ handleSubmit ~ res:', res);
      Alert.alert('Thành công', 'Gửi yêu cầu thuốc thành công!', [
        {
          text: 'OK',
          onPress: () => {
            handleReset();
            onClose?.();
          },
        },
      ]);
    } catch (error) {
      Alert.alert('Lỗi', error?.message || 'Có lỗi xảy ra khi gửi yêu cầu.');
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form
  const handleReset = () => {
    setSelectedImage(undefined);
    setStudentId('');
    setNote('');
    setMedicineResponse(null);
    setSlots(
      ['Sáng', 'Trưa', 'Chiều'].map((session) => ({
        session,
        medicines: [{ name: '', description: '', quantity: 1 }],
      }))
    );
  };

  // Lấy tên học sinh được chọn
  const getSelectedStudentName = () => {
    const student = mySons.find((son) => son.id === studentId);
    return student ? student.fullName : 'Chọn học sinh';
  };

  return (
    <SafeAreaView className='flex-1 bg-white dark:bg-gray-900'>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className='flex-1'
      >
        {/* Header */}
        <View className='flex-row justify-between items-center p-4 bg-white border-b border-gray-200'>
          {onClose && (
            <TouchableOpacity onPress={onClose} className='p-1'>
              <ArrowLeft size={20} color='#407CE2' />
            </TouchableOpacity>
          )}
          <Text className='text-lg font-semibold text-gray-900'>
            Tạo yêu cầu gửi thuốc
          </Text>
          <View className='w-8' />
        </View>

        {/* Content */}
        <ScrollView className='flex-1 px-4'>
          {/* Image Selection */}
          <View className='items-center mb-8'>
            <View className='p-4 bg-white rounded-xl border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-700'>
              <ImageViewer
                imgSource={PlaceholderImage}
                selectedImage={selectedImage}
              />
            </View>

            <TouchableOpacity
              onPress={handleShowImageOptions}
              className={`px-6 py-4 mt-4 w-full rounded-xl shadow-lg ${
                isLoading || isAiLoading
                  ? 'bg-gray-400'
                  : 'bg-blue-500 active:bg-blue-600'
              }`}
              disabled={isLoading || isAiLoading}
              accessibilityLabel={
                selectedImage ? 'Thay đổi ảnh đã chọn' : 'Chọn ảnh cho yêu cầu'
              }
              accessibilityRole='button'
            >
              <Text className='text-lg font-semibold text-center text-white'>
                {selectedImage ? '📂 Thay đổi ảnh' : '📂 Tải hoá đơn thuốc'}
              </Text>
            </TouchableOpacity>

            {/* AI Generate Button */}
            {selectedImage && (
              <TouchableOpacity
                onPress={generateWithAI}
                className={`px-6 py-4 mt-3 w-full rounded-xl shadow-lg ${
                  isAiLoading || isLoading
                    ? 'bg-gray-400'
                    : medicineResponse
                    ? 'bg-orange-500 active:bg-orange-600'
                    : 'bg-green-500 active:bg-green-600'
                }`}
                disabled={isLoading || isAiLoading}
                accessibilityLabel='Phân tích ảnh bằng AI'
                accessibilityRole='button'
              >
                {isAiLoading ? (
                  <View className='flex-row justify-center items-center'>
                    <ActivityIndicator size='small' color='white' />
                    <Text className='ml-2 text-lg font-semibold text-white'>
                      AI đang phân tích...
                    </Text>
                  </View>
                ) : (
                  <Text className='text-lg font-semibold text-center text-white'>
                    {medicineResponse
                      ? '🔄 Phân tích lại bằng AI'
                      : '🤖 Phân tích bằng AI'}
                  </Text>
                )}
              </TouchableOpacity>
            )}
          </View>

          {/* Student Selection */}
          <View className='mb-8'>
            <Text className='mb-3 text-lg font-semibold text-gray-700 dark:text-gray-300'>
              Gửi cho *
            </Text>
            {mySons.length > 0 ? (
              <View className='relative'>
                <TouchableOpacity
                  onPress={() => setShowStudentDropdown(!showStudentDropdown)}
                  className='flex-row justify-between items-center p-4 bg-white rounded-xl border border-gray-200 shadow-sm dark:bg-gray-800 dark:border-gray-700'
                  accessibilityLabel='Chọn học sinh'
                  accessibilityRole='button'
                >
                  <Text
                    className={`text-base ${
                      studentId
                        ? 'text-gray-800 dark:text-gray-200'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {getSelectedStudentName()}
                  </Text>
                  <ChevronDown size={20} color='#6B7280' />
                </TouchableOpacity>

                {/* Dropdown Modal */}
                <Modal
                  visible={showStudentDropdown}
                  transparent={true}
                  animationType='fade'
                  onRequestClose={() => setShowStudentDropdown(false)}
                >
                  <TouchableOpacity
                    style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}
                    onPress={() => setShowStudentDropdown(false)}
                    activeOpacity={1}
                  >
                    <View className='flex-1 justify-center items-center px-4'>
                      <View className='w-full max-w-sm bg-white rounded-xl shadow-lg dark:bg-gray-800'>
                        <View className='p-4 border-b border-gray-200 dark:border-gray-700'>
                          <Text className='text-md text-center text-gray-900 dark:text-white'>
                            Chọn học sinh
                          </Text>
                        </View>
                        <ScrollView className='max-h-60'>
                          {mySons.map((son, index) => (
                            <TouchableOpacity
                              key={son.id}
                              onPress={() => {
                                setStudentId(son.id);
                                setShowStudentDropdown(false);
                              }}
                              className={`p-4 ${
                                studentId === son.id
                                  ? 'bg-blue-50 dark:bg-blue-900'
                                  : 'bg-white dark:bg-gray-800'
                              } ${
                                index < mySons.length - 1
                                  ? 'border-b border-gray-100 dark:border-gray-700'
                                  : ''
                              }`}
                            >
                              <Text
                                className={`text-lg font-semibold text-center ${
                                  studentId === son.id
                                    ? 'text-blue-600 dark:text-blue-300'
                                    : 'text-gray-800 dark:text-gray-200'
                                }`}
                              >
                                {son.fullName}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </ScrollView>
                      </View>
                    </View>
                  </TouchableOpacity>
                </Modal>
              </View>
            ) : (
              <View className='p-6 bg-white rounded-xl border border-gray-200 shadow-sm dark:bg-gray-800 dark:border-gray-700'>
                <Text className='text-base text-center text-gray-500 dark:text-gray-400'>
                  Không có thông tin học sinh để chọn.
                </Text>
              </View>
            )}
          </View>

          {/* Medicine Slots */}
          <View className='mb-8'>
            <View className='flex-row justify-between items-center mb-2'>
              <Text className='text-lg font-semibold text-gray-700 dark:text-gray-300'>
                Lịch uống thuốc *
              </Text>
              {medicineResponse && (
                <View className='px-3 py-1 bg-green-100 rounded-full dark:bg-green-900'>
                  <Text className='text-xs font-medium text-green-700 dark:text-green-300'>
                    🤖 Tạo bởi AI
                  </Text>
                </View>
              )}
            </View>

            {slots.map((slot, slotIndex) => (
              <View key={slotIndex} className='mb-6'>
                {/* Session Header */}
                <View className='flex-row items-center mb-3'>
                  <View className='px-4 py-2 bg-blue-500 rounded-lg'>
                    <Text className='text-md font-semibold text-white'>
                      {slot.session}
                    </Text>
                  </View>
                  <View className='flex-1 ml-3 h-px bg-gray-300 dark:bg-gray-700' />
                </View>

                {/* Medicines List */}
                <View className='gap-2'>
                  {slot.medicines.map((medicine, medicineIndex) => (
                    <View
                      key={medicineIndex}
                      className='p-4 bg-white rounded-2xl border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-700'
                    >
                      {/* Medicine Header */}
                      <View className='flex-row justify-between items-center'>
                        <Text className='text-sm font-medium text-gray-600 dark:text-gray-400'>
                          Thuốc {medicineIndex + 1}
                        </Text>
                        {slot.medicines.length > 1 && (
                          <TouchableOpacity
                            onPress={() =>
                              handleRemoveMedicine(slotIndex, medicineIndex)
                            }
                            className='justify-center items-center w-8 h-8 bg-red-50 rounded-full dark:bg-red-900'
                            disabled={isLoading}
                          >
                            <Trash2 size={14} color='#EF4444' />
                          </TouchableOpacity>
                        )}
                      </View>

                      {/* Medicine Form */}
                      <View className='gap-1'>
                        {/* Medicine Name */}
                        <View>
                          <TextInput
                            value={medicine.name}
                            onChangeText={(value) =>
                              handleUpdateMedicine(
                                slotIndex,
                                medicineIndex,
                                'name',
                                value
                              )
                            }
                            placeholder='Tên thuốc *'
                            placeholderTextColor='#9CA3AF'
                            className='p-3 text-sm text-gray-800 bg-gray-50 rounded-xl border-0 dark:bg-gray-700 dark:text-white'
                            editable={!isLoading}
                          />
                        </View>
                        {/* Medicine Description & Quantity Row */}
                        <View className='flex-row gap-3'>
                          <View className='flex-1'>
                            <Text className='text-sm font-medium text-gray-600 dark:text-gray-400'>
                              Mô tả
                            </Text>
                            <TextInput
                              value={medicine.description}
                              onChangeText={(value) =>
                                handleUpdateMedicine(
                                  slotIndex,
                                  medicineIndex,
                                  'description',
                                  value
                                )
                              }
                              placeholder='Mô tả '
                              placeholderTextColor='#9CA3AF'
                              className='p-3 text-sm text-gray-800 bg-gray-50 rounded-xl border-0 dark:bg-gray-700 dark:text-white'
                              editable={!isLoading}
                            />
                          </View>
                          <View className='w-24'>
                            <Text className='text-sm font-medium text-gray-600 dark:text-gray-400'>
                              Số lượng *
                            </Text>
                            <TextInput
                              value={medicine.quantity.toString()}
                              onChangeText={(value) =>
                                handleUpdateMedicine(
                                  slotIndex,
                                  medicineIndex,
                                  'quantity',
                                  value
                                )
                              }
                              placeholderTextColor='#9CA3AF'
                              keyboardType='numeric'
                              className='p-3 text-sm text-center text-gray-800 bg-gray-50 rounded-xl border-0 dark:bg-gray-700 dark:text-white'
                              editable={!isLoading}
                            />
                          </View>
                        </View>
                      </View>
                    </View>
                  ))}

                  {/* Add Medicine Button */}
                  <TouchableOpacity
                    onPress={() => handleAddMedicine(slotIndex)}
                    className='flex-row justify-center items-center p-3 bg-green-50 rounded-2xl border-2 border-green-200 border-dashed dark:bg-green-900 dark:border-green-700'
                    disabled={isLoading}
                  >
                    <Plus size={18} color='#10B981' />
                    <Text className='ml-2 text-sm font-medium text-green-600 dark:text-green-400'>
                      Thêm thuốc cho buổi {slot.session}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>

          {/* Note Input */}
          <View className='mb-8'>
            <Text className='mb-3 text-lg font-semibold text-gray-700 dark:text-gray-300'>
              Ghi chú (tùy chọn)
            </Text>
            <View className='bg-white rounded-xl border border-gray-200 shadow-sm dark:bg-gray-800 dark:border-gray-700'>
              <TextInput
                value={note}
                onChangeText={setNote}
                placeholder='Nhập ghi chú cho yêu cầu thuốc'
                placeholderTextColor='#9CA3AF'
                multiline
                numberOfLines={4}
                className='p-4 h-24 text-gray-800 dark:text-white'
                textAlignVertical='top'
                editable={!isLoading}
                accessibilityLabel='Ghi chú cho yêu cầu thuốc'
              />
            </View>
          </View>

          {/* Action Buttons */}
          <View className='pb-5 flex-row justify-between items-center gap-2'>
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={isLoading}
              className={`${
                isLoading ? 'bg-gray-400' : 'bg-green-500 active:bg-green-600'
              } p-4 px-20 rounded-xl shadow-lg`}
              accessibilityLabel='Gửi yêu cầu thuốc'
              accessibilityRole='button'
            >
              {isLoading ? (
                <View className='flex-row justify-center items-center'>
                  <ActivityIndicator size='small' color='white' />
                  <Text className='ml-2 text-lg font-semibold text-white'>
                    Đang gửi...
                  </Text>
                </View>
              ) : (
                <Text className='text-lg font-semibold text-center text-white'>
                  ✓ Gửi Yêu Cầu
                </Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleReset}
              disabled={isLoading}
              className='p-4 px-10 bg-blue-500 rounded-xl shadow-lg active:bg-blue-600'
              accessibilityLabel='Reset form để nhập lại'
              accessibilityRole='button'
            >
              <Text className='text-lg font-semibold text-center text-white'>
                Khôi phục
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
