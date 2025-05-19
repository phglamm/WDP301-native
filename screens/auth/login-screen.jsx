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
import { Eye, EyeOff, Mail, Lock } from 'lucide-react-native';
import { validateEmail } from '../../lib/utils';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('a.baocute0204@gmail.com');
  const [password, setPassword] = useState('123123');
  const [showPassword, setShowPassword] = useState(false);
  const { isLoading, login } = useAuthStore();

  const handleLogin = async () => {
    if (!validateEmail(email)) {
      Alert.alert('Lỗi', 'Email không hợp lệ');
      return;
    }
    try {
      // const res = await login(email, password);
      // if (res.data.user.role === 'STUDENT') {
      //   router.replace('/(student)/home');
      // } else if (res.data.user.role === 'PARENT') {
      //   router.replace('/(parent)/home');
      // } else if (res.data.user.role === 'NURSE') {
      //   router.replace('/(nurse)/home');
      // } else {
      //   router.replace('/(student)/home');
      // }
      router.push('/(student)/home');
    } catch (error) {
      Alert.alert('Lỗi đăng nhập', error || 'Có lỗi xảy ra khi đăng nhập');
    }
  };

  const handleGoogleLogin = () => {
    Alert.alert('Thông báo', 'Đăng nhập bằng Google sẽ được triển khai sau');
  };

  return (
    <KeyboardAvoidingView
      className='flex-1 bg-white dark:bg-gray-900'
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 0}
    >
      <View className='flex-1 px-10 justify-center'>
        <View className='mb-8'>
          <Text className='text-5xl font-bold py-4 text-gray-900 dark:text-white text-center'>
            Đăng nhập
          </Text>
        </View>

        <View>
          <View className='relative mb-5'>
            <View className='absolute left-4 top-1/2 -translate-y-1/2 z-10'>
              <Mail color='gray' size={24} />
            </View>
            <TextInput
              className='border border-gray-200 dark:border-gray-700 rounded-xl text-xl p-4 py-6 pl-14 bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
              placeholder='Enter your phone or email'
              placeholderTextColor='#9ca3af'
              value={email}
              onChangeText={setEmail}
              keyboardType='email-address'
              autoCapitalize='none'
              autoComplete='email'
            />
          </View>

          <View className='relative'>
            <View className='absolute left-4 top-1/2 -translate-y-1/2 z-10'>
              <Lock color='gray' size={24} />
            </View>
            <TextInput
              className='border border-gray-200 dark:border-gray-700 text-xl rounded-xl p-4 py-6 pl-14 bg-white dark:bg-gray-800 text-gray-900 dark:text-white pr-12'
              placeholder='Enter your password'
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

          <View className='items-end mb-5 mt-2'>
            <TouchableOpacity
              onPress={() => router.push('/(auth)/forgot-password')}
              className='active:opacity-70'
            >
              <Text className='text-blue-600 dark:text-blue-400 font-medium'>
                Quên mật khẩu ?
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            className={`rounded-full p-4 mt-2 ${
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
              <Text className='text-white text-center font-semibold text-xl py-1'>
                Sign In
              </Text>
            )}
          </TouchableOpacity>

          <View className='flex-row items-center my-5'>
            <View className='flex-1 h-0.5 bg-gray-200 dark:bg-gray-700' />
            <Text className='mx-4 text-gray-500 dark:text-gray-400'>OR</Text>
            <View className='flex-1 h-0.5 bg-gray-200 dark:bg-gray-700' />
          </View>

          <TouchableOpacity
            className='flex-row py-5 items-center justify-center border border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-white dark:bg-gray-800'
            onPress={handleGoogleLogin}
          >
            <Image
              source={{
                uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1024px-Google_%22G%22_logo.svg.png',
              }}
              style={{ width: 20, height: 20 }}
              className='mr-2'
            />
            <Text className='text-gray-800 dark:text-white text-xl font-medium ml-2'>
              Sign In with Google
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
