import { View, Text } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import ThemeToggle from '../../components/themes/ThemeToggle';

export default function SettingsScreen() {
  return (
    <SafeAreaView className='flex-1 bg-white dark:bg-gray-900'>
      <View className='flex-1 items-center justify-center'>
        <Text>Student Settings Screen</Text>
        <ThemeToggle />
      </View>
    </SafeAreaView>
  );
}
