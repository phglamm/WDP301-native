import React from 'react';
import {
  Text,
  ScrollView,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  ArrowRight,
  CheckCircle,
  Scale,
  Ruler,
  Droplet,
  Eye,
  Ear,
  AlertTriangle,
  FileText,
  User,
  Clock,
  Activity,
  AlertTriangleIcon,
  ArrowLeft,
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const HealthDeclarationHistory = ({ selectedSon, healthProfiles, onBack }) => {
  const studentProfiles = healthProfiles.filter(
    (p) => String(p.student.id) === String(selectedSon?.id)
  );

  const getBMI = (weight, height) => {
    if (!weight || !height) return null;
    const heightInMeters = height / 100;
    return Math.round((weight / (heightInMeters * heightInMeters)) * 10) / 10;
  };

  const getBMIStatus = (bmi) => {
    if (!bmi) return { status: 'Chưa có dữ liệu', color: 'text-gray-500' };
    if (bmi < 18.5) return { status: 'Thiếu cân', color: 'text-yellow-600' };
    if (bmi < 25) return { status: 'Bình thường', color: 'text-green-600' };
    if (bmi < 30) return { status: 'Thừa cân', color: 'text-orange-600' };
    return { status: 'Béo phì', color: 'text-red-600' };
  };

  const getHealthScore = (vision, hearing) => {
    if (!vision || !hearing) return null;
    return (
      Math.round(((parseFloat(vision) + parseFloat(hearing)) / 2) * 10) / 10
    );
  };

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className='flex-1'
      >
        <View className='flex-1'>
          {/* Header */}
          <View className='flex-row justify-between items-center p-4 bg-white border-b border-gray-200'>
            <TouchableOpacity onPress={onBack} className='p-1'>
              <ArrowLeft size={20} color='#407CE2' />
            </TouchableOpacity>
            <Text className='text-lg font-semibold text-gray-900'>
              Lịch sử khai báo hồ sơ
            </Text>
            <View className='w-8' />
          </View>
          <View className='px-6 py-4 bg-white border-b border-gray-100'>
            <View className='flex-row gap-8 items-start'>
              <View
                className={`justify-center items-center w-12 h-12 bg-blue-500 rounded-full`}
              >
                <User size={24} color={'#fff'} />
              </View>
              <View className='flex-1 justify-start items-start'>
                <Text
                  className={`text-blue-800 font-montserratSemiBold`}
                  numberOfLines={1}
                >
                  {studentProfiles[0].student.fullName || 'Học sinh'}
                </Text>

                <Text className='text-sm text-gray-500 font-montserratSemiBold'>
                  MSSV: {studentProfiles[0].student.studentCode || 'Mã HS'}
                </Text>
              </View>
            </View>
          </View>
          <ScrollView className='flex-1 px-6 py-4'>
            {studentProfiles.length === 0 ? (
              <View className='items-center py-20'>
                <FileText size={64} color='#D1D5DB' />
                <Text className='mt-4 mb-2 text-lg text-gray-500'>
                  Chưa có hồ sơ nào
                </Text>
                <Text className='text-center text-gray-400'>
                  Hãy tạo hồ sơ sức khỏe đầu tiên
                </Text>
              </View>
            ) : (
              <>
                {/* Latest Profile Summary */}
                {studentProfiles.length > 0 && (
                  <View className='p-4 mb-6 bg-blue-50 rounded-2xl border border-gray-200'>
                    <Text className='mb-1 text-lg text-gray-800 font-montserratBold'>
                      📃 Hồ sơ mới nhất
                    </Text>
                    {(() => {
                      const latest = studentProfiles[0];
                      const bmi = getBMI(latest.weight, latest.height);
                      const bmiStatus = getBMIStatus(bmi);
                      const healthScore = getHealthScore(
                        latest.vision,
                        latest.hearing
                      );

                      return (
                        <View className='flex-row justify-between'>
                          <View className='items-center'>
                            <Text className='text-xl font-bold text-blue-600'>
                              {bmi || '--'}
                            </Text>
                            <Text className='text-sm text-gray-500'>BMI</Text>
                            <Text className={`text-xs ${bmiStatus.color}`}>
                              {bmiStatus.status}
                            </Text>
                          </View>
                          <View className='items-center'>
                            <Text className='text-xl font-bold text-green-600'>
                              {healthScore || '--'}
                            </Text>
                            <Text className='text-sm text-gray-500'>
                              Điểm SK
                            </Text>
                            <Text className='text-xs text-gray-400'>
                              (Thị lực + Thính giác)/2
                            </Text>
                          </View>
                          <View className='items-center'>
                            <Text className='text-xl font-bold text-purple-600'>
                              {latest.bloodType || '--'}
                            </Text>
                            <Text className='text-sm text-gray-500'>
                              Nhóm máu
                            </Text>
                          </View>
                        </View>
                      );
                    })()}
                  </View>
                )}

                {/* Profile List */}
                <Text className='mb-4 text-lg font-bold text-gray-800'>
                  Tất cả hồ sơ
                </Text>

                {studentProfiles.map((profile, index) => {
                  const bmi = getBMI(profile.weight, profile.height);
                  const bmiStatus = getBMIStatus(bmi);
                  const healthScore = getHealthScore(
                    profile.vision,
                    profile.hearing
                  );

                  return (
                    <View
                      key={profile.id}
                      className='p-4 mb-4 bg-white rounded-2xl border-2 border-gray-200'
                    >
                      {/* Header */}
                      <View className='flex-row justify-between items-center mb-3'>
                        <View className='flex-row items-center'>
                          <User size={20} color='#3B82F6' />
                          <Text className='ml-2 text-lg font-bold text-gray-800'>
                            Hồ sơ #{studentProfiles.length - index}
                          </Text>
                          {index === 0 && (
                            <View className='px-2 py-1 ml-2 bg-blue-500 rounded-full'>
                              <Text className='text-xs font-bold text-white'>
                                Mới nhất
                              </Text>
                            </View>
                          )}
                        </View>
                        <Text className='text-sm text-gray-500'>
                          {new Date(
                            profile.createdAt || Date.now()
                          ).toLocaleDateString('vi-VN')}
                        </Text>
                      </View>

                      {/* Basic Info */}
                      <View className='flex-row justify-between mb-4'>
                        <View className='flex-1 mr-2'>
                          <View className='flex-row items-center mb-2'>
                            <Scale size={16} color='#3B82F6' />
                            <Text className='ml-2 font-medium text-gray-600'>
                              Cân nặng: {profile.weight}kg
                            </Text>
                          </View>
                          <View className='flex-row items-center mb-2'>
                            <Ruler size={16} color='#10B981' />
                            <Text className='ml-2 font-medium text-gray-600'>
                              Chiều cao: {profile.height}cm
                            </Text>
                          </View>
                          <View className='flex-row items-center'>
                            <Droplet size={16} color='#EF4444' />
                            <Text className='ml-2 font-medium text-gray-600'>
                              Nhóm máu: {profile.bloodType}
                            </Text>
                          </View>
                        </View>

                        {/* BMI Card */}
                        <View className='items-center p-3 bg-blue-50 rounded-xl min-w-20'>
                          <Text className='text-lg font-bold text-blue-600'>
                            {bmi || '--'}
                          </Text>
                          <Text className='mb-1 text-xs text-gray-500'>
                            BMI
                          </Text>
                          <Text
                            className={`text-xs ${bmiStatus.color} font-medium`}
                          >
                            {bmiStatus.status}
                          </Text>
                        </View>
                      </View>

                      {/* Health Metrics */}
                      <View className='flex-row justify-between mb-4'>
                        <View className='flex-row gap-1 items-center'>
                          <Eye size={16} color='#8B5CF6' />
                          <Text className='text-gray-600'>
                            Thị lực: {profile.vision}/10
                          </Text>
                          {profile.vision >= 8 ? (
                            <CheckCircle size={16} color='#10B981' />
                          ) : (
                            <AlertTriangleIcon size={16} color='red' />
                          )}
                        </View>

                        <View className='flex-row gap-1 items-center'>
                          <Ear size={16} color='#F59E0B' />
                          <Text className='text-gray-600'>
                            Thính giác: {profile.hearing}/10
                          </Text>
                          {profile.hearing >= 8 ? (
                            <CheckCircle size={16} color='#10B981' />
                          ) : (
                            <AlertTriangleIcon size={16} color='red' />
                          )}
                        </View>
                      </View>

                      {/* Health Score */}
                      {healthScore && (
                        <View className='p-3 mb-3 bg-green-50 rounded-xl'>
                          <View className='flex-row justify-between items-center'>
                            <View className='flex-row items-center'>
                              <Activity size={16} color='#10B981' />
                              <Text className='ml-2 font-medium text-green-800'>
                                Điểm sức khỏe tổng quát
                              </Text>
                            </View>
                            <Text className='text-lg font-bold text-green-600'>
                              {healthScore}/10
                            </Text>
                          </View>
                        </View>
                      )}

                      {/* Allergies */}
                      {profile.allergies && (
                        <View className='flex-col items-start'>
                          <View className='flex-row gap-2 items-center mb-1'>
                            <AlertTriangle
                              size={16}
                              color='#EF4444'
                              style={{ marginTop: 2 }}
                            />
                            <Text className='font-medium text-red-600'>
                              Dị ứng
                            </Text>
                          </View>
                          <View className='flex-1 w-full'>
                            <View className='p-3 mb-3 bg-red-50 rounded-xl'>
                              <View className='flex-row justify-between items-center'>
                                <View className='flex-row items-center'>
                                  <Text className='ml-2 font-medium text-red-800'>
                                    {profile.allergies}
                                  </Text>
                                </View>
                              </View>
                            </View>
                          </View>
                        </View>
                      )}

                      {/* Notes */}
                      {profile.note && (
                        <View className='flex-row items-start pt-3 mt-2 border-t border-gray-200'>
                          <FileText
                            size={16}
                            color='#6B7280'
                            style={{ marginTop: 2 }}
                          />
                          <View className='flex-1 ml-2'>
                            <Text className='mb-1 font-medium text-gray-600'>
                              Ghi chú:
                            </Text>
                            <Text className='text-sm leading-4 text-gray-600'>
                              {profile.note}
                            </Text>
                          </View>
                        </View>
                      )}

                      {/* Created time */}
                      <View className='flex-row items-center pt-3 mt-3 border-t border-gray-200'>
                        <Clock size={14} color='#9CA3AF' />
                        <Text className='ml-2 text-xs text-gray-400'>
                          Cập nhật:{' '}
                          {new Date(
                            profile.createdAt || Date.now()
                          ).toLocaleString('vi-VN')}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </>
            )}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default HealthDeclarationHistory;
