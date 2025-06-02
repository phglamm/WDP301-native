import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  User,
  Mail,
  Phone,
  LogOut,
  ChevronRight,
  Settings,
  Bell,
  HelpCircle,
} from 'lucide-react-native';
import { useAuthStore } from '../../stores/useAuthStore';
import { getMySonService } from '../../services/parentServices';
import ThemeToggle from '../../components/themes/ThemeToggle';

const MenuButton = ({ icon, title, onPress, showBorder = true }) => (
  <TouchableOpacity
    onPress={onPress}
    className={`flex-row items-center px-6 py-4 bg-white ${
      showBorder ? 'border-b border-gray-200' : ''
    }`}
    activeOpacity={0.7}
  >
    <View className='w-10 h-10 rounded-full bg-gray-100 items-center justify-center'>
      {icon}
    </View>
    <Text className='flex-1 ml-4 text-gray-800 text-base font-medium'>
      {title}
    </Text>
    <ChevronRight size={20} color='#9CA3AF' />
  </TouchableOpacity>
);

export default function ProfileScreen() {
  const router = useRouter();
  const { logout, user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [sonData, setSonData] = useState([]);
  const [error, setError] = useState(null);

  const fetchSonData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getMySonService();
      setSonData(response.data || []);
    } catch (err) {
      setError('Không thể tải thông tin. Vui lòng thử lại sau.');
      console.error('Error fetching son data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSonData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchSonData();
  };

  const handleLogout = () => {
    Alert.alert(
      'Đăng xuất',
      'Bạn có chắc chắn muốn đăng xuất?',
      [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Đăng xuất', style: 'destructive', onPress: logout },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView className='flex-1 bg-gray-50'>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Header Profile */}
        <View className='bg-white px-6 pt-8 pb-6 rounded-b-3xl shadow-md'>
          <View className='w-28 h-28 rounded-full bg-blue-100 items-center justify-center mb-4 shadow-lg mx-auto'>
            <User size={60} color='#2563EB' />
          </View>

          <View className='flex-row items-center w-full relative'>
            {/* Full name centered absolutely */}
            <Text className='text-3xl font-semibold text-gray-900 absolute left-0 right-0 text-center'>
              {user?.fullName}
            </Text>
            {/* ThemeToggle aligned right */}
            <View className='w-12 h-12 rounded-full bg-blue-50 items-center justify-center ml-auto'>
              <ThemeToggle />
            </View>
          </View>
        </View>

        {/* Contact Info */}
        <View className='flex-row justify-around bg-white mt-6 px-8 py-6 rounded-xl shadow-sm'>
          <View className='items-center'>
            <View className='w-12 h-12 rounded-full bg-blue-50 items-center justify-center mb-1'>
              <Phone size={24} color='#2563EB' />
            </View>
            <Text className='text-sm text-gray-700'>{user?.phone}</Text>
          </View>

          <View className='items-center'>
            <View className='w-12 h-12 rounded-full bg-blue-50 items-center justify-center mb-1'>
              <Mail size={24} color='#2563EB' />
            </View>
            <Text className='text-sm text-gray-700'>{user?.email}</Text>
          </View>
        </View>

        {/* Children Section */}
        <View className='mt-8 px-6'>
          <Text className='text-xl font-semibold text-gray-900 mb-4'>
            👨‍👦 Thông tin con ({sonData.length})
          </Text>
          {loading ? (
            <View className='py-12 items-center'>
              <ActivityIndicator size='large' color='#2563EB' />
            </View>
          ) : error ? (
            <View className='py-12 items-center'>
              <Text className='text-red-600'>{error}</Text>
            </View>
          ) : sonData.length === 0 ? (
            <View className='py-12 items-center'>
              <Text className='text-gray-500'>Chưa có thông tin con</Text>
            </View>
          ) : (
            sonData.map((child) => (
              <View
                key={child.id}
                className='mb-4 bg-white rounded-xl shadow p-4 flex-row items-center'
              >
                <View className='w-12 h-12 rounded-full bg-blue-100 items-center justify-center'>
                  <User size={24} color='#2563EB' />
                </View>
                <View className='ml-4 flex-1'>
                  <Text className='text-lg font-semibold text-gray-900'>
                    {child.fullName}
                  </Text>
                  <Text className='text-sm text-gray-500'>
                    {child.studentCode}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Menu Section */}
        <View className='mt-8'>
          <Text className='px-6 text-xl font-semibold text-gray-900 mb-4'>
            ⚙️ Thao tác
          </Text>
          <View className='bg-white rounded-xl shadow-md overflow-hidden mx-4'>
            <MenuButton
              icon={<Bell size={20} color='#2563EB' />}
              title='Thông báo'
              onPress={() => router.push('/notification')}
            />
            <MenuButton
              icon={<Settings size={20} color='#2563EB' />}
              title='Cài đặt tài khoản'
              onPress={() => router.push('/settings')}
            />
            <MenuButton
              icon={<HelpCircle size={20} color='#2563EB' />}
              title='Trợ giúp & Hỗ trợ'
              onPress={() => router.push('/help')}
              showBorder={false}
            />
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          onPress={handleLogout}
          className='mt-10 mx-8 mb-12 bg-red-100 py-4 rounded-2xl flex-row items-center justify-center shadow-md'
          activeOpacity={0.8}
        >
          <LogOut size={22} color='#DC2626' />
          <Text className='ml-3 text-red-600 font-semibold text-lg'>
            Đăng xuất
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
