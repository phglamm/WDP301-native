import { Stack, useRouter, useSegments } from 'expo-router';
import '../global.css';
import { useEffect } from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import ThemeProvider from '../components/themes/ThemeProvider';
import { useAuthStore } from '../stores/useAuthStore';

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const router = useRouter();
  const segments = useSegments();
  const { initialize } = useAuthStore();
  console.log(segments);

  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    if (loaded || error) {
      setTimeout(() => {
        SplashScreen.hideAsync();
      }, 100);
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name='(auth)' />
        <Stack.Screen name='(parent)' />
        <Stack.Screen name='(nurse)' />
        <Stack.Screen name='(student)' />
      </Stack>
    </ThemeProvider>
  );
};

export default RootLayout;
