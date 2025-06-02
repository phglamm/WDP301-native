import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { getMySonService } from '../../services/parentServices';
import { useRouter } from 'expo-router';
import VaccineDeclareForm from '../../components/parent/VaccineDeclareForm';
import { ArrowLeft, ChevronRight } from 'lucide-react-native';
import { Ionicons } from '@expo/vector-icons';
import StudentCard from '../../components/parent/StudentCard';

export default function VaccineDeclarationScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [mySon, setMySon] = useState([]);
  const [selectedSon, setSelectedSon] = useState(null);
  const [isError, setIsError] = useState(false);
  const [currentView, setCurrentView] = useState('select'); // select, form

  const fetchMySon = async () => {
    try {
      setIsLoading(true);
      const response = await getMySonService();
      if (response.data) {
        setMySon(response.data);
        if (response.data.length > 0) {
          setSelectedSon(response.data[0]);
        }
      }
    } catch (error) {
      setIsError(true);
      console.error('Error fetching sons:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMySon();
  }, []);

  const handleSelectSon = (son) => {
    setSelectedSon(son);
  };

  const handleContinue = () => {
    if (selectedSon) {
      setCurrentView('form');
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView className='flex-1 bg-white items-center justify-center'>
        <ActivityIndicator size='large' color='#407CE2' />
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView className='flex-1 bg-white items-center justify-center'>
        <Text className='text-red-500 font-montserratBold text-xl mb-4'>
          Có lỗi xảy ra khi tải dữ liệu
        </Text>
        <TouchableOpacity
          className='border border-blue-500 px-4 py-2 rounded-lg hover:bg-blue-500'
          onPress={fetchMySon}
        >
          <Text className='text-blue-500 font-montserratBold text-base hover:text-white'>
            Thử lại
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (currentView === 'form') {
    return (
      <SafeAreaView className='flex-1 bg-white'>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className='flex-1'
        >
          <VaccineDeclareForm
            selectedSon={selectedSon}
            onBack={() => setCurrentView('select')}
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className='flex-1 bg-white dark:bg-gray-900'>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className='flex-1'
      >
        {/* Header */}
        <View className='p-4'>
          <View className='flex-row items-center justify-start gap-4 mb-4'>
            <TouchableOpacity onPress={() => router.push('/home')}>
              <ArrowLeft size={24} color='#6B7280' />
            </TouchableOpacity>
            <View>
              <Text className='text-2xl font-montserratBold text-gray-800'>
                Khai báo tiêm chủng 💉
              </Text>
              <Text className='text-gray-500 font-montserratRegular'>
                Quản lý thông tin tiêm chủng
              </Text>
            </View>
          </View>
        </View>

        {/* Content */}
        <ScrollView
          className='flex-1'
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
        >
          <View className='mb-6'>
            <Text className='text-xl font-semibold mb-4 text-gray-800'>
              Danh sách con:
            </Text>
            {mySon.length === 0 ? (
              <View className='items-center py-12'>
                <Text className='text-gray-500 text-center'>
                  Không có dữ liệu học sinh
                </Text>
              </View>
            ) : (
              <View className='flex-row flex-wrap justify-between'>
                {mySon.map((student) => (
                  <StudentCard
                    key={student.id}
                    student={student}
                    selectedSon={selectedSon}
                    handleSelectSon={handleSelectSon}
                  />
                ))}
              </View>
            )}
          </View>
        </ScrollView>

        {/* Footer với nút Continue */}
        <View>
          {selectedSon && (
            <View className='px-4 py-4 border-t border-gray-100 bg-white'>
              {/* Title */}
              <View className='flex-row items-center justify-between mb-3'>
                <View className='flex-1'>
                  <Text className='text-sm text-gray-600'>Đã chọn:</Text>
                  <Text className='text-lg font-semibold text-gray-900'>
                    {selectedSon.fullName}
                  </Text>
                </View>
              </View>
              {/* Continue */}
              <TouchableOpacity
                className='bg-blue-500 p-4 rounded-xl flex-row items-center justify-center'
                onPress={handleContinue}
              >
                <Text className='text-white text-lg font-semibold mr-2'>
                  Tiếp tục khai báo
                </Text>
                <ChevronRight size={20} color='#fff' />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
