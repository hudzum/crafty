import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  RefreshControl 
} from 'react-native';
import { 
  collection, 
  query, 
  orderBy, 
  getDocs 
} from 'firebase/firestore';
import PostView from './PostView';
import { db } from '../../FirebaseConfig';
interface Post {
  id: string;
  description: string;
  username: string;
  materials: string[];
  likes: number;
  comments: string[];
  createdAt: any;
  imageUrl: string;
  imagePath: string;
}

const PostListScreen = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Create a query to fetch posts, ordered by creation time (most recent first)
      const postsQuery = query(
        collection(db, 'posts'), 
        orderBy('createdAt', 'desc')
      );

      // Fetch the documents
      const querySnapshot = await getDocs(postsQuery);

      // Map the documents to our Post interface
      const fetchedPosts: Post[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Post));

      setPosts(fetchedPosts);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to fetch posts');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchPosts();
  };

  const renderPost = ({ item }: { item: Post }) => (
    <PostView
      id={item.id}
      description={item.description}
      username={item.username}
      materials={item.materials}
      likes={item.likes}
      comments={item.comments}
      imageUrl={item.imageUrl}
      imagePath={item.imagePath}
    />
  );

  if (loading) {
    return (
      <View style={styles.centerContent}>
        <Text>Loading posts...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContent}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={posts}
      renderItem={renderPost}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContainer}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#007bff']}
        />
      }
      ListEmptyComponent={
        <View style={styles.centerContent}>
          <Text>No posts found. Be the first to create one!</Text>
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 10,
    backgroundColor: '#c3c4b1',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
});

export default PostListScreen;