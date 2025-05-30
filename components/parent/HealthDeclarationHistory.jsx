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
  AlertCircle,
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
  console.log('🚀 ~ studentProfiles:', studentProfiles);
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
          <View className='flex-row items-center justify-between p-4 bg-white border-b border-gray-200'>
            <TouchableOpacity onPress={onBack} className='p-1'>
              <ArrowLeft size={20} color='#407CE2' />
            </TouchableOpacity>
            <Text className='text-lg font-semibold text-gray-900'>
              Lịch sử khai báo hồ sơ
            </Text>
            <View className='w-8' />
          </View>

          <ScrollView className='flex-1 px-6 py-4'>
            {studentProfiles.length === 0 ? (
              <View className='items-center py-20'>
                <FileText size={64} color='#D1D5DB' />
                <Text className='text-gray-500 text-lg mt-4 mb-2'>
                  Chưa có hồ sơ nào
                </Text>
                <Text className='text-gray-400 text-center'>
                  Hãy tạo hồ sơ sức khỏe đầu tiên
                </Text>
              </View>
            ) : (
              <>
                {/* Latest Profile Summary */}
                {studentProfiles.length > 0 && (
                  <View className='bg-blue-50 p-4 rounded-2xl mb-6 border border-gray-200'>
                    <Text className='text-lg font-montserratBold text-gray-800 mb-3'>
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
                            <Text className='text-gray-500 text-sm'>BMI</Text>
                            <Text className={`text-xs ${bmiStatus.color}`}>
                              {bmiStatus.status}
                            </Text>
                          </View>
                          <View className='items-center'>
                            <Text className='text-xl font-bold text-green-600'>
                              {healthScore || '--'}
                            </Text>
                            <Text className='text-gray-500 text-sm'>
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
                            <Text className='text-gray-500 text-sm'>
                              Nhóm máu
                            </Text>
                          </View>
                        </View>
                      );
                    })()}
                  </View>
                )}

                {/* Profile List */}
                <Text className='text-lg font-bold text-gray-800 mb-4'>
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
                      className='mb-4 p-4 rounded-2xl border-2 bg-white border-gray-200'
                    >
                      {/* Header */}
                      <View className='flex-row items-center justify-between mb-3'>
                        <View className='flex-row items-center'>
                          <User size={20} color='#3B82F6' />
                          <Text className='ml-2 text-lg font-bold text-gray-800'>
                            Hồ sơ #{studentProfiles.length - index}
                          </Text>
                          {index === 0 && (
                            <View className='ml-2 bg-blue-500 rounded-full px-2 py-1'>
                              <Text className='text-white text-xs font-bold'>
                                Mới nhất
                              </Text>
                            </View>
                          )}
                        </View>
                        <Text className='text-gray-500 text-sm'>
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
                            <Text className='ml-2 text-gray-600 font-medium'>
                              Cân nặng: {profile.weight}kg
                            </Text>
                          </View>
                          <View className='flex-row items-center mb-2'>
                            <Ruler size={16} color='#10B981' />
                            <Text className='ml-2 text-gray-600 font-medium'>
                              Chiều cao: {profile.height}cm
                            </Text>
                          </View>
                          <View className='flex-row items-center'>
                            <Droplet size={16} color='#EF4444' />
                            <Text className='ml-2 text-gray-600 font-medium'>
                              Nhóm máu: {profile.bloodType}
                            </Text>
                          </View>
                        </View>

                        {/* BMI Card */}
                        <View className='bg-blue-50 rounded-xl p-3 items-center min-w-20'>
                          <Text className='text-blue-600 font-bold text-lg'>
                            {bmi || '--'}
                          </Text>
                          <Text className='text-gray-500 text-xs mb-1'>
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
                        <View className='flex-row items-center gap-1'>
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

                        <View className='flex-row items-center gap-1'>
                          <Ear size={16} color='#F59E0B' />
                          <Text className=' text-gray-600'>
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
                        <View className='bg-green-50 rounded-xl p-3 mb-3'>
                          <View className='flex-row items-center justify-between'>
                            <View className='flex-row items-center'>
                              <Activity size={16} color='#10B981' />
                              <Text className='ml-2 text-green-800 font-medium'>
                                Điểm sức khỏe tổng quát
                              </Text>
                            </View>
                            <Text className='text-green-600 font-bold text-lg'>
                              {healthScore}/10
                            </Text>
                          </View>
                        </View>
                      )}

                      {/* Allergies */}
                      {profile.allergies && (
                        <View className='flex-row items-start'>
                          <AlertTriangle
                            size={16}
                            color='#EF4444'
                            style={{ marginTop: 2 }}
                          />
                          <View className='ml-2 flex-1'>
                            <Text className='text-red-600 font-medium mb-1'>
                              Dị ứng:
                            </Text>
                            <View className='bg-red-50 rounded-xl p-2'>
                              <Text className='text-red-700 text-sm'>
                                {profile.allergies}
                              </Text>
                            </View>
                          </View>
                        </View>
                      )}

                      {/* Notes */}
                      {profile.note && (
                        <View className='flex-row items-start mt-2 pt-3 border-t border-gray-200'>
                          <FileText
                            size={16}
                            color='#6B7280'
                            style={{ marginTop: 2 }}
                          />
                          <View className='ml-2 flex-1'>
                            <Text className='text-gray-600 font-medium mb-1'>
                              Ghi chú:
                            </Text>
                            <Text className='text-gray-600 text-sm leading-4'>
                              {profile.note}
                            </Text>
                          </View>
                        </View>
                      )}

                      {/* Created time */}
                      <View className='flex-row items-center mt-3 pt-3 border-t border-gray-200'>
                        <Clock size={14} color='#9CA3AF' />
                        <Text className='text-gray-400 text-xs ml-2'>
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
