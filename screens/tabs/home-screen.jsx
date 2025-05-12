import { Link } from 'expo-router';
import {
  SafeAreaView,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import {
  BookOpen,
  Brain,
  Lightbulb,
  Play,
  Star,
  Users,
} from 'lucide-react-native';
import ThemeToggle from '../../components/themes/ThemeToggle';

export default function HomeScreen() {
  const features = [
    {
      id: 1,
      title: 'Interactive Learning',
      description: 'Fun activities that make learning enjoyable',
      icon: (
        <Brain
          stroke='#60A5FA'
          className='dark:stroke-blue-300'
          width={24}
          height={24}
        />
      ),
      color: 'bg-blue-50 dark:bg-blue-900/30',
    },
    {
      id: 2,
      title: 'Progress Tracking',
      description: "Monitor your child's learning journey",
      icon: (
        <Star
          stroke='#60A5FA'
          className='dark:stroke-blue-300'
          width={24}
          height={24}
        />
      ),
      color: 'bg-indigo-50 dark:bg-indigo-900/30',
    },
    {
      id: 3,
      title: 'Educational Content',
      description: 'Curriculum-aligned learning materials',
      icon: (
        <BookOpen
          stroke='#60A5FA'
          className='dark:stroke-blue-300'
          width={24}
          height={24}
        />
      ),
      color: 'bg-purple-50 dark:bg-purple-900/30',
    },
  ];

  return (
    <SafeAreaView className='flex-1 bg-white dark:bg-gray-900'>
      <ScrollView showsVerticalScrollIndicator={false} className='flex-1'>
        {/* Header */}
        <View className='px-6 pt-4 pb-2 flex-row justify-between items-center'>
          <View className='flex-row items-center'>
            <View className='w-10 h-10 rounded-full bg-blue-500 items-center justify-center mr-2'>
              <Lightbulb stroke='white' width={20} height={20} />
            </View>
            <Text className='text-2xl font-bold text-gray-800 dark:text-white'>
              Test Dark Mode
            </Text>
          </View>
          <ThemeToggle />
        </View>

        {/* Hero Section */}
        <View className='px-6 pt-4'>
          <View className='bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 p-6 rounded-2xl mb-8'>
            <View className='flex-row justify-between'>
              <View className='flex-1 pr-4'>
                <Text className='text-black text-xl font-bold mb-2 dark:text-white'>
                  Start Learning Today!
                </Text>
                <Text className='text-blue-400 mb-4 dark:text-white'>
                  Unlock your child's potential with interactive lessons and fun
                  activities.
                </Text>
                <TouchableOpacity
                  className='bg-white dark:bg-gray-800 py-3 px-4 rounded-lg flex-row items-center self-start'
                  activeOpacity={0.8}
                >
                  <Play stroke='#3B82F6' width={16} height={16} />
                  <Text className='text-blue-500 dark:text-blue-400 font-medium ml-2'>
                    Get Started
                  </Text>
                </TouchableOpacity>
              </View>
              <Image
                source={{
                  uri: 'https://cdn-icons-png.flaticon.com/512/2436/2436636.png',
                }}
                className='w-24 h-24'
                resizeMode='contain'
              />
            </View>
          </View>
        </View>

        {/* Features */}
        <View className='px-6 mb-8'>
          <Text className='text-lg font-semibold mb-4 text-gray-800 dark:text-white'>
            Key Features
          </Text>
          <View className='space-y-3'>
            {features.map((feature) => (
              <View
                key={feature.id}
                className={`p-4 rounded-xl ${feature.color} flex-row items-center`}
              >
                <View className='bg-white dark:bg-gray-800 p-2 rounded-lg mr-4'>
                  {feature.icon}
                </View>
                <View className='flex-1'>
                  <Text className='font-medium text-gray-800 dark:text-white'>
                    {feature.title}
                  </Text>
                  <Text className='text-sm text-gray-600 dark:text-gray-300'>
                    {feature.description}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
