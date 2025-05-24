import { View, Text, Image } from 'react-native';
import React from 'react';

export default function HeaderIcon({ className }) {
  return (
    <View
      className={`w-full flex-row justify-center items-center ${className}`}
    >
      <View className='items-center justify-center'>
        <Image
          source={require('../../assets/images/icon-removebg.png')}
          className='w-14 h-14'
          resizeMode='contain'
        />
      </View>
      <Text className='text-2xl font-bold text-gray-800 dark:text-white'>
        CampusMedix
      </Text>
    </View>
  );
}
