import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  Alert,
  FlatList
} from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../FirebaseConfig';
import PostView from '../Community/PostView';

interface Post {
  id: string;
  description: string;
  username: string;
  materials: string[];
  likes: number;
  comments: string[];
  createdAt: any;
}

const SearchByMaterialsScreen = () => {
  const [materials, setMaterials] = useState(['']);
  const [searchResults, setSearchResults] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);

  const addMaterialInput = () => {
    setMaterials([...materials, '']);
  };

  const updateMaterial = (text: string, index: number) => {
    const newMaterials = [...materials];
    newMaterials[index] = text;
    setMaterials(newMaterials);
  };

  const removeMaterial = (index: number) => {
    const newMaterials = materials.filter((_, i) => i !== index);
    setMaterials(newMaterials);
  };

  const handleSearch = async () => {
    // Filter out empty material inputs
    const filteredMaterials = materials.filter(material => material.trim() !== '');

    if (filteredMaterials.length === 0) {
      Alert.alert('Validation Error', 'Please add at least one material to search for');
      return;
    }

    setLoading(true);
    try {
      // Get all posts
      const postsQuery = query(collection(db, 'posts'));
      const querySnapshot = await getDocs(postsQuery);

      // Filter posts that contain all the specified materials
      const matchingPosts = querySnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Post))
        .filter(post => {
          // Check if all search materials are present in the post's materials
          return filteredMaterials.every(searchMaterial =>
            post.materials.some(postMaterial =>
              postMaterial.toLowerCase().includes(searchMaterial.toLowerCase())
            )
          );
        });

      setSearchResults(matchingPosts);
    } catch (error) {
      console.error('Error searching posts:', error);
      Alert.alert('Error', 'Failed to search posts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderPost = ({ item }: { item: Post }) => (
    <PostView
      id={item.id}
      description={item.description}
      username={item.username}
      materials={item.materials}
      likes={item.likes}
      comments={item.comments}
    />
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Search by Materials</Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Materials to Search For</Text>
          {materials.map((material, index) => (
            <View key={index} style={styles.materialInputContainer}>
              <TextInput
                style={styles.materialInput}
                placeholder={`Material ${index + 1}`}
                value={material}
                onChangeText={(text) => updateMaterial(text, index)}
              />
              {materials.length > 1 && (
                <TouchableOpacity 
                  onPress={() => removeMaterial(index)} 
                  style={styles.removeMaterialButton}
                >
                  <Text style={styles.removeMaterialButtonText}>-</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
          <TouchableOpacity 
            onPress={addMaterialInput} 
            style={styles.addMaterialButton}
          >
            <Text style={styles.addMaterialButtonText}>+ Add Material</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.searchButton}
          onPress={handleSearch}
          disabled={loading}
        >
          <Text style={styles.searchButtonText}>
            {loading ? 'Searching...' : 'Search Posts'}
          </Text>
        </TouchableOpacity>

        {searchResults.length > 0 && (
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsTitle}>Search Results</Text>
            <FlatList
              data={searchResults}
              renderItem={renderPost}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContainer: {
    padding: 20,
  },
  headerContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: '600',
  },
  materialInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  materialInput: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 10,
  },
  removeMaterialButton: {
    backgroundColor: 'red',
    borderRadius: 5,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  removeMaterialButtonText: {
    color: 'white',
    fontSize: 18,
  },
  addMaterialButton: {
    backgroundColor: '#007bff',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  addMaterialButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  searchButton: {
    backgroundColor: '#28a745',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  searchButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultsContainer: {
    marginTop: 20,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default SearchByMaterialsScreen; 