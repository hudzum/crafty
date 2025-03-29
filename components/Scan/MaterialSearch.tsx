import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  FlatList, 
  StyleSheet, 
  Modal,
  ScrollView,
  RefreshControl
} from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../FirebaseConfig'; // Adjust the import path as needed
import PostView from '../Community/PostView'; // Import the PostView component

// Define Post interface to match your existing one
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

// List of all possible materials
const ALL_MATERIALS: string[] = [
  'Water Bottle',
  'Toliet Paper Rolls',
  'Soda Bottle',
  'Tissue Boxes',
  'Soda Can',
  'Cardboard',
  'Paper',
  // Add more materials as needed
];

const MaterialSearchComponent: React.FC = () => {
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<Post[]>([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleMaterial = (material: string): void => {
    setSelectedMaterials(prev => 
      prev.includes(material)
        ? prev.filter(m => m !== material)
        : [...prev, material]
    );
  };

  const searchPosts = async (): Promise<void> => {
    if (selectedMaterials.length === 0) {
      setSearchResults([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Create a query to find posts that match ANY selected materials first
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
      setError('Failed to search posts');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    searchPosts();
  };

  // Use the same renderPost function as in PostListScreen
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

  return (
    <View style={styles.container}>
      
      {/* Materials Dropdown Button */}
      <TouchableOpacity 
        style={styles.dropdownButton}
        onPress={() => setDropdownVisible(true)}
      >
        <Text style={styles.dropdownButtonText}>
          {selectedMaterials.length > 0 
            ? `Selected: ${selectedMaterials.length} materials` 
            : 'Select Materials'}
        </Text>
      </TouchableOpacity>

      {/* Materials Dropdown Modal (stays open during selections) */}
      <Modal
        visible={dropdownVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setDropdownVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Materials</Text>
            
            <ScrollView style={styles.modalScrollView}>
              {ALL_MATERIALS.map(material => (
                <TouchableOpacity
                  key={material}
                  style={[
                    styles.materialItem,
                    selectedMaterials.includes(material) && styles.selectedMaterialItem
                  ]}
                  onPress={() => toggleMaterial(material)}
                >
                  <Text style={[
                    styles.materialItemText,
                    selectedMaterials.includes(material) && styles.selectedMaterialItemText
                  ]}>
                    {material}
                  </Text>
                  {selectedMaterials.includes(material) && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            <View style={styles.modalActions}>
              <Text style={styles.selectionCount}>
                {selectedMaterials.length} materials selected
              </Text>
              <TouchableOpacity 
                style={styles.modalButton}
                onPress={() => setDropdownVisible(false)}
              >
                <Text style={styles.modalButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Selected material chips */}
      {selectedMaterials.length > 0 && (
        <View style={styles.selectedChipsContainer}>
          {selectedMaterials.map(material => (
            <TouchableOpacity 
              key={material} 
              style={styles.chip}
              onPress={() => toggleMaterial(material)}
            >
              <Text style={styles.chipText}>{material}</Text>
              <Text style={styles.chipRemove}>×</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Search Button */}
      <TouchableOpacity 
        style={[
          styles.searchButton,
          selectedMaterials.length === 0 && styles.disabledButton
        ]}
        onPress={searchPosts}
        disabled={selectedMaterials.length === 0}
      >
        <Text style={styles.searchButtonText}>
          Search Posts ({selectedMaterials.length} selected)
        </Text>
      </TouchableOpacity>

      {/* Search Results - Using the same FlatList style as PostListScreen */}
      {loading && !refreshing ? (
        <View style={styles.centerContent}>
          <Text>Searching posts...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={searchResults}
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
              <Text>
                {selectedMaterials.length === 0 
                  ? 'Select materials to search for posts' 
                  : 'No posts found with all selected materials'}
              </Text>
            </View>
          }
        />
      )}
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
  dropdownButton: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 8,
  },
  dropdownButtonText: {
    fontSize: 16,
  },
  selectedChipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  chip: {
    backgroundColor: '#8d8e7c',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    margin: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  chipText: {
    color: '#fff',
    marginRight: 4,
  },
  chipRemove: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 2,
  },
  searchButton: {
    backgroundColor: '#8d8e7c',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalScrollView: {
    maxHeight: 300,
  },
  materialItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedMaterialItem: {
    backgroundColor: '#f0f7ff',
  },
  materialItemText: {
    fontSize: 16,
  },
  selectedMaterialItemText: {
    fontWeight: 'bold',
    color: '#4682b4',
  },
  checkmark: {
    color: '#4682b4',
    fontWeight: 'bold',
    fontSize: 18,
  },
  modalActions: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectionCount: {
    color: '#666',
  },
  modalButton: {
    backgroundColor: '#8d8e7c',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  // Copied from PostListScreen
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

export default MaterialSearchComponent;