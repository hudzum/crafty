import React, { useRef, useCallback, useState } from 'react';
import {Modal, View, Text, TouchableOpacity, StyleSheet, Platform, Alert } from 'react-native';
import CreatePostScreen from './CreatePostScreen';

const CreatePostButton = () => {
  // Reference to the bottom sheet modal
  const [isModalVisible, setIsModalVisible] = useState(false);


  return (
    
      <View style={styles.container}>
        {/* Button to open the modal */}
        <View>
        <TouchableOpacity 
          style={styles.openButton} 
          onPress={() => setIsModalVisible(true)}>
          <Text style={styles.buttonText}>+ Create Post</Text>
        </TouchableOpacity>
        </View>
        <Modal
        visible={isModalVisible}
        animationType="slide" // Options: "slide", "fade", "none"
        transparent={true} // Allows background to be seen
        onRequestClose={() => setIsModalVisible(false)} // Android back button closes modal
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <CreatePostScreen onPostCreated={() => setIsModalVisible(false)} />
          
          </View>
        </View>
      </Modal>
      </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#c3c4b1',
    },
    openButton: {
      backgroundColor: '#344b33', // Green color
      borderRadius: 10,
      paddingHorizontal: 15,
      paddingVertical: 1,
    },
    buttonText: {
      color: 'white', // Black text
      fontWeight: 'bold',
      fontSize: 16,
      paddingHorizontal: 10,
    },
    modalBackground: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
      flex: 1,
      marginTop: 50,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
  });

export default CreatePostButton;