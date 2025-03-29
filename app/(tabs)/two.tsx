import { StyleSheet } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getAuth } from 'firebase/auth';
import CreatePostButton from '@/components/Community/CreatePostButton';
import PostListScreen from '@/components/Community/PostListScreen';

export default function TabTwoScreen() {
  const auth = getAuth();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Community Posts</Text>
        </View>
        <View style={styles.buttonContainer}>
          <CreatePostButton/>
        </View>
      </View>
      <View style={styles.postListContainer}>
        <PostListScreen/>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#c3c4b1',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#c3c4b1',

  },
  titleContainer: {
    flex: 1,
    backgroundColor: '#c3c4b1',

  },
  buttonContainer: {
    marginLeft: 10,
    
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  postListContainer: {
    flex: 1,
    backgroundColor: '#c3c4b1',

  },
});