import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const NurseLayout = () => {
  return (
    <Tabs
      initialRouteName='home'
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#407CE2',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#fff',
          height: 60,
          paddingTop: 10,
        },
      }}
    >
      <Tabs.Screen
        name='home'
        options={{
          title: 'Trang chủ',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'home-sharp' : 'home-outline'}
              color={color}
              size={28}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='chat'
        options={{
          title: 'Chatbox AI Provjp',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'chatbubbles' : 'chatbubbles-outline'}
              color={color}
              size={28}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='profile'
        options={{
          title: 'Hồ sơ',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'person' : 'person-outline'}
              color={color}
              size={28}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default NurseLayout;
