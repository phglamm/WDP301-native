import {
  Button,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import PlaceholderImage from '../../assets/images/icon.png';
import ImageViewer from '../common/ImageViewer';
import * as ImagePicker from 'expo-image-picker';
import {
  getMySonService,
  sendMedicineRequestService,
} from '../../services/parentServices';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SendMedicineForm({ navigation, onClose }) {
  const [selectedImage, setSelectedImage] = useState(undefined);
  const [studentId, setStudentId] = useState('');
  const [note, setNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mySons, setMySons] = useState([]);

  useEffect(() => {
    const fetchSon = async () => {
      try {
        const res = await getMySonService();
        if (res && res.code === 200 && res.status && Array.isArray(res.data)) {
          setMySons(res.data);
        } else {
          setMySons([]);
          Alert.alert('Lỗi', 'Không thể tải danh sách học sinh.');
        }
      } catch (error) {
        console.error('Error fetching sons:', error);
        setMySons([]);
        Alert.alert('Lỗi', 'Không thể tải danh sách học sinh.');
      }
    };
    fetchSon();
  }, []);

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: [ImagePicker.MediaTypeOptions.Images],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setSelectedImage(result.assets[0].uri);
    } else if (!result.canceled) {
      Alert.alert('Thông báo', 'Không thể chọn ảnh này.');
    }
  };

  const takeCameraPhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Lỗi', 'Cần quyền truy cập camera để chụp ảnh.');
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setSelectedImage(result.assets[0].uri);
    } else if (!result.canceled) {
      Alert.alert('Thông báo', 'Không thể chụp ảnh này.');
    }
  };

  const handleShowImageOptions = () => {
    Alert.alert('Chọn ảnh', 'Bạn muốn chọn ảnh từ đâu?', [
      { text: 'Camera', onPress: takeCameraPhoto },
      { text: 'Thư viện', onPress: pickImageAsync },
      { text: 'Hủy', style: 'cancel' },
    ]);
  };

  const handleSubmit = async () => {
    if (!selectedImage) {
      Alert.alert('Lỗi', 'Vui lòng chọn ảnh.');
      return;
    }
    if (mySons.length > 0 && !studentId) {
      Alert.alert('Lỗi', 'Vui lòng chọn học sinh.');
      return;
    }

    setIsLoading(true);
    try {
      const studentIdToSend =
        typeof studentId === 'number' ? String(studentId) : studentId;

      await sendMedicineRequestService(
        selectedImage,
        studentIdToSend.trim(),
        note.trim()
      );

      Alert.alert('Thành công', 'Gửi yêu cầu thuốc thành công!', [
        {
          text: 'OK',
          onPress: () => {
            setSelectedImage(undefined);
            setStudentId('');
            setNote('');
            if (onClose) {
              onClose();
            }
          },
        },
      ]);
    } catch (error) {
      Alert.alert('Lỗi', error?.message || 'Có lỗi xảy ra khi gửi yêu cầu.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className='flex-1 bg-white dark:bg-gray-900 '>
      {/* Header */}
      <View className='bg-white dark:bg-gray-800 px-4 py-6 shadow-sm border-b border-gray-200 dark:border-gray-700  mt-10'>
        <View className='flex-row items-center justify-between'>
          <Text className='text-2xl font-bold text-gray-800 dark:text-white'>
            Tạo Yêu Cầu Thuốc Mới
          </Text>
          {onClose && (
            <TouchableOpacity
              onPress={onClose}
              className='p-2 -mr-2'
              accessibilityLabel='Đóng form'
              accessibilityRole='button'
            >
              <Text className='text-blue-500 dark:text-blue-400 text-lg font-semibold'>
                Đóng
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Content */}
      <ScrollView className='flex-1 px-4 my-5'>
        {/* Image Selection */}
        <View className='items-center mb-8'>
          <View className='bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700'>
            <ImageViewer
              imgSource={PlaceholderImage}
              selectedImage={selectedImage}
            />
          </View>
          <TouchableOpacity
            onPress={handleShowImageOptions}
            className='bg-blue-500 active:bg-blue-600 px-6 py-4 rounded-xl mt-4 w-full shadow-lg'
            disabled={isLoading}
            accessibilityLabel={
              selectedImage ? 'Thay đổi ảnh đã chọn' : 'Chọn ảnh cho yêu cầu'
            }
            accessibilityRole='button'
          >
            <Text className='text-white font-semibold text-center text-lg'>
              {selectedImage ? '📷 Thay đổi ảnh' : '📷 Tải hóa đơn thuốc'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Student Selection */}
        <View className='mb-8'>
          <Text className='text-lg font-semibold mb-3 text-gray-700 dark:text-gray-300'>
            Gửi cho *
          </Text>
          {mySons.length > 0 ? (
            <View className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden'>
              {mySons.map((son, index) => (
                <TouchableOpacity
                  key={son.id}
                  onPress={() => setStudentId(son.id)}
                  className={`p-4 ${
                    studentId === son.id
                      ? 'bg-blue-50 dark:bg-blue-900'
                      : 'bg-white dark:bg-gray-800'
                  } ${
                    index < mySons.length - 1
                      ? 'border-b border-gray-100 dark:border-gray-700'
                      : ''
                  }`}
                  accessibilityLabel={`Chọn học sinh ${son.fullName}`}
                  accessibilityState={{ selected: studentId === son.id }}
                  accessibilityRole='radio'
                >
                  <View className='flex-row items-center'>
                    <View
                      className={`w-5 h-5 rounded-full border-2 mr-3 ${
                        studentId === son.id
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      {studentId === son.id && (
                        <View className='w-full h-full rounded-full bg-white dark:bg-gray-800 scale-50' />
                      )}
                    </View>
                    <Text
                      className={`text-base font-medium ${
                        studentId === son.id
                          ? 'text-blue-600 dark:text-blue-300'
                          : 'text-gray-800 dark:text-gray-200'
                      }`}
                    >
                      {son.fullName}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View className='bg-white dark:bg-gray-800 p-6 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm'>
              <Text className='text-base text-gray-500 dark:text-gray-400 text-center'>
                Không có thông tin học sinh để chọn.
              </Text>
            </View>
          )}
        </View>

        {/* Note Input */}
        <View className='mb-8'>
          <Text className='text-lg font-semibold mb-3 text-gray-700 dark:text-gray-300'>
            Ghi chú (tùy chọn)
          </Text>
          <View className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm'>
            <TextInput
              value={note}
              onChangeText={setNote}
              placeholder='Nhập ghi chú cho yêu cầu thuốc'
              placeholderTextColor='#9CA3AF'
              multiline
              numberOfLines={4}
              className='p-4 text-gray-800 dark:text-white h-24'
              textAlignVertical='top'
              editable={!isLoading}
              accessibilityLabel='Ghi chú cho yêu cầu thuốc'
            />
          </View>
        </View>

        {/* Action Buttons */}
        <View className='pb-10'>
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={isLoading}
            className={`${
              isLoading ? 'bg-gray-400' : 'bg-green-500 active:bg-green-600'
            } py-4 px-6 rounded-xl shadow-lg mb-3`}
            accessibilityLabel='Gửi yêu cầu thuốc'
            accessibilityRole='button'
          >
            {isLoading ? (
              <View className='flex-row items-center justify-center'>
                <ActivityIndicator size='small' color='white' />
                <Text className='text-white font-semibold ml-2 text-lg'>
                  Đang gửi...
                </Text>
              </View>
            ) : (
              <Text className='text-white font-semibold text-center text-lg'>
                ✓ Gửi Yêu Cầu
              </Text>
            )}
          </TouchableOpacity>

          {onClose && (
            <TouchableOpacity
              onPress={onClose}
              disabled={isLoading}
              className='bg-gray-500 active:bg-gray-600 py-4 px-6 rounded-xl shadow-lg'
              accessibilityLabel='Hủy và quay lại'
              accessibilityRole='button'
            >
              <Text className='text-white font-semibold text-center text-lg'>
                ← Quay lại
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
