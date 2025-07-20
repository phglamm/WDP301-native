import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  RefreshControl,
  Alert,
  TextInput,
  Animated,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import ParentHeader from '../../components/layouts/ParentHeader';
import { getAppointmentService } from '../../services/parentServices';
import { SafeAreaView } from 'react-native-safe-area-context';

// Enhanced Icons with better styling
const CalendarIcon = ({ color = '#3B82F6' }) => (
  <View
    className='w-6 h-6 rounded-lg flex items-center justify-center'
    style={{ backgroundColor: color + '20' }}
  >
    <Text className='text-sm font-bold'>📅</Text>
  </View>
);

const ClockIcon = ({ color = '#10B981' }) => (
  <View
    className='w-6 h-6 rounded-lg flex items-center justify-center'
    style={{ backgroundColor: color + '20' }}
  >
    <Text className='text-sm'>⏰</Text>
  </View>
);

const VideoIcon = ({ color = '#8B5CF6' }) => (
  <View
    className='w-6 h-6 rounded-lg flex items-center justify-center'
    style={{ backgroundColor: color + '20' }}
  >
    <Text className='text-sm'>📹</Text>
  </View>
);

const SearchIcon = () => <Text className='text-gray-400 text-lg'>🔍</Text>;

const ClearIcon = () => <Text className='text-gray-400 text-lg'>✕</Text>;

// Enhanced Search Bar Component
const SearchBar = ({
  searchQuery,
  setSearchQuery,
  onFocus,
  onBlur,
  focused,
}) => (
  <View className='mx-4 mb-4'>
    <View
      className={`flex-row items-center bg-white dark:bg-gray-800 rounded-2xl px-4 py-3 shadow-sm border ${
        focused ? 'border-blue-500' : 'border-gray-200 dark:border-gray-700'
      }`}
    >
      <SearchIcon />
      <TextInput
        className='flex-1 ml-3 text-gray-900 dark:text-white text-base'
        placeholder='Tìm kiếm lịch hẹn...'
        placeholderTextColor='#9CA3AF'
        value={searchQuery}
        onChangeText={setSearchQuery}
        onFocus={onFocus}
        onBlur={onBlur}
      />
      {searchQuery.length > 0 && (
        <TouchableOpacity onPress={() => setSearchQuery('')} className='ml-2'>
          <ClearIcon />
        </TouchableOpacity>
      )}
    </View>
  </View>
);

