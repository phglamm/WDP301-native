import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getChatHistoryService } from '../../services/parentServices';
import { groupMessagesByDate } from '../../lib/utils';

const ChatHistory = ({ onSelectDay, onBack }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [historyByDate, setHistoryByDate] = useState([]);

  useEffect(() => {
    loadChatHistory();
  }, []);

  const loadChatHistory = async () => {
    try {
      setIsLoading(true);
      const response = await getChatHistoryService();
      if (response.status && response.data) {
        // Sắp xếp messages theo thời gian từ mới đến cũ
        const sortedMessages = response.data.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );

        // Group theo ngày
        const grouped = groupMessagesByDate(sortedMessages);

        // Chuyển đổi thành format cho danh sách ngày
        const historyData = grouped.map((group) => ({
          date: group.date,
          messageCount: group.messages.length,
          lastMessage: group.messages[group.messages.length - 1],
          messages: group.messages,
        }));

        setHistoryByDate(historyData);
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tải lịch sử trò chuyện');
    } finally {
      setIsLoading(false);
    }
  };

  const getLastMessagePreview = (lastMessage) => {
    if (!lastMessage) return 'Không có tin nhắn';

    const content = lastMessage.content || '';
    const preview =
      content.length > 50 ? content.substring(0, 50) + '...' : content;
    const sender = lastMessage.from === 'user' ? 'Bạn: ' : 'AI: ';

    return sender + preview;
  };

  const getMessageIcon = (messageCount) => {
    if (messageCount === 0) return 'chatbubble-outline';
    if (messageCount < 5) return 'chatbubble';
    return 'chatbubbles';
  };

  const renderHistoryItem = ({ item }) => (
    <TouchableOpacity
      className='flex-row items-center bg-white mx-4 my-1 p-4 rounded-xl shadow-sm'
      onPress={() => onSelectDay(item)}
      activeOpacity={0.7}
    >
      <View className='flex-row items-center flex-1'>
        <View className='w-11 h-11 rounded-full bg-blue-50 items-center justify-center mr-3'>
          <Ionicons
            name={getMessageIcon(item.messageCount)}
            size={24}
            color='#407CE2'
          />
        </View>
        <View className='flex-1'>
          <Text className='text-base font-semibold text-gray-900 mb-1'>
            {item.date}
          </Text>
          <Text
            className='text-sm text-gray-500 leading-[18px]'
            numberOfLines={2}
          >
            {getLastMessagePreview(item.lastMessage)}
          </Text>
        </View>
      </View>

      <View className='items-end ml-3'>
        <Text className='text-xs text-gray-500 mb-1'>
          {item.messageCount} tin nhắn
        </Text>
        <Ionicons name='chevron-forward' size={16} color='#C7C7CC' />
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View className='flex-1 justify-center items-center bg-gray-50'>
        <ActivityIndicator size='large' color='#407CE2' />
        <Text className='mt-3 text-base text-gray-500'>
          Đang tải lịch sử...
        </Text>
      </View>
    );
  }

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
        <Text className='text-lg font-semibold text-gray-900 flex-1 text-center'>
          Lịch sử trò chuyện
        </Text>
        <TouchableOpacity
          onPress={loadChatHistory}
          className='w-8 h-8 items-center justify-center'
        >
          <Ionicons name='refresh' size={20} color='#407CE2' />
        </TouchableOpacity>
      </View>

      {/* History List */}
      {historyByDate.length === 0 ? (
        <View className='flex-1 justify-center items-center px-10'>
          <Ionicons name='chatbubbles-outline' size={60} color='#C7C7CC' />
          <Text className='text-xl font-semibold text-gray-900 mt-4 text-center'>
            Chưa có lịch sử trò chuyện
          </Text>
          <Text className='text-base text-gray-500 mt-2 text-center leading-5'>
            Các cuộc trò chuyện của bạn sẽ xuất hiện ở đây
          </Text>
        </View>
      ) : (
        <FlatList
          data={historyByDate}
          renderItem={renderHistoryItem}
          keyExtractor={(item, index) => `${item.date}-${index}`}
          className='flex-1'
          showsVerticalScrollIndicator={false}
          contentContainerClassName='pt-2'
        />
      )}
    </View>
  );
};

export default ChatHistory;
