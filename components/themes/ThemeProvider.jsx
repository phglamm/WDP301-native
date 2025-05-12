import { StatusBar } from 'expo-status-bar';
import { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme, View } from 'react-native';
import { useColorScheme as useNativeWindColorScheme } from 'nativewind';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();
const THEME_PREFERENCE_KEY = '@theme_preference';

const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState(systemColorScheme || 'light');
  const { setColorScheme } = useNativeWindColorScheme();

  // Load saved theme preference
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_PREFERENCE_KEY);
        if (savedTheme) {
          setTheme(savedTheme);
          setColorScheme(savedTheme);
        }
      } catch (error) {
        console.error('Error loading theme preference:', error);
      }
    };
    loadThemePreference();
  }, []);

  // Update theme when system color scheme changes if no saved preference
  useEffect(() => {
    const updateSystemTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_PREFERENCE_KEY);
        if (!savedTheme && systemColorScheme) {
          setTheme(systemColorScheme);
          setColorScheme(systemColorScheme);
        }
      } catch (error) {
        console.error('Error checking theme preference:', error);
      }
    };
    updateSystemTheme();
  }, [systemColorScheme, setColorScheme]);

  const toggleTheme = async () => {
    try {
      const newTheme = theme === 'light' ? 'dark' : 'light';
      setTheme(newTheme);
      setColorScheme(newTheme);
      await AsyncStorage.setItem(THEME_PREFERENCE_KEY, newTheme);
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <View className='flex-1 bg-white dark:bg-gray-900'>{children}</View>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeProvider;
