import { VALID_ROLES } from '../constants';

export const getHomeRouteByRole = (user, appendHome = false) => {
  if (!user) return '/(auth)/login';

  const homeSuffix = appendHome ? '/home' : '';

  switch (user.role) {
    case 'student':
      return `/(student)${homeSuffix}`;
    case 'parent':
      return `/(parent)${homeSuffix}`;
    case 'nurse':
      return `/(nurse)${homeSuffix}`;
    default:
      return '/(auth)/login';
  }
};

export const isValidRole = (role) => {
  return VALID_ROLES.includes(role);
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhoneNumber = (phoneNumber) => {
  const phoneRegex = /^0\d{9}$/;
  return phoneRegex.test(phoneNumber);
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

export const formatDate = (dateString) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (error) {
    return dateString;
  }
};

export const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Hàm nhóm tin nhắn theo ngày
export const groupMessagesByDate = (messages) => {
  const grouped = [];
  let currentDate = null;
  let currentGroup = null;

  messages.forEach((message) => {
    const messageDate = new Date(message.date);
    const dateString = formatDateLabel(messageDate);

    if (dateString !== currentDate) {
      if (currentGroup) {
        grouped.push(currentGroup);
      }
      currentGroup = {
        date: dateString,
        messages: [message],
      };
      currentDate = dateString;
    } else {
      currentGroup.messages.push(message);
    }
  });

  if (currentGroup) {
    grouped.push(currentGroup);
  }

  return grouped;
};

// Hàm format label ngày
export const formatDateLabel = (date) => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const messageDate = new Date(date);

  // Reset thời gian về 00:00:00 để so sánh chỉ ngày
  today.setHours(0, 0, 0, 0);
  yesterday.setHours(0, 0, 0, 0);
  messageDate.setHours(0, 0, 0, 0);

  if (messageDate.getTime() === today.getTime()) {
    return 'Hôm nay';
  } else if (messageDate.getTime() === yesterday.getTime()) {
    return 'Hôm qua';
  } else {
    return messageDate.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }
};
