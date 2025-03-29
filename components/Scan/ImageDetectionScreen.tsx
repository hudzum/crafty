import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as tf from '@tensorflow/tfjs';
import * as coco from '@tensorflow-models/coco-ssd';
import * as ImageManipulator from 'expo-image-manipulator';
import { toByteArray } from 'base64-js';
import * as FileSystem from 'expo-file-system';
const ObjectDetectionScreen = () => {
  const [image, setImage] = useState(null);
  const [detections, setDetections] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [model, setModel] = useState(null);

  // Initialize TensorFlow.js and load the COCO-SSD model on component mount
  React.useEffect(() => {
    const setupModel = async () => {
      try {
        setIsLoading(true);
        // Initialize TensorFlow.js
        await tf.ready();
        console.log('TensorFlow.js is ready');
        
        // Load the COCO-SSD model
        const loadedModel = await coco.load();

        setModel(loadedModel);
        setModelLoaded(true);
        console.log('COCO-SSD model loaded');
      } catch (error) {
        console.error('Failed to load model:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    setupModel();
  }, []);



const imageToTensor = async (imageUri) => {
  try {
    // 1. Resize the image to a standard size using ImageManipulator
    const resizedImage = await ImageManipulator.manipulateAsync(
      imageUri,
      [{ resize: { width: 224, height: 224 } }], // Common model input size
      { format: 'jpeg', base64: true }
    );
    
    // 2. Get base64 data
    const base64Data = resizedImage.base64;
    
    // 3. Decode base64 to binary buffer
    const buffer = toByteArray(base64Data);
    
    // 4. Create a typed array from the buffer
    const rawImageData = new Uint8Array(buffer);
    
    // 5. Decode the JPEG image data to get RGB values
    // Note: This step is a simplification. In a real app, you'd need a proper
    // JPEG decoder, which is not trivial in JS. Libraries like jpeg-js can help.
    // For this example, let's assume we have the raw RGB data somehow
    
    // Create a 3D tensor with shape [height, width, channels]
    const tensor = tf.tensor3d(
      Array.from(rawImageData), 
      [224, 224, 3],  // [height, width, rgb]
      'int32'
    );
    
    // Normalize the tensor from [0, 255] to [0, 1]
    const normalized = tensor.div(tf.scalar(255));
    
    // Clean up the non-normalized tensor to free memory
    tensor.dispose();
    
    return normalized;
  } catch (error) {
    console.error('Error converting image to tensor:', error);
    throw error;
  }
};


  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;
      console.log(result, 'the result');
      setImage(imageUri);
      console.log("Image picked: ", imageUri);
    }
  };

  // Detect objects in the selected image
  const detectObjects = async () => {
    if (!image || !modelLoaded) {
        console.log('no image or model loaded');
        return;
    }
    try {
        
      setIsLoading(true);
      console.log('image', image);
      const tensor = await imageToTensor(image);
      console.log('tensor', tensor);
      const predictions = await model.detect(tensor);


      console.log('predictions', predictions);
      setDetections(predictions);
      console.log('Detections:', predictions);
    } catch (error) {
      console.error('Failed to detect objects:', error);
      alert('Error detecting objects. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Object Detection</Text>
        
        {/* Loading indicator when model is being loaded */}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0066cc" />
            <Text style={styles.loadingText}>
              {modelLoaded ? 'Analyzing image...' : 'Loading detection model...'}
            </Text>
          </View>
        )}
        
        {/* Image selection area */}
        <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
          {image ? (
            <Image source={{ uri: image }} style={styles.image} />
          ) : (
            <View style={styles.placeholderContainer}>
              <Text style={styles.placeholderText}>Tap to select an image</Text>
            </View>
          )}
        </TouchableOpacity>
        
        {/* Button to perform detection */}
        <TouchableOpacity
          style={[
            styles.detectButton,
            (!image || isLoading || !modelLoaded) && styles.disabledButton
          ]}
          onPress={detectObjects}
          disabled={!image || isLoading || !modelLoaded}
        >
          <Text style={styles.buttonText}>Detect Objects</Text>
        </TouchableOpacity>
        
        {/* Display detection results */}
        {detections.length > 0 && (
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsTitle}>Detected Objects:</Text>
            {detections.map((detection, index) => (
              <View key={index} style={styles.detectionItem}>
                <Text style={styles.detectionClass}>{detection.class}</Text>
                <Text style={styles.detectionScore}>
                  Confidence: {(detection.score * 100).toFixed(2)}%
                </Text>
              </View>
            ))}
          </View>
        )}
        
        {/* Display message when no objects are detected */}
        {detections.length === 0 && image && !isLoading && (
          <Text style={styles.noDetectionsText}>
            No objects detected. Try a different image.
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    padding: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  imageContainer: {
    width: '100%',
    height: 300,
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#e0e0e0',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
  },
  placeholderText: {
    fontSize: 16,
    color: '#666',
  },
  detectButton: {
    backgroundColor: '#0066cc',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 20,
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    zIndex: 1000,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
  resultsContainer: {
    width: '100%',
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  detectionItem: {
    padding: 12,
    marginBottom: 8,
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#0066cc',
  },
  detectionClass: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  detectionScore: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  noDetectionsText: {
    marginTop: 20,
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
});

export default ObjectDetectionScreen;