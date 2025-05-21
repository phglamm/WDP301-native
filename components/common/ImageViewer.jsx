import { StyleSheet } from 'react-native';
import { Image } from 'expo-image';

export default function ImageViewer({ imgSource, selectedImage }) {
  const imageSource = selectedImage ? { uri: selectedImage } : imgSource;

  return (
    <Image source={imageSource} style={styles.image} contentFit='contain' />
  );
}

const styles = StyleSheet.create({
  image: {
    width: 320,
    height: 440,
    borderRadius: 18,
  },
});
