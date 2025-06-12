import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Platform } from "react-native";
import { useColorScheme } from "react-native";

const ParentLayout = () => {
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
        tabBarActiveTintColor: isDark ? "#ffffff" : "#007AFF",
        tabBarInactiveTintColor: isDark ? "#666666" : "#999999",
      }}
      initialRouteName="home"
    >
      <Tabs.Screen name="health-declaration" options={{ href: null }} />
      <Tabs.Screen name="send-medicine" options={{ href: null }} />
      <Tabs.Screen name="vaccine-declaration" options={{ href: null }} />
      <Tabs.Screen name="injection-register" options={{ href: null }} />
      <Tabs.Screen name="order-process" options={{ href: null }} />
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              color={color}
              size={28}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "chatbubbles" : "chatbubbles-outline"}
              color={color}
              size={28}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="blogs"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "newspaper" : "newspaper-outline"}
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

export default ParentLayout;
