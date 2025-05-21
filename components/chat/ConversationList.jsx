import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import ConversationItem from './ConversationItem';

const ConversationList = ({
  conversations,
  onSelectConversation,
  onDeleteConversation,
  onRenameConversation,
}) => {
  return (
    <View style={styles.conversationsContainer}>
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ConversationItem
            conversation={item}
            onPress={onSelectConversation}
            onDelete={onDeleteConversation}
            onRename={onRenameConversation}
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Không có hội thoại nào</Text>
            <Text style={styles.emptySubText}>
              Tạo một hội thoại mới để bắt đầu
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  conversationsContainer: {
    flex: 1,
    backgroundColor: '#F9F9FB',
  },
  separator: {
    height: 1,
    backgroundColor: '#E5E5EA',
    marginHorizontal: 16,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 18,
    color: '#8E8E93',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: '#8E8E93',
  },
});

export default ConversationList;
