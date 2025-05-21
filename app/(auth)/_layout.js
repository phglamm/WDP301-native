import { Stack } from 'expo-router';

const AuthLayout = () => {
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
