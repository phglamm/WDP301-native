import { Tabs } from 'expo-router';

const ParentLayout = () => {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name='home' />
      <Tabs.Screen name='profile' />
    </Tabs>
  );
};

export default ParentLayout;
