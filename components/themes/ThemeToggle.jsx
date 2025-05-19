import React from 'react';
import { Pressable, Animated, View } from 'react-native';
import { Moon, Sun } from 'lucide-react-native';
import { useTheme } from './ThemeProvider';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <Pressable
      onPress={toggleTheme}
      className='p-2 max-w-12 rounded-full bg-gray-100 dark:bg-gray-800 shadow-sm'
      style={{
        elevation: 2,
      }}
    >
      <View className='w-8 h-8 items-center justify-center'>
        {isDark ? (
          <Moon color='#FDB813' size={24} />
        ) : (
          <Sun color='#FDB813' size={24} />
        )}
      </View>
    </Pressable>
  );
};

export default ThemeToggle;
