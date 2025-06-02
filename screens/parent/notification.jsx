import { KeyboardAvoidingView, Platform } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import ParentHeader from '../../components/layouts/ParentHeader';

export default function Notification() {
  const router = useRouter();

  return (
    <SafeAreaView className='flex-1 bg-white dark:bg-gray-900'>
      <KeyboardAvoidingView
        className='flex-1 bg-white'
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ParentHeader
          title='Thông báo 🔔'
          description='Thông báo từ nhà trường'
          onBack={() => router.push('/home')}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
