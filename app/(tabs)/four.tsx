import { StyleSheet } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialSearchComponent from '@/components/Scan/MaterialSearch';
import ObjectDetectionScreen from '@/components/Scan/ImageDetectionScreen';
export default function TabTwoScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Scan</Text>
      <ObjectDetectionScreen/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#c3c4b1',

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
