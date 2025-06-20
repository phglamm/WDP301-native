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
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState(null);

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

  const handleShowDetailModal = (item) => {
    setSelectedDetail(item);
    setIsDetailModalVisible(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalVisible(false);
    setSelectedDetail(null);
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
        {/* Header */}
        <View className='px-4 py-6 bg-white border-b border-gray-200 shadow-sm dark:bg-gray-800 dark:border-gray-700'>
          {/* Header */}
          <View className='flex-row gap-4 justify-start items-center mb-6'>
            <TouchableOpacity onPress={() => router.push('/home')}>
              <ArrowLeft size={24} color='#6B7280' />
            </TouchableOpacity>
            <View>
              <Text className='text-2xl text-gray-800 font-montserratBold'>
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
            className='px-6 py-4 mb-4 bg-blue-500 rounded-xl shadow-lg active:bg-blue-600'
            accessibilityLabel='Tạo yêu cầu thuốc mới'
            accessibilityRole='button'
          >
            <View className='flex-row gap-4 justify-center items-center'>
              <Send size={20} color='white' />
              <Text className='text-lg font-semibold text-center text-white'>
                Tạo Yêu Cầu Mới
              </Text>
            </View>
          </TouchableOpacity>
          {/* Filter Bar */}
          <View className='flex-row justify-between items-center mb-4'>
            {/* Student Filter Button */}
            <View className='flex-1 mr-4'>
              <TouchableOpacity
                onPress={() => setShowStudentDropdown(true)}
                className='flex-row justify-between items-center px-4 py-3 bg-gray-100 rounded-lg dark:bg-gray-700'
              >
                <Text
                  className='flex-1 text-gray-700 dark:text-gray-300'
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
                  className='px-3 py-1 mr-2 bg-red-100 rounded-lg dark:bg-red-900'
                >
                  <Text className='text-sm text-red-600 dark:text-red-400'>
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
            <View className='flex-1 justify-center items-center'>
              <ActivityIndicator size='large' color='#3B82F6' />
              <Text className='mt-2 text-gray-500 dark:text-gray-400'>
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
              <Text className='mb-2 text-lg text-gray-500 dark:text-gray-400 font-montserratBold'>
                Lịch sử gửi thuốc ( {filteredHistory.length} )
              </Text>
              {filteredHistory.length === 0 ? (
                <View className='flex-1 justify-center items-center p-8 bg-white rounded-xl shadow-sm dark:bg-gray-800 min-h-48'>
                  <Text className='mb-2 text-lg text-center text-gray-500 dark:text-gray-400'>
                    {medicineHistory.length === 0
                      ? 'Chưa có yêu cầu thuốc nào'
                      : hasActiveFilters
                      ? 'Không tìm thấy yêu cầu phù hợp'
                      : 'Không có dữ liệu'}
                  </Text>
                  <Text className='text-sm text-center text-gray-400 dark:text-gray-500'>
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
                        className='overflow-hidden mb-4 bg-white rounded-xl border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-700'
                      >
                        {/* Date Header */}
                        <View className='flex-row justify-between items-center p-4 pb-2 border-b border-gray-50 dark:border-gray-700'>
                          <Text className='text-sm font-medium text-gray-600 dark:text-gray-400'>
                            📅{' '}
                            {item.date
                              ? formatDate(item.date)
                              : 'Không có ngày'}
                          </Text>
                          <TouchableOpacity
                            onPress={() => handleShowDetailModal(item)}
                          >
                            <Text className='flex-row rounded-lg gap-2 items-center p-1 px-2 text-sm font-medium text-white bg-[#3B82F6] dark:text-gray-400'>
                              Chi tiết
                            </Text>
                          </TouchableOpacity>
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
                                    className='w-28 h-28 bg-gray-100 rounded-lg dark:bg-gray-700'
                                    resizeMode='cover'
                                  />
                                </TouchableOpacity>
                              ) : (
                                <View className='justify-center items-center w-20 h-20 bg-gray-100 rounded-lg dark:bg-gray-700'>
                                  <Text className='text-xs text-gray-400'>
                                    Không có ảnh
                                  </Text>
                                </View>
                              )}
                            </View>

                            {/* Info */}
                            <View className='flex-1'>
                              <Text className='mb-1 text-lg font-semibold text-gray-800 dark:text-white'>
                                👤 {item.student?.fullName || 'Không rõ tên'} (
                                {item.student?.class})
                              </Text>

                              <View className='mb-2 space-y-1'>
                                <Text className='text-sm text-gray-600 dark:text-gray-400'>
                                  🆔 MSSV: {item.student?.studentCode || 'N/A'}
                                </Text>
                              </View>

                              {item.note && item.note.trim() && (
                                <View className='p-2 bg-gray-50 rounded-lg dark:bg-gray-700'>
                                  <Text className='mb-1 text-xs text-gray-500 dark:text-gray-400'>
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
      </KeyboardAvoidingView>

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
          className='flex-1 justify-center items-center p-4 bg-black/50'
        >
          <View className='w-full max-w-md max-h-96 bg-white rounded-xl shadow-2xl dark:bg-gray-800'>
            {/* Header */}
            <View className='flex-row justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700'>
              <Text className='text-lg font-bold text-gray-800 dark:text-white'>
                Lọc theo học sinh
              </Text>
              <TouchableOpacity
                onPress={() => setShowStudentDropdown(false)}
                className='p-1'
              >
                <Text className='text-lg text-blue-500'>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Options */}
            <ScrollView
              className='max-h-80'
              showsVerticalScrollIndicator={false}
            >
              <TouchableOpacity
                onPress={() => handleStudentSelect('all')}
                className={`px-4 py-3 ${
                  selectedStudent === 'all' ? 'bg-blue-50 dark:bg-blue-900' : ''
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
                    className={`flex-row gap-4 px-4 py-3 ${
                      String(selectedStudent) === String(student.id)
                        ? 'bg-blue-50 dark:bg-blue-900'
                        : ''
                    }`}
                  >
                    <View>
                      <Image
                        source={{
                          uri: `https://api.dicebear.com/9.x/micah/svg?seed=${student.fullName}`,
                        }}
                        className='w-10 h-10 bg-gray-100 rounded-lg dark:bg-gray-700'
                        resizeMode='cover'
                      />
                    </View>
                    <View>
                      <Text
                        className={`${
                          String(selectedStudent) === String(student.id)
                            ? 'text-blue-600 dark:text-blue-300 font-medium'
                            : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {student.fullName || 'Không rõ tên'} ({student.class})
                      </Text>
                      <Text className='mt-1 text-xs text-gray-500 dark:text-gray-400'>
                        MSSV: {student.studentCode || 'N/A'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                <View className='p-4'>
                  <Text className='text-center text-gray-500 dark:text-gray-400'>
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
          className='flex-1 justify-center items-center p-4 bg-black/80'
        >
          <View className='p-2 w-full max-w-md bg-white rounded-xl shadow-2xl dark:bg-gray-800'>
            {selectedImageUri ? (
              <Image
                source={{ uri: selectedImageUri }}
                className='w-full h-auto rounded-lg'
                style={{ aspectRatio: 1 }}
                resizeMode='contain'
              />
            ) : (
              <View className='justify-center items-center w-full h-64'>
                <Text className='text-gray-500 dark:text-gray-400'>
                  Không có ảnh để hiển thị
                </Text>
              </View>
            )}
            <TouchableOpacity
              onPress={handleCloseImageModal}
              className='absolute top-3 right-3 z-10 p-2 rounded-full bg-gray-700/50 dark:bg-black/50'
            >
              <Text className='text-lg text-white'>✕</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
      {/* Xem thông tin chi tiết */}
      <Modal
        visible={isDetailModalVisible}
        transparent
        animationType='fade'
        onRequestClose={handleCloseDetailModal}
      >
        <View className='flex-1 justify-center items-center p-4 bg-black/50'>
          <View
            className='w-full max-w-lg bg-white rounded-xl shadow-2xl dark:bg-gray-800'
            style={{ maxHeight: '85%' }}
          >
            {/* Header */}
            <View className='flex-row justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700'>
              <Text className='text-lg font-bold text-gray-800 dark:text-white'>
                📋 Thông tin chi tiết
              </Text>
              <TouchableOpacity
                onPress={handleCloseDetailModal}
                className='p-2 bg-gray-100 rounded-full dark:bg-gray-700'
              >
                <Text className='text-lg text-gray-500'>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Content */}
            <ScrollView className='p-4' showsVerticalScrollIndicator={false}>
              {selectedDetail ? (
                <View>
                  {/* Student Info */}
                  <View className='p-4 mb-4 bg-blue-50 rounded-xl dark:bg-blue-900'>
                    <Text className='mb-2 text-sm font-medium text-blue-700 dark:text-blue-300'>
                      👤 Thông tin học sinh
                    </Text>
                    <Text className='mb-1 text-base font-semibold text-gray-800 dark:text-white'>
                      {selectedDetail.student?.fullName || 'Không rõ tên'}
                    </Text>
                    <Text className='text-sm text-gray-600 dark:text-gray-400'>
                      🆔 MSSV: {selectedDetail.student?.studentCode || 'N/A'}
                    </Text>
                    <Text className='text-sm text-gray-600 dark:text-gray-400'>
                      🏫 Lớp: {selectedDetail.student?.class || 'N/A'}
                    </Text>
                  </View>

                  {/* Request Info */}
                  <View className='p-4 mb-4 bg-green-50 rounded-xl dark:bg-green-900'>
                    <Text className='mb-2 text-sm font-medium text-green-700 dark:text-green-300'>
                      📅 Thông tin yêu cầu
                    </Text>
                    <Text className='mb-1 text-sm text-gray-600 dark:text-gray-400'>
                      Ngày gửi:{' '}
                      {selectedDetail.date
                        ? formatDate(selectedDetail.date)
                        : 'Không có ngày'}
                    </Text>
                    <Text className='text-sm text-gray-600 dark:text-gray-400'>
                      Trạng thái:{' '}
                      <Text className='font-medium text-orange-600'>
                        {selectedDetail.status === 'pending'
                          ? 'Đang xử lý'
                          : selectedDetail.status === 'approved'
                          ? 'Đã phê duyệt'
                          : selectedDetail.status === 'rejected'
                          ? 'Đã từ chối'
                          : 'Không xác định'}
                      </Text>
                    </Text>
                  </View>

                  {/* Medicine Image */}
                  {selectedDetail.image && (
                    <View className='mb-4'>
                      <Text className='mb-2 text-sm font-medium text-gray-700 dark:text-gray-300'>
                        🖼️ Hình ảnh thuốc
                      </Text>
                      <TouchableOpacity
                        onPress={() =>
                          handleShowImageModal(selectedDetail.image)
                        }
                        className='overflow-hidden rounded-xl'
                      >
                        <Image
                          source={{ uri: selectedDetail.image }}
                          className='w-full h-48 bg-gray-100 dark:bg-gray-700'
                          resizeMode='cover'
                        />
                        <View className='absolute inset-0 justify-center items-center'>
                          <View className='px-3 py-1 rounded-full bg-black/50'>
                            <Text className='text-xs text-white'>
                              Nhấn để phóng to
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    </View>
                  )}

                  {/* Medicine Schedule - Slots */}
                  {selectedDetail.slots && selectedDetail.slots.length > 0 && (
                    <View className='mb-4'>
                      <Text className='mb-3 text-sm font-medium text-gray-700 dark:text-gray-300'>
                        ⏰ Lịch uống thuốc
                      </Text>
                      {selectedDetail.slots.map((slot, index) => (
                        <View
                          key={index}
                          className='p-3 mb-3 bg-gray-50 rounded-xl dark:bg-gray-700'
                        >
                          <View className='flex-row items-center mb-2'>
                            <View className='px-3 py-1 bg-blue-500 rounded-full'>
                              <Text className='text-xs font-medium text-white'>
                                {slot.session}
                              </Text>
                            </View>
                          </View>
                          {slot.medicines && slot.medicines.length > 0 && (
                            <View className='space-y-2'>
                              {slot.medicines.map((medicine, medIndex) => (
                                <View
                                  key={medIndex}
                                  className='flex-row justify-between items-center p-2 bg-white rounded-lg dark:bg-gray-600'
                                >
                                  <View className='flex-1'>
                                    <Text className='text-sm font-medium text-gray-800 dark:text-white'>
                                      {medicine.name}
                                    </Text>
                                    {medicine.description && (
                                      <Text className='text-xs text-gray-500 dark:text-gray-400'>
                                        {medicine.description}
                                      </Text>
                                    )}
                                  </View>
                                  <View className='px-2 py-1 bg-green-100 rounded-lg dark:bg-green-800'>
                                    <Text className='text-xs font-medium text-green-700 dark:text-green-300'>
                                      {medicine.quantity} viên
                                    </Text>
                                  </View>
                                </View>
                              ))}
                            </View>
                          )}
                        </View>
                      ))}
                    </View>
                  )}

                  {/* Note */}
                  {selectedDetail.note && selectedDetail.note.trim() && (
                    <View className='p-4 mb-4 bg-yellow-50 rounded-xl dark:bg-yellow-900'>
                      <Text className='mb-2 text-sm font-medium text-yellow-700 dark:text-yellow-300'>
                        📝 Ghi chú
                      </Text>
                      <Text className='text-sm text-gray-700 dark:text-gray-300'>
                        {selectedDetail.note}
                      </Text>
                    </View>
                  )}
                </View>
              ) : (
                <View className='justify-center items-center p-8'>
                  <Text className='text-gray-500 dark:text-gray-400'>
                    Không có thông tin chi tiết
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
