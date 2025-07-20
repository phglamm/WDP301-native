import { ScrollView, Text, View, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import ParentHeaderSub from '../layouts/ParentHeaderSub';
import { getInjectionEventResultService } from '../../services/parentServices';
import { formatCurrency, formatDate } from '../../lib/utils';
import { ChevronRight } from 'lucide-react-native';
import InjectionRegisterReport from './InjectionRegisterReport';

export default function InjectionRegisterResult({ selectedSon, onBack }) {
  const [result, setResult] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [currentView, setCurrentView] = useState('result'); // result, report
  const [injectionId, setInjectionId] = useState(null);

  const fetchInjectionEventResult = async () => {
    try {
      const response = await getInjectionEventResultService(selectedSon.id);
      if (response.data) {
        setResult(response.data);
      }
    } catch (error) {
      console.log('Error fetching injection event result: ', error);
    }
  };

  const handleReport = (injectionId) => {
    setCurrentView('report');
    setInjectionId(injectionId);
  };

  useEffect(() => {
    fetchInjectionEventResult();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 border-green-300 dark:bg-green-900 dark:border-green-600';
      case 'scheduled':
        return 'bg-blue-100 border-blue-300 dark:bg-blue-900 dark:border-blue-600';
      case 'cancelled':
        return 'bg-red-100 border-red-300 dark:bg-red-900 dark:border-red-600';
      default:
        return 'bg-gray-100 border-gray-300 dark:bg-gray-800 dark:border-gray-600';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Đã tiêm';
      case 'scheduled':
        return 'Đã lên lịch';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return 'Chưa xác định';
    }
  };

  const getStatusTextColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-700 dark:text-green-300';
      case 'scheduled':
        return 'text-blue-700 dark:text-blue-300';
      case 'cancelled':
        return 'text-red-700 dark:text-red-300';
      default:
        return 'text-gray-700 dark:text-gray-300';
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const renderInjectionCard = (injection) => {
    const isExpanded = expandedId === injection.id;

    return (
      <View key={injection.id} className='mb-4 mx-4'>
        <TouchableOpacity
          onPress={() => toggleExpand(injection.id)}
          className={`rounded-xl border-2 ${getStatusColor(
            injection.injectionStatus
          )} p-4`}
        >
          {/* Header Card */}
          <View className='flex-row items-center justify-between mb-3'>
            <View className='flex-1'>
              <Text className='text-lg font-bold text-gray-800 dark:text-white mb-1'>
                {injection.injectionEvent?.name || 'Chưa có tên'}
              </Text>
              <View className='flex-row items-center'>
                <View
                  className={`px-3 py-1 rounded-full ${getStatusColor(
                    injection.injectionStatus
                  )}`}
                >
                  <Text
                    className={`text-sm font-semibold ${getStatusTextColor(
                      injection.injectionStatus
                    )}`}
                  >
                    {getStatusText(injection.injectionStatus)}
                  </Text>
                </View>
              </View>
            </View>
            <View className='items-end'>
              <Text className='text-sm text-gray-600 dark:text-gray-300'>
                {formatDate(injection.injectionEvent?.date)}
              </Text>
              <Text className='text-sm font-semibold text-gray-800 dark:text-white mt-1'>
                {formatCurrency(injection.injectionEvent?.price)}
              </Text>
            </View>
          </View>

          {/* Basic Info */}
          <View className='border-t border-gray-200 dark:border-gray-600 pt-3'>
            <View className='flex-row justify-between mb-2'>
              <Text className='text-sm text-gray-600 dark:text-gray-400'>
                Ngày đăng ký:
              </Text>
              <Text className='text-sm font-medium text-gray-800 dark:text-white'>
                {formatDate(injection.registrationDate)}
              </Text>
            </View>

            {injection.preInjectionTemperature && (
              <View className='flex-row justify-between mb-2'>
                <Text className='text-sm text-gray-600 dark:text-gray-400'>
                  Nhiệt độ trước tiêm:
                </Text>
                <Text className='text-sm font-medium text-gray-800 dark:text-white'>
                  {injection.preInjectionTemperature}°C
                </Text>
              </View>
            )}

            {injection.eligibleForInjection !== null && (
              <View className='flex-row justify-between mb-2'>
                <Text className='text-sm text-gray-600 dark:text-gray-400'>
                  Đủ điều kiện tiêm:
                </Text>
                <Text
                  className={`text-sm font-medium ${
                    injection.eligibleForInjection
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {injection.eligibleForInjection ? 'Có' : 'Không'}
                </Text>
              </View>
            )}
          </View>
          <View className='flex-row justify-end items-center'>
            <TouchableOpacity
              onPress={() => handleReport(injection.id)}
              className='flex-row items-center justify-center p-2 dark:bg-gray-800 rounded-lg bg-orange-500'
            >
              <Text className='text-sm text-white mr-2'>Báo cáo</Text>
              <ChevronRight size={16} color='#fff' />
            </TouchableOpacity>
          </View>

          {/* Expand/Collapse indicator */}
          <View className='flex-row justify-center mt-3 pt-2 border-t border-gray-200 dark:border-gray-600'>
            <Text className='text-xs text-gray-500 dark:text-gray-400'>
              {isExpanded ? '▲ Thu gọn' : '▼ Xem chi tiết'}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Expanded Details */}
        {isExpanded && (
          <View className='mt-3 mx-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600'>
            <Text className='text-lg font-semibold text-gray-800 dark:text-white mb-3'>
              Chi tiết tiêm chủng
            </Text>

            {/* Pre-injection details */}
            <View className='mb-4'>
              <Text className='text-base font-medium text-gray-700 dark:text-gray-300 mb-2'>
                Trước khi tiêm:
              </Text>

              {injection.hasPreExistingConditions !== null && (
                <View className='flex-row justify-between mb-1'>
                  <Text className='text-sm text-gray-600 dark:text-gray-400'>
                    Có bệnh lý nền:
                  </Text>
                  <Text className='text-sm text-gray-800 dark:text-white'>
                    {injection.hasPreExistingConditions ? 'Có' : 'Không'}
                  </Text>
                </View>
              )}

              {injection.preExistingConditions && (
                <View className='mb-1'>
                  <Text className='text-sm text-gray-600 dark:text-gray-400'>
                    Bệnh lý nền:
                  </Text>
                  <Text className='text-sm text-gray-800 dark:text-white mt-1'>
                    {injection.preExistingConditions}
                  </Text>
                </View>
              )}

              {injection.preInjectionHealthNotes && (
                <View className='mb-1'>
                  <Text className='text-sm text-gray-600 dark:text-gray-400'>
                    Ghi chú sức khỏe:
                  </Text>
                  <Text className='text-sm text-gray-800 dark:text-white mt-1'>
                    {injection.preInjectionHealthNotes}
                  </Text>
                </View>
              )}

              {injection.deferralReason && (
                <View className='mb-1'>
                  <Text className='text-sm text-gray-600 dark:text-gray-400'>
                    Lý do hoãn:
                  </Text>
                  <Text className='text-sm text-red-600 dark:text-red-400 mt-1'>
                    {injection.deferralReason}
                  </Text>
                </View>
              )}
            </View>

            {/* Injection details */}
            {injection.injectionSite && (
              <View className='mb-4'>
                <Text className='text-base font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Thông tin tiêm:
                </Text>
                <View className='flex-row justify-between mb-1'>
                  <Text className='text-sm text-gray-600 dark:text-gray-400'>
                    Vị trí tiêm:
                  </Text>
                  <Text className='text-sm text-gray-800 dark:text-white'>
                    {injection.injectionSite}
                  </Text>
                </View>
              </View>
            )}

            {/* Post-injection details */}
            {(injection.postInjectionTemperature ||
              injection.sideEffects ||
              injection.healthStatus) && (
              <View className='mb-4'>
                <Text className='text-base font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Sau khi tiêm:
                </Text>

                {injection.postInjectionTemperature && (
                  <View className='flex-row justify-between mb-1'>
                    <Text className='text-sm text-gray-600 dark:text-gray-400'>
                      Nhiệt độ:
                    </Text>
                    <Text className='text-sm text-gray-800 dark:text-white'>
                      {injection.postInjectionTemperature}°C
                    </Text>
                  </View>
                )}

                {injection.healthStatus && (
                  <View className='flex-row justify-between mb-1'>
                    <Text className='text-sm text-gray-600 dark:text-gray-400'>
                      Tình trạng sức khỏe:
                    </Text>
                    <Text className='text-sm text-gray-800 dark:text-white'>
                      {injection.healthStatus === 'normal'
                        ? 'Bình thường'
                        : injection.healthStatus}
                    </Text>
                  </View>
                )}

                {injection.sideEffects && (
                  <View className='mb-1'>
                    <Text className='text-sm text-gray-600 dark:text-gray-400'>
                      Tác dụng phụ:
                    </Text>
                    <Text className='text-sm text-gray-800 dark:text-white mt-1'>
                      {injection.sideEffects}
                    </Text>
                  </View>
                )}
              </View>
            )}

            {/* Notes */}
            {injection.notes && (
              <View>
                <Text className='text-base font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Ghi chú:
                </Text>
                <Text className='text-sm text-gray-600 dark:text-gray-400 italic'>
                  {injection.notes}
                </Text>
              </View>
            )}
          </View>
        )}
      </View>
    );
  };

  if (currentView === 'report') {
    return (
      <InjectionRegisterReport
        injectionId={injectionId}
        selectedSon={selectedSon}
        onBack={() => setCurrentView('result')}
      />
    );
  }
  return (
    <SafeAreaView className='flex-1 bg-white dark:bg-gray-900'>
      <ParentHeaderSub title='Kết quả tiêm' onBack={onBack} />

      {result.length === 0 ? (
        <View className='flex-1 justify-center items-center px-4'>
          <Text className='text-lg text-gray-500 dark:text-gray-400 text-center'>
            Chưa có kết quả tiêm chủng nào
          </Text>
        </View>
      ) : (
        <ScrollView className='flex-1 py-4'>
          <View className='mb-4 mx-4'>
            <Text className='text-2xl font-bold text-gray-800 dark:text-white mb-2'>
              Lịch sử tiêm chủng
            </Text>
            <Text className='text-sm text-gray-600 dark:text-gray-400 mb-4'>
              Tổng cộng: {result.length} lần tiêm
            </Text>
          </View>

          {result.map(renderInjectionCard)}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
