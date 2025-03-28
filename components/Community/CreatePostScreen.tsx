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
  Alert 
} from 'react-native';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { router } from 'expo-router';
import { db } from '../../FirebaseConfig';

// Add an optional onPostCreated prop
const CreatePostScreen = ({ onPostCreated }: { onPostCreated?: () => void }) => {
  const [description, setDescription] = useState('');
  const [materials, setMaterials] = useState(['']);
  const [loading, setLoading] = useState(false);

  const auth = getAuth();
  
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

  // ... (rest of the previous implementation remains the same)

  const handleCreatePost = async () => {
    // ... (previous validation code)
    if (!description.trim()) {
        Alert.alert('Validation Error', 'Please enter a description');
        return;
      }
  
      // Filter out empty material inputs
      const filteredMaterials = materials.filter(material => material.trim() !== '');
  
      if (filteredMaterials.length === 0) {
        Alert.alert('Validation Error', 'Please add at least one material');
        return;
      }
  
      // Ensure user is logged in
      if (!auth.currentUser) {
        Alert.alert('Authentication Error', 'Please log in to create a post');
        return;
      }
  
      setLoading(true);
    try {
      const postRef = await addDoc(collection(db, 'posts'), {
        description: description.trim(),
        userId: auth.currentUser?.uid,
        username: auth.currentUser?.displayName || 'Anonymous User',
        materials: filteredMaterials,
        comments: [],
        likes: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // Call the onPostCreated callback if provided
      onPostCreated && onPostCreated();

      // Reset form
      setDescription('');
      setMaterials(['']);

      // Optional: show success message
      Alert.alert('Success', 'Post created successfully!');
    } catch (error) {
      console.error('Error creating post:', error);
      Alert.alert('Error', 'Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Create New Post</Text>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={onPostCreated}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.descriptionInput}
            placeholder="Describe your project or idea..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Materials</Text>
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
          style={styles.createPostButton}
          onPress={handleCreatePost}
          disabled={loading}
        >
          <Text style={styles.createPostButtonText}>
            {loading ? 'Creating Post...' : 'Create Post'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
  // ... (rest of the previous implementation remains the same)
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
    },
    scrollContainer: {
      padding: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
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
    descriptionInput: {
      backgroundColor: '#f5f5f5',
      borderRadius: 10,
      padding: 15,
      minHeight: 100,
      textAlignVertical: 'top',
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
    createPostButton: {
      backgroundColor: '#28a745',
      borderRadius: 10,
      padding: 15,
      alignItems: 'center',
    },
    createPostButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
    headerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    closeButton: {
      padding: 8,
    },
    closeButtonText: {
      fontSize: 24,
      color: '#666',
    },
  });
  


export default CreatePostScreen;