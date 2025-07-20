import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import {
  createInjectionEventReportService,
  getInjectionEventReportHistoryService,
} from '../../services/parentServices';
import { SafeAreaView } from 'react-native-safe-area-context';
import ParentHeaderSub from '../layouts/ParentHeaderSub';
import StudentDeclareCard from './StudentDeclareCard';

export default function InjectionRegisterReport({
  injectionId,
  selectedSon,
  onBack,
}) {
  console.log('🚀 ~ selectedSon:', selectedSon);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [severityDropdown, setSeverityDropdown] = useState('low');
  const [reportData, setReportData] = useState({
    injectionRecordId: injectionId,
    severity: severityDropdown,
    description: '',
    temperature: '',
    hoursPostInjection: '',
  });

  const fetchReportHistory = async () => {
    try {
      setLoading(true);
      const response = await getInjectionEventReportHistoryService(injectionId);
      if (response.status) {
        setReport(response.data);
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tải lịch sử khiếu nại');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportHistory();
  }, []);

  const handleCreateReport = async () => {
    // Validate form
    if (!reportData.description.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập mô tả triệu chứng');
      return;
    }
    if (!reportData.temperature || !reportData.hoursPostInjection) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
      return;
    }

    try {
      setLoading(true);
      const dataToSend = {
        ...reportData,
        severity: severityDropdown,
        temperature: parseFloat(reportData.temperature),
        hoursPostInjection: parseInt(reportData.hoursPostInjection),
      };

      const response = await createInjectionEventReportService(dataToSend);

      if (response.status) {
        Alert.alert('Thành công', 'Khiếu nại đã được gửi thành công');
        setShowForm(false);
        setReportData({
          injectionRecordId: injectionId,
          severity: severityDropdown,
          description: '',
          temperature: '',
          hoursPostInjection: '',
        });
        setSeverityDropdown('low');
        fetchReportHistory(); // Refresh history
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể gửi khiếu nại. Vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'low':
        return '#4CAF50';
      case 'medium':
        return '#FF9800';
      case 'high':
        return '#F44336';
      default:
        return '#757575';
    }
  };

  const getSeverityText = (severity) => {
    switch (severity) {
      case 'low':
        return 'Nhẹ';
      case 'medium':
        return 'Trung bình';
      case 'high':
        return 'Nghiêm trọng';
      default:
        return severity;
    }
  };

  return (
    <SafeAreaView className='flex-1 bg-gray-50 dark:bg-gray-900'>
      <ParentHeaderSub title='Báo cáo sau tiêm' onBack={onBack} />

      <StudentDeclareCard selectedSon={selectedSon} />
      {/* Add Report Button */}
      <TouchableOpacity
        className='bg-orange-500 px-4 py-3 mt-2 rounded-lg mb-6 active:bg-orange-600 mx-4'
        onPress={() => setShowForm(true)}
      >
        <Text className='text-white text-center font-semibold text-base'>
          Tạo báo cáo mới
        </Text>
      </TouchableOpacity>
      <ScrollView className='flex-1 px-4 py-4'>
        {/* Report History */}
        <View className='mb-4'>
          <Text className='text-lg font-bold text-gray-900 dark:text-white mb-4'>
            Lịch sử báo cáo
          </Text>

          {loading ? (
            <View className='bg-white dark:bg-gray-800 p-4 rounded-lg'>
              <Text className='text-center text-gray-500 dark:text-gray-400'>
                Đang tải...
              </Text>
            </View>
          ) : !report || report.length === 0 ? (
            <View className='bg-white dark:bg-gray-800 p-6 rounded-lg'>
              <Text className='text-center text-gray-400 dark:text-gray-500 italic'>
                Chưa có báo cáo nào
              </Text>
            </View>
          ) : (
            report.map((reportItem) => (
              <View
                key={reportItem.id}
                className='bg-white dark:bg-gray-800 p-4 rounded-lg mb-3 border border-gray-100 dark:border-gray-700'
              >
                <View className='flex-row justify-between items-start mb-3'>
                  <View
                    className={`px-3 py-1 rounded-full ${
                      reportItem.severityLevel === 'low'
                        ? 'bg-green-100 dark:bg-green-900'
                        : reportItem.severityLevel === 'medium'
                        ? 'bg-yellow-100 dark:bg-yellow-900'
                        : 'bg-red-100 dark:bg-red-900'
                    }`}
                  >
                    <Text
                      className={`text-xs font-semibold ${
                        reportItem.severityLevel === 'low'
                          ? 'text-green-700 dark:text-green-300'
                          : reportItem.severityLevel === 'medium'
                          ? 'text-yellow-700 dark:text-yellow-300'
                          : 'text-red-700 dark:text-red-300'
                      }`}
                    >
                      {getSeverityText(reportItem.severityLevel)}
                    </Text>
                  </View>
                  <Text className='text-xs text-gray-500 dark:text-gray-400'>
                    {formatDate(reportItem.createdAt)}
                  </Text>
                </View>

                <Text className='text-gray-900 dark:text-gray-100 mb-3 leading-5'>
                  {reportItem.description}
                </Text>

                <View className='flex-row justify-between mb-2'>
                  <Text className='text-sm text-gray-600 dark:text-gray-300'>
                    Nhiệt độ:{' '}
                    <Text className='font-semibold'>
                      {reportItem.temperature}°C
                    </Text>
                  </Text>
                  <Text className='text-sm text-gray-600 dark:text-gray-300'>
                    Sau tiêm:{' '}
                    <Text className='font-semibold'>
                      {reportItem.hoursPostInjection}h
                    </Text>
                  </Text>
                </View>

                <Text className='text-xs text-gray-400 dark:text-gray-500 italic'>
                  Báo cáo bởi: {reportItem.createdBy.fullName}
                </Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Report Form Modal */}
      <Modal
        visible={showForm}
        animationType='slide'
        presentationStyle='pageSheet'
      >
        <SafeAreaView className='flex-1 bg-gray-50 dark:bg-gray-900'>
          <View className='bg-white dark:bg-gray-800 px-4 py-4 border-b border-gray-200 dark:border-gray-700 flex-row items-center justify-between'>
            <TouchableOpacity
              onPress={() => setShowForm(false)}
              className='py-2'
            >
              <Text className='text-red-500 font-semibold'>Hủy</Text>
            </TouchableOpacity>
            <Text className='text-lg font-bold text-gray-900 dark:text-white'>
              Tạo báo cáo mới
            </Text>
            <TouchableOpacity
              onPress={handleCreateReport}
              className='bg-blue-500 px-4 py-2 rounded-lg active:bg-blue-600'
              disabled={loading}
            >
              <Text className='text-white font-semibold'>
                {loading ? 'Đang gửi...' : 'Gửi'}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView className='flex-1 px-4 py-4'>
            {/* Severity Level */}
            <View className='mb-5'>
              <Text className='text-base font-semibold text-gray-900 dark:text-white mb-2'>
                Mức độ nghiêm trọng:
              </Text>
              <View className='bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg'>
                <Picker
                  selectedValue={severityDropdown}
                  onValueChange={setSeverityDropdown}
                  style={{ color: '#000' }}
                >
                  <Picker.Item label='Nhẹ' value='low' />
                  <Picker.Item label='Trung bình' value='medium' />
                  <Picker.Item label='Nghiêm trọng' value='high' />
                </Picker>
              </View>
            </View>

            {/* Description */}
            <View className='mb-5'>
              <Text className='text-base font-semibold text-gray-900 dark:text-white mb-2'>
                Mô tả triệu chứng:
              </Text>
              <TextInput
                className='bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-3 min-h-[100px] text-gray-900 dark:text-white'
                placeholder='Mô tả chi tiết các triệu chứng sau khi tiêm...'
                placeholderTextColor='#9CA3AF'
                value={reportData.description}
                onChangeText={(text) =>
                  setReportData({ ...reportData, description: text })
                }
                multiline
                numberOfLines={4}
                textAlignVertical='top'
              />
            </View>

            {/* Temperature */}
            <View className='mb-5'>
              <Text className='text-base font-semibold text-gray-900 dark:text-white mb-2'>
                Nhiệt độ cơ thể (°C):
              </Text>
              <TextInput
                className='bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-gray-900 dark:text-white'
                placeholder='VD: 38.5'
                placeholderTextColor='#9CA3AF'
                value={reportData.temperature}
                onChangeText={(text) =>
                  setReportData({ ...reportData, temperature: text })
                }
                keyboardType='decimal-pad'
              />
            </View>

            {/* Hours Post Injection */}
            <View className='mb-5'>
              <Text className='text-base font-semibold text-gray-900 dark:text-white mb-2'>
                Số giờ sau khi tiêm:
              </Text>
              <TextInput
                className='bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-gray-900 dark:text-white'
                placeholder='VD: 24'
                placeholderTextColor='#9CA3AF'
                value={reportData.hoursPostInjection}
                onChangeText={(text) =>
                  setReportData({ ...reportData, hoursPostInjection: text })
                }
                keyboardType='numeric'
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}
