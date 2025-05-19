import {
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Platform,
  useColorScheme,
} from 'react-native';
import { AlertCircle, PlusCircle, Pill, ArrowRight } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: isDark ? '#1a202c' : 'white',
        paddingTop: Platform.OS === 'ios' ? insets.top : 40,
      }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        className='flex-1'
        contentInsetAdjustmentBehavior='automatic'
      >
        {/* Header */}
        <View className='px-6 pt-4 pb-2 flex-row justify-center items-center text-center'>
          <View className='flex-row items-center'>
            <View className='w-10 h-10 rounded-full items-center justify-center mr-2'>
              <Image
                source={require('../../assets/images/icon-removebg.png')}
                className='w-14 h-14'
                resizeMode='contain'
              />
            </View>
            <Text className='text-2xl font-bold text-gray-800 dark:text-white'>
              CampusMedix
            </Text>
          </View>
        </View>
        {/* Welcome Section */}
        <View className='px-6 pt-4 my-4'>
          <Text className='text-4xl font-bold text-gray-800 dark:text-white'>
            Nurse, VBao
          </Text>
          <Text className='text-2xl mt-2 text-gray-500 dark:text-white'>
            Hệ thống quản lý y tế học đường
          </Text>
        </View>
        {/* Cards Section */}
        <View className='px-6 pt-6 pb-24'>
          {/* Quản lý thuốc và vật tư */}
          <TouchableOpacity
            className='bg-blue-100 rounded-xl p-4 py-5 mb-8 flex-row justify-between items-center'
            activeOpacity={0.7}
          >
            <View>
              <Text className='text-3xl font-semibold max-w-52'>
                Quản lý thuốc và vật tư
              </Text>
              <View className='flex-row items-end gap-1 mt-10'>
                <Text className='text-5xl font-bold text-gray-800'>105</Text>
                <Text className='mb-1 text-xl'>loại</Text>
              </View>
            </View>
            <View className='flex-row items-end'>
              <View className='h-32 w-32 justify-center items-center'>
                <Pill size={140} color='#000' strokeWidth={1} />
              </View>
              <View className='text-2xl ml-10'>
                <ArrowRight size={32} color='#000' />
              </View>
            </View>
          </TouchableOpacity>

          {/* Two Cards in a Row */}
          <View className='flex-row justify-between mb-8'>
            {/* Tạo sự kiện y tế */}
            <TouchableOpacity
              className='bg-pink-100 rounded-xl p-6 w-[48%] items-center'
              activeOpacity={0.7}
            >
              <View className='h-12 w-12 rounded-full justify-center items-center mb-4'>
                <AlertCircle size={48} color='#B83280' />
              </View>
              <Text className='text-center text-xl font-medium text-gray-700'>
                Tạo sự kiện y tế
              </Text>
            </TouchableOpacity>

            {/* Yêu cầu của parents */}
            <TouchableOpacity
              className='bg-yellow-50 rounded-xl p-6 w-[48%] items-center'
              activeOpacity={0.7}
            >
              <View className='h-12 w-12 rounded-full justify-center items-center mb-4'>
                <PlusCircle size={48} color='#D69E2E' />
              </View>
              <Text className='text-center text-xl font-medium text-gray-700'>
                Yêu cầu của parents
              </Text>
            </TouchableOpacity>
          </View>

          {/* Two Cards in a Row */}
          <View className='flex-row justify-between mb-4'>
            {/* New Accident Event */}
            <TouchableOpacity
              className='bg-green-100 rounded-xl p-6 w-[48%] items-center'
              activeOpacity={0.7}
            >
              <View className='h-12 w-12 rounded-full justify-center items-center mb-4'>
                <AlertCircle size={48} color='#48BB78' />
              </View>
              <Text className='text-center text-xl font-medium text-gray-700'>
                New Accident Event
              </Text>
            </TouchableOpacity>

            {/* Medical Request */}
            <TouchableOpacity
              className='bg-purple-100 rounded-xl p-6 w-[48%] items-center'
              activeOpacity={0.7}
            >
              <View className='h-12 w-12 rounded-full justify-center items-center mb-4'>
                <PlusCircle size={48} color='#9F7AEA' />
              </View>
              <Text className='text-center text-xl font-medium text-gray-700'>
                Medical Request
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
