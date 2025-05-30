import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  RefreshControl,
  ActivityIndicator,
  Modal,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import SendMedicineForm from '../../components/parent/SendMedicineForm';
import { getSendMedicineRequestHistoryService } from '../../services/parentServices';
import { ArrowLeft, ChevronDown, Send } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { formatDate } from '../../lib/utils';

export default function SendMedicine() {
  const router = useRouter();
  const [medicineHistory, setMedicineHistory] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState('all');
  const [showStudentDropdown, setShowStudentDropdown] = useState(false);
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const [selectedImageUri, setSelectedImageUri] = useState(null);

  const handleToggleForm = () => {
    setShowForm(!showForm);
  };

  const handleShowImageModal = (uri) => {
    setSelectedImageUri(uri);
    setIsImageModalVisible(true);
  };

  const handleCloseImageModal = () => {
    setIsImageModalVisible(false);
    setSelectedImageUri(null);
  };

  const fetchMedicineHistory = async () => {
    try {
      setIsLoading(true);
      const response = await getSendMedicineRequestHistoryService();

      if (response.code === 200 && response.data) {
        setMedicineHistory(response.data);
      } else {
        console.error('Invalid API response:', response);
        Alert.alert('Lỗi', 'Dữ liệu trả về không hợp lệ từ server.');
        setMedicineHistory([]);
      }
    } catch (error) {
      console.error('Error fetching medicine history:', error);
      Alert.alert('Lỗi', 'Không thể tải lịch sử yêu cầu thuốc.');
      setMedicineHistory([]);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await fetchMedicineHistory();
    setIsRefreshing(false);
  }, []);

  const handleFormClose = useCallback(() => {
    setShowForm(false);
    fetchMedicineHistory();
  }, []);

  const uniqueStudents = useMemo(() => {
    const students = medicineHistory
      .map((item) => item.student)
      .filter((student) => student && student.id && student.fullName);

    const unique = students.reduce((acc, student) => {
      if (!acc.find((s) => s.id === student.id)) {
        acc.push(student);
      }
      return acc;
    }, []);

    return unique;
  }, [medicineHistory]);

  // Filter logic
  const filteredHistory = useMemo(() => {
    let filtered = [...medicineHistory];

    // Filter by student
    if (selectedStudent !== 'all') {
      filtered = filtered.filter((item) => {
        return (
          item.student && String(item.student.id) === String(selectedStudent)
        );
      });
    }

    // Sort by date (newest first)
    return filtered.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB - dateA;
    });
  }, [medicineHistory, selectedStudent]);

  const clearAllFilters = () => {
    setSelectedStudent('all');
  };

  const hasActiveFilters = selectedStudent !== 'all';

  const handleStudentSelect = (studentId) => {
    setSelectedStudent(studentId);
    setShowStudentDropdown(false);
  };

  const getSelectedStudentName = () => {
    if (selectedStudent === 'all') return 'Tất cả học sinh';
    const student = uniqueStudents.find(
      (s) => String(s.id) === String(selectedStudent)
    );
    return student ? student.fullName : 'Tất cả học sinh';
  };

  useEffect(() => {
    fetchMedicineHistory();
  }, []);

  if (showForm) {
    return <SendMedicineForm onClose={handleFormClose} />;
  }

  return (
    <SafeAreaView className='flex-1 bg-white dark:bg-gray-900'>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className='flex-1'
      >
        <View className='bg-white dark:bg-gray-800 px-4 py-6 shadow-sm border-b border-gray-200 dark:border-gray-700'>
          {/* Header */}
          <View className='flex-row items-center justify-start gap-4 mb-6'>
            <TouchableOpacity onPress={() => router.push('/home')}>
              <ArrowLeft size={24} color='#6B7280' />
            </TouchableOpacity>
            <View>
              <Text className='text-2xl font-montserratBold text-gray-800'>
                Gửi thuốc cho con 💊
              </Text>
              <Text className='text-gray-500 font-montserratRegular'>
                Quản lý form gửi thuốc cho con bạn
              </Text>
            </View>
          </View>

          {/* Create Request Button */}
          <TouchableOpacity
            onPress={handleToggleForm}
            className='bg-blue-500 active:bg-blue-600 py-4 px-6 rounded-xl shadow-lg mb-4'
            accessibilityLabel='Tạo yêu cầu thuốc mới'
            accessibilityRole='button'
          >
            <View className='flex-row items-center justify-center gap-4'>
              <Send size={20} color='white' />
              <Text className='text-white text-lg font-semibold text-center'>
                Tạo Yêu Cầu Mới
              </Text>
            </View>
          </TouchableOpacity>

          {/* Filter Bar */}
          <View className='flex-row items-center justify-between mb-4'>
            {/* Student Filter Button */}
            <View className='flex-1 mr-4'>
              <TouchableOpacity
                onPress={() => setShowStudentDropdown(true)}
                className='flex-row items-center justify-between bg-gray-100 dark:bg-gray-700 px-4 py-3 rounded-lg'
              >
                <Text
                  className='text-gray-700 dark:text-gray-300 flex-1'
                  numberOfLines={1}
                >
                  🔍 {getSelectedStudentName()}
                </Text>
                <ChevronDown size={16} color='#6B7280' />
              </TouchableOpacity>
            </View>

            <View className='flex-row items-center'>
              {hasActiveFilters && (
                <TouchableOpacity
                  onPress={clearAllFilters}
                  className='bg-red-100 dark:bg-red-900 px-3 py-1 rounded-lg mr-2'
                >
                  <Text className='text-red-600 dark:text-red-400 text-sm'>
                    Xóa lọc
                  </Text>
                </TouchableOpacity>
              )}
              <Text className='text-sm text-gray-500 dark:text-gray-400'>
                {filteredHistory.length}/{medicineHistory.length} yêu cầu
              </Text>
            </View>
          </View>
        </View>

        {/* Content */}
        <View className='flex-1 px-4 pt-4'>
          {isLoading ? (
            <View className='flex-1 items-center justify-center'>
              <ActivityIndicator size='large' color='#3B82F6' />
              <Text className='text-gray-500 dark:text-gray-400 mt-2'>
                Đang tải...
              </Text>
            </View>
          ) : (
            <ScrollView
              className='flex-1'
              refreshControl={
                <RefreshControl
                  refreshing={isRefreshing}
                  onRefresh={onRefresh}
                  colors={['#3B82F6']}
                  tintColor='#3B82F6'
                />
              }
              showsVerticalScrollIndicator={false}
            >
              <Text className='text-gray-500 dark:text-gray-400 text-lg font-montserratBold mb-2'>
                Lịch sử gửi thuốc ( {filteredHistory.length} )
              </Text>
              {filteredHistory.length === 0 ? (
                <View className='flex-1 items-center justify-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm min-h-48'>
                  <Text className='text-gray-500 dark:text-gray-400 text-center text-lg mb-2'>
                    {medicineHistory.length === 0
                      ? 'Chưa có yêu cầu thuốc nào'
                      : hasActiveFilters
                      ? 'Không tìm thấy yêu cầu phù hợp'
                      : 'Không có dữ liệu'}
                  </Text>
                  <Text className='text-gray-400 dark:text-gray-500 text-center text-sm'>
                    {medicineHistory.length === 0
                      ? 'Nhấn "Tạo Yêu Cầu Mới" để gửi yêu cầu thuốc đầu tiên'
                      : hasActiveFilters
                      ? 'Thử thay đổi bộ lọc'
                      : 'Dữ liệu sẽ được hiển thị ở đây'}
                  </Text>
                </View>
              ) : (
                <View className='pb-4'>
                  {filteredHistory.map((item, index) => {
                    // Kiểm tra data integrity
                    if (!item) return null;

                    return (
                      <View
                        key={item.id || `item-${index}`}
                        className='mb-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden'
                      >
                        {/* Date Header */}
                        <View className='flex-row justify-between items-center p-4 pb-2 border-b border-gray-50 dark:border-gray-700'>
                          <Text className='text-sm font-medium text-gray-600 dark:text-gray-400'>
                            📅{' '}
                            {item.date
                              ? formatDate(item.date)
                              : 'Không có ngày'}
                          </Text>
                        </View>

                        {/* Main Content */}
                        <View className='p-4'>
                          <View className='flex-row'>
                            {/* Image */}
                            <View className='mr-4'>
                              {item.image ? (
                                <TouchableOpacity
                                  onPress={() =>
                                    handleShowImageModal(item.image)
                                  }
                                  activeOpacity={0.7}
                                >
                                  <Image
                                    source={{ uri: item.image }}
                                    className='w-20 h-20 rounded-lg bg-gray-100 dark:bg-gray-700'
                                    resizeMode='cover'
                                  />
                                </TouchableOpacity>
                              ) : (
                                <View className='w-20 h-20 rounded-lg bg-gray-100 dark:bg-gray-700 items-center justify-center'>
                                  <Text className='text-gray-400 text-xs'>
                                    Không có ảnh
                                  </Text>
                                </View>
                              )}
                            </View>

                            {/* Info */}
                            <View className='flex-1'>
                              <Text className='text-lg font-semibold text-gray-800 dark:text-white mb-1'>
                                👤 {item.student?.fullName || 'Không rõ tên'}
                              </Text>

                              <View className='space-y-1 mb-2'>
                                <Text className='text-sm text-gray-600 dark:text-gray-400'>
                                  🆔 MSSV: {item.student?.studentCode || 'N/A'}
                                </Text>
                              </View>

                              {item.note && item.note.trim() && (
                                <View className='bg-gray-50 dark:bg-gray-700 p-2 rounded-lg'>
                                  <Text className='text-xs text-gray-500 dark:text-gray-400 mb-1'>
                                    📝 Ghi chú:
                                  </Text>
                                  <Text className='text-sm text-gray-700 dark:text-gray-300'>
                                    {item.note}
                                  </Text>
                                </View>
                              )}
                            </View>
                          </View>
                        </View>
                      </View>
                    );
                  })}
                </View>
              )}
            </ScrollView>
          )}
        </View>

        {/* Student Filter Modal */}
        <Modal
          visible={showStudentDropdown}
          transparent
          animationType='fade'
          onRequestClose={() => setShowStudentDropdown(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setShowStudentDropdown(false)}
            className='flex-1 bg-black/50 justify-center items-center p-4'
          >
            <View className='bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md max-h-96'>
              {/* Header */}
              <View className='flex-row items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700'>
                <Text className='text-lg font-bold text-gray-800 dark:text-white'>
                  Lọc theo học sinh
                </Text>
                <TouchableOpacity
                  onPress={() => setShowStudentDropdown(false)}
                  className='p-1'
                >
                  <Text className='text-blue-500 text-lg'>✕</Text>
                </TouchableOpacity>
              </View>

              {/* Options */}
              <ScrollView
                className='max-h-80'
                showsVerticalScrollIndicator={false}
              >
                <TouchableOpacity
                  onPress={() => handleStudentSelect('all')}
                  className={`px-4 py-3 border-b border-gray-100 dark:border-gray-700 ${
                    selectedStudent === 'all'
                      ? 'bg-blue-50 dark:bg-blue-900'
                      : ''
                  }`}
                >
                  <Text
                    className={`${
                      selectedStudent === 'all'
                        ? 'text-blue-600 dark:text-blue-300 font-medium'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    Tất cả học sinh
                  </Text>
                </TouchableOpacity>

                {uniqueStudents.length > 0 ? (
                  uniqueStudents.map((student) => (
                    <TouchableOpacity
                      key={student.id}
                      onPress={() => handleStudentSelect(student.id)}
                      className={`px-4 py-3 border-b border-gray-100 dark:border-gray-700 ${
                        String(selectedStudent) === String(student.id)
                          ? 'bg-blue-50 dark:bg-blue-900'
                          : ''
                      }`}
                    >
                      <Text
                        className={`${
                          String(selectedStudent) === String(student.id)
                            ? 'text-blue-600 dark:text-blue-300 font-medium'
                            : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {student.fullName || 'Không rõ tên'}
                      </Text>
                      <Text className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
                        MSSV: {student.studentCode || 'N/A'}
                      </Text>
                    </TouchableOpacity>
                  ))
                ) : (
                  <View className='p-4'>
                    <Text className='text-gray-500 dark:text-gray-400 text-center'>
                      Chưa có học sinh nào
                    </Text>
                  </View>
                )}
              </ScrollView>
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Xem ảnh chi tiết */}
        <Modal
          visible={isImageModalVisible}
          transparent
          animationType='fade'
          onRequestClose={handleCloseImageModal}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={handleCloseImageModal}
            className='flex-1 bg-black/80 items-center justify-center p-4'
          >
            <View className='bg-white dark:bg-gray-800 p-2 rounded-xl shadow-2xl w-full max-w-md'>
              {selectedImageUri ? (
                <Image
                  source={{ uri: selectedImageUri }}
                  className='w-full h-auto rounded-lg'
                  style={{ aspectRatio: 1 }}
                  resizeMode='contain'
                />
              ) : (
                <View className='w-full h-64 items-center justify-center'>
                  <Text className='text-gray-500 dark:text-gray-400'>
                    Không có ảnh để hiển thị
                  </Text>
                </View>
              )}
              <TouchableOpacity
                onPress={handleCloseImageModal}
                className='absolute top-3 right-3 bg-gray-700/50 dark:bg-black/50 p-2 rounded-full z-10'
              >
                <Text className='text-white text-lg'>✕</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
