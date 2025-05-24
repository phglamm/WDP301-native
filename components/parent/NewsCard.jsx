import React from 'react';
import { View, Text, ImageBackground, TouchableOpacity } from 'react-native';

const NewsCard = ({ item }) => {
  return (
    <TouchableOpacity className='mr-4 w-80'>
      <View className='flex-row justify-between bg-slate-50 rounded-xl overflow-hidden border border-gray-200'>
        <View className='flex-1 flex-col justify-between p-4'>
          <View>
            <View className='bg-green-500 rounded-full px-2 py-1 self-start mb-2'>
              <Text className='text-xs text-white font-medium'>New</Text>
            </View>
            <Text className='text-lg font-bold mb-1'>{item.title}</Text>
          </View>
          <Text className='text-sm text-gray-500'>{item.date}</Text>
        </View>
        <ImageBackground
          source={{ uri: item.image }}
          className='w-32'
          style={{ aspectRatio: 1 }}
          resizeMode='cover'
        />
      </View>
    </TouchableOpacity>
  );
};

export default NewsCard;
