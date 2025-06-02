import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
  Linking,
  Alert,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  Clock,
  DollarSign,
  CheckCircle,
  CreditCard,
  Shield,
  FileText,
  Users,
  Send,
} from 'lucide-react-native';
import StudentDeclareCard from './StudentDeclareCard';
import {
  getAvailableInjectionEventService,
  getInjectionEventHadRegisteredService,
  registerInjectionEventService,
} from '../../services/parentServices';
import { SafeAreaView } from 'react-native-safe-area-context';
import { formatCurrency, formatDateLabel } from '../../lib/utils';
import { useAuthStore } from '../../stores/useAuthStore';

export default function InjectionRegisterForm({ selectedSon, onBack }) {
  const { user } = useAuthStore();
  const userId = user.id;
  const selectedSonId = selectedSon.id;
  const [eventAvailable, setEventAvailable] = useState([]);
  const [eventHadRegistered, setEventHadRegistered] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentData, setPaymentData] = useState(null);

  const isEventRegistered = (eventId) => {
    return eventHadRegistered.some(
      (registered) => registered.injectionEvent.id === eventId
    );
  };

  const fetchEventAvailable = async () => {
    const response = await getAvailableInjectionEventService();
    setEventAvailable(response.data);
    console.log(
      '🚀 ~ fetchEventAvailable ~ response:',
      JSON.stringify(response, null, 2)
    );
  };

  const fetchEventHadRegistered = async () => {
    const response = await getInjectionEventHadRegisteredService(selectedSonId);
    setEventHadRegistered(response.data);
    console.log(
      '🚀 ~ fetchEventHadRegistered ~ response:',
      JSON.stringify(response, null, 2)
    );
  };

  useEffect(() => {
    fetchEventAvailable();
    fetchEventHadRegistered();
  }, []);

  // Hàm xử lý đăng ký event
  const handleRegisterEvent = async (eventId) => {
    try {
      const response = await registerInjectionEventService(
        userId,
        selectedSonId,
        eventId
      );

      if (response.code === 201) {
        setPaymentData({
          paymentUrl: response.data,
          eventId: eventId,
        });
        setShowPaymentModal(true);
        await fetchEventHadRegistered();
      } else {
        Alert.alert('Lỗi', 'Không thể đăng ký sự kiện');
      }
    } catch (error) {
      console.error('Error registering event:', error);
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi đăng ký');
    }
  };

  // Hàm xử lý thanh toán
  const handlePayment = async () => {
    try {
      if (paymentData?.paymentUrl) {
        const supported = await Linking.canOpenURL(paymentData.paymentUrl);
        if (supported) {
          await Linking.openURL(paymentData.paymentUrl);
        } else {
          Alert.alert('Lỗi', 'Không thể mở ứng dụng MoMo');
        }
      }
      setShowPaymentModal(false);
      setPaymentData(null);
    } catch (error) {
      console.error('Error opening payment URL:', error);
      Alert.alert('Lỗi', 'Không thể mở liên kết thanh toán');
    }
  };

  // Hàm đóng modal
  const handleCloseModal = () => {
    setShowPaymentModal(false);
    setPaymentData(null);
  };

  // Component modal xác nhận thanh toán
  const PaymentConfirmModal = () => (
    <Modal
      visible={showPaymentModal}
      transparent={true}
      animationType='fade'
      onRequestClose={handleCloseModal}
    >
      <View className='items-center justify-center flex-1 bg-black/50'>
        <View className='w-full max-w-sm p-6 mx-4 bg-white rounded-xl'>
          <View className='items-center mb-6'>
            <CheckCircle size={64} color='#10B981' />
            <Text className='mt-4 text-xl font-bold text-center text-gray-900'>
              Hoàn tất đăng ký !
            </Text>
            <Text className='mt-2 text-center text-gray-600'>
              Bạn đã đăng ký sự kiện tiêm vaccine thành công. Vui lòng thanh
              toán để hoàn tất đăng ký.
            </Text>
          </View>

          <View className='gap-4 space-y-3'>
            <TouchableOpacity
              onPress={handlePayment}
              className='flex-row items-center justify-center py-4 bg-blue-500 rounded-lg'
            >
              <CreditCard size={20} color='#FFFFFF' />
              <Text className='ml-2 font-semibold text-white'>
                Thanh toán ngay
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleCloseModal}
              className='py-4 bg-gray-100 rounded-lg'
            >
              <Text className='font-medium text-center text-gray-700'>
                Thanh toán sau
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  // Component hiển thị một injection event
  const InjectionEventCard = ({ event, isRegistered = false }) => {
    return (
      <View
        className={`mb-6 mx-1 rounded-2xl border-2 shadow-sm ${
          isRegistered
            ? 'bg-gray-50 border-gray-200'
            : 'bg-white border-blue-100 shadow-blue-50'
        }`}
      >
        {/* Header với status */}
        <View
          className={`p-4 rounded-t-2xl ${
            isRegistered
              ? 'bg-gray-100'
              : 'bg-gradient-to-r from-blue-50 to-indigo-50'
          }`}
        >
          <View className='flex-row items-center justify-between'>
            <View className='flex-row items-center'>
              <View
                className={`p-2 rounded-full ${
                  isRegistered ? 'bg-gray-200' : 'bg-blue-100'
                }`}
              >
                <Shield
                  size={20}
                  color={isRegistered ? '#9CA3AF' : '#3B82F6'}
                />
              </View>
              <View className='ml-3'>
                <Text
                  className={`text-lg font-bold ${
                    isRegistered ? 'text-gray-600' : 'text-gray-800'
                  }`}
                >
                  Sự kiện #{event.id}
                </Text>
                <Text
                  className={`text-md font-semibold ${
                    isRegistered ? 'text-gray-500' : 'text-blue-600'
                  }`}
                >
                  {event.vaccination.name}
                </Text>
              </View>
            </View>

            {isRegistered && (
              <View className='px-3 py-1.5 bg-green-100 rounded-full border border-green-200'>
                <Text className='text-xs font-semibold text-green-700'>
                  ✓ Đã đăng ký
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Content */}
        <View className='p-4 space-y-4'>
          {/* Vaccine Description */}
          <View className='p-3 border border-blue-100 bg-blue-50 rounded-xl'>
            <View className='flex-row items-start'>
              <FileText size={16} color='#3B82F6' className='mt-0.5' />
              <View className='flex-1 ml-3'>
                <Text className='text-sm font-medium text-blue-900'>
                  Mô tả vaccine
                </Text>
                <Text className='mt-1 text-sm leading-5 text-blue-700'>
                  {event.vaccination.description}
                </Text>
              </View>
            </View>
          </View>

          {/* Event Details */}
          <View className='space-y-3'>
            {/* Date */}
            <View className='flex-row items-center p-3 bg-gray-50 rounded-xl'>
              <View
                className={`p-2 rounded-full ${
                  isRegistered ? 'bg-gray-200' : 'bg-green-100'
                }`}
              >
                <Calendar
                  size={16}
                  color={isRegistered ? '#9CA3AF' : '#10B981'}
                />
              </View>
              <View className='ml-3'>
                <Text className='text-xs font-medium tracking-wide text-gray-500 uppercase'>
                  Ngày tiêm vaccine
                </Text>
                <Text
                  className={`text-sm font-semibold ${
                    isRegistered ? 'text-gray-600' : 'text-gray-800'
                  }`}
                >
                  {formatDateLabel(event.date)}
                </Text>
              </View>
            </View>

            {/* Registration Period */}
            <View className='flex-row items-center p-3 bg-gray-50 rounded-xl'>
              <View
                className={`p-2 rounded-full ${
                  isRegistered ? 'bg-gray-200' : 'bg-orange-100'
                }`}
              >
                <Clock size={16} color={isRegistered ? '#9CA3AF' : '#F97316'} />
              </View>
              <View className='flex-1 ml-3'>
                <Text className='text-xs font-medium tracking-wide text-gray-500 uppercase'>
                  Thời gian đăng ký
                </Text>
                <Text
                  className={`text-sm font-semibold ${
                    isRegistered ? 'text-gray-600' : 'text-gray-800'
                  }`}
                >
                  {formatDateLabel(event.registrationOpenDate)}
                </Text>
                <Text
                  className={`text-xs ${
                    isRegistered ? 'text-gray-500' : 'text-gray-600'
                  }`}
                >
                  đến {formatDateLabel(event.registrationCloseDate)}
                </Text>
              </View>
            </View>

            {/* Price */}
            <View className='flex-row items-center p-3 bg-gray-50 rounded-xl'>
              <View
                className={`p-2 rounded-full ${
                  isRegistered ? 'bg-gray-200' : 'bg-purple-100'
                }`}
              >
                <DollarSign
                  size={16}
                  color={isRegistered ? '#9CA3AF' : '#8B5CF6'}
                />
              </View>
              <View className='ml-3'>
                <Text className='text-xs font-medium tracking-wide text-gray-500 uppercase'>
                  Chi phí
                </Text>
                <Text
                  className={`text-lg font-bold ${
                    isRegistered ? 'text-gray-600' : 'text-purple-600'
                  }`}
                >
                  {formatCurrency(event.price)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Action Button */}
        {!isRegistered && (
          <View className='p-4 pt-0'>
            <TouchableOpacity
              onPress={() => handleRegisterEvent(event.id)}
              className='flex-row items-center justify-center py-4 bg-blue-500 rounded-xl'
            >
              <Send size={20} color='#FFFFFF' />
              <Text className='ml-2 text-base font-bold text-white'>
                Đăng ký ngay
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView className='flex-1 bg-gray-50'>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className='flex-1'
      >
        <View className='flex-1'>
          {/* Header */}
          <View className='flex-row items-center justify-between p-4 bg-white border-b border-gray-200'>
            <TouchableOpacity onPress={onBack} className='p-1'>
              <ArrowLeft size={20} color='#407CE2' />
            </TouchableOpacity>
            <Text className='text-lg font-semibold text-gray-900'>
              Đăng ký sự kiện tiêm vaccine
            </Text>
            <View className='w-8' />
          </View>

          <ScrollView className='flex-1'>
            {/* Student Info */}
            <StudentDeclareCard selectedSon={selectedSon} />

            {/* Injection events registered */}
            {eventHadRegistered.length > 0 && (
              <View className='p-4'>
                <Text className='mb-4 text-xl font-semibold text-gray-800'>
                  Sự kiện đã đăng ký ({eventHadRegistered.length})
                </Text>
                {eventHadRegistered.map((registered) => (
                  <InjectionEventCard
                    key={registered.id}
                    event={registered.injectionEvent}
                    isRegistered={true}
                  />
                ))}
              </View>
            )}

            {/* Available injection events */}
            <View className='p-4'>
              <Text className='mb-4 text-xl font-semibold text-gray-800'>
                Sự kiện có thể đăng ký
              </Text>
              {eventAvailable.length > 0 ? (
                eventAvailable
                  .filter((event) => !isEventRegistered(event.id))
                  .map((event) => (
                    <InjectionEventCard
                      key={event.id}
                      event={event}
                      isRegistered={false}
                    />
                  ))
              ) : (
                <View className='items-center p-8'>
                  <Text className='text-center text-gray-500'>
                    Hiện tại không có sự kiện tiêm vaccine nào có thể đăng ký
                  </Text>
                </View>
              )}

              {/* Hiển thị thông báo khi không có event nào có thể đăng ký (tất cả đã đăng ký) */}
              {eventAvailable.length > 0 &&
                eventAvailable.filter((event) => !isEventRegistered(event.id))
                  .length === 0 && (
                  <View className='items-center p-8'>
                    <Text className='text-center text-gray-500'>
                      Bạn đã đăng ký tất cả sự kiện tiêm vaccine có sẵn
                    </Text>
                  </View>
                )}
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>

      {/* Payment Confirmation Modal */}
      <PaymentConfirmModal />
    </SafeAreaView>
  );
}
