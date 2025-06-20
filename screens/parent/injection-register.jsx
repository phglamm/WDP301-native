import { useRouter } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useParentStore } from '../../stores/useParentStore';
import StudentCard from '../../components/parent/StudentCard';
import InjectionRegisterForm from '../../components/parent/InjectionRegisterForm';
import ParentHeader from '../../components/layouts/ParentHeader';

export default function InjectionRegister() {
  const router = useRouter();
  const [selectedSon, setSelectedSon] = useState(null);
  const [currentView, setCurrentView] = useState('select');
  const { mySon, getMySon } = useParentStore();

  useEffect(() => {
    getMySon();
  }, []);

  const handleSelectSon = (son) => {
    setSelectedSon(son);
    console.log('Selected son: ', { son: son.fullName, id: son.id });
  };

  const handleContinue = () => {
    if (selectedSon) {
      setCurrentView('form');
    }
  };

  if (currentView === 'form') {
    return (
      <InjectionRegisterForm
        selectedSon={selectedSon}
        onBack={() => setCurrentView('select')}
      />
    );
  }

  return (
    <SafeAreaView className='flex-1 bg-white dark:bg-gray-900'>
      <KeyboardAvoidingView
        className='flex-1 bg-white'
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <ParentHeader
          title='Đăng ký tiêm vaccine 💉'
          description='Đăng ký tiêm vaccine cho con'
          onBack={() => router.push('/home')}
        />

        {/* Content */}
        <ScrollView
          className='flex-1'
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
        >
          <View className='mb-6'>
            <Text className='mb-4 text-xl font-semibold text-gray-800'>
              Danh sách con:
            </Text>
            {!mySon || mySon.length === 0 ? (
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
                  Tiếp tục đăng ký
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
