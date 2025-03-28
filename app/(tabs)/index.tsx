import React from 'react';
import { StyleSheet, TouchableOpacity, Image } from 'react-native';
import { getAuth, signOut } from 'firebase/auth';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View } from '@/components/Themed';
import { router } from 'expo-router';

export default function TabTwoScreen() {
  const auth = getAuth();
  const user = auth.currentUser;

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      // Navigation would typically be handled here, 
      // e.g., navigating back to login screen
      router.push('/');
    } catch (error) {
      console.error('Sign out error', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileHeader}>
     
        <Text style={styles.title}>{user?.displayName || 'User'}</Text>
        <Text style={styles.email}>{"Hey " +user?.email+" 👋" }</Text>
      </View>

      <View style={styles.infoSection}>
        <TouchableOpacity style={styles.infoItem}>
          <Text style={styles.infoItemText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.infoItem}>
          <Text style={styles.infoItemText}>Account Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.signOutButton} 
          onPress={handleSignOut}
        >
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  profileHeader: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: '#666',
  },
  infoSection: {
    width: '85%',
    marginTop: 20,
  },
  infoItem: {
    backgroundColor: 'white',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  infoItemText: {
    fontSize: 16,
  },
  signOutButton: {
    backgroundColor: '#ff4444',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  signOutText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});