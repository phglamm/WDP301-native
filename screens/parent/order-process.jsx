import {
  View,
  Text,
  Alert,
  Linking,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, { useCallback, useEffect, useState, useMemo } from 'react';
import {
  useFocusEffect,
  useGlobalSearchParams,
  useLocalSearchParams,
  useRouter,
} from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function OrderProcess() {
  const router = useRouter();
  const globalParams = useGlobalSearchParams();
  const localParams = useLocalSearchParams();
  const [params, setParams] = useState({});
  const [deepLinkUrl, setDeepLinkUrl] = useState('');

  // Listen for deep links
  useEffect(() => {
    const handleDeepLink = (url) => {
      console.log('Deep link received:', url);
      setDeepLinkUrl(url);

      // Parse URL manually nếu params không được tự động parse
      if (url) {
        const urlObj = new URL(url);
        const searchParams = new URLSearchParams(urlObj.search);
        const parsedParams = {};

        for (const [key, value] of searchParams.entries()) {
          parsedParams[key] = value;
        }

        console.log('Manually parsed params:', parsedParams);
        if (Object.keys(parsedParams).length > 0) {
          setParams((prevParams) => {
            // Chỉ update nếu thực sự có thay đổi
            const isEqual =
              JSON.stringify(prevParams) === JSON.stringify(parsedParams);
            return isEqual ? prevParams : parsedParams;
          });
        }
      }
    };

    // Get initial URL if app was opened via deep link
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink(url);
      }
    });

    // Listen for subsequent deep links
    const subscription = Linking.addEventListener('url', (event) => {
      handleDeepLink(event.url);
    });

    return () => subscription?.remove();
  }, []);

  // Sử dụng useMemo để merge params và tránh re-calculation không cần thiết
  const mergedParams = useMemo(() => {
    return { ...globalParams, ...localParams };
  }, [globalParams, localParams]);

  // Log và xử lý params một cách tối ưu
  useEffect(() => {
    console.log('=== DEBUG PARAMS ===');
    console.log('globalParams:', globalParams);
    console.log('localParams:', localParams);
    console.log('globalParams keys:', Object.keys(globalParams));
    console.log('localParams keys:', Object.keys(localParams));
    console.log('deepLinkUrl:', deepLinkUrl);

    // Kiểm tra từng param cụ thể
    console.log(
      'partnerCode:',
      globalParams.partnerCode || localParams.partnerCode
    );
    console.log('orderId:', globalParams.orderId || localParams.orderId);
    console.log(
      'resultCode:',
      globalParams.resultCode || localParams.resultCode
    );
    console.log('===================');

    // Chỉ update params nếu có thay đổi thực sự
    if (Object.keys(mergedParams).length > 0) {
      setParams((prevParams) => {
        const isEqual =
          JSON.stringify(prevParams) === JSON.stringify(mergedParams);
        return isEqual ? prevParams : mergedParams;
      });
    }
  }, [mergedParams, deepLinkUrl]); // Sử dụng mergedParams thay vì globalParams, localParams riêng lẻ

  // Xử lý success alert riêng biệt để tránh gọi nhiều lần
  useEffect(() => {
    if (mergedParams.resultCode === '0') {
      Alert.alert('Thành công', 'Thanh toán đã được xử lý thành công!');
    }
  }, [mergedParams.resultCode]); // Chỉ depend vào resultCode

  useFocusEffect(
    useCallback(() => {
      console.log('Screen focused - params:', params);
      return () => {
        console.log('Screen unfocused');
      };
    }, [params])
  );

  const isSuccess = params.resultCode === '0';
  const formatAmount = (amount) => {
    if (!amount) return '0';
    return new Intl.NumberFormat('vi-VN').format(amount) + ' VNĐ';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleString('vi-VN');
    } catch (error) {
      return dateString;
    }
  };

  const handleGoHome = () => {
    router.replace('/(tabs)/(parent)');
  };

  const handleViewHistory = () => {
    router.push('/screens/parent/payment-history');
  };

  return (
    <ScrollView className='flex-1 bg-gray-50'>
      {/* Header */}
      <View className='px-4 pt-12 pb-6 bg-white shadow-sm'>
        <View className='flex-row items-center justify-between'>
          <TouchableOpacity onPress={handleGoHome}>
            <Ionicons name='arrow-back' size={24} color='#374151' />
          </TouchableOpacity>
          <Text className='text-lg font-semibold text-gray-900'>
            Kết quả thanh toán
          </Text>
          <View className='w-6' />
        </View>
      </View>

      <View className='flex-1 px-4 py-6'>
        {Object.keys(params).length > 0 ? (
          <>
            {/* Status Card */}
            <View
              className={`p-6 rounded-2xl mb-6 ${
                isSuccess
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-red-50 border border-red-200'
              }`}
            >
              <View className='items-center'>
                <View
                  className={`w-16 h-16 rounded-full items-center justify-center mb-4 ${
                    isSuccess ? 'bg-green-100' : 'bg-red-100'
                  }`}
                >
                  <Ionicons
                    name={isSuccess ? 'checkmark-circle' : 'close-circle'}
                    size={32}
                    color={isSuccess ? '#10B981' : '#EF4444'}
                  />
                </View>

                <Text
                  className={`text-xl font-bold mb-2 ${
                    isSuccess ? 'text-green-800' : 'text-red-800'
                  }`}
                >
                  {isSuccess ? 'Thanh toán thành công!' : 'Thanh toán thất bại'}
                </Text>

                <Text
                  className={`text-lg font-semibold ${
                    isSuccess ? 'text-green-700' : 'text-red-700'
                  }`}
                >
                  {formatAmount(params.amount)}
                </Text>

                <Text
                  className={`text-sm mt-1 ${
                    isSuccess ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {decodeURIComponent(params.message || '')}
                </Text>
              </View>
            </View>

            {/* Payment Details */}
            <View className='p-6 mb-6 bg-white shadow-sm rounded-2xl'>
              <Text className='mb-4 text-lg font-semibold text-gray-900'>
                Chi tiết giao dịch
              </Text>

              <View className='space-y-4'>
                <View className='flex-row items-center justify-between py-2 border-b border-gray-100'>
                  <Text className='text-gray-600'>Mã đơn hàng</Text>
                  <Text
                    className='flex-1 font-medium text-right text-gray-900'
                    numberOfLines={1}
                  >
                    {params.orderId}
                  </Text>
                </View>

                <View className='flex-row items-center justify-between py-2 border-b border-gray-100'>
                  <Text className='text-gray-600'>Mã giao dịch</Text>
                  <Text className='font-medium text-gray-900'>
                    {params.transId}
                  </Text>
                </View>

                <View className='flex-row items-center justify-between py-2 border-b border-gray-100'>
                  <Text className='text-gray-600'>Phương thức</Text>
                  <View className='flex-row items-center'>
                    <Text className='mr-2 font-medium text-gray-900'>MoMo</Text>
                    <View className='px-2 py-1 bg-pink-100 rounded'>
                      <Text className='text-xs font-medium text-pink-700'>
                        E-Wallet
                      </Text>
                    </View>
                  </View>
                </View>

                <View className='flex-row items-center justify-between py-2 border-b border-gray-100'>
                  <Text className='text-gray-600'>Nội dung</Text>
                  <Text
                    className='flex-1 font-medium text-right text-gray-900'
                    numberOfLines={2}
                  >
                    {decodeURIComponent(params.orderInfo || '')}
                  </Text>
                </View>

                <View className='flex-row items-center justify-between py-2 border-b border-gray-100'>
                  <Text className='text-gray-600'>Thời gian</Text>
                  <Text className='font-medium text-gray-900'>
                    {formatDate(params.orderId)}
                  </Text>
                </View>

                <View className='flex-row items-center justify-between py-2'>
                  <Text className='text-gray-600'>Trạng thái</Text>
                  <View
                    className={`px-3 py-1 rounded-full ${
                      isSuccess ? 'bg-green-100' : 'bg-red-100'
                    }`}
                  >
                    <Text
                      className={`text-sm font-medium ${
                        isSuccess ? 'text-green-700' : 'text-red-700'
                      }`}
                    >
                      {isSuccess ? 'Thành công' : 'Thất bại'}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Action Buttons */}
            <View className='space-y-3'>
              <TouchableOpacity
                onPress={handleGoHome}
                className='flex-row items-center justify-center py-4 bg-blue-600 rounded-xl'
              >
                <Ionicons name='home-outline' size={20} color='white' />
                <Text className='ml-2 font-semibold text-white'>
                  Về trang chủ
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleViewHistory}
                className='flex-row items-center justify-center py-4 bg-gray-100 rounded-xl'
              >
                <Ionicons name='receipt-outline' size={20} color='#374151' />
                <Text className='ml-2 font-medium text-gray-700'>
                  Xem lịch sử giao dịch
                </Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View className='items-center p-8 bg-white rounded-2xl'>
            <View className='items-center justify-center w-16 h-16 mb-4 bg-gray-100 rounded-full'>
              <Ionicons name='receipt-outline' size={32} color='#9CA3AF' />
            </View>
            <Text className='mb-2 text-lg font-semibold text-gray-900'>
              Không có thông tin
            </Text>
            <Text className='mb-6 text-center text-gray-600'>
              Không tìm thấy thông tin giao dịch. Vui lòng thử lại sau.
            </Text>
            <TouchableOpacity
              onPress={handleGoHome}
              className='px-6 py-3 bg-blue-600 rounded-xl'
            >
              <Text className='font-medium text-white'>Về trang chủ</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Debug Info - Chỉ hiển thị trong development */}
        {/* {__DEV__ && deepLinkUrl && (
          <View className='p-4 mt-6 bg-gray-100 rounded-xl'>
            <Text className='mb-2 text-xs text-gray-600'>
              Debug - Deep Link URL:
            </Text>
            <Text className='text-xs text-blue-600 break-all'>
              {deepLinkUrl}
            </Text>
          </View>
        )} */}
      </View>
    </ScrollView>
  );
}
