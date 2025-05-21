import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

const TypingIndicator = ({ typingAnimation }) => {
  return (
    <View style={styles.typingContainer}>
      <View style={styles.avatarContainer}>
        <BlurView intensity={90} style={styles.avatarBlur} tint='light'>
          <Ionicons name='medkit' size={20} color='#407CE2' />
        </BlurView>
      </View>
      <View style={styles.typingBubble}>
        <Animated.View
          style={[
            styles.typingDot,
            {
              opacity: typingAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [0.3, 1],
              }),
            },
          ]}
        />
        <Animated.View
          style={[
            styles.typingDot,
            {
              opacity: typingAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [0.5, 1],
              }),
            },
          ]}
        />
        <Animated.View
          style={[
            styles.typingDot,
            {
              opacity: typingAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [0.7, 1],
              }),
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  typingContainer: {
    flexDirection: 'row',
    marginBottom: 16,
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
  typingBubble: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#407CE2',
    marginHorizontal: 2,
  },
});

export default TypingIndicator;
