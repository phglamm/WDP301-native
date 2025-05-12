import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import useAuthStore from '../../stores/useAuthStore';

const AuthLayout = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  console.log('isAuthenticated', isAuthenticated);

  // useEffect(() => {
  //   if (isAuthenticated) {
  //     router.replace('/(tabs)');
  //   }
  // }, [isAuthenticated]);

  return (
    <Stack>
      <Stack.Screen
        name='login'
        options={{
          title: 'Đăng nhập',
        }}
      />
      <Stack.Screen
        name='register'
        options={{
          title: 'Đăng ký',
        }}
      />
    </Stack>
  );
};

export default AuthLayout;
