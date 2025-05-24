import React, { useState, useEffect } from 'react';
import {
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  getMySonService,
  createHealthProfileService,
  getHealthProfileHistoryService,
} from '../../services/parentServices';
import HealthDeclarationForm from '../../components/parent/HealthDeclarationForm';
import HealthDeclarationHistory from '../../components/parent/HealthDeclarationHistory';
import {
  User,
  School,
  Heart,
  BookOpen,
  Plus,
  Clock,
  Droplet,
  ArrowLeft,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function HealthDeclarationScreen() {
  const router = useRouter();
  const [selectedSon, setSelectedSon] = useState(null);
  const [sonData, setSonData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [currentView, setCurrentView] = useState('select');
  const [healthProfiles, setHealthProfiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    weight: '',
    height: '',
    bloodType: '',
    vision: '',
    hearing: '',
    allergies: '',
    note: '',
  });

  const fetchSonData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getMySonService();
      setSonData(response.data || []);
      if (response.data && response.data.length > 0) {
        setSelectedSon(response.data[0].id);
      }
    } catch (err) {
      setError('Không thể tải thông tin. Vui lòng thử lại sau.');
      console.error('Error fetching son data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchHealthProfileHistory = async (studentId) => {
    try {
      const response = await getHealthProfileHistoryService(studentId);
      console.log('🚀 ~ fetchHealthProfileHistory ~ response:', response);
      if (response.code === 200 && response.status) {
        setHealthProfiles(response.data);
      }
    } catch (err) {
      console.error('Error fetching health profile history:', err);
    }
  };

  useEffect(() => {
    fetchSonData();
  }, []);

  useEffect(() => {
    if (selectedSon) {
      fetchHealthProfileHistory(selectedSon);
    }
  }, [selectedSon]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchSonData();
    if (selectedSon) {
      fetchHealthProfileHistory(selectedSon);
    }
  };

  const handleSelectStudent = (student) => {
    setSelectedSon(student.id);
  };

  const handleStartDeclaration = () => {
    setCurrentView('form');
    setFormData({
      weight: '',
      height: '',
      bloodType: '',
      vision: '',
      hearing: '',
      allergies: '',
      note: '',
    });
  };

  const handleViewHistory = () => {
    setCurrentView('history');
  };

  const handleSubmitHealthProfile = async () => {
    setIsSubmitting(true);
    try {
      const healthData = {
        studentId: selectedSon.toString(),
        weight: parseFloat(formData.weight),
        height: parseFloat(formData.height),
        bloodType: formData.bloodType,
        vision: parseFloat(formData.vision),
        hearing: parseFloat(formData.hearing),
        allergies: formData.allergies || '',
        note: formData.note || '',
      };
      const response = await createHealthProfileService(healthData);
      if (response.code === 201 && response.status) {
        Alert.alert('Thành công', 'Hồ sơ sức khỏe đã được lưu!', [
          {
            text: 'OK',
            onPress: () => {
              setCurrentView('select');
              fetchHealthProfileHistory(selectedSon);
            },
          },
        ]);
      }
    } catch (err) {
      Alert.alert('Lỗi', 'Không thể lưu hồ sơ. Vui lòng thử lại.');
      console.error('Error submitting health profile:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStudentCard = (student, index) => {
    const isSelected = selectedSon === student.id;
    const latestProfile = healthProfiles.find(
      (p) => p.studentId === student.id
    );

    return (
      <TouchableOpacity
        key={student.id || index}
        onPress={() => handleSelectStudent(student)}
        className='mb-4'
        style={{
          width: (width - 48) / 2 - 8,
          marginRight: index % 2 === 0 ? 16 : 0,
        }}
      >
        <View
          className={`p-4 rounded-2xl ${
            isSelected
              ? 'border-2 border-blue-500 bg-blue-50'
              : 'border border-gray-200 bg-white'
          }`}
          style={{
            shadowColor: isSelected ? '#3B82F6' : '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: isSelected ? 0.2 : 0.1,
            shadowRadius: 8,
            elevation: isSelected ? 6 : 3,
          }}
        >
          {/* Avatar và tên */}
          <View className='flex-col items-center justify-center gap-2'>
            <View
              className={`w-12 h-12 rounded-full items-center justify-center ${
                isSelected ? 'bg-blue-500' : 'bg-gray-200'
              }`}
            >
              <User size={24} color={isSelected ? '#fff' : '#6B7280'} />
            </View>
            <View className='flex-1 justify-center items-center ml-3'>
              <Text
                className={`font-bold text-base ${
                  isSelected ? 'text-blue-800' : 'text-gray-800'
                }`}
                numberOfLines={1}
              >
                {student.fullName || student.name || 'Học sinh'}
              </Text>

              <Text className='text-gray-500 text-sm'>
                {student.studentCode || 'Mã HS'}
              </Text>
            </View>
          </View>

          {/* Thông tin chi tiết */}
          <View className='space-y-2'>
            {/* Lớp học */}
            {student.className && (
              <View className='flex-row items-center'>
                <School size={16} color='#6B7280' />
                <Text className='text-gray-600 text-sm ml-2 flex-1'>
                  Lớp {student.className}
                </Text>
              </View>
            )}

            {/* Nhóm máu */}
            {latestProfile?.bloodType && (
              <View className='flex-row items-center'>
                <Droplet size={16} color='#EF4444' />
                <Text className='text-gray-600 text-sm ml-2 flex-1'>
                  Nhóm máu: {latestProfile.bloodType}
                </Text>
              </View>
            )}
          </View>

          {/* Badge trạng thái */}
          <View className='mt-3'>
            <View
              className={`px-3 py-1 rounded-full self-start ${
                isSelected ? 'bg-blue-500' : 'bg-gray-100'
              }`}
            >
              <Text
                className={`text-xs font-medium ${
                  isSelected ? 'text-white' : 'text-gray-600'
                }`}
              >
                {isSelected ? 'Đã chọn' : 'Chọn học sinh'}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const selectedStudent = sonData.find((s) => s.id === selectedSon);

  if (currentView === 'form') {
    return (
      <SafeAreaView className='flex-1 bg-white'>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className='flex-1'
        >
          <HealthDeclarationForm
            selectedStudent={selectedStudent}
            formData={formData}
            setFormData={setFormData}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmitHealthProfile}
            onBack={() => setCurrentView('select')}
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  if (currentView === 'history') {
    return (
      <SafeAreaView className='flex-1 bg-white'>
        <HealthDeclarationHistory
          selectedStudent={selectedStudent}
          healthProfiles={healthProfiles}
          onBack={() => setCurrentView('select')}
        />
      </SafeAreaView>
    );
  }

  console.log('🚀 ~ selectedSon:', selectedSon);

  return (
    <SafeAreaView className='flex-1 bg-white dark:bg-gray-900'>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className='flex-1'
      >
        {/* Header */}
        <View className='bg-white shadow-sm border-b border-gray-100 p-6'>
          <View className='flex-row items-center justify-start gap-4 mb-4'>
            <TouchableOpacity onPress={() => router.push('/home')}>
              <ArrowLeft size={24} color='#6B7280' />
            </TouchableOpacity>
            <View>
              <Text className='text-2xl font-montserratBold text-gray-800'>
                Hồ sơ sức khỏe 🏥
              </Text>
              <Text className='text-gray-500 font-montserratRegular'>
                Quản lý thông tin sức khỏe của con bạn
              </Text>
            </View>
          </View>

          {/* Stats */}
          <View className='flex-row justify-between my-4 '>
            <View className='items-center '>
              <Text className='text-xl font-bold text-blue-600 bg-blue-100 p-2 px-4 rounded-md'>
                {sonData.length}
              </Text>
              <Text className='text-gray-500 font-montserratMedium'>
                Học sinh
              </Text>
            </View>
            <View className='items-center'>
              <Text className='text-xl font-bold text-green-600 bg-green-100 p-2 px-4 rounded-md'>
                {healthProfiles.length}
              </Text>
              <Text className='text-gray-500 font-montserratMedium'>Hồ sơ</Text>
            </View>
            <View className='items-center'>
              <Text className='text-xl font-bold text-orange-600 bg-orange-100 p-2 px-4 rounded-md'>
                {selectedSon ? 1 : 0}
              </Text>
              <Text className='text-gray-500 font-montserratMedium'>
                Đã chọn
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          {selectedSon && (
            <View className='flex-row gap-10'>
              <TouchableOpacity
                onPress={handleStartDeclaration}
                className='flex-1 bg-blue-500 py-3 rounded-xl flex-row items-center justify-center'
              >
                <Plus size={20} color='white' />
                <Text className='text-white font-bold ml-2'>Tạo hồ sơ mới</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleViewHistory}
                className='flex-1 bg-gray-200 py-3 rounded-xl flex-row items-center justify-center'
              >
                <Clock size={20} color='#6B7280' />
                <Text className='text-gray-700 font-bold ml-2'>Lịch sử</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Content */}
        <ScrollView
          className='flex-1 px-6'
          contentContainerStyle={{ paddingTop: 20, paddingBottom: 20 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          showsVerticalScrollIndicator={false}
        >
          {loading ? (
            <View className='flex-1 items-center justify-center py-20'>
              <ActivityIndicator size='large' color='#3B82F6' />
              <Text className='text-gray-500 mt-4'>
                Đang tải danh sách học sinh...
              </Text>
            </View>
          ) : error ? (
            <View className='flex-1 items-center justify-center py-20'>
              <Heart size={64} color='#EF4444' />
              <Text className='text-red-500 text-lg mt-4 mb-2'>
                Có lỗi xảy ra
              </Text>
              <Text className='text-gray-500 text-center px-8 mb-6'>
                {error}
              </Text>
              <TouchableOpacity
                onPress={handleRefresh}
                className='bg-blue-500 px-6 py-3 rounded-2xl'
              >
                <Text className='text-white font-medium'>Thử lại</Text>
              </TouchableOpacity>
            </View>
          ) : sonData.length === 0 ? (
            <View className='flex-1 items-center justify-center py-20'>
              <BookOpen size={64} color='#D1D5DB' />
              <Text className='text-gray-500 text-lg mt-4 mb-2'>
                Chưa có học sinh nào
              </Text>
              <Text className='text-gray-400 text-center px-8'>
                Liên hệ nhà trường để thêm thông tin học sinh
              </Text>
            </View>
          ) : (
            <>
              <Text className='text-lg font-bold text-gray-800 mb-4'>
                Danh sách học sinh ({sonData.length})
              </Text>

              <View className='flex-row flex-wrap justify-between'>
                {sonData.map((student, index) =>
                  renderStudentCard(student, index)
                )}
              </View>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
