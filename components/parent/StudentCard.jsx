import { View, Text, TouchableOpacity } from 'react-native';
import { User } from 'lucide-react-native';

const StudentCard = ({ student, selectedSon, handleSelectSon }) => {
  const isSelected = selectedSon?.id === student.id;

  return (
    <TouchableOpacity
      key={student.id}
      onPress={() => handleSelectSon(student)}
      className='mb-4 w-[47%]'
    >
      <View
        className={`p-4 rounded-2xl ${
          isSelected
            ? 'border-2 border-blue-500 bg-blue-50'
            : 'border-2 border-gray-200 bg-white'
        }`}
      >
        {/* Avatar - fullName - studentCode */}
        <View className='items-center mb-3'>
          <View
            className={`w-12 h-12 rounded-full items-center justify-center mb-2 ${
              isSelected ? 'bg-blue-500' : 'bg-gray-200'
            }`}
          >
            <User size={24} color={isSelected ? '#fff' : '#6B7280'} />
          </View>
          <Text
            className={`font-bold text-base text-center ${
              isSelected ? 'text-blue-800' : 'text-gray-800'
            }`}
            numberOfLines={2}
          >
            {student.fullName || student.name || 'Học sinh'}
          </Text>
          <Text className='text-gray-500 text-sm text-center'>
            {student.studentCode || 'Mã HS'}
          </Text>
        </View>
        {/* Badge trạng thái */}
        <View className='items-center'>
          <View
            className={`px-3 py-1 rounded-full ${
              isSelected ? 'bg-blue-500' : 'bg-gray-100'
            }`}
          >
            <Text
              className={`text-xs font-medium ${
                isSelected ? 'text-white' : 'text-gray-600'
              }`}
            >
              {isSelected ? 'Đã chọn' : 'Chọn học sinh'}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default StudentCard;
