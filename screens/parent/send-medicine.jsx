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
  Dimensions,
  TextInput,
  Modal,
} from 'react-native';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import SendMedicineForm from '../../components/parent/SendMedicineForm';
import { getSendMedicineRequestHistoryService } from '../../services/parentServices';
import { ArrowLeft, Search } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function SendMedicine({ navigation }) {
  const router = useRouter();
  const [medicineHistory, setMedicineHistory] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchNote, setSearchNote] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('all');
  const [dateFilter, setDateFilter] = useState('all'); // 'all', 'today', 'week', 'month'
  const [showFilterModal, setShowFilterModal] = useState(false);
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

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      return dateString;
    }
  };

  const fetchMedicineHistory = async () => {
    try {
      const response = await getSendMedicineRequestHistoryService();
      if (response.code === 200 && response.data) {
        setMedicineHistory(response.data);
      }
    } catch (error) {
      console.error('Error fetching medicine history:', error);
      Alert.alert('Lỗi', 'Không thể tải lịch sử yêu cầu thuốc.');
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

  // Get unique students for filter
  const uniqueStudents = useMemo(() => {
    const students = medicineHistory
      .map((item) => item.student)
      .filter(Boolean);
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

    // Filter by search note
    if (searchNote.trim()) {
      filtered = filtered.filter((item) =>
        item.note?.toLowerCase().includes(searchNote.toLowerCase())
      );
    }

    // Filter by student
    if (selectedStudent !== 'all') {
      filtered = filtered.filter(
        (item) => item.student?.id === selectedStudent
      );
    }

    // Filter by date
    if (dateFilter !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.date);

        switch (dateFilter) {
          case 'today':
            return itemDate >= today;
          case 'week':
            const weekAgo = new Date(today);
            weekAgo.setDate(weekAgo.getDate() - 7);
            return itemDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(today);
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            return itemDate >= monthAgo;
          default:
            return true;
        }
      });
    }

    // Sort by date (newest first)
    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [medicineHistory, searchNote, selectedStudent, dateFilter]);

  const clearAllFilters = () => {
    setSearchNote('');
    setSelectedStudent('all');
    setDateFilter('all');
  };

  const hasActiveFilters =
    searchNote.trim() || selectedStudent !== 'all' || dateFilter !== 'all';

  useEffect(() => {
    fetchMedicineHistory();
  }, []);

  if (showForm) {
    return (
      <SendMedicineForm navigation={navigation} onClose={handleFormClose} />
    );
  }

  return (
    <View className='flex-1 bg-white dark:bg-gray-900'>
      <View className='flex-1 mt-10'>
        {/* Header */}
        <View className='bg-white dark:bg-gray-800 px-4 py-6 shadow-sm border-b border-gray-200 dark:border-gray-700'>
          <View className='flex-row items-center justify-start gap-4 mb-4'>
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

          <TouchableOpacity
            onPress={handleToggleForm}
            className='bg-blue-500 active:bg-blue-600 py-4 px-6 rounded-xl shadow-lg mb-4'
            accessibilityLabel='Tạo yêu cầu thuốc mới'
            accessibilityRole='button'
          >
            <Text className='text-white text-lg font-semibold text-center'>
              Tạo Yêu Cầu Mới
            </Text>
          </TouchableOpacity>

          {/* Search Bar */}
          <View className='bg-gray-50 dark:bg-gray-700 rounded-xl px-4 py-1 mb-3 border-2 border-gray-200 dark:border-gray-700 flex-row items-center'>
            <Search size={20} color='#9CA3AF' />
            <TextInput
              value={searchNote}
              onChangeText={setSearchNote}
              placeholder='Tìm kiếm theo ghi chú...'
              placeholderTextColor='#9CA3AF'
              className='text-gray-800 dark:text-white text-base ml-3'
            />
          </View>

          {/* Filter Bar */}
          <View className='flex-row items-center justify-between'>
            <TouchableOpacity
              onPress={() => setShowFilterModal(true)}
              className='flex-row items-center bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg'
            >
              <Text className='text-gray-700 dark:text-gray-300 mr-2'>
                🔍 Lọc
              </Text>
              {hasActiveFilters && (
                <View className='w-2 h-2 bg-blue-500 rounded-full' />
              )}
            </TouchableOpacity>

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
                      : 'Không tìm thấy yêu cầu phù hợp'}
                  </Text>
                  <Text className='text-gray-400 dark:text-gray-500 text-center text-sm'>
                    {medicineHistory.length === 0
                      ? 'Nhấn "Tạo Yêu Cầu Mới" để gửi yêu cầu thuốc đầu tiên'
                      : 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm'}
                  </Text>
                </View>
              ) : (
                <View className='pb-4'>
                  {filteredHistory.map((item, index) => (
                    <View
                      key={item.id || index}
                      className='mb-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden'
                    >
                      {/* Date Header */}
                      <View className='flex-row justify-between items-center p-4 pb-2 border-b border-gray-50 dark:border-gray-700'>
                        <Text className='text-sm font-medium text-gray-600 dark:text-gray-400'>
                          📅 {formatDate(item.date)}
                        </Text>
                      </View>

                      {/* Main Content */}
                      <View className='p-4'>
                        <View className='flex-row'>
                          {/* Image */}
                          <View className='mr-4'>
                            {item.image ? (
                              <TouchableOpacity
                                onPress={() => handleShowImageModal(item.image)}
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

                            {item.note && (
                              <View className='bg-gray-50 dark:bg-gray-700 p-3 rounded-lg'>
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
                  ))}
                </View>
              )}
            </ScrollView>
          )}
        </View>
      </View>

      {/* Filter Modal */}
      <Modal
        visible={showFilterModal}
        transparent
        animationType='slide'
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View className='flex-1 bg-black/50 justify-end'>
          <View className='bg-white dark:bg-gray-800 rounded-t-3xl p-6 max-h-96'>
            <View className='flex-row items-center justify-between mb-6'>
              <Text className='text-xl font-bold text-gray-800 dark:text-white'>
                Bộ lọc
              </Text>
              <TouchableOpacity
                onPress={() => setShowFilterModal(false)}
                className='p-2'
              >
                <Text className='text-blue-500 text-lg'>Đóng</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Student Filter */}
              <View className='mb-6'>
                <Text className='text-lg font-semibold mb-3 text-gray-700 dark:text-gray-300'>
                  Học sinh
                </Text>
                <View className='space-y-2'>
                  <TouchableOpacity
                    onPress={() => setSelectedStudent('all')}
                    className={`p-3 rounded-lg flex-row items-center ${
                      selectedStudent === 'all'
                        ? 'bg-blue-50 dark:bg-blue-900'
                        : 'bg-gray-50 dark:bg-gray-700'
                    }`}
                  >
                    <View
                      className={`w-4 h-4 rounded-full border-2 mr-3 ${
                        selectedStudent === 'all'
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                    />
                    <Text
                      className={`font-medium ${
                        selectedStudent === 'all'
                          ? 'text-blue-600 dark:text-blue-300'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      Tất cả học sinh
                    </Text>
                  </TouchableOpacity>

                  {uniqueStudents.map((student) => (
                    <TouchableOpacity
                      key={student.id}
                      onPress={() => setSelectedStudent(student.id)}
                      className={`p-3 rounded-lg flex-row items-center ${
                        selectedStudent === student.id
                          ? 'bg-blue-50 dark:bg-blue-900'
                          : 'bg-gray-50 dark:bg-gray-700'
                      }`}
                    >
                      <View
                        className={`w-4 h-4 rounded-full border-2 mr-3 ${
                          selectedStudent === student.id
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-300 dark:border-gray-600'
                        }`}
                      />
                      <Text
                        className={`font-medium ${
                          selectedStudent === student.id
                            ? 'text-blue-600 dark:text-blue-300'
                            : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {student.fullName}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Date Filter */}
              <View className='mb-6'>
                <Text className='text-lg font-semibold mb-3 text-gray-700 dark:text-gray-300'>
                  Thời gian
                </Text>
                <View className='space-y-2'>
                  {[
                    { key: 'all', label: 'Tất cả' },
                    { key: 'today', label: 'Hôm nay' },
                    { key: 'week', label: '7 ngày qua' },
                    { key: 'month', label: '30 ngày qua' },
                  ].map((option) => (
                    <TouchableOpacity
                      key={option.key}
                      onPress={() => setDateFilter(option.key)}
                      className={`p-3 rounded-lg flex-row items-center ${
                        dateFilter === option.key
                          ? 'bg-blue-50 dark:bg-blue-900'
                          : 'bg-gray-50 dark:bg-gray-700'
                      }`}
                    >
                      <View
                        className={`w-4 h-4 rounded-full border-2 mr-3 ${
                          dateFilter === option.key
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-300 dark:border-gray-600'
                        }`}
                      />
                      <Text
                        className={`font-medium ${
                          dateFilter === option.key
                            ? 'text-blue-600 dark:text-blue-300'
                            : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Image Viewer Modal */}
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
                style={{ aspectRatio: 1, minHeight: width * 0.8 }}
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
    </View>
  );
}
