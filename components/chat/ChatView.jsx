import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';
import ChatInput from './ChatInput';
import QuickSuggestions from './QuickSuggestions';

const ChatView = ({
  conversation,
  isTyping,
  typingAnimation,
  input,
  setInput,
  inputRef,
  scrollViewRef,
  showQuickSuggestions,
  quickSuggestions,
  handleSendMessage,
  handleQuickSuggestion,
}) => {
  if (!conversation) return null;

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        onContentSizeChange={() =>
          scrollViewRef.current?.scrollToEnd({ animated: true })
        }
      >
        {conversation.messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            onSuggestionPress={handleQuickSuggestion}
          />
        ))}

        {/* Hiệu ứng AI đang gõ */}
        {isTyping && <TypingIndicator typingAnimation={typingAnimation} />}
      </ScrollView>

      {/* Gợi ý nhanh */}
      {showQuickSuggestions && (
        <QuickSuggestions
          suggestions={quickSuggestions}
          onSuggestionPress={handleQuickSuggestion}
        />
      )}

      {/* Khung nhập tin nhắn */}
      <ChatInput
        input={input}
        setInput={setInput}
        onSend={handleSendMessage}
        inputRef={inputRef}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9FB',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 10,
  },
});

export default ChatView;
