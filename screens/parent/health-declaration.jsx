import React, { useState, useEffect } from 'react';
import {
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
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
import { BookOpen, Plus, Clock, ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import StudentCard from '../../components/parent/StudentCard';
import ParentHeader from '../../components/layouts/ParentHeader';

export default function HealthDeclarationScreen() {
  const router = useRouter();
  const [selectedSon, setSelectedSon] = useState(null);
  const [sonData, setSonData] = useState([]);
  const [loading, setLoading] = useState(false);
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
      const response = await getMySonService();
      setSonData(response.data || []);
      if (response.data && response.data.length > 0) {
        setSelectedSon(response.data[0]);
      }
    } catch (err) {
      Alert.alert('Lỗi', 'Không thể tải danh sách học sinh');
      console.error('Error fetching son data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchHealthProfileHistory = async (studentId) => {
    try {
      const response = await getHealthProfileHistoryService(studentId);
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
      fetchHealthProfileHistory(selectedSon.id);
    }
  }, [selectedSon]);

  const handleSelectSon = (student) => {
    setSelectedSon(student);
    console.log('Selected Son: ', {
      student: student.fullName,
      id: student.id,
    });
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
        studentId: selectedSon.id,
        weight: parseFloat(formData.weight),
        height: parseFloat(formData.height),
        bloodType: formData.bloodType,
        vision: parseFloat(formData.vision),
        hearing: parseFloat(formData.hearing),
        allergies: formData.allergies || '',
        note: formData.note || '',
      };
      const response = await createHealthProfileService(healthData);
      if (response.status) {
        Alert.alert('Thành công', 'Hồ sơ sức khỏe đã được lưu!', [
          {
            text: 'OK',
            onPress: () => {
              setCurrentView('select');
              fetchHealthProfileHistory(selectedSon.id);
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
  //   return (
  //     <TouchableOpacity
  //       key={student.id || index}
  //       onPress={() => handleSelectStudent(student)}
  //       className='mb-4'
  //       style={{
  //         width: (width - 48) / 2 - 8,
  //         marginRight: index % 2 === 0 ? 16 : 0,
  //       }}
  //     >
  //       <View
  //         className={`p-4 rounded-2xl ${
  //           isSelected
  //             ? 'bg-blue-50 border-2 border-blue-500'
  //             : 'bg-white border border-gray-200'
  //         }`}
  //         style={{
  //           shadowColor: isSelected ? '#3B82F6' : '#000',
  //           shadowOffset: { width: 0, height: 2 },
  //           shadowOpacity: isSelected ? 0.2 : 0.1,
  //           shadowRadius: 8,
  //           elevation: isSelected ? 6 : 3,
  //         }}
  //       >
  //         {/* Avatar và tên */}
  //         <View className='flex-col gap-2 justify-center items-center'>
  //           <View
  //             className={`w-12 h-12 rounded-full items-center justify-center ${
  //               isSelected ? 'bg-blue-500' : 'bg-gray-200'
  //             }`}
  //           >
  //             <User size={24} color={isSelected ? '#fff' : '#6B7280'} />
  //           </View>
  //           <View className='flex-1 justify-center items-center ml-3'>
  //             <Text
  //               className={`font-bold text-base ${
  //                 isSelected ? 'text-blue-800' : 'text-gray-800'
  //               }`}
  //               numberOfLines={1}
  //             >
  //               {student.fullName || student.name || 'Học sinh'}
  //             </Text>

  //             <Text className='text-sm text-gray-500'>
  //               {student.studentCode || 'Mã HS'}
  //             </Text>
  //           </View>
  //         </View>

  //         {/* Thông tin chi tiết */}
  //         <View className='space-y-2'>
  //           {/* Lớp học */}
  //           {student.className && (
  //             <View className='flex-row items-center'>
  //               <School size={16} color='#6B7280' />
  //               <Text className='flex-1 ml-2 text-sm text-gray-600'>
  //                 Lớp {student.className}
  //               </Text>
  //             </View>
  //           )}
  //         </View>

  //         {/* Badge trạng thái */}
  //         <View className='mt-3'>
  //           <View
  //             className={`px-3 py-1 rounded-full self-start ${
  //               isSelected ? 'bg-blue-500' : 'bg-gray-100'
  //             }`}
  //           >
  //             <Text
  //               className={`text-xs font-medium ${
  //                 isSelected ? 'text-white' : 'text-gray-600'
  //               }`}
  //             >
  //               {isSelected ? 'Đã chọn' : 'Chọn học sinh'}
  //             </Text>
  //           </View>
  //         </View>
  //       </View>
  //     </TouchableOpacity>
  //   );
  // };

  if (currentView === 'form') {
    return (
      <HealthDeclarationForm
        selectedSon={selectedSon}
        formData={formData}
        setFormData={setFormData}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmitHealthProfile}
        onBack={() => setCurrentView('select')}
      />
    );
  }

  if (currentView === 'history') {
    return (
      <HealthDeclarationHistory
        selectedSon={selectedSon}
        healthProfiles={healthProfiles}
        onBack={() => setCurrentView('select')}
      />
    );
  }

  return (
    <SafeAreaView className='flex-1 bg-white dark:bg-gray-900'>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className='flex-1'
      >
        {/* Header */}
        <ParentHeader
          title='Khai báo sức khỏe 🩺'
          description='Khai báo thông tin sức khỏe'
          onBack={() => router.push('/home')}
        />
        <View className='px-4 bg-white border-b border-gray-100 shadow-sm'>
          {/* Action Buttons */}
          {selectedSon && (
            <View className='flex-row gap-10 mb-4'>
              <TouchableOpacity
                onPress={handleStartDeclaration}
                className='flex-row flex-1 justify-center items-center py-3 bg-blue-500 rounded-xl'
              >
                <Plus size={20} color='white' />
                <Text className='ml-2 font-bold text-white'>Tạo hồ sơ mới</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleViewHistory}
                className='flex-row flex-1 justify-center items-center py-3 bg-gray-200 rounded-xl'
              >
                <Clock size={20} color='#6B7280' />
                <Text className='ml-2 font-bold text-gray-700'>Lịch sử</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Content */}
        <ScrollView
          className='flex-1 px-6'
          contentContainerStyle={{ paddingTop: 20, paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        >
          {loading ? (
            <View className='flex-1 justify-center items-center py-20'>
              <ActivityIndicator size='large' color='#3B82F6' />
              <Text className='mt-4 text-gray-500'>
                Đang tải danh sách học sinh...
              </Text>
            </View>
          ) : sonData.length === 0 ? (
            <View className='flex-1 justify-center items-center py-20'>
              <BookOpen size={64} color='#D1D5DB' />
              <Text className='mt-4 mb-2 text-lg text-gray-500'>
                Chưa có học sinh nào
              </Text>
              <Text className='px-8 text-center text-gray-400'>
                Liên hệ nhà trường để thêm thông tin học sinh
              </Text>
            </View>
          ) : (
            <>
              <Text className='mb-4 text-lg font-bold text-gray-800'>
                Danh sách học sinh ({sonData.length})
              </Text>

              <View className='flex-row flex-wrap justify-between'>
                {sonData.map((student, index) => (
                  <StudentCard
                    key={student.id}
                    student={student}
                    selectedSon={selectedSon}
                    handleSelectSon={handleSelectSon}
                  />
                ))}
              </View>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
