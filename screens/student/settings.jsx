import { View } from 'react-native';
import React, { useState } from 'react';
import PlaceholderImage from '../../assets/images/icon.png';
import ImageViewer from '../../components/common/ImageViewer';
import * as ImagePicker from 'expo-image-picker';

export default function SettingsScreen() {
  const [selectedImage, setSelectedImage] = useState(undefined);
  const [showAppOptions, setShowAppOptions] = useState(false);
  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    } else {
      alert('You did not select any image.');
    }
  };
  return (
    <View className='bg-white dark:bg-gray-900 flex-1'>
      <View className='bg-white dark:bg-gray-900 flex-1 items-center justify-center'>
        <ImageViewer
          imgSource={PlaceholderImage}
          selectedImage={selectedImage}
        />
      </View>
      {showAppOptions ? (
        <View />
      ) : (
        <View className='bg-white dark:bg-gray-900 flex-1 items-center justify-center'>
          <Button onPress={pickImageAsync}>
            <Text>Choose a photo</Text>
          </Button>
        </View>
      )}
    </View>
  );
}
