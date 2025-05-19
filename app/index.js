import { Redirect, useRouter } from 'expo-router';
import { View, Text, TouchableOpacity, useColorScheme } from 'react-native';
import ThemeToggle from '../components/themes/ThemeToggle';

export default function Index() {
  const router = useRouter();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  return (
    <View className='flex-1 items-center justify-center bg-white dark:bg-gray-900'>
      <Text className='text-2xl font-bold'>Welcome to CampusMedix</Text>
      <ThemeToggle />
      <TouchableOpacity
        onPress={() => router.push('/(auth)/login')}
        className={`bg-blue-500 p-2 rounded-md ${
          isDark ? 'bg-white' : 'bg-black'
        }`}
      >
        <Text className={`text-white ${isDark ? 'text-black' : 'text-white'}`}>
          Login
        </Text>
      </TouchableOpacity>
    </View>
  );
}
