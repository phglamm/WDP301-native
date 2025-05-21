import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ChatHeader = ({ mode, title, onBack, onNewConversation, onSettings }) => {
  if (mode === 'conversations') {
    return (
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{title || 'Trò chuyện Y tế'}</Text>
          </View>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onNewConversation}
          >
            <Ionicons name='add-circle' size={24} color='#407CE2' />
          </TouchableOpacity>
        </View>
      </View>
    );
  } else {
    return (
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Ionicons name='chevron-back' size={24} color='#407CE2' />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{title || 'Trợ lý Y tế'}</Text>
            <View style={styles.statusContainer}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>Trực tuyến</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.iconButton} onPress={onSettings}>
            <Ionicons
              name='information-circle-outline'
              size={24}
              color='#1C1C1E'
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  header: {
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 8,
  },
  titleContainer: {
    flexDirection: 'column',
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CD964',
    marginRight: 6,
  },
  statusText: {
    fontSize: 13,
    color: '#8E8E93',
  },
  iconButton: {
    padding: 8,
  },
});

export default ChatHeader;
