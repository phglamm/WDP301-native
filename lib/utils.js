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

export const formatDate = (date) => {
  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'full',
  }).format(date);
};

export const formatTime = (time) => {
  return new Intl.DateTimeFormat('vi-VN', {
    timeStyle: 'short',
  }).format(time);
};
