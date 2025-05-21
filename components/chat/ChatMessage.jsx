import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

const ChatMessage = ({ message, onSuggestionPress }) => {
  const { isUser, text, timestamp, suggestions } = message;

  return (
    <View
      style={[
        styles.messageRow,
        isUser ? styles.userMessageRow : styles.aiMessageRow,
      ]}
    >
      {!isUser && (
        <View style={styles.avatarContainer}>
          <BlurView intensity={90} style={styles.avatarBlur} tint='light'>
            <Ionicons name='medkit' size={20} color='#407CE2' />
          </BlurView>
        </View>
      )}
      <View style={styles.messageBubbleContainer}>
        <View
          style={[
            styles.messageBubble,
            isUser ? styles.userBubble : styles.aiBubble,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isUser ? styles.userMessageText : styles.aiMessageText,
            ]}
          >
            {text}
          </Text>
        </View>
        <Text style={styles.timestamp}>{timestamp}</Text>

        {/* Hiển thị gợi ý phản hồi nếu có */}
        {!isUser && suggestions && (
          <View style={styles.contextSuggestionsContainer}>
            {suggestions.map((suggestion, index) => (
              <TouchableOpacity
                key={index}
                style={styles.contextSuggestion}
                onPress={() => onSuggestionPress({ text: suggestion })}
              >
                <Text style={styles.contextSuggestionText}>{suggestion}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  messageRow: {
    flexDirection: 'row',
    marginBottom: 16,
    maxWidth: '95%',
  },
  userMessageRow: {
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
  },
  aiMessageRow: {
    justifyContent: 'flex-start',
    alignSelf: 'flex-start',
  },
  avatarContainer: {
    width: 34,
    height: 34,
    marginRight: 10,
    alignSelf: 'flex-end',
  },
  avatarBlur: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  messageBubbleContainer: {
    maxWidth: '80%',
  },
  messageBubble: {
    padding: 12,
    borderRadius: 18,
  },
  userBubble: {
    backgroundColor: '#407CE2',
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  aiMessageText: {
    color: '#1C1C1E',
  },
  timestamp: {
    fontSize: 11,
    color: '#8E8E93',
    marginTop: 4,
    marginLeft: 4,
  },
  contextSuggestionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  contextSuggestion: {
    backgroundColor: '#F5F5F7',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  contextSuggestionText: {
    fontSize: 13,
    color: '#407CE2',
  },
});

export default ChatMessage;
