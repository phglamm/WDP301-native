import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  FlatList,
} from 'react-native';
import WidgetCustom from '../../components/common/WidgetCustom';
import {
  ClipboardPlus,
  ChartNoAxesGantt,
  BellRing,
  Pill,
  Syringe,
  Cross,
  Calendar,
  ArrowRight,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../stores/useAuthStore';
import HeaderIcon from '../../components/layouts/HeaderIcon';
import NewsCard from '../../components/parent/NewsCard';

const NEWS_DATA = [
  {
    id: '1',
    title: 'Tình hình môi trường hiện nay',
    date: '20/7/2025',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC0tw7pXwKQmq9hevtzuyeOqKDCKL4rJnlUz8RSwonZc656-euH_n1QYyRbx4eT7IO7LhxLWnB4BXVoYRDkwifDyxUlk4O_zRPr3PhWgqZ1kQNka8gaH3w7kfVTtCAcvq2vIIfDm0m5_GVCHQSVZ7_3ISO3MDMCqKCMs48yYtupUWkY27nJopZiAwMQaD2Mh_CaWjx8yPvzjal4gAXcARgO9JugSyiDzLEuUS5c2ye81dGe54_-Ow7ABsMPGWtl3fIx-CGDywbdicg',
    isNew: true,
  },
  {
    id: '2',
    title: 'Sức khoẻ của trẻ em',
    date: '15/7/2025',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC0tw7pXwKQmq9hevtzuyeOqKDCKL4rJnlUz8RSwonZc656-euH_n1QYyRbx4eT7IO7LhxLWnB4BXVoYRDkwifDyxUlk4O_zRPr3PhWgqZ1kQNka8gaH3w7kfVTtCAcvq2vIIfDm0m5_GVCHQSVZ7_3ISO3MDMCqKCMs48yYtupUWkY27nJopZiAwMQaD2Mh_CaWjx8yPvzjal4gAXcARgO9JugSyiDzLEuUS5c2ye81dGe54_-Ow7ABsMPGWtl3fIx-CGDywbdicg',
    isNew: true,
  },
  {
    id: '3',
    title: 'Các biện pháp phòng chống dịch',
    date: '10/7/2025',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC0tw7pXwKQmq9hevtzuyeOqKDCKL4rJnlUz8RSwonZc656-euH_n1QYyRbx4eT7IO7LhxLWnB4BXVoYRDkwifDyxUlk4O_zRPr3PhWgqZ1kQNka8gaH3w7kfVTtCAcvq2vIIfDm0m5_GVCHQSVZ7_3ISO3MDMCqKCMs48yYtupUWkY27nJopZiAwMQaD2Mh_CaWjx8yPvzjal4gAXcARgO9JugSyiDzLEuUS5c2ye81dGe54_-Ow7ABsMPGWtl3fIx-CGDywbdicg',
    isNew: false,
  },
];

export default function HomeScreen() {
  const { user } = useAuthStore();
  const router = useRouter();

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        paddingBottom: 70,
        paddingHorizontal: 12,
        paddingVertical: 16,
        backgroundColor: '#FFF',
      }}
    >
      {/* Header */}
      <HeaderIcon className='mt-12' />

      {/* Welcome */}
      <View className='flex-row justify-between items-center my-5 mb-7'>
        <Text className='text-2xl text-black max-w-80 font-montserratSemiBold'>
          👋🏻 Welcome,{' '}
          <Text className='text-3xl font-montserratBold'>{user?.fullName}</Text>
        </Text>
        <TouchableOpacity
          onPress={() => {
            router.push('/notification');
          }}
          className='text-sm text-gray-600'
        >
          <BellRing size={26} color='#407CE2' />
        </TouchableOpacity>
      </View>

      {/* Banner */}
      <Image
        source={{
          uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDBP2RjPY-ypc10tIS6z3CNevKJHCu0AGLwNrXERzKut3ydQPuSYfSWG4C3hBQkfvMOqKeV38jkeKetJ0p0pRtdQUYitlcHUXZoKM6w-aIfVQOOgM7B1zzQlU0a360GbYwVAx1ezV_XWesSbBCvSnbTobZdUf_bil5E4XU1xW_DGNz1GhJlR8rBO77RDu_sXWW26htwoumjaA1nNQgQG_-dmd1B70CtmScC9hQpvBsY9j0PGGv8L3CA9e8KI9Cg18rHKSBrr6p2y0w',
        }}
        className='overflow-hidden justify-start w-full h-52 rounded-xl'
        resizeMode='cover'
      />

      {/* News */}
      <View className='mt-10'>
        <View className='flex-row justify-between items-center mb-3'>
          <Text className='text-xl text-black font-montserratBold'>
            🗞️ Bài viết mới
          </Text>
          <TouchableOpacity
            onPress={() => {
              router.push('/blogs');
            }}
          >
            <ChartNoAxesGantt size={24} color='#407CE2' />
          </TouchableOpacity>
        </View>

        <FlatList
          data={NEWS_DATA}
          renderItem={({ item }) => <NewsCard item={item} />}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 16 }}
          snapToInterval={320}
          decelerationRate='fast'
          snapToAlignment='start'
        />
      </View>

      {/* Quick Actions */}
      <View className='mt-10'>
        <Text className='mb-3 text-xl text-black font-montserratBold'>
          ⚡ Thao tác nhanh
        </Text>
        <View className='flex-row flex-wrap justify-between mb-5'>
          <WidgetCustom
            icon={<Cross size={48} color='red' />}
            title='Khai báo thông tin sức khỏe'
            backgroundColor='bg-red-100'
            borderColor='border-red-200'
            textColor='text-red-700'
            onPress={() => {
              router.push('/health-declaration');
            }}
          />
          <WidgetCustom
            icon={<Syringe size={48} color='#407CE2' />}
            title='Khai báo tiêm chủng'
            backgroundColor='bg-blue-100'
            borderColor='border-blue-200'
            textColor='text-blue-600'
            onPress={() => {
              router.push('/vaccine-declaration');
            }}
          />
          <WidgetCustom
            icon={<Pill size={48} color='orange' />}
            title='Tạo yêu cầu gửi thuốc'
            backgroundColor='bg-yellow-100'
            borderColor='border-yellow-200'
            textColor='text-yellow-700'
            onPress={() => {
              router.push('/send-medicine');
            }}
          />
          <WidgetCustom
            icon={<ClipboardPlus size={48} color='green' />}
            title='Đăng ký tiêm vaccine'
            backgroundColor='bg-green-100'
            borderColor='border-green-200'
            textColor='text-green-700'
            onPress={() => {
              router.push('/injection-register');
            }}
          />

          <TouchableOpacity
            className='w-full'
            activeOpacity={0.8}
            onPress={() => router.push('/(parent)/appointment')}
          >
            <View className='rounded-2xl p-6 shadow-sm border bg-indigo-50 border-indigo-200'>
              <View className='flex-row items-center justify-between'>
                <View className='flex-1 flex flex-row items-center justify-between'>
                  <View className='flex-col items-center justify-center mb-3'>
                    <View className='w-16 h-16 rounded-full bg-indigo-100 items-center justify-center mr-4'>
                      <Calendar size={32} color='#6366F1' strokeWidth={2.5} />
                    </View>
                    <View>
                      <Text className='text-xl mt-2 font-bold text-indigo-900'>
                        Quản lý lịch hẹn
                      </Text>
                    </View>
                  </View>
                  <View className='flex-row items-center justify-between'>
                    <View className='flex-row items-center'>
                      <Text className='text-lg font-bold text-indigo-600 mr-2'>
                        Xem chi tiết
                      </Text>
                      <ArrowRight size={20} color='#6366F1' />
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
