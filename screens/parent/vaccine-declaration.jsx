import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { getMySonService } from '../../services/parentServices';
import { useRouter } from 'expo-router';
import VaccineDeclareForm from '../../components/parent/VaccineDeclareForm';
import { ChevronRight } from 'lucide-react-native';
import StudentCard from '../../components/parent/StudentCard';
import ParentHeader from '../../components/layouts/ParentHeader';
import LoadingCustom from '../../components/common/LoadingCustom';

export default function VaccineDeclarationScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [mySon, setMySon] = useState([]);
  const [selectedSon, setSelectedSon] = useState(null);
  const [isError, setIsError] = useState(false);
  const [currentView, setCurrentView] = useState('select'); // select, form
  const [refetch, setRefetch] = useState(false);

  const fetchMySon = async () => {
    try {
      setIsLoading(true);
      const response = await getMySonService();
      if (response.data) {
        setMySon(response.data);
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

  const handleRefresh = () => {
    setRefetch(true);
    fetchMySon();
    setRefetch(false);
  };

  if (isLoading) {
    return <LoadingCustom />;
  }

  if (isError) {
    return (
      <SafeAreaView className='flex-1 justify-center items-center bg-white'>
        <Text className='mb-4 text-xl text-red-500 font-montserratBold'>
          Có lỗi xảy ra khi tải dữ liệu
        </Text>
        <TouchableOpacity
          className='px-4 py-2 rounded-lg border border-blue-500 hover:bg-blue-500'
          onPress={fetchMySon}
        >
          <Text className='text-base text-blue-500 font-montserratBold hover:text-white'>
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
        <ParentHeader
          title='Khai báo tiêm chủng 💉'
          description='Khai báo tiêm chủng cho con'
          onBack={() => router.push('/home')}
        />

        {/* Content */}
        <ScrollView
          className='flex-1'
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refetch} onRefresh={handleRefresh} />
          }
        >
          <View className='mb-6'>
            <Text className='mb-4 text-xl font-semibold text-gray-800'>
              Khai báo cho:
            </Text>
            {mySon.length === 0 ? (
              <View className='items-center py-12'>
                <Text className='text-center text-gray-500'>
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
            <View className='px-4 py-4 bg-white border-t border-gray-100'>
              {/* Title */}
              <View className='flex-row justify-between items-center mb-3'>
                <View className='flex-1'>
                  <Text className='text-sm text-gray-600'>Đã chọn:</Text>
                  <Text className='text-lg font-semibold text-gray-900'>
                    {selectedSon.fullName}
                  </Text>
                </View>
              </View>
              {/* Continue */}
              <TouchableOpacity
                className='flex-row justify-center items-center p-4 bg-blue-500 rounded-xl'
                onPress={handleContinue}
              >
                <Text className='mr-2 text-lg font-semibold text-white'>
                  Tiếp tục
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
