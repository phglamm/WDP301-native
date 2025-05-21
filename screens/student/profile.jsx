import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import React from 'react';
import { useAuthStore } from '../../stores/useAuthStore';
import { Redirect } from 'expo-router';
import ThemeToggle from '../../components/themes/ThemeToggle';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();

  if (!user) {
    return <Redirect href='/login' />;
  }

  const handleLogout = () => {
    logout();
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      className='bg-white dark:bg-gray-900'
    >
      <View className='px-4 pt-6'>
        {/* Header */}
        <View className='flex-row items-center justify-between mb-8'>
          <Text className='text-2xl font-bold text-gray-800 dark:text-white'>
            Hồ sơ
          </Text>
          <ThemeToggle />
        </View>

        {/* Profile Card */}
        <View className='bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm mb-6 border border-gray-200 dark:border-gray-700'>
          <View className='items-center'>
            <View className='relative'>
              <Image
                source={{
                  uri:
                    user.avatar ||
                    'https://randomuser.me/api/portraits/men/36.jpg',
                }}
                className='w-24 h-24 rounded-full'
              />
              <View className='absolute bottom-0 right-0 bg-blue-500 p-1 rounded-full border-2 border-white dark:border-gray-800'>
                <Ionicons name='camera' size={16} color='white' />
              </View>
            </View>

            <Text className='text-xl font-bold mt-4 text-gray-800 dark:text-white'>
              {user.name}
            </Text>
            <Text className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
              {user.phone}
            </Text>

            <View className='bg-blue-100 dark:bg-blue-900 px-4 py-1 rounded-full mt-3'>
              <Text className='text-blue-600 dark:text-blue-300 font-medium'>
                Sinh viên
              </Text>
            </View>
          </View>

          <View className='flex-row justify-around mt-6 pt-4 border-t border-gray-100 dark:border-gray-700'>
            <View className='items-center'>
              <Text className='text-lg font-bold text-gray-800 dark:text-white'>
                256
              </Text>
              <Text className='text-xs text-gray-500 dark:text-gray-400'>
                Khóa học
              </Text>
            </View>
            <View className='items-center'>
              <Text className='text-lg font-bold text-gray-800 dark:text-white'>
                24
              </Text>
              <Text className='text-xs text-gray-500 dark:text-gray-400'>
                Bài tập
              </Text>
            </View>
            <View className='items-center'>
              <Text className='text-lg font-bold text-gray-800 dark:text-white'>
                98%
              </Text>
              <Text className='text-xs text-gray-500 dark:text-gray-400'>
                Hoàn thành
              </Text>
            </View>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          onPress={handleLogout}
          className='bg-red-500 rounded-2xl p-4 items-center mb-8'
        >
          <Text className='text-white font-bold text-base'>Đăng xuất</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
