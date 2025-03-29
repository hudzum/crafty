import { View, Text, SafeAreaView, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native'
import React, { useState } from 'react'
import { auth } from '../FirebaseConfig'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { router } from 'expo-router'
import { doc, setDoc } from 'firebase/firestore'
import {db} from '../FirebaseConfig'
const SignInScreen = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  
  // Initialize Firestore

  // Function to generate username from email
  const generateUsername = (email: string) => {
    return email.split('@')[0]
  }

  // Function to create user document in Firestore
  const createUserDocument = async (userId: string, email: string ) => {
    try {
      const username = generateUsername(email)
      await setDoc(doc(db, "users", userId), {
        email: email,
        username: username,
        createdAt: new Date()
      })
      console.log("User document created successfully")
    } catch (error) {
      console.error("Error creating user document:", error)
      Alert.alert("Warning", "Account created but profile setup failed. Some features may be limited.")
    }
  }

  const handleAuthentication = async () => {
    // Validate inputs
    if (!email || !password) {
      setError('Please enter both email and password')
      return
    }

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address')
      return
    }

    // Password strength check
    if (password.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }

    setLoading(true)
    setError('')

    try {
      let userCredential;
      if (isSignUp) {
        userCredential = await createUserWithEmailAndPassword(auth, email, password)
        // Create user document in Firestore when a new user signs up
        await createUserDocument(userCredential.user.uid, email)
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password)
      }

      if (userCredential) {
        router.replace("/(tabs)")
      }
    } catch (error: any) {
      // Specific error handling
      let errorMessage = 'Authentication failed'
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'Email is already registered'
          break
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address'
          break
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password'
          break
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email'
          break
      }

      setError(errorMessage)
      Alert.alert('Authentication Error', errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.innerContainer}>
        <Text style={styles.title}>{isSignUp ? 'Let’s Get Crafty!' : 'Back To Craftin’!'}</Text>
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#888"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
            placeholderTextColor="#888"
          />
          
          {error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : null}
        </View>

        <TouchableOpacity 
          style={styles.authButton}
          onPress={handleAuthentication}
          disabled={loading}
        >
          <Text style={styles.authButtonText}>
            {loading ? (isSignUp ? 'Signing Up...' : 'Logging In...') : (isSignUp ? 'Sign Up' : 'Log In')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.switchButton}
          onPress={() => setIsSignUp(!isSignUp)}
        >
          <Text style={styles.switchButtonText}>
            {isSignUp 
              ? 'Already have an account? Log In' 
              : 'Don\'t have an account? Sign Up'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#c3c4b1',
  },
  innerContainer: {
    paddingHorizontal: 20,
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#344b33',
    fontFamily: 'Ojuju-Regular',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 10,
    fontSize: 16,
    color: '#344b33',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  authButton: {
    backgroundColor: '#344b33',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  authButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  switchButton: {
    alignItems: 'center',
  },
  switchButtonText: {
    color: '#344b33',
    fontWeight: '600',
  },
})

export default SignInScreen