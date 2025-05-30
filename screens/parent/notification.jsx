import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';

export default function Notification() {
  const router = useRouter();

  return (
    <SafeAreaView className='flex-1 bg-white dark:bg-gray-900'>
      <KeyboardAvoidingView
        className='flex-1 bg-white'
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View className='p-4'>
          <View className='flex-row items-center justify-start gap-4 mb-4'>
            <TouchableOpacity onPress={() => router.push('/home')}>
              <ArrowLeft size={24} color='#6B7280' />
            </TouchableOpacity>
            <View>
              <Text className='text-2xl font-montserratBold text-gray-800'>
                Thông báo 🔔
              </Text>
              <Text className='text-gray-500 font-montserratRegular'>
                Quản lý thông báo từ nhà trường
              </Text>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
