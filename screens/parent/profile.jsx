import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Button,
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
  Lock,
} from 'lucide-react-native';
import { useAuthStore } from '../../stores/useAuthStore';
import { getMySonService } from '../../services/parentServices';
import ThemeToggle from '../../components/themes/ThemeToggle';

const MenuButton = ({ icon, title, onPress, showBorder = true }) => (
  <TouchableOpacity
    onPress={onPress}
    className={`flex-row items-center px-4 py-4 ${
      showBorder ? 'border-b border-gray-100' : ''
    }`}
  >
    <View className='w-8 h-8 rounded-full bg-gray-100 items-center justify-center'>
      {icon}
    </View>
    <Text className='flex-1 ml-3 text-gray-700 text-base'>{title}</Text>
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
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Đăng xuất',
          style: 'destructive',
          onPress: logout,
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header Profile */}
        <View className='bg-white px-4 py-6'>
          <View className='items-center mb-4'>
            <View className='w-24 h-24 rounded-full bg-blue-100 items-center justify-center mb-3'>
              <User size={48} color='#3B82F6' />
            </View>
            <Text className='text-2xl font-bold text-gray-800 mb-1'>
              {user?.fullName}
            </Text>
            <Text className='text-base text-gray-500 mb-3'>{user?.role}</Text>
          </View>

          {/* Contact Info */}
          <View className='flex-row justify-around'>
            <View className='items-center'>
              <View className='w-10 h-10 rounded-full bg-blue-50 items-center justify-center mb-2'>
                <Phone size={20} color='#3B82F6' />
              </View>
              <Text className='text-sm text-gray-600'>{user?.phone}</Text>
            </View>
            <View className='items-center'>
              <View className='w-10 h-10 rounded-full bg-blue-50 items-center justify-center mb-2'>
                <ThemeToggle />
              </View>
            </View>
            <View className='items-center'>
              <View className='w-10 h-10 rounded-full bg-blue-50 items-center justify-center mb-2'>
                <Mail size={20} color='#3B82F6' />
              </View>
              <Text className='text-sm text-gray-600'>{user?.email}</Text>
            </View>
          </View>
        </View>

        {/* Children Section */}
        <View className='mt-6 bg-white'>
          <View className='px-4 py-3 border-b border-gray-100'>
            <Text className='text-lg font-bold text-gray-800'>
              👨‍👦 Thông tin con ({sonData.length})
            </Text>
          </View>
          {loading ? (
            <View className='py-8 items-center'>
              <ActivityIndicator size='large' color='#3B82F6' />
            </View>
          ) : error ? (
            <View className='py-8 items-center'>
              <Text className='text-red-500'>{error}</Text>
            </View>
          ) : (
            sonData.map((child) => (
              <View
                key={child.id}
                className='px-4 py-3 border-b border-gray-100 flex-row items-center'
              >
                <View className='w-10 h-10 rounded-full bg-blue-100 items-center justify-center'>
                  <User size={20} color='#3B82F6' />
                </View>
                <View className='ml-3 flex-1'>
                  <Text className='text-base font-medium text-gray-800'>
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
        <View className='mt-6 bg-white'>
          <MenuButton
            icon={<Bell size={20} color='#3B82F6' />}
            title='Thông báo'
            onPress={() => router.push('/notification')}
          />
          <MenuButton
            icon={<Settings size={20} color='#3B82F6' />}
            title='Cài đặt tài khoản'
            onPress={() => router.push('/settings')}
          />
          <MenuButton
            icon={<Lock size={20} color='#3B82F6' />}
            title='Bảo mật'
            onPress={() => router.push('/security')}
          />
          <MenuButton
            icon={<HelpCircle size={20} color='#3B82F6' />}
            title='Trợ giúp & Hỗ trợ'
            onPress={() => router.push('/help')}
            showBorder={false}
          />
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          onPress={handleLogout}
          className='mt-6 mx-4 mb-8 bg-red-50 py-4 rounded-xl flex-row items-center justify-center'
        >
          <LogOut size={20} color='#EF4444' />
          <Text className='ml-2 text-red-600 font-medium'>Đăng xuất</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
