import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  RefreshControl,
  StatusBar,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import {
  Search,
  BookOpen,
  Heart,
  Clock,
  TrendingUp,
  Bookmark,
  Share2,
  MessageCircle,
  Filter,
  Star,
  Eye,
  Calendar,
  ArrowLeft,
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HeaderIcon from '../../components/layouts/HeaderIcon';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ParentHeader from '../../components/layouts/ParentHeader';

const { width } = Dimensions.get('window');

const DUMMY_POSTS = [
  {
    id: 1,
    title: 'Cách Giữ Gìn Sức Khỏe Trong Mùa Thi',
    description:
      'Những bí quyết đơn giản giúp học sinh duy trì sức khỏe tốt trong thời gian ôn thi. Bao gồm chế độ ăn uống, nghỉ ngơi và tập thể dục phù hợp.',
    image: 'https://picsum.photos/400/300?random=1',
    date: '20/03/2024',
    readTime: 5,
    views: 1234,
    likes: 89,
    comments: 23,
    tags: ['Sức khỏe học đường', 'Mùa thi', 'Stress'],
    category: 'study',
    author: 'BS. Nguyễn Thị Lan',
    isFeatured: true,
  },
  {
    id: 2,
    title: 'Dinh Dưỡng Cho Học Sinh Phát Triển',
    description:
      'Chế độ ăn uống khoa học giúp tăng cường trí nhớ và tập trung. Những thực phẩm bổ não cho học sinh.',
    image: 'https://picsum.photos/400/300?random=2',
    date: '19/03/2024',
    readTime: 7,
    views: 856,
    likes: 45,
    comments: 12,
    tags: ['Dinh dưỡng', 'Học tập', 'Bổ não'],
    category: 'nutrition',
    author: 'TS. Lê Văn Minh',
    isFeatured: false,
  },
  {
    id: 3,
    title: 'Quản Lý Stress Và Áp Lực Học Tập',
    description:
      'Cách nhận biết và xử lý stress hiệu quả. Những kỹ thuật thư giãn đơn giản cho học sinh.',
    image: 'https://picsum.photos/400/300?random=3',
    date: '18/03/2024',
    readTime: 6,
    views: 1567,
    likes: 134,
    comments: 45,
    tags: ['Tâm lý', 'Stress', 'Thư giãn'],
    category: 'mental',
    author: 'ThS. Trần Thị Mai',
    isFeatured: true,
  },
  {
    id: 4,
    title: 'Tầm Quan Trọng Của Giấc Ngủ',
    description:
      'Giấc ngủ đóng vai trò quan trọng trong việc học tập và phát triển của học sinh. Cách cải thiện chất lượng giấc ngủ.',
    image: 'https://picsum.photos/400/300?random=4',
    date: '17/03/2024',
    readTime: 4,
    views: 892,
    likes: 67,
    comments: 18,
    tags: ['Giấc ngủ', 'Sức khỏe', 'Phát triển'],
    category: 'study',
    author: 'BS. Phạm Văn Đức',
    isFeatured: false,
  },
  {
    id: 5,
    title: 'Tập Thể Dục Cho Học Sinh',
    description:
      'Những bài tập thể dục đơn giản có thể thực hiện tại nhà để duy trì sức khỏe và tăng cường sự tập trung.',
    image: 'https://picsum.photos/400/300?random=5',
    date: '16/03/2024',
    readTime: 8,
    views: 743,
    likes: 89,
    comments: 25,
    tags: ['Thể dục', 'Sức khỏe', 'Tại nhà'],
    category: 'study',
    author: 'HLV. Hoàng Thị Lan',
    isFeatured: false,
  },
];

const TABS = [
  { id: 'all', label: 'Tất cả', icon: BookOpen, color: '#3B82F6' },
  { id: 'study', label: 'Học tập', icon: BookOpen, color: '#10B981' },
  { id: 'nutrition', label: 'Dinh dưỡng', icon: TrendingUp, color: '#F59E0B' },
  { id: 'mental', label: 'Tâm lý', icon: Heart, color: '#EF4444' },
  { id: 'saved', label: 'Đã lưu', icon: Bookmark, color: '#8B5CF6' },
];

export default function Blogs() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [savedPosts, setSavedPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  const handleToggleSave = (postId) => {
    setSavedPosts((prev) =>
      prev.includes(postId)
        ? prev.filter((id) => id !== postId)
        : [...prev, postId]
    );
  };

  const handleToggleLike = (postId) => {
    setLikedPosts((prev) =>
      prev.includes(postId)
        ? prev.filter((id) => id !== postId)
        : [...prev, postId]
    );
  };

  const handleNavigateToDetail = (post) => {
    console.log('Navigate to blog detail:', post.id);
  };

  const getFilteredPosts = () => {
    let filtered = DUMMY_POSTS;

    // Filter by category
    if (activeTab === 'saved') {
      filtered = filtered.filter((post) => savedPosts.includes(post.id));
    } else if (activeTab !== 'all') {
      filtered = filtered.filter((post) => post.category === activeTab);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    return filtered;
  };

  const filteredPosts = getFilteredPosts();
  const featuredPosts = DUMMY_POSTS.filter((post) => post.isFeatured);

  return (
    <SafeAreaView className='flex-1 bg-white dark:bg-gray-900'>
      <KeyboardAvoidingView
        className='flex-1 bg-white'
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <ParentHeader
          title='Bài viết 📚'
          description='Chia sẻ kiến thức và kinh nghiệm'
          onBack={() => router.push('/home')}
        />
        {/* Tabs */}
        <View className='p-4 bg-white border-b border-gray-100'>
          {/* Tabs */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <TouchableOpacity
                  key={tab.id}
                  onPress={() => setActiveTab(tab.id)}
                  className={`mr-4 px-6 py-3 rounded-2xl flex-row items-center ${
                    isActive
                      ? 'bg-blue-500'
                      : 'bg-white border-2 border-gray-200'
                  }`}
                >
                  <Icon size={20} color={isActive ? '#fff' : tab.color} />
                  <Text
                    className={`ml-2 font-semibold ${
                      isActive ? 'text-white' : 'text-gray-700'
                    }`}
                  >
                    {tab.label}
                  </Text>
                  {activeTab === 'saved' && savedPosts.length > 0 && (
                    <View
                      className={`ml-2 rounded-full px-2 py-1 ${
                        isActive ? 'bg-white/20' : 'bg-blue-100'
                      }`}
                    >
                      <Text
                        className={`text-xs font-bold ${
                          isActive ? 'text-white' : 'text-blue-600'
                        }`}
                      >
                        {savedPosts.length}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
        {/* Main Content */}
        <ScrollView
          className='flex-1 px-4'
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          showsVerticalScrollIndicator={false}
        >
          {/* Featured Posts Section */}
          {activeTab === 'all' && searchQuery.length === 0 && (
            <View className='mt-4 mb-6'>
              <Text className='mb-2 text-xl font-bold text-gray-800'>
                Bài viết nổi bật ⭐
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className='py-2'
              >
                {featuredPosts.map((post, index) => (
                  <TouchableOpacity
                    key={post.id}
                    className='overflow-hidden mr-4 bg-white rounded-3xl border border-gray-200'
                    style={{
                      width: width * 0.75,
                    }}
                    onPress={() => handleNavigateToDetail(post)}
                  >
                    <Image
                      source={{ uri: post.image }}
                      className='w-full h-40'
                      resizeMode='cover'
                    />
                    <View className='absolute top-3 right-3'>
                      <View className='px-3 py-1 bg-orange-500 rounded-full'>
                        <Text className='text-xs font-bold text-white'>
                          Nổi bật
                        </Text>
                      </View>
                    </View>
                    <View className='p-4'>
                      <Text
                        className='mb-2 text-lg font-bold text-gray-800'
                        numberOfLines={2}
                      >
                        {post.title}
                      </Text>
                      <Text
                        className='mb-3 text-sm text-gray-600'
                        numberOfLines={2}
                      >
                        {post.description}
                      </Text>
                      <View className='flex-row justify-between items-center'>
                        <Text className='text-xs font-medium text-blue-600'>
                          {post.author}
                        </Text>
                        <View className='flex-row items-center'>
                          <Heart size={14} color='#EF4444' />
                          <Text className='ml-1 text-xs text-gray-500'>
                            {post.likes}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Main Posts Grid */}
          <View>
            <View className='flex-row justify-between items-center mb-4'>
              <Text className='text-xl font-bold text-gray-800'>
                {activeTab === 'all'
                  ? 'Tất cả bài viết'
                  : activeTab === 'saved'
                  ? 'Bài viết đã lưu'
                  : TABS.find((tab) => tab.id === activeTab)?.label}
              </Text>
              <Text className='text-gray-500'>
                {filteredPosts.length} bài viết
              </Text>
            </View>

            {filteredPosts.length === 0 ? (
              <View className='items-center py-20'>
                <BookOpen size={64} color='#D1D5DB' />
                <Text className='mt-4 mb-2 text-lg text-gray-500'>
                  {searchQuery
                    ? 'Không tìm thấy bài viết phù hợp'
                    : 'Chưa có bài viết nào'}
                </Text>
                <Text className='px-8 text-center text-gray-400'>
                  {searchQuery
                    ? 'Thử tìm kiếm với từ khóa khác'
                    : 'Hãy quay lại sau để xem thêm bài viết mới'}
                </Text>
              </View>
            ) : (
              <View className='flex-row flex-wrap justify-between'>
                {filteredPosts.map((post, index) => {
                  const isLiked = likedPosts.includes(post.id);
                  const isSaved = savedPosts.includes(post.id);

                  return (
                    <TouchableOpacity
                      key={post.id}
                      className='overflow-hidden mb-4 bg-white rounded-2xl'
                      style={{
                        width: (width - 48) / 2 - 8,
                        marginRight: index % 2 === 0 ? 16 : 0,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 8,
                        elevation: 4,
                      }}
                      onPress={() => handleNavigateToDetail(post)}
                    >
                      <Image
                        source={{ uri: post.image }}
                        className='w-full h-32'
                        resizeMode='cover'
                      />

                      <View className='p-4'>
                        {/* Date and Save Button */}
                        <View className='flex-row justify-between items-center mb-2'>
                          <View className='flex-row items-center'>
                            <Calendar size={12} color='#9CA3AF' />
                            <Text className='ml-1 text-xs text-gray-500'>
                              {post.date}
                            </Text>
                          </View>
                          <TouchableOpacity
                            onPress={() => handleToggleSave(post.id)}
                          >
                            <Bookmark
                              size={16}
                              color={isSaved ? '#3B82F6' : '#D1D5DB'}
                              fill={isSaved ? '#3B82F6' : 'none'}
                            />
                          </TouchableOpacity>
                        </View>

                        {/* Title */}
                        <Text
                          className='mb-2 text-sm font-bold leading-4 text-gray-800'
                          numberOfLines={2}
                        >
                          {post.title}
                        </Text>

                        {/* Doctor */}
                        <Text className='mb-3 text-xs font-medium text-blue-600'>
                          {post.author}
                        </Text>

                        {/* Tags */}
                        <View className='flex-row flex-wrap mb-3'>
                          {post.tags.slice(0, 2).map((tag, tagIndex) => (
                            <View
                              key={tagIndex}
                              className='px-2 py-1 mr-1 mb-1 bg-blue-50 rounded-full'
                            >
                              <Text className='text-xs font-medium text-blue-600'>
                                {tag}
                              </Text>
                            </View>
                          ))}
                        </View>

                        {/* Likes and Views */}
                        <View className='flex-row justify-between items-center'>
                          <TouchableOpacity
                            className='flex-row items-center'
                            onPress={() => handleToggleLike(post.id)}
                          >
                            <Heart
                              size={16}
                              color={isLiked ? '#EF4444' : '#9CA3AF'}
                              fill={isLiked ? '#EF4444' : 'none'}
                            />
                            <Text
                              className={`ml-1 text-xs font-medium ${
                                isLiked ? 'text-red-500' : 'text-gray-600'
                              }`}
                            >
                              {post.likes}
                            </Text>
                          </TouchableOpacity>

                          <View className='flex-row items-center'>
                            <Eye size={14} color='#9CA3AF' />
                            <Text className='ml-1 text-xs text-gray-500'>
                              {post.views}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
