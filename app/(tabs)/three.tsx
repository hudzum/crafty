import { StyleSheet } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ObjectDetectionScreen } from '@/components/Scan/ObjectDetection/ObjectDetectionScreen';
import { useState } from 'react';

export default function TabTwoScreen() {
  const [imageUri, setImageUri] = useState('');
  return (
    <SafeAreaView style={styles.container}>
      <ObjectDetectionScreen imageUri={imageUri} setImageUri={setImageUri} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