// Enhanced Appointment Card
const AppointmentCard = ({ appointment, onPress, index }) => {
  const appointmentDate = new Date(appointment.appointmentTime);
  const animatedValue = new Animated.Value(0);

  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 300,
      delay: index * 100,
      useNativeDriver: true,
    }).start();
  }, []);

  const formatDate = (date) => {
    return date.toLocaleDateString('vi-VN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusConfig = (status) => {
    const configs = {
      scheduled: {
        bgColor: '#EFF6FF',
        textColor: '#1D4ED8',
        label: 'Đã lên lịch',
        dotColor: '#3B82F6',
      },
      completed: {
        bgColor: '#F0FDF4',
        textColor: '#166534',
        label: 'Hoàn thành',
        dotColor: '#10B981',
      },
      cancelled: {
        bgColor: '#FEF2F2',
        textColor: '#DC2626',
        label: 'Đã hủy',
        dotColor: '#EF4444',
      },
    };
    return configs[status] || configs.scheduled;
  };

  const statusConfig = getStatusConfig(appointment.status);

  return (
    <Animated.View
      style={{
        opacity: animatedValue,
        transform: [
          {
            translateY: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [20, 0],
            }),
          },
        ],
      }}
    >
      <TouchableOpacity
        className='bg-white dark:bg-gray-800 rounded-2xl p-5 mb-3 shadow-sm border border-gray-100 dark:border-gray-700'
        onPress={() => onPress(appointment.id)}
        activeOpacity={0.8}
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 2,
        }}
      >
        {/* Header với status */}
        <View className='flex-row justify-between items-start mb-4'>
          <View className='flex-1'>
            <Text
              className='text-lg font-bold text-gray-900 dark:text-white mb-2'
              numberOfLines={2}
            >
              {appointment.purpose || 'Cuộc hẹn'}
            </Text>
            <View
              className='self-start px-3 py-1.5 rounded-full flex-row items-center'
              style={{ backgroundColor: statusConfig.bgColor }}
            >
              <View
                className='w-2 h-2 rounded-full mr-2'
                style={{ backgroundColor: statusConfig.dotColor }}
              />
              <Text
                className='text-xs font-semibold'
                style={{ color: statusConfig.textColor }}
              >
                {statusConfig.label}
              </Text>
            </View>
          </View>
        </View>

        {/* Thông tin chi tiết */}
        <View className='space-y-3'>
          <View className='flex-row items-center'>
            <CalendarIcon />
            <Text className='ml-3 text-gray-700 dark:text-gray-300 font-medium'>
              {formatDate(appointmentDate)}
            </Text>
          </View>

          <View className='flex-row items-center'>
            <ClockIcon />
            <Text className='ml-3 text-gray-700 dark:text-gray-300 font-medium'>
              {formatTime(appointmentDate)}
            </Text>
          </View>

          {appointment.googleMeetLink && (
            <View className='flex-row items-center'>
              <VideoIcon />
              <Text className='ml-3 text-purple-600 dark:text-purple-400 font-medium'>
                Cuộc họp trực tuyến
              </Text>
            </View>
          )}
        </View>

        {/* Footer */}
        <View className='mt-4 pt-3 border-t border-gray-100 dark:border-gray-700'>
          <Text className='text-xs text-gray-400 dark:text-gray-500'>
            Tạo: {new Date(appointment.createdAt).toLocaleDateString('vi-VN')}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Enhanced Empty State
const EmptyState = ({ hasSearch }) => (
  <View className='flex-1 justify-center items-center py-16'>
    <View className='w-32 h-32 bg-blue-100 dark:bg-gray-700 rounded-3xl items-center justify-center mb-6'>
      <Text className='text-6xl opacity-60'>{hasSearch ? '🔍' : '📅'}</Text>
    </View>
    <Text className='text-xl font-bold text-gray-900 dark:text-white mb-3'>
      {hasSearch ? 'Không tìm thấy kết quả' : 'Chưa có lịch hẹn nào'}
    </Text>
    <Text className='text-gray-500 dark:text-gray-400 text-center px-8 leading-relaxed'>
      {hasSearch
        ? 'Thử tìm kiếm với từ khóa khác'
        : 'Các lịch hẹn của bạn sẽ xuất hiện ở đây khi bạn tạo cuộc hẹn mới'}
    </Text>
  </View>
);

// Enhanced Loading Cards
const LoadingCard = ({ index }) => {
  const animatedValue = new Animated.Value(0);

  React.useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    setTimeout(() => animation.start(), index * 200);

    return () => animation.stop();
  }, []);

  return (
    <View className='bg-white dark:bg-gray-800 rounded-2xl p-5 mb-3 shadow-sm border border-gray-100 dark:border-gray-700'>
      <Animated.View
        style={{
          opacity: animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0.3, 1],
          }),
        }}
      >
        <View className='h-5 bg-gray-200 dark:bg-gray-600 rounded-lg w-3/4 mb-3'></View>
        <View className='h-4 bg-gray-200 dark:bg-gray-600 rounded-lg w-1/3 mb-4'></View>
        <View className='space-y-2'>
          <View className='h-4 bg-gray-200 dark:bg-gray-600 rounded-lg w-1/2'></View>
          <View className='h-4 bg-gray-200 dark:bg-gray-600 rounded-lg w-1/3'></View>
        </View>
      </Animated.View>
    </View>
  );
};

