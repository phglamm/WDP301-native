import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import {
  getChatHistoryService,
  sendChatMessageService,
} from '../../services/parentServices';
import { groupMessagesByDate, formatTime } from '../../lib/utils';
import DateSeparator from '../../components/chat/DateSeparator';
import ChatHistory from '../../components/chat/ChatHistory';
import ChatDayView from '../../components/chat/ChatDayView';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';

export default function Chatbox() {
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [groupedMessages, setGroupedMessages] = useState([]);
  const [viewMode, setViewMode] = useState('chat');
  const [selectedDay, setSelectedDay] = useState(null);
  const scrollViewRef = useRef();

  useEffect(() => {
    loadChatHistory();
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      const grouped = groupMessagesByDate(messages);
      setGroupedMessages(grouped);
    }
  }, [messages]);

  const loadChatHistory = async () => {
    try {
      setIsLoading(true);
      const response = await getChatHistoryService();
      if (response.status && response.data) {
        const sortedMessages = response.data.sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );
        setMessages(sortedMessages);
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tải lịch sử trò chuyện');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now(),
      content: inputText.trim(),
      from: 'user',
      date: new Date().toISOString(),
    };

    const currentInput = inputText.trim();

    // Thêm tin nhắn user vào danh sách ngay lập tức
    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Scroll to bottom
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    try {
      const response = await sendChatMessageService(currentInput);
      console.log('Full API response:', JSON.stringify(response, null, 2));

      if (response.status && response.data) {
        let aiContent = '';

        // Thử các cách khác nhau để lấy content
        if (typeof response.data === 'string') {
          aiContent = response.data;
        } else if (response.data.content) {
          aiContent = response.data.content;
        } else {
          // Nếu không tìm thấy content, lấy toàn bộ data
          aiContent = JSON.stringify(response.data);
        }

        if (aiContent && aiContent.trim()) {
          const aiMessage = {
            id: Date.now() + 1,
            content: aiContent.trim(),
            from: 'ai',
            date: new Date().toISOString(),
          };

          setMessages((prev) => [...prev, aiMessage]);
        } else {
          console.warn('No valid AI content found in response');
          Alert.alert('Thông báo', 'AI đã phản hồi nhưng không có nội dung');
        }
      } else {
        console.warn('Invalid response format:', response);
        Alert.alert('Lỗi', 'Không nhận được phản hồi hợp lệ từ AI');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Lỗi', 'Không thể gửi tin nhắn. Vui lòng thử lại.');
    } finally {
      setIsTyping(false);
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 200);
    }
  };

  const handleShowHistory = () => {
    setViewMode('history');
  };

  const handleSelectDay = (dayData) => {
    setSelectedDay(dayData);
    setViewMode('dayView');
  };

  const handleBackToChat = () => {
    setViewMode('chat');
    setSelectedDay(null);
  };

  const handleBackToHistory = () => {
    setViewMode('history');
    setSelectedDay(null);
  };

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
            className={`p-3 rounded-xl ${
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

  const renderTypingIndicator = () => {
    if (!isTyping) return null;

    return (
      <View className='flex-row mb-4 max-w-[85%] self-start justify-start'>
        <View className='w-8 h-8 mr-2.5 self-end'>
          <BlurView
            intensity={90}
            className='w-8 h-8 rounded-2xl items-center justify-center overflow-hidden'
            tint='light'
          >
            <Ionicons name='medical' size={18} color='#407CE2' />
          </BlurView>
        </View>
        <View className='flex-1'>
          <View className='p-3 rounded-[18px] bg-white rounded-bl-1 shadow-sm'>
            <View className='flex-row items-center'>
              <Text className='text-sm text-gray-500 italic'>Đang trả lời</Text>
              <ActivityIndicator
                size='small'
                color='#407CE2'
                className='ml-2'
              />
            </View>
          </View>
        </View>
      </View>
    );
  };

  // Render theo view mode
  if (viewMode === 'history') {
    return (
      <ChatHistory onSelectDay={handleSelectDay} onBack={handleBackToChat} />
    );
  }

  if (viewMode === 'dayView' && selectedDay) {
    return <ChatDayView dayData={selectedDay} onBack={handleBackToHistory} />;
  }

  if (isLoading) {
    return (
      <View className='flex-1 justify-center items-center bg-gray-50'>
        <ActivityIndicator size='large' color='#407CE2' />
      </View>
    );
  }

  return (
    <SafeAreaView className='flex-1 bg-white dark:bg-gray-900'>
      <KeyboardAvoidingView
        className='flex-1 bg-white'
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View className='flex-row items-center justify-between gap-4 mb-4 border-b border-gray-200 p-4'>
          <View className='flex-row items-center justify-start gap-4'>
            <TouchableOpacity onPress={() => router.push('/home')}>
              <ArrowLeft size={24} color='#6B7280' />
            </TouchableOpacity>
            <View>
              <Text className='text-2xl font-montserratBold text-gray-800'>
                Trợ lý AI 🤖
              </Text>
              <Text className='text-gray-500 font-montserratRegular'>
                Hỗ trợ tư vấn y tế
              </Text>
            </View>
          </View>
          <View className='flex-row items-center gap-4'>
            <TouchableOpacity onPress={handleShowHistory}>
              <Ionicons name='time' size={20} color='#407CE2' />
            </TouchableOpacity>
            <TouchableOpacity onPress={loadChatHistory}>
              <Ionicons name='refresh' size={20} color='#407CE2' />
            </TouchableOpacity>
          </View>
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          className='flex-1 p-4 mb-5'
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() =>
            scrollViewRef.current?.scrollToEnd({ animated: true })
          }
        >
          {groupedMessages.length === 0 ? (
            <View className='flex-1 justify-center items-center px-10 pt-25'>
              <Ionicons name='medical' size={60} color='#C7C7CC' />
              <Text className='text-xl font-semibold text-gray-900 mt-4 text-center'>
                Chào mừng đến với Trợ lý Y tế AI
              </Text>
              <Text className='text-base text-gray-500 mt-2 text-center leading-5'>
                Hãy bắt đầu cuộc trò chuyện bằng cách gửi câu hỏi y tế của bạn
              </Text>
              <TouchableOpacity
                className='flex-row items-center bg-blue-50 px-4 py-2 rounded-2xl mt-4'
                onPress={handleShowHistory}
              >
                <Ionicons name='time' size={16} color='#407CE2' />
                <Text className='text-sm text-primary ml-1.5 font-medium'>
                  Xem lịch sử trò chuyện
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            groupedMessages.map((group, groupIndex) => (
              <View key={groupIndex}>
                <DateSeparator date={group.date} />
                {group.messages.map(renderMessage)}
              </View>
            ))
          )}

          {renderTypingIndicator()}
        </ScrollView>

        {/* Input */}
        <View className='bg-white px-4 pt-6 border-t border-gray-200'>
          <View className='flex-row items-center bg-gray-100 rounded-2xl px-4 py-2'>
            <TextInput
              className='flex-1 text-base text-gray-900 max-h-25'
              value={inputText}
              onChangeText={setInputText}
              placeholder='Nhập thắc mắc của bạn ...'
              placeholderTextColor='#8E8E93'
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              className={`w-8 h-8 rounded-2xl items-center justify-center ml-2 ${
                inputText.trim() ? 'bg-primary' : 'bg-transparent'
              }`}
              onPress={handleSendMessage}
              disabled={!inputText.trim() || isTyping}
            >
              <Ionicons
                name='send'
                size={20}
                color={inputText.trim() ? '#FFFFFF' : '#C7C7CC'}
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
