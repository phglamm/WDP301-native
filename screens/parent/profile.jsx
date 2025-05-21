import { View, Text, Button } from 'react-native';
import React from 'react';
import { useAuthStore } from '../../stores/useAuthStore';

export default function ProfileScreen() {
  const { logout, user } = useAuthStore();

  return (
    <View>
      <Text className='text-2xl font-bold'>Parent Profile Screen</Text>
      <Text className='text-lg font-bold'>{user?.role}</Text>
      <Text className='text-lg'>{user?.fullName}</Text>
      <Text className='text-lg'>{user?.phone}</Text>
      <Text className='text-lg'>{user?.email}</Text>
      <Button title='Logout' onPress={logout} />
    </View>
  );
}
