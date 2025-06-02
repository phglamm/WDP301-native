import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  FlatList,
  ImageBackground,
} from 'react-native';
import WidgetCustom from '../../components/common/WidgetCustom';
import {
  ClipboardPlus,
  ChartNoAxesGantt,
  Newspaper,
  BellRing,
  Pill,
  Bell,
  Syringe,
} from 'lucide-react-native';
import { Link, useRouter } from 'expo-router';
import { useAuthStore } from '../../stores/useAuthStore';
import HeaderIcon from '../../components/layouts/HeaderIcon';
import NewsCard from '../../components/parent/NewsCard';

const NEWS_DATA = [
  {
    id: '1',
    title: 'Flu Shot Clinic',
    date: 'October 20, 2024',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC0tw7pXwKQmq9hevtzuyeOqKDCKL4rJnlUz8RSwonZc656-euH_n1QYyRbx4eT7IO7LhxLWnB4BXVoYRDkwifDyxUlk4O_zRPr3PhWgqZ1kQNka8gaH3w7kfVTtCAcvq2vIIfDm0m5_GVCHQSVZ7_3ISO3MDMCqKCMs48yYtupUWkY27nJopZiAwMQaD2Mh_CaWjx8yPvzjal4gAXcARgO9JugSyiDzLEuUS5c2ye81dGe54_-Ow7ABsMPGWtl3fIx-CGDywbdicg',
    isNew: true,
  },
  {
    id: '2',
    title: 'Health Awareness Week',
    date: 'October 15, 2024',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC0tw7pXwKQmq9hevtzuyeOqKDCKL4rJnlUz8RSwonZc656-euH_n1QYyRbx4eT7IO7LhxLWnB4BXVoYRDkwifDyxUlk4O_zRPr3PhWgqZ1kQNka8gaH3w7kfVTtCAcvq2vIIfDm0m5_GVCHQSVZ7_3ISO3MDMCqKCMs48yYtupUWkY27nJopZiAwMQaD2Mh_CaWjx8yPvzjal4gAXcARgO9JugSyiDzLEuUS5c2ye81dGe54_-Ow7ABsMPGWtl3fIx-CGDywbdicg',
    isNew: true,
  },
  {
    id: '3',
    title: 'Mental Health Workshop',
    date: 'October 10, 2024',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC0tw7pXwKQmq9hevtzuyeOqKDCKL4rJnlUz8RSwonZc656-euH_n1QYyRbx4eT7IO7LhxLWnB4BXVoYRDkwifDyxUlk4O_zRPr3PhWgqZ1kQNka8gaH3w7kfVTtCAcvq2vIIfDm0m5_GVCHQSVZ7_3ISO3MDMCqKCMs48yYtupUWkY27nJopZiAwMQaD2Mh_CaWjx8yPvzjal4gAXcARgO9JugSyiDzLEuUS5c2ye81dGe54_-Ow7ABsMPGWtl3fIx-CGDywbdicg',
    isNew: false,
  },
];

export default function HomeScreen() {
  const { user } = useAuthStore();
  const router = useRouter();

  return (
    // <ImageBackground
    //   source={require('../../assets/images/splash-background.png')}
    //   style={{ flex: 1 }}
    //   resizeMode='cover'
    // >
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
      <HeaderIcon className='mt-10' />

      {/* Welcome */}
      <View className='flex-row justify-between items-center my-5'>
        <Text className='text-2xl max-w-80 font-montserratSemiBold text-black'>
          👋🏻 Welcome,{' '}
          <Text className='text-3xl font-montserratBold'>{user?.fullName}</Text>
        </Text>
        <TouchableOpacity
          onPress={() => {
            router.push('/notification');
          }}
          className='text-gray-600 text-sm'
        >
          <BellRing size={26} color='#407CE2' />
        </TouchableOpacity>
      </View>

      {/* Banner */}
      <Image
        source={{
          uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDBP2RjPY-ypc10tIS6z3CNevKJHCu0AGLwNrXERzKut3ydQPuSYfSWG4C3hBQkfvMOqKeV38jkeKetJ0p0pRtdQUYitlcHUXZoKM6w-aIfVQOOgM7B1zzQlU0a360GbYwVAx1ezV_XWesSbBCvSnbTobZdUf_bil5E4XU1xW_DGNz1GhJlR8rBO77RDu_sXWW26htwoumjaA1nNQgQG_-dmd1B70CtmScC9hQpvBsY9j0PGGv8L3CA9e8KI9Cg18rHKSBrr6p2y0w',
        }}
        className='w-full h-52 rounded-xl overflow-hidden justify-start'
        resizeMode='cover'
      />

      {/* News */}
      <View className='mt-10'>
        <View className='flex-row justify-between items-center mb-3'>
          <Text className='text-xl font-montserratBold text-black'>
            🗞️ Bài viết mới
          </Text>
          <TouchableOpacity
            onPress={() => {
              router.push('/blogs');
            }}
          >
            <ChartNoAxesGantt size={28} color='#407CE2' />
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
        <Text className='text-xl font-montserratBold text-black mb-3'>
          ⚡ Thao tác nhanh
        </Text>
        <View className='flex-row justify-between mb-5'>
          <WidgetCustom
            icon={<ClipboardPlus size={48} color='green' />}
            title='Khai báo thông tin sức khỏe'
            backgroundColor='bg-green-100'
            borderColor='border-green-200'
            textColor='text-green-700'
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
        </View>
        <View className='flex-row justify-between mb-5'>
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
            icon={<Bell size={48} color='red' />}
            title='Thông báo từ nhà trường'
            backgroundColor='bg-red-100'
            borderColor='border-red-200'
            textColor='text-red-700'
            onPress={() => {
              router.push('/notification');
            }}
          />
        </View>
      </View>
    </ScrollView>
    // </ImageBackground>
  );
}
