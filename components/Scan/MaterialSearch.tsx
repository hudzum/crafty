import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  FlatList, 
  StyleSheet, 
  ScrollView 
} from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../FirebaseConfig'; // Adjust the import path as needed

// Define Post interface
interface Post {
  id: string;
  description: string;
  userId: string;
  username: string;
  materials: string[];
  comments: any[];
  likes: number;
  createdAt: any;
  updatedAt: any;
}

// List of all possible materials
const ALL_MATERIALS: string[] = [
  'Wood', 'Metal', 'Plastic', 'Glass', 'Ceramic', 
  'Fabric', 'Leather', 'Paper', 'Electronics', 'Paint'
  // Add more materials as needed
];

const MaterialSearchComponent: React.FC = () => {
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<Post[]>([]);

  const toggleMaterial = (material: string): void => {
    setSelectedMaterials(prev => 
      prev.includes(material)
        ? prev.filter(m => m !== material)
        : [...prev, material]
    );
  };

  const searchPosts = async (): Promise<void> => {
    if (selectedMaterials.length === 0) {
      // Optionally handle case of no materials selected
      return;
    }

    try {
      // Create a query to find posts that match ALL selected materials
      const postsRef = collection(db, 'posts');
      const q = query(
        postsRef, 
        where('materials', 'array-contains-any', selectedMaterials)
      );

      const querySnapshot = await getDocs(q);
      const posts: Post[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Post));

      // Filter to ensure ALL selected materials are present
      const filteredPosts = posts.filter(post => 
        selectedMaterials.every(material => 
          post.materials.includes(material)
        )
      );

      setSearchResults(filteredPosts);
    } catch (error) {
      console.error('Error searching posts:', error);
    }
  };

  const renderMaterialButton = (material: string) => {
    const isSelected = selectedMaterials.includes(material);
    return (
      <TouchableOpacity
        key={material}
        style={[
          styles.materialButton,
          isSelected && styles.selectedMaterialButton
        ]}
        onPress={() => toggleMaterial(material)}
      >
        <Text style={[
          styles.materialButtonText,
          isSelected && styles.selectedMaterialButtonText
        ]}>
          {material}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderPostItem = ({ item }: { item: Post }) => (
    <View style={styles.postItem}>
      <Text style={styles.postUsername}>{item.username}</Text>
      <Text style={styles.postDescription}>{item.description}</Text>
      <Text style={styles.postMaterials}>
        Materials: {item.materials.join(', ')}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search Posts by Materials</Text>
      
      {/* Materials Selection Scroll View */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.materialsContainer}
      >
        {ALL_MATERIALS.map(renderMaterialButton)}
      </ScrollView>

      {/* Search Button */}
      <TouchableOpacity 
        style={styles.searchButton}
        onPress={searchPosts}
      >
        <Text style={styles.searchButtonText}>
          Search Posts ({selectedMaterials.length} selected)
        </Text>
      </TouchableOpacity>

      {/* Search Results */}
      <FlatList
        data={searchResults}
        renderItem={renderPostItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.noResultsText}>
            {searchResults.length === 0 
              ? 'No posts found' 
              : 'Select materials to search'}
          </Text>
        }
        style={styles.resultsList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  materialsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  materialButton: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
    marginRight: 8,
  },
  selectedMaterialButton: {
    backgroundColor: '#007bff',
  },
  materialButtonText: {
    color: '#000',
  },
  selectedMaterialButtonText: {
    color: '#fff',
  },
  searchButton: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  resultsList: {
    flex: 1,
  },
  postItem: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  postUsername: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  postDescription: {
    marginBottom: 4,
  },
  postMaterials: {
    color: '#666',
    fontStyle: 'italic',
  },
  noResultsText: {
    textAlign: 'center',
    marginTop: 32,
    color: '#666',
  },
});

export default MaterialSearchComponent;