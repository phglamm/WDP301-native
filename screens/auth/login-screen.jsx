import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import useAuthStore from '../../stores/useAuthStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Eye, EyeOff } from 'lucide-react-native';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('a.baocute0204@gmail.com');
  const [password, setPassword] = useState('123123');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuthStore();

  const handleLogin = async () => {
    if (!validateEmail(email)) {
      Alert.alert('Lỗi', 'Email không hợp lệ');
      return;
    }

    try {
      await login(email, password);
    } catch (error) {
      Alert.alert(
        'Lỗi đăng nhập',
        error.message || 'Có lỗi xảy ra khi đăng nhập'
      );
    }
  };

  return (
    <SafeAreaView className='flex-1 bg-gray-50 dark:bg-gray-900'>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className='flex-1'
      >
        {/* Header with Theme Toggle */}
        <View className='flex-row justify-between items-center px-6 py-4'>
          <Text className='text-2xl font-bold text-gray-900 dark:text-white'>
            SmartKid
          </Text>
        </View>

        <View className='flex-1 px-6 justify-center'>
          <View className='mb-10'>
            <Text className='text-3xl font-bold text-gray-900 dark:text-white text-center'>
              Chào mừng trở lại!
            </Text>
            <Text className='text-gray-600 dark:text-gray-400 text-center mt-2 text-base'>
              Đăng nhập để tiếp tục hành trình học tập
            </Text>
          </View>

          <View className='space-y-6'>
            <View>
              <Text className='text-gray-700 dark:text-gray-300 mb-2 font-medium'>
                Email
              </Text>
              <TextInput
                className='border border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
                placeholder='Nhập email của bạn'
                placeholderTextColor='#9ca3af'
                value={email}
                onChangeText={setEmail}
                keyboardType='email-address'
                autoCapitalize='none'
                autoComplete='email'
              />
            </View>

            <View>
              <Text className='text-gray-700 dark:text-gray-300 mb-2 font-medium'>
                Mật khẩu
              </Text>
              <View className='relative'>
                <TextInput
                  className='border border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white pr-12'
                  placeholder='Nhập mật khẩu'
                  placeholderTextColor='#9ca3af'
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoComplete='password'
                />
                <Pressable
                  onPress={() => setShowPassword(!showPassword)}
                  className='absolute right-4 top-4'
                >
                  {showPassword ? (
                    <EyeOff size={24} color='#9ca3af' />
                  ) : (
                    <Eye size={24} color='#9ca3af' />
                  )}
                </Pressable>
              </View>
            </View>

            <TouchableOpacity
              className={`rounded-xl p-4 ${
                isLoading
                  ? 'bg-blue-400 dark:bg-blue-500'
                  : 'bg-blue-600 dark:bg-blue-700 active:bg-blue-700 dark:active:bg-blue-800'
              } shadow-sm`}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color='white' />
              ) : (
                <Text className='text-white text-center font-semibold text-lg'>
                  Đăng nhập
                </Text>
              )}
            </TouchableOpacity>

            <View className='flex-row justify-center space-x-1'>
              <Text className='text-gray-600 dark:text-gray-400'>
                Chưa có tài khoản?
              </Text>
              <TouchableOpacity
                onPress={() => router.push('/auth/register-screen')}
                className='active:opacity-70'
              >
                <Text className='text-blue-600 dark:text-blue-400 font-medium'>
                  Đăng ký ngay
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const validateEmail = (email) => {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
};
