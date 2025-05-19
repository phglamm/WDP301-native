import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import React from 'react';
import { useAuthStore } from '../../stores/useAuthStore';
import { Redirect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
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

  const profileOptions = [
    {
      icon: 'person-outline',
      title: 'Thông tin cá nhân',
      description: 'Xem và chỉnh sửa thông tin',
    },
    {
      icon: 'shield-checkmark-outline',
      title: 'Bảo mật',
      description: 'Đổi mật khẩu',
    },
    {
      icon: 'notifications-outline',
      title: 'Thông báo',
      description: 'Tùy chỉnh thông báo',
    },
    {
      icon: 'help-circle-outline',
      title: 'Trợ giúp',
      description: 'Câu hỏi thường gặp',
    },
  ];

  return (
    <SafeAreaView className='flex-1 bg-white dark:bg-gray-900'>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className='px-4 pt-6'>
          {/* Header */}
          <View className='flex-row items-center justify-between mb-8'>
            <Text className='text-2xl font-bold text-gray-800 dark:text-white'>
              Hồ sơ
            </Text>
            <ThemeToggle />
          </View>

          {/* Profile Card */}
          <View className='bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm mb-6'>
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
                {user.email}
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

          {/* Options */}
          <View className='bg-white dark:bg-gray-800 rounded-2xl p-2 shadow-sm mb-6'>
            {profileOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                className='flex-row items-center p-4 border-b border-gray-100 dark:border-gray-700'
                style={{
                  borderBottomWidth:
                    index === profileOptions.length - 1 ? 0 : 1,
                }}
              >
                <View className='w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full items-center justify-center'>
                  <Ionicons name={option.icon} size={20} color='#407CE2' />
                </View>
                <View className='ml-3 flex-1'>
                  <Text className='text-base font-medium text-gray-800 dark:text-white'>
                    {option.title}
                  </Text>
                  <Text className='text-sm text-gray-500 dark:text-gray-400'>
                    {option.description}
                  </Text>
                </View>
                <Ionicons name='chevron-forward' size={20} color='#9CA3AF' />
              </TouchableOpacity>
            ))}
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
    </SafeAreaView>
  );
}
