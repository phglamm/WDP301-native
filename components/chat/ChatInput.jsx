import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ChatInput = ({ input, setInput, onSend, inputRef }) => {
  return (
    <View style={styles.inputContainer}>
      <TouchableOpacity style={styles.attachButton}>
        <Ionicons name='add-circle-outline' size={24} color='#8E8E93' />
      </TouchableOpacity>
      <View style={styles.textInputContainer}>
        <TextInput
          ref={inputRef}
          style={styles.textInput}
          placeholder='Nhập câu hỏi...'
          placeholderTextColor='#8E8E93'
          value={input}
          onChangeText={setInput}
          multiline
          maxHeight={80}
        />
      </View>
      <TouchableOpacity
        style={[styles.sendButton, input.trim() ? styles.sendButtonActive : {}]}
        onPress={onSend}
        disabled={!input.trim()}
      >
        <Ionicons
          name='arrow-up'
          size={20}
          color={input.trim() ? '#FFFFFF' : '#BDBDBD'}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  attachButton: {
    paddingRight: 8,
  },
  textInputContainer: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    borderRadius: 20,
    paddingHorizontal: 12,
    marginHorizontal: 8,
  },
  textInput: {
    fontSize: 15,
    paddingVertical: 8,
    maxHeight: 80,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E5E5EA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonActive: {
    backgroundColor: '#407CE2',
  },
});

export default ChatInput;
