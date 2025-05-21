import React, { useState, useRef, useEffect } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Alert,
  Animated,
} from 'react-native';
import * as Haptics from 'expo-haptics';

// Components
import ChatHeader from './ChatHeader';
import ChatView from './ChatView';
import ConversationList from './ConversationList';
import NewConversationButton from './NewConversationButton';

// Data mẫu
const sampleConversation = {
  id: '1',
  title: 'Hội thoại mới',
  lastUpdate: new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  }),
  messages: [
    {
      id: '1',
      text: 'Xin chào, tôi là trợ lý AI y tế. Tôi có thể giúp gì cho bạn hôm nay?',
      isUser: false,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    },
  ],
};

// Danh sách gợi ý dựa trên ngữ cảnh
const contextSuggestions = {
  sốt: ['Uống nhiều nước', 'Theo dõi nhiệt độ', 'Đến cơ sở y tế gần nhất'],
  'tiêm chủng': [
    'Lịch tiêm cho trẻ sơ sinh',
    'Vắc-xin Covid-19',
    'Tác dụng phụ sau tiêm',
  ],
  'dinh dưỡng': [
    'Bổ sung vitamin',
    'Chế độ ăn cân bằng',
    'Thực phẩm tốt cho miễn dịch',
  ],
};

const ChatScreen = () => {
  // States
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickSuggestions, setShowQuickSuggestions] = useState(true);
  const [viewMode, setViewMode] = useState('conversations'); // 'conversations' hoặc 'chat'
  const [conversations, setConversations] = useState([
    {
      id: '1',
      title: 'Tư vấn về vắc-xin Covid',
      lastUpdate: '09:30',
      messages: [
        {
          id: '1',
          text: 'Xin chào, tôi là trợ lý AI y tế. Tôi có thể giúp gì cho bạn hôm nay?',
          isUser: false,
          timestamp: '09:30',
        },
        {
          id: '2',
          text: 'Tôi muốn biết thông tin về vắc-xin Covid mới nhất',
          isUser: true,
          timestamp: '09:31',
        },
      ],
    },
    {
      id: '2',
      title: 'Triệu chứng đau đầu',
      lastUpdate: 'Hôm qua',
      messages: [
        {
          id: '1',
          text: 'Xin chào, tôi là trợ lý AI y tế. Tôi có thể giúp gì cho bạn hôm nay?',
          isUser: false,
          timestamp: '15:20',
        },
      ],
    },
  ]);
  const [currentConversation, setCurrentConversation] = useState(null);

  // Refs
  const scrollViewRef = useRef();
  const inputRef = useRef();
  const typingAnimation = useRef(new Animated.Value(0)).current;

  // Gợi ý nhanh
  const quickSuggestions = [
    { id: '1', text: 'Tôi cần tư vấn y tế' },
    { id: '2', text: 'Triệu chứng sốt cao kéo dài' },
    { id: '3', text: 'Lịch tiêm chủng' },
    { id: '4', text: 'Dinh dưỡng cho trẻ em' },
  ];

  // Xử lý hiệu ứng đang gõ
  useEffect(() => {
    if (isTyping) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(typingAnimation, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(typingAnimation, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      typingAnimation.setValue(0);
    }
  }, [isTyping]);

  // Tạo cuộc hội thoại mới
  const handleNewConversation = () => {
    const newConversation = {
      ...sampleConversation,
      id: Date.now().toString(),
      lastUpdate: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setConversations([newConversation, ...conversations]);
    setCurrentConversation(newConversation);
    setViewMode('chat');
    setShowQuickSuggestions(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  // Xóa cuộc hội thoại
  const handleDeleteConversation = (id) => {
    Alert.alert('Xóa hội thoại', 'Bạn có chắc chắn muốn xóa hội thoại này?', [
      {
        text: 'Hủy',
        style: 'cancel',
      },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: () => {
          setConversations(conversations.filter((conv) => conv.id !== id));
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        },
      },
    ]);
  };

  // Đổi tên cuộc hội thoại
  const handleRenameConversation = (id, newTitle) => {
    setConversations((prevConversations) =>
      prevConversations.map((conv) => {
        if (conv.id === id) {
          return {
            ...conv,
            title: newTitle,
          };
        }
        return conv;
      })
    );

    // Cập nhật tiêu đề cho cuộc hội thoại hiện tại nếu đang được xem
    if (currentConversation && currentConversation.id === id) {
      setCurrentConversation({
        ...currentConversation,
        title: newTitle,
      });
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  // Chọn hội thoại
  const handleSelectConversation = (conversation) => {
    setCurrentConversation(conversation);
    setViewMode('chat');
    setShowQuickSuggestions(false); // Không hiển thị gợi ý khi vào hội thoại cũ
  };

  // Quay lại danh sách hội thoại
  const handleBackToConversations = () => {
    setViewMode('conversations');
  };

  // Cập nhật tiêu đề hội thoại dựa trên tin nhắn đầu tiên của người dùng
  const updateConversationTitle = (convId, firstUserMessage) => {
    setConversations((prevConversations) =>
      prevConversations.map((conv) => {
        if (conv.id === convId) {
          // Tạo tiêu đề từ tin nhắn người dùng (tối đa 25 ký tự)
          const newTitle =
            firstUserMessage.length > 25
              ? firstUserMessage.substring(0, 25) + '...'
              : firstUserMessage;

          return {
            ...conv,
            title: newTitle,
            lastUpdate: new Date().toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
          };
        }
        return conv;
      })
    );
  };

  // Xử lý gửi tin nhắn
  const handleSendMessage = () => {
    if (input.trim() === '' || !currentConversation) return;

    // Phản hồi xúc giác
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Thêm tin nhắn người dùng
    const userMessage = {
      id: Date.now().toString(),
      text: input,
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    // Cập nhật tin nhắn trong hội thoại hiện tại
    const updatedConversation = {
      ...currentConversation,
      messages: [...currentConversation.messages, userMessage],
      lastUpdate: userMessage.timestamp,
    };

    setCurrentConversation(updatedConversation);

    // Cập nhật danh sách hội thoại
    setConversations((prevConversations) =>
      prevConversations.map((conv) =>
        conv.id === currentConversation.id ? updatedConversation : conv
      )
    );

    // Nếu đây là tin nhắn đầu tiên của người dùng, cập nhật tiêu đề hội thoại
    const isFirstUserMessage = !currentConversation.messages.some(
      (msg) => msg.isUser
    );
    if (isFirstUserMessage) {
      updateConversationTitle(currentConversation.id, input);
    }

    setInput('');
    setShowQuickSuggestions(false);

    // Hiển thị hiệu ứng AI đang gõ
    setTimeout(() => {
      setIsTyping(true);
    }, 1000);

    // Giả lập phản hồi từ AI
    setTimeout(() => {
      setIsTyping(false);

      // Tạo phản hồi dựa trên từ khóa trong tin nhắn người dùng
      let aiResponse = {
        id: (Date.now() + 1).toString(),
        text: 'Tôi đã nhận được câu hỏi của bạn. Đây là một số thông tin có thể giúp ích.',
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      // Thêm phản hồi thông minh dựa trên nội dung
      Object.keys(contextSuggestions).forEach((keyword) => {
        if (input.toLowerCase().includes(keyword)) {
          aiResponse.text = `Tôi có thông tin về "${keyword}". ${aiResponse.text}`;
          aiResponse.suggestions = contextSuggestions[keyword];
        }
      });

      // Cập nhật hội thoại với phản hồi AI
      const conversationWithAIResponse = {
        ...updatedConversation,
        messages: [...updatedConversation.messages, aiResponse],
        lastUpdate: aiResponse.timestamp,
      };

      setCurrentConversation(conversationWithAIResponse);

      // Cập nhật danh sách hội thoại
      setConversations((prevConversations) =>
        prevConversations.map((conv) =>
          conv.id === currentConversation.id ? conversationWithAIResponse : conv
        )
      );
    }, 2500);
  };

  // Xử lý gợi ý nhanh
  const handleQuickSuggestion = (suggestion) => {
    setInput(suggestion.text);
    inputRef.current?.focus();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 50}
    >
      {/* Header */}
      <ChatHeader
        mode={viewMode}
        title={
          viewMode === 'chat' && currentConversation
            ? currentConversation.title
            : null
        }
        onBack={handleBackToConversations}
        onNewConversation={handleNewConversation}
        onSettings={() => {}}
      />

      {/* Nội dung chính */}
      {viewMode === 'conversations' ? (
        <>
          <ConversationList
            conversations={conversations}
            onSelectConversation={handleSelectConversation}
            onDeleteConversation={handleDeleteConversation}
            onRenameConversation={handleRenameConversation}
          />
          <NewConversationButton onPress={handleNewConversation} />
        </>
      ) : (
        <ChatView
          conversation={currentConversation}
          isTyping={isTyping}
          typingAnimation={typingAnimation}
          input={input}
          setInput={setInput}
          inputRef={inputRef}
          scrollViewRef={scrollViewRef}
          showQuickSuggestions={showQuickSuggestions}
          quickSuggestions={quickSuggestions}
          handleSendMessage={handleSendMessage}
          handleQuickSuggestion={handleQuickSuggestion}
        />
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9FB',
  },
});

export default ChatScreen;
