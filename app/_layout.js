import { Stack, Slot, useRouter, useSegments } from 'expo-router';
import '../global.css';
import { useEffect, useState } from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import ThemeProvider from '../components/themes/ThemeProvider';
import { useAuthStore } from '../stores/useAuthStore';
import { getHomeRouteByRole } from '../lib/utils';
import { SafeAreaView } from 'react-native-safe-area-context';

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const router = useRouter();
  const segments = useSegments();
  console.log('🚀 ~ Current route:', segments);

  const [initialized, setInitialized] = useState(false);
  const { initialize, isAuthenticated, user } = useAuthStore();

  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // Initialize data
  useEffect(() => {
    const initData = async () => {
      await initialize();
      setInitialized(true);
    };
    initData();
  }, []);

  // Hide splash screen
  useEffect(() => {
    if (loaded || error) {
      setTimeout(() => {
        SplashScreen.hideAsync();
      }, 1000);
    }
  }, [loaded, error]);

  // Auth routes
  useEffect(() => {
    if (!initialized) return;

    const inAuthGroup = segments[0] === '(auth)';
    const isSignedIn = !!user;
    if (inAuthGroup && isSignedIn && isAuthenticated) {
      const targetRoute = getHomeRouteByRole(user);
      router.replace(targetRoute);
    } else if (!inAuthGroup && !isSignedIn) {
      router.replace('/(auth)/login');
    }
  }, [segments, user, router, initialized]);

  // Loading fonts
  if (!loaded && !error) {
    return null;
  }

  return (
    <ThemeProvider>
      <SafeAreaView className='flex-1 bg-white dark:bg-gray-900'>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name='(auth)' />
          <Stack.Screen name='(parent)' />
          <Stack.Screen name='(nurse)' />
          <Stack.Screen name='(student)' />
        </Stack>
      </SafeAreaView>
    </ThemeProvider>
  );
};

export default RootLayout;
