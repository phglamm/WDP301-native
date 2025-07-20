import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Alert,
  Linking,
  Share,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import ParentHeader from '../../components/layouts/ParentHeader';
import { getAppointmentDetailService } from '../../services/parentServices';
import { SafeAreaView } from 'react-native-safe-area-context';
import LoadingCustom from '../../components/common/LoadingCustom';
import ParentHeaderSub from '../../components/layouts/ParentHeaderSub';

const InfoItem = ({ emoji, label, value, onPress, isLink = false }) => (
  <TouchableOpacity
    className={`py-3 ${isLink ? 'active:opacity-70' : ''}`}
    onPress={onPress}
    disabled={!isLink}
  >
    <View className='flex-row items-start'>
      <Text className='text-lg mr-3'>{emoji}</Text>
      <View className='flex-1'>
        <Text className='text-gray-500 dark:text-gray-400 text-xs font-medium mb-1 uppercase tracking-wide'>
          {label}
        </Text>
        <Text
          className={`text-base ${
            isLink
              ? 'text-blue-600 dark:text-blue-400'
              : 'text-gray-900 dark:text-white'
          } font-medium`}
        >
          {value}
        </Text>
      </View>
      {isLink && (
        <Text className='text-blue-600 dark:text-blue-400 text-lg ml-2'>↗</Text>
      )}
    </View>
  </TouchableOpacity>
);

const StatusChip = ({ status }) => {
  const getStatus = (status) => {
    switch (status) {
      case 'scheduled':
        return {
          text: 'Đã lên lịch',
          color:
            'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
          emoji: '📅',
        };
      case 'completed':
        return {
          text: 'Hoàn thành',
          color:
            'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
          emoji: '✅',
        };
      case 'cancelled':
        return {
          text: 'Đã hủy',
          color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
          emoji: '❌',
        };
      default:
        return {
          text: status,
          color:
            'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
          emoji: '📋',
        };
    }
  };

  const config = getStatus(status);
  return (
    <View
      className={`px-3 py-1.5 rounded-full flex-row items-center ${config.color} self-start`}
    >
      <Text className='text-xs mr-1'>{config.emoji}</Text>
      <Text
        className={`font-medium text-xs ${config.color
          .split(' ')
          .slice(1)
          .join(' ')}`}
      >
        {config.text}
      </Text>
    </View>
  );
};

