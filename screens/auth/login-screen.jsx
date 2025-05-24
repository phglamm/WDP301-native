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
  const { isLoading, login, user } = useAuthStore();

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
      const errorMessage =
        error?.message ||
        (typeof error === 'string' ? error : 'Có lỗi xảy ra khi đăng nhập');

      Alert.alert('Lỗi đăng nhập', errorMessage);
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
      <View className='flex-1 flex-col justify-between items-center py-20 mx-auto'>
        <View className='mt-10'>
          <View className='flex-col items-center justify-center'>
            <View className='w-10 h-10 rounded-full items-center justify-center'>
              <Image
                source={require('../../assets/images/icon-removebg.png')}
                className='w-32 h-32'
                resizeMode='contain'
              />
            </View>
            <View className='w-full mt-4 mb-1 rounded-full items-center justify-center'>
              <Text className='text-xl font-bold text-gray-800 dark:text-white'>
                CampusMedix
              </Text>
            </View>
            {/* <View className='w-full rounded-full items-center justify-center'>
              <Text className='font-medium text-gray-700 dark:text-white'>
                Hệ thống quản lý sức khỏe học sinh
              </Text>
            </View> */}
          </View>
        </View>

        <View>
          <View className='relative mb-5'>
            <Text className='text-4xl font-montserratBold text-gray-900 mb-2 text-center dark:text-white'>
              Đăng nhập
            </Text>
          </View>
          <View>
            <View className='relative mb-5'>
              <View className='absolute left-4 top-1/2 -translate-y-1/2 z-10'>
                <Phone color='gray' size={24} />
              </View>
              <TextInput
                className='border border-gray-200 dark:border-gray-700 rounded-xl text-xl p-4 py-5 pl-14 bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
                placeholder='Nhập số điện thoại'
                placeholderTextColor='#9ca3af'
                value={phone}
                onChangeText={setPhone}
                keyboardType='phone-pad'
                // autoCapitalize='none'
                // autoComplete='tel'
              />
            </View>

            <View className='relative mb-2'>
              <View className='absolute left-4 top-1/2 -translate-y-1/2 z-10'>
                <Lock color='gray' size={24} />
              </View>
              <TextInput
                className='border border-gray-200 text-gray-900 text-xl rounded-xl p-4 py-5 pl-14 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white pr-12'
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
                <Text className='text-blue-500 dark:text-blue-400 font-semibold'>
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
                <Text className='text-white text-center font-montserratSemiBold text-xl py-1'>
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

            <View className='flex-row gap-5 items-center justify-center w-full'>
              <TouchableOpacity
                className='flex-row p-5 px-8 items-center justify-center border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800'
                onPress={handleGoogleLogin}
              >
                <SimpleLineIcons name='social-google' size={20} />
                <Text className='text-gray-800 dark:text-white text-xl font-medium ml-2'>
                  Google
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className='flex-row p-5 px-8 items-center justify-center border border-gray-200 dark:border-gray-700 rounded-xl  bg-white dark:bg-gray-800'
                onPress={handleGoogleLogin}
              >
                <Ionicons name='mail-outline' size={25} />
                <Text className='text-gray-800 dark:text-white text-xl font-medium ml-2'>
                  Email
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View className='flex-row items-center justify-center p-4 rounded-xl mx-4'>
          <View className='flex-row items-center gap-1'>
            <Phone size={16} color='gray' />
            <Text className='text-gray-500 dark:text-gray-400'>
              Liên hệ hỗ trợ:
            </Text>
          </View>
          <TouchableOpacity className='flex-row items-center ml-2'>
            <Text className='text-blue-500 text-lg dark:text-blue-400 font-semibold'>
              0987123456
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
