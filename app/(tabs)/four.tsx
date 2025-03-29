import { StyleSheet } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialSearchComponent from '@/components/Scan/MaterialSearch';
  export default function TabTwoScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search Posts by Materials</Text>
      <MaterialSearchComponent/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 65,
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
