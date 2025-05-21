import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

const ConversationItem = ({ conversation, onPress, onDelete, onRename }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  const handleRenamePress = () => {
    setNewTitle(conversation.title);
    setModalVisible(true);
  };

  const handleSaveTitle = () => {
    if (newTitle.trim()) {
      onRename(conversation.id, newTitle.trim());
    }
    setModalVisible(false);
  };

  const handleCancelRename = () => {
    setModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity
        style={styles.conversationItem}
        onPress={() => onPress(conversation)}
      >
        <View style={styles.conversationContent}>
          <View style={styles.conversationIconContainer}>
            <BlurView
              intensity={90}
              style={styles.conversationIconBlur}
              tint='light'
            >
              <Ionicons name='chatbubble' size={16} color='#407CE2' />
            </BlurView>
          </View>
          <View style={styles.conversationDetails}>
            <Text style={styles.conversationTitle} numberOfLines={1}>
              {conversation.title}
            </Text>
            <Text style={styles.conversationTime}>
              {conversation.lastUpdate}
            </Text>
          </View>
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleRenamePress}
          >
            <Ionicons name='pencil-outline' size={20} color='#8E8E93' />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onDelete(conversation.id)}
          >
            <Ionicons name='trash-outline' size={20} color='#FF3B30' />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      {/* Modal chỉnh sửa tên */}
      <Modal
        animationType='fade'
        transparent
        visible={modalVisible}
        onRequestClose={handleCancelRename}
      >
        <TouchableWithoutFeedback onPress={handleCancelRename}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Đổi tên hội thoại</Text>
                <TextInput
                  style={styles.modalInput}
                  value={newTitle}
                  onChangeText={setNewTitle}
                  autoFocus
                  placeholder='Nhập tên mới'
                />
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.modalCancelButton]}
                    onPress={handleCancelRename}
                  >
                    <Text style={styles.modalCancelText}>Hủy</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.modalSaveButton]}
                    onPress={handleSaveTitle}
                  >
                    <Text style={styles.modalSaveText}>Lưu</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  conversationItem: {
    flexDirection: 'row',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  conversationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  conversationIconContainer: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  conversationIconBlur: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  conversationDetails: {
    flex: 1,
  },
  conversationTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  conversationTime: {
    fontSize: 13,
    color: '#8E8E93',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 22,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#1C1C1E',
  },
  modalInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  modalCancelButton: {
    backgroundColor: '#F2F2F7',
  },
  modalSaveButton: {
    backgroundColor: '#407CE2',
  },
  modalCancelText: {
    color: '#8E8E93',
    fontSize: 16,
    fontWeight: '500',
  },
  modalSaveText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default ConversationItem;
