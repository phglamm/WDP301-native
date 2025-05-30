import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { formatTime } from '../../lib/utils';

const ChatDayView = ({ dayData, onBack }) => {
  const scrollViewRef = useRef();

  useEffect(() => {
    // Auto scroll to bottom khi vào view
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, []);

  const renderMessage = (message) => {
    const isUser = message.from === 'user';

    return (
      <View
        key={message.id}
        className={`flex-row mb-4 max-w-[85%] ${
          isUser ? 'self-end justify-end' : 'self-start justify-start'
        }`}
      >
        {!isUser && (
          <View className='w-8 h-8 mr-2.5 self-end'>
            <BlurView
              intensity={90}
              className='w-8 h-8 rounded-2xl items-center justify-center overflow-hidden'
              tint='light'
            >
              <Ionicons name='medical' size={18} color='#407CE2' />
            </BlurView>
          </View>
        )}

        <View className='flex-1'>
          <View
            className={`p-3 rounded-[18px] ${
              isUser
                ? 'bg-primary rounded-br-1'
                : 'bg-white rounded-bl-1 shadow-sm'
            }`}
          >
            <Text
              className={`text-[15px] leading-5 ${
                isUser ? 'text-white' : 'text-gray-900'
              }`}
            >
              {message.content}
            </Text>
          </View>
          <Text
            className={`text-[11px] mt-1 ml-1 text-gray-500 ${
              isUser ? 'text-right' : ''
            }`}
          >
            {formatTime(message.date)}
          </Text>
        </View>
      </View>
    );
  };

  const getMessageStats = () => {
    const userMessages = dayData.messages.filter(
      (msg) => msg.from === 'user'
    ).length;
    const aiMessages = dayData.messages.filter(
      (msg) => msg.from === 'ai'
    ).length;
    return { userMessages, aiMessages };
  };

  const stats = getMessageStats();

  return (
    <View className='flex-1 bg-gray-50'>
      {/* Header */}
      <View className='flex-row items-center justify-between px-4 py-4 bg-white border-b border-gray-200 pt-14'>
        <TouchableOpacity
          onPress={onBack}
          className='w-8 h-8 items-center justify-center'
        >
          <Ionicons name='chevron-back' size={24} color='#407CE2' />
        </TouchableOpacity>
        <View className='flex-1 items-center'>
          <Text className='text-lg font-semibold text-gray-900'>
            {dayData.date}
          </Text>
          <Text className='text-xs text-gray-500 mt-0.5'>
            {dayData.messageCount} tin nhắn • {stats.userMessages} câu hỏi •{' '}
            {stats.aiMessages} trả lời
          </Text>
        </View>
        <View className='w-8' />
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        className='flex-1 px-4'
        showsVerticalScrollIndicator={false}
        contentContainerClassName='py-4'
      >
        {dayData.messages.length === 0 ? (
          <View className='flex-1 justify-center items-center px-10 pt-25'>
            <Ionicons name='chatbubble-outline' size={60} color='#C7C7CC' />
            <Text className='text-xl font-semibold text-gray-900 mt-4 text-center'>
              Không có tin nhắn
            </Text>
            <Text className='text-base text-gray-500 mt-2 text-center leading-5'>
              Ngày này chưa có cuộc trò chuyện nào
            </Text>
          </View>
        ) : (
          <>
            {/* Date header */}
            <View className='flex-row items-center my-4'>
              <View className='flex-1 h-px bg-gray-200' />
              <View className='bg-gray-50 px-3 py-1 rounded-xl mx-3'>
                <Text className='text-xs text-gray-500 font-medium'>
                  {dayData.date}
                </Text>
              </View>
              <View className='flex-1 h-px bg-gray-200' />
            </View>

            {dayData.messages.map(renderMessage)}
          </>
        )}
      </ScrollView>

      {/* Footer info */}
      <View className='flex-row justify-around px-4 py-3 bg-white border-t border-gray-200'>
        <View className='flex-row items-center'>
          <Ionicons name='person' size={16} color='#407CE2' />
          <Text className='text-xs text-gray-500 ml-1.5'>
            {stats.userMessages} câu hỏi của bạn
          </Text>
        </View>
        <View className='flex-row items-center'>
          <Ionicons name='medical' size={16} color='#407CE2' />
          <Text className='text-xs text-gray-500 ml-1.5'>
            {stats.aiMessages} phản hồi từ AI
          </Text>
        </View>
      </View>
    </View>
  );
};

export default ChatDayView;
