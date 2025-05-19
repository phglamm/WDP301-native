import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../stores/useAuthStore';

const AuthLayout = () => {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  console.log('isAuthenticated', isAuthenticated);

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'STUDENT') {
        router.replace('/(student)/home');
      } else if (user.role === 'PARENT') {
        router.replace('/(parent)/home');
      } else if (user.role === 'NURSE') {
        router.replace('/(nurse)/home');
      } else {
        router.replace('/(student)/home');
      }
    }
  }, [isAuthenticated, user]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
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
  );
};

export default AuthLayout;
