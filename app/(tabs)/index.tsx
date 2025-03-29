import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ActivityIndicator, Alert, Platform } from 'react-native'
import React, { useState, useEffect } from 'react'
import { getAuth } from 'firebase/auth'
import {  doc, getDoc, updateDoc } from 'firebase/firestore'
import {  ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import * as ImagePicker from 'expo-image-picker'
import { router } from 'expo-router'
import { db, storage } from '../../FirebaseConfig'
const ProfileScreen = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [newUsername, setNewUsername] = useState('')
  const [uploadLoading, setUploadLoading] = useState(false)

  const auth = getAuth()

  // Fetch user data on component mount
  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      setIsLoading(true)
      const user = auth.currentUser
      
      if (!user) {
        // User is not logged in, redirect to sign in
        return
      }

      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid))
      
      if (userDoc.exists()) {
        const userData = userDoc.data()
        setUsername(userData.username || '')
        setNewUsername(userData.username || '')
        setEmail(userData.email || user.email || '')
        setProfileImage(userData.profileImageUrl || null)
      } else {
        console.log('No user document found')
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditToggle = () => {
    if (isEditing) {
      // If we're exiting edit mode, reset the new username
      setNewUsername(username)
    }
    setIsEditing(!isEditing)
  }

  const handleSaveProfile = async () => {
    try {
      const user = auth.currentUser
      if (!user) return

      // Validate username
      if (!newUsername.trim()) {
        Alert.alert('Error', 'Username cannot be empty')
        return
      }

      setIsLoading(true)
      
      // Update user document in Firestore
      await updateDoc(doc(db, 'users', user.uid), {
        username: newUsername.trim()
      })

      setUsername(newUsername.trim())
      setIsEditing(false)
      Alert.alert('Success', 'Username updated successfully')
    } catch (error) {
      console.error('Error updating profile:', error)
      Alert.alert('Error', 'Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePickImage = async () => {
    // Request permission
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()
    
    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'You need to grant permission to access your photos')
      return
    }

    // Pick image
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    })

    if (!result.canceled) {
      uploadProfileImage(result.assets[0].uri)
    }
  }

  const uploadProfileImage = async (uri: string) => {
    try {
      const user = auth.currentUser
      if (!user) return

      setUploadLoading(true)

      // Create a reference to the file in Firebase Storage
      const storageRef = ref(storage, `profileImages/${user.uid}`)
      
      // Convert image to blob
      const response = await fetch(uri)
      const blob = await response.blob()
      
      // Upload blob
      await uploadBytes(storageRef, blob)
      
      // Get download URL
      const downloadURL = await getDownloadURL(storageRef)
      
      // Update user document with profile image URL
      await updateDoc(doc(db, 'users', user.uid), {
        profileImageUrl: downloadURL
      })
      
      // Update state
      setProfileImage(downloadURL)
      Alert.alert('Success', 'Profile picture updated successfully')
    } catch (error) {
      console.error('Error uploading image:', error)
      Alert.alert('Error', 'Failed to update profile picture')
    } finally {
      setUploadLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await auth.signOut()
      router.replace('/')
    } catch (error) {
      console.error('Error signing out:', error)
      Alert.alert('Error', 'Failed to sign out')
    }
  }

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.profileImageContainer}>
          {uploadLoading ? (
            <View style={styles.profileImage}>
              <ActivityIndicator size="small" color="#fff" />
            </View>
          ) : (
            <>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.profileImage} />
              ) : (
                <View style={styles.profileImage}>
                  <Text style={styles.profileInitial}>{username.charAt(0).toUpperCase()}</Text>
                </View>
              )}
            </>
          )}
          <TouchableOpacity 
            style={styles.changePhotoButton} 
            onPress={handlePickImage}
            disabled={uploadLoading}
          >
            <Text style={styles.changePhotoText}>Change Photo</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.profileDetails}>
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Username</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={newUsername}
              onChangeText={setNewUsername}
              placeholder="Enter new username"
              autoCapitalize="none"
            />
          ) : (
            <Text style={styles.fieldValue}>{username}</Text>
          )}
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Email</Text>
          <Text style={styles.fieldValue}>{email}</Text>
          <Text style={styles.fieldNote}>Email cannot be changed</Text>
        </View>

        <View style={styles.buttonContainer}>
          {isEditing ? (
            <>
              <TouchableOpacity 
                style={[styles.button, styles.saveButton]} 
                onPress={handleSaveProfile}
              >
                <Text style={styles.buttonText}>Save Changes</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton]} 
                onPress={handleEditToggle}
              >
                <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity 
              style={[styles.button, styles.editButton]} 
              onPress={handleEditToggle}
            >
              <Text style={styles.buttonText}>Edit Profile</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={[styles.button, styles.signOutButton]} 
            onPress={handleSignOut}
          >
            <Text style={styles.buttonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#c3c4b1',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#c3c4b1',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  profileHeader: {
    backgroundColor: '#8d8e7c',
    alignItems: 'center',
    paddingTop: 100,
    paddingBottom: 20,
  },
  profileImageContainer: {
    alignItems: 'center',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#0069d9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileInitial: {
    fontSize: 48,
    color: 'white',
    fontWeight: 'bold',
  },
  changePhotoButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  changePhotoText: {
    color: 'white',
    fontWeight: '600',
  },
  profileDetails: {
    padding: 20,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 14,
    color: '#344b33',
    marginBottom: 5,
  },
  fieldValue: {
    fontSize: 18,
    color: '#344b33',
    fontWeight: '500',
  },
  fieldNote: {
    fontSize: 12,
    color: '#344b33',
    marginTop: 5,
  },
  input: {
    borderWidth: 1,
    color: '#344b33',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: 'white',
  },
  buttonContainer: {
    marginTop: 20,
    backgroundColor: '#c3c4b1',
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'white',
  },
  editButton: {
    backgroundColor: '#344b33',
  },
  saveButton: {
    backgroundColor: '#344b33',
  },
  cancelButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#8d8e7c',
  },
  cancelButtonText: {
    color: '#8d8e7c',
  },
  signOutButton: {
    backgroundColor: '#8d8e7c',
    marginTop: 20,
  },
})

export default ProfileScreen