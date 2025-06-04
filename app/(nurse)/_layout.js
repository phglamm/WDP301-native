import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Platform } from "react-native";
import { useColorScheme } from "react-native";

const NurseLayout = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: Platform.OS === "ios" ? 88 : 80,
          paddingBottom: Platform.OS === "ios" ? 28 : 8,
          paddingTop: 10,
          backgroundColor: isDark ? "#1a1a1a" : "#ffffff",
        },
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: isDark ? "#666666" : "#999999",
      }}
      initialRouteName="home"
    >
      <Tabs.Screen name="injection" options={{ href: null }} />
      <Tabs.Screen name="accident" options={{ href: null }} />
      <Tabs.Screen name="accident-detail" options={{ href: null }} />
      <Tabs.Screen name="medicine-request" options={{ href: null }} />
      <Tabs.Screen name="medicine-request-detail" options={{ href: null }} />

      <Tabs.Screen
        name="home"
        options={{
          title: "Trang chủ",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home-sharp" : "home-outline"}
              color={color}
              size={28}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="notification"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "notifications" : "notifications-outline"}
              color={color}
              size={28}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Hồ sơ",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
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