// Stats Component
const StatsBar = ({ appointments }) => {
  const stats = {
    total: appointments.length,
    scheduled: appointments.filter((a) => a.status === 'scheduled').length,
    completed: appointments.filter((a) => a.status === 'completed').length,
    cancelled: appointments.filter((a) => a.status === 'cancelled').length,
  };

  return (
    <View className='mx-4 mb-4'>
      <View className='bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700'>
        <Text className='text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3'>
          Thống kê
        </Text>
        <View className='flex-row justify-between'>
          <View className='items-center'>
            <Text className='text-2xl font-bold text-gray-900 dark:text-white'>
              {stats.total}
            </Text>
            <Text className='text-xs text-gray-500'>Tổng</Text>
          </View>
          <View className='items-center'>
            <Text className='text-2xl font-bold text-blue-600'>
              {stats.scheduled}
            </Text>
            <Text className='text-xs text-gray-500'>Đã lên lịch</Text>
          </View>
          <View className='items-center'>
            <Text className='text-2xl font-bold text-green-600'>
              {stats.completed}
            </Text>
            <Text className='text-xs text-gray-500'>Hoàn thành</Text>
          </View>
          <View className='items-center'>
            <Text className='text-2xl font-bold text-red-600'>
              {stats.cancelled}
            </Text>
            <Text className='text-xs text-gray-500'>Đã hủy</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default function AppointmentScreen() {
  const router = useRouter();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  const fetchAppointments = async () => {
    try {
      const response = await getAppointmentService();
      if (response.data) {
        setAppointments(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
      Alert.alert(
        'Lỗi',
        'Không thể tải danh sách lịch hẹn. Vui lòng thử lại.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAppointments();
    setRefreshing(false);
  };

  // Thay thế useEffect bằng useFocusEffect để reload data khi screen được focus
  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      fetchAppointments();
    }, [])
  );

  const handleAppointmentPress = (appointmentId) => {
    router.push({
      pathname: '/(parent)/appointment-detail',
      params: { id: appointmentId },
    });
  };

  // Simplified filtering - only search query
  const filteredAppointments = appointments
    .filter((appointment) => {
      // Filter by search query only
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return (
          appointment.purpose?.toLowerCase().includes(query) ||
          new Date(appointment.appointmentTime)
            .toLocaleDateString('vi-VN')
            .includes(query) ||
          appointment.status?.toLowerCase().includes(query)
        );
      }

      return true;
    })
    .sort((a, b) => new Date(b.appointmentTime) - new Date(a.appointmentTime));

  return (
    <SafeAreaView className='flex-1 bg-gray-50 dark:bg-gray-900'>
      <ParentHeader
        title='Lịch hẹn 📅'
        description='Quản lý lịch hẹn của bạn'
        onBack={() => router.back()}
      />

      {/* Search Bar */}
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onFocus={() => setSearchFocused(true)}
        onBlur={() => setSearchFocused(false)}
        focused={searchFocused}
      />

      {/* Stats Bar */}
      {!loading && appointments.length > 0 && (
        <StatsBar appointments={appointments} />
      )}

      <ScrollView
        className='flex-1 px-4'
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#3B82F6']}
            tintColor='#3B82F6'
          />
        }
      >
        <View className='py-2 pb-6'>
          {loading ? (
            <>
              <LoadingCard index={0} />
              <LoadingCard index={1} />
              <LoadingCard index={2} />
            </>
          ) : filteredAppointments.length > 0 ? (
            <>
              <View className='mb-4'>
                <Text className='text-sm font-medium text-gray-600 dark:text-gray-400'>
                  {filteredAppointments.length} kết quả
                  {searchQuery && ` cho "${searchQuery}"`}
                </Text>
              </View>
              {filteredAppointments.map((appointment, index) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  onPress={handleAppointmentPress}
                  index={index}
                />
              ))}
            </>
          ) : (
            <EmptyState hasSearch={searchQuery.trim().length > 0} />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
