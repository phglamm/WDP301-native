import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const NewConversationButton = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.floatingButton} onPress={onPress}>
      <Ionicons name='add' size={30} color='#FFFFFF' />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#407CE2',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
});

export default NewConversationButton;
