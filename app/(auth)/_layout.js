import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const AuthLayout = () => {
  return (
    // <SafeAreaView className='flex-1 bg-white dark:bg-gray-900'>
    <Stack screenOptions={{ headerShown: false }} initialRouteName='login'>
      <Stack.Screen
        name='login'
        options={{
          title: 'Đăng nhập',
        }}
      />
      <Stack.Screen
        name='forgot-password'
        options={{
          title: 'Quên mật khẩu',
        }}
      />
    </Stack>
    // </SafeAreaView>
  );
};

export default AuthLayout;
