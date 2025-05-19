import { Tabs } from 'expo-router';

const NurseLayout = () => {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name='home' options={{ headerShown: false }} />
      <Tabs.Screen name='profile' options={{ headerShown: false }} />
      <Tabs.Screen name='settings' options={{ headerShown: false }} />
    </Tabs>
  );
};

export default NurseLayout;
