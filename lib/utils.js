export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
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

export const formatPhoneNumber = (phoneNumber) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(phoneNumber);
};
