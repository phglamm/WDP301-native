import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';

const QuickSuggestions = ({ suggestions, onSuggestionPress }) => {
  return (
    <View style={styles.quickSuggestionsContainer}>
      <Text style={styles.quickSuggestionsTitle}>Bạn có thể hỏi:</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.quickSuggestionsScrollContent}
      >
        {suggestions.map((suggestion) => (
          <TouchableOpacity
            key={suggestion.id}
            style={styles.quickSuggestion}
            onPress={() => onSuggestionPress(suggestion)}
          >
            <Text style={styles.quickSuggestionText}>{suggestion.text}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  quickSuggestionsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F9F9FB',
  },
  quickSuggestionsTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8E8E93',
    marginBottom: 8,
  },
  quickSuggestionsScrollContent: {
    paddingRight: 16,
  },
  quickSuggestion: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  quickSuggestionText: {
    fontSize: 14,
    color: '#407CE2',
  },
});

export default QuickSuggestions;