const ActionButton = ({ title, onPress, variant = 'primary', emoji }) => {
  const getButtonStyle = (variant) => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-600 dark:bg-blue-500';
      case 'success':
        return 'bg-green-600 dark:bg-green-500';
      case 'secondary':
        return 'bg-gray-200 dark:bg-gray-700';
      default:
        return 'bg-blue-600 dark:bg-blue-500';
    }
  };

  const getTextStyle = (variant) => {
    return variant === 'secondary'
      ? 'text-gray-900 dark:text-white'
      : 'text-white';
  };

  return (
    <TouchableOpacity
      className={`${getButtonStyle(
        variant
      )} rounded-xl py-3 px-4 flex-row items-center justify-center mb-2`}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {emoji && <Text className='mr-2 text-base'>{emoji}</Text>}
      <Text className={`${getTextStyle(variant)} font-semibold text-base`}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const LoadingSkeleton = () => (
  <View className='p-6'>
    <View className='animate-pulse'>
      <View className='h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4 mb-2'></View>
      <View className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-8'></View>

      {[1, 2, 3, 4].map((i) => (
        <View key={i} className='py-3'>
          <View className='h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2'></View>
          <View className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3'></View>
        </View>
      ))}
    </View>
  </View>
);

export default function AppointmentDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAppointmentDetail = async () => {
    try {
      const response = await getAppointmentDetailService(id);
      if (response.data) {
        setAppointment(response.data);
      }
    } catch (error) {
      console.error('Error fetching appointment detail:', error);
      Alert.alert('Lỗi', 'Không thể tải chi tiết lịch hẹn', [
        { text: 'Thử lại', onPress: fetchAppointmentDetail },
        { text: 'Quay lại', onPress: () => router.back() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchAppointmentDetail();
    }
  }, [id]);

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    let dateText;
    if (date.toDateString() === today.toDateString()) {
      dateText = 'Hôm nay';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      dateText = 'Ngày mai';
    } else {
      dateText = date.toLocaleDateString('vi-VN', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      });
    }

    const time = date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    });

    return `${dateText}, ${time}`;
  };

  const handleJoinMeeting = async () => {
    try {
      const supported = await Linking.canOpenURL(appointment.googleMeetLink);
      if (supported) {
        await Linking.openURL(appointment.googleMeetLink);
      } else {
        Alert.alert('Lỗi', 'Không thể mở liên kết cuộc họp');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể mở liên kết cuộc họp');
    }
  };

  const handleShare = async () => {
    const message = `📅 ${appointment.purpose}\n⏰ ${formatDateTime(
      appointment.appointmentTime
    )}\n👩‍⚕️ ${appointment.nurse?.fullName || 'Chưa phân công'}\n${
      appointment.googleMeetLink ? `📹 ${appointment.googleMeetLink}` : ''
    }`;

    try {
      await Share.share({ message });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  if (loading) {
    return <LoadingCustom isLoading={loading} />;
  }

  if (!appointment) {
    return (
      <SafeAreaView className='flex-1 bg-white dark:bg-gray-900'>
        <ParentHeader title='Chi tiết' onBack={() => router.back()} />
        <View className='flex-1 justify-center items-center px-6'>
          <Text className='text-4xl mb-4'>😔</Text>
          <Text className='text-gray-900 dark:text-white font-semibold text-lg mb-2 text-center'>
            Không tìm thấy lịch hẹn
          </Text>
          <TouchableOpacity
            className='bg-blue-600 rounded-xl py-3 px-6 mt-4'
            onPress={() => router.back()}
          >
            <Text className='text-white font-semibold'>Quay lại</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className='flex-1 bg-white dark:bg-gray-900'>
      <ParentHeaderSub
        title='Chi tiết lịch hẹn'
        onBack={() => router.push('/(parent)/appointment')}
      />

      <ScrollView className='flex-1' showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className='p-6 pb-4'>
          <Text className='text-2xl font-bold text-gray-900 dark:text-white mb-3'>
            {appointment.purpose || 'Cuộc hẹn khám'}
          </Text>
          <StatusChip status={appointment.status} />
        </View>

        {/* Details */}
        <View className='px-6 pb-6'>
          <View className='bg-gray-50 dark:bg-gray-800 rounded-2xl p-5'>
            <InfoItem
              emoji='⏰'
              label='Thời gian'
              value={formatDateTime(appointment.appointmentTime)}
            />

            {appointment.nurse && (
              <>
                <InfoItem
                  emoji='👩‍⚕️'
                  label='Y tá phụ trách'
                  value={appointment.nurse.fullName}
                />
                <InfoItem
                  emoji='📞'
                  label='Liên hệ'
                  value={appointment.nurse.phone}
                />
              </>
            )}

            {appointment.googleMeetLink && (
              <InfoItem
                emoji='📹'
                label='Cuộc họp trực tuyến'
                value='Tham gia Google Meet'
                onPress={handleJoinMeeting}
                isLink={true}
              />
            )}

            <InfoItem
              emoji='📝'
              label='Ngày tạo'
              value={new Date(appointment.createdAt).toLocaleDateString(
                'vi-VN'
              )}
            />
          </View>
        </View>

        {/* Actions */}
        <View className='px-6 pb-6'>
          {appointment.googleMeetLink && (
            <ActionButton
              title='Tham gia cuộc họp'
              onPress={handleJoinMeeting}
              variant='success'
              emoji='📹'
            />
          )}

          <ActionButton
            title='Chia sẻ'
            onPress={handleShare}
            variant='primary'
            emoji='📤'
          />

          <ActionButton
            title='Quay lại'
            onPress={() => router.back()}
            variant='secondary'
            emoji='←'
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
