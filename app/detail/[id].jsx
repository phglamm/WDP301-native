import { View, Text } from 'react-native';
import React from 'react';
import { useLocalSearchParams } from 'expo-router';

export default function Index() {
  const { id } = useLocalSearchParams();
  return (
    <View>
      <Text>Details of user {id}</Text>
    </View>
  );
}
