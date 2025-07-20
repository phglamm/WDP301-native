import React from 'react';
import { View, Text, ImageBackground, TouchableOpacity } from 'react-native';

const NewsCard = ({ item }) => {
  return (
    <TouchableOpacity className='mr-4 w-80'>
      <View className='overflow-hidden flex-row justify-between rounded-xl border border-gray-200 bg-slate-50'>
        <View className='flex-col flex-1 justify-between p-4'>
          <View>
            <View className='self-start px-2 py-1 mb-2 bg-green-500 rounded-full'>
              <Text className='text-xs font-medium text-white'>Mới</Text>
            </View>
            <Text className='mb-1 text-lg font-bold'>{item.title}</Text>
          </View>
          <Text className='text-sm text-gray-500'>{item.date}</Text>
        </View>
        <ImageBackground
          source={{ uri: item.image }}
          className='w-32 min-h-36'
          style={{ aspectRatio: 1 }}
          resizeMode='cover'
        />
      </View>
    </TouchableOpacity>
  );
};

export default NewsCard;
