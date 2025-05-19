import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text } from 'react-native';

export default function HomeScreen() {
  return (
    <SafeAreaView className='flex-1 bg-white dark:bg-gray-900'>
      <View>
        <Text>Parent Home Screen</Text>
      </View>
    </SafeAreaView>
  );
}
