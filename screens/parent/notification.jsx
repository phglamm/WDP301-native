import { View, Text, ScrollView } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import HeaderIcon from '../../components/layouts/HeaderIcon';
export default function Notification() {
  return (
    <SafeAreaView className='flex-1 bg-white dark:bg-gray-900'>
      <ScrollView>
        <HeaderIcon />
        <View className='flex-1 px-4 pt-4'>
          <Text className='text-2xl font-bold text-gray-800 dark:text-white'>
            Trạm thông báo
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
