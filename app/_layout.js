import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import ThemeProvider from '../components/themes/ThemeProvider';
import { useAuthStore } from '../stores/useAuthStore';
import { getHomeRouteByRole } from '../lib/utils';
import '../global.css';

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const router = useRouter();
  const segments = useSegments();
  console.log('🚀 ~ Current route:', segments);

  const [initialized, setInitialized] = useState(false);
  const { initialize, isAuthenticated, user } = useAuthStore();

  const [loaded, error] = useFonts({
    MontserratBold: require('../assets/fonts/Montserrat-Bold.ttf'),
    MontserratRegular: require('../assets/fonts/Montserrat-Regular.ttf'),
    MontserratSemiBold: require('../assets/fonts/Montserrat-SemiBold.ttf'),
    MontserratMedium: require('../assets/fonts/Montserrat-Medium.ttf'),
    MontserratItalic: require('../assets/fonts/Montserrat-Italic.ttf'),
    MontserratSemiBoldItalic: require('../assets/fonts/Montserrat-SemiBoldItalic.ttf'),
  });

  // Initialize data
  useEffect(() => {
    const initData = async () => {
      await initialize();
      setInitialized(true);
    };
    initData();
  }, [initialize]);

  // Hide splash screen
  useEffect(() => {
    if ((loaded || error) && initialized) {
      setTimeout(() => {
        SplashScreen.hideAsync();
      }, 500);
    }
  }, [loaded, error, initialized]);

  // Auth routes
  useEffect(() => {
    if (!initialized) return;
    const inAuthGroup = segments[0] === '(auth)';
    const isSignedIn = !!user && isAuthenticated;

    if (inAuthGroup && isSignedIn) {
      const targetRoute = getHomeRouteByRole(user, true);
      router.replace(targetRoute);
    } else if (!inAuthGroup && !isSignedIn && initialized) {
      router.replace('/(auth)/login');
    }
  }, [segments, user, router, initialized, isAuthenticated]);

  // Loading fonts
  if (!initialized || (!loaded && !error)) {
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
