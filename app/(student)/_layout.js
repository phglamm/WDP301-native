import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

const TabsLayout = () => {
  return (
    <Tabs
      initialRouteName='home'
      screenOptions={{
        tabBarActiveTintColor: '#407CE2',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderRadius: 50,
          height: 70,
          shadowOpacity: 0.1,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 0 },
          shadowRadius: 10,
          paddingTop: 10,
          paddingBottom: 10,
          marginHorizontal: 20,
          position: 'absolute',
          left: 20,
          right: 20,
          bottom: 10,
        },
      }}
    >
      <Tabs.Screen
        name='home'
        options={{
          title: 'Home',
          headerShown: false,
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
        name='settings'
        options={{
          title: 'Settings',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'settings' : 'settings-outline'}
              color={color}
              size={28}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='profile'
        options={{
          title: 'Profile',
          headerShown: false,
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

export default TabsLayout;
