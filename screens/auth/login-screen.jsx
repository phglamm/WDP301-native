import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Pressable,
  Image,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../stores/useAuthStore';
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  HelpCircle,
} from 'lucide-react-native';
import { getHomeRouteByRole, validatePhoneNumber } from '../../lib/utils';
import { Ionicons, SimpleLineIcons } from '@expo/vector-icons';

export default function LoginScreen() {
  const router = useRouter();
  const [phone, setPhone] = useState('0123456789');
  const [password, setPassword] = useState('12345');
  const [showPassword, setShowPassword] = useState(false);
  const { isLoading, login } = useAuthStore();

  const handleLogin = async () => {
    if (!validatePhoneNumber(phone)) {
      Alert.alert('Lỗi đăng nhập', 'Số điện thoại không hợp lệ');
      return;
    }

    if (!password || password.length < 5) {
      Alert.alert('Lỗi đăng nhập', 'Mật khẩu phải có ít nhất 5 ký tự');
      return;
    }

    try {
      const res = await login(phone, password);
      const targetRoute = getHomeRouteByRole(res.data.user, true);
      router.replace(targetRoute);
    } catch (error) {
      Alert.alert('Lỗi đăng nhập', error?.message);
    }
  };

  const handleGoogleLogin = () => {
    Alert.alert('Thông báo', 'Đăng nhập bằng Google sẽ được triển khai sau');
    router.push('/(student)/home');
  };

  return (
    <KeyboardAvoidingView
      className='flex-1 bg-blue-50 dark:bg-gray-900'
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 0}
    >
      <View className='flex-col flex-1 justify-between items-center py-20 mx-auto'>
        <View className='mt-10'>
          <View className='flex-col justify-center items-center'>
            <View className='justify-center items-center w-10 h-10 rounded-full'>
              <Image
                source={require('../../assets/images/icon-removebg.png')}
                className='w-32 h-32'
                resizeMode='contain'
              />
            </View>
            <View className='justify-center items-center mt-4 mb-1 w-full rounded-full'>
              <Text className='text-xl font-bold text-gray-800 dark:text-white'>
                CampusMedix
              </Text>
            </View>
          </View>
        </View>

        <View>
          <View className='relative mb-5'>
            <Text className='mb-2 text-4xl text-center text-gray-900 font-montserratBold dark:text-white'>
              Đăng nhập
            </Text>
          </View>
          <View>
            <View className='relative mb-5'>
              <View className='absolute left-4 top-1/2 z-10 -translate-y-1/2'>
                <Phone color='gray' size={24} />
              </View>
              <TextInput
                className='p-4 py-5 pl-14 text-xl text-gray-900 bg-white rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white'
                placeholder='Nhập số điện thoại'
                placeholderTextColor='#9ca3af'
                value={phone}
                onChangeText={setPhone}
                keyboardType='phone-pad'
              />
            </View>

            <View className='relative mb-2'>
              <View className='absolute left-4 top-1/2 z-10 -translate-y-1/2'>
                <Lock color='gray' size={24} />
              </View>
              <TextInput
                className='p-4 py-5 pr-12 pl-14 text-xl text-gray-900 bg-white rounded-xl border border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-white'
                placeholder='Nhập mật khẩu'
                placeholderTextColor='gray'
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoComplete='password'
              />
              <Pressable
                onPress={() => setShowPassword(!showPassword)}
                className='absolute right-4 top-1/2 -translate-y-1/2'
              >
                {showPassword ? (
                  <EyeOff size={24} color='gray' />
                ) : (
                  <Eye size={24} color='gray' />
                )}
              </Pressable>
            </View>

            <View className='items-end mb-5'>
              <TouchableOpacity
                onPress={() => router.push('/(auth)/forgot-password')}
                className='active:opacity-70'
              >
                <Text className='font-semibold text-blue-500 dark:text-blue-400'>
                  Quên mật khẩu ?
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              className={`rounded-xl p-4 mt-2 ${
                isLoading
                  ? 'bg-primary dark:bg-primary'
                  : 'bg-primary dark:bg-primary active:bg-primary dark:active:bg-primary'
              } shadow-sm`}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color='white' size={32} />
              ) : (
                <Text className='py-1 text-xl text-center text-white font-montserratSemiBold'>
                  Đăng nhập
                </Text>
              )}
            </TouchableOpacity>

            <View className='flex-row items-center my-10'>
              <View className='flex-1 h-0.5 bg-gray-200 dark:bg-gray-700' />
              <Text className='mx-4 text-gray-500 dark:text-gray-400'>
                Hoặc đăng nhập với
              </Text>
              <View className='flex-1 h-0.5 bg-gray-200 dark:bg-gray-700' />
            </View>

            <View className='flex-row gap-5 justify-center items-center w-full'>
              <TouchableOpacity
                className='flex-row justify-center items-center p-5 px-8 bg-white rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800'
                onPress={handleGoogleLogin}
              >
                <SimpleLineIcons name='social-google' size={20} />
                <Text className='ml-2 text-xl font-medium text-gray-800 dark:text-white'>
                  Google
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className='flex-row justify-center items-center p-5 px-8 bg-white rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800'
                onPress={handleGoogleLogin}
              >
                <Ionicons name='mail-outline' size={25} />
                <Text className='ml-2 text-xl font-medium text-gray-800 dark:text-white'>
                  Email
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View className='flex-row justify-center items-center p-4 mx-4 rounded-xl'>
          <View className='flex-row gap-1 items-center'>
            <Phone size={16} color='gray' />
            <Text className='text-gray-500 dark:text-gray-400'>
              Liên hệ hỗ trợ:
            </Text>
          </View>
          <TouchableOpacity className='flex-row items-center ml-2'>
            <Text className='text-lg font-semibold text-blue-500 dark:text-blue-400'>
              0987123456
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
