import { ScrollView, StyleSheet, Image } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ObjectDetectionScreen } from '@/components/Scan/ObjectDetection/ObjectDetectionScreen';
import { useState } from 'react';

export default function TabTwoScreen() {
  const [imageUri, setImageUri] = useState('');
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
      <Text style={styles.title}>Welcome to</Text>
      <Image source={require('@/assets/images/CraftyLogo.png')} style={styles.logo} resizeMode="contain" />
      <Text style={styles.content}>One man’s trash is another man’s treasure—but with Crafty, every man’s trash can become treasure!</Text>
      <Text style={styles.content}>Our app helps you turn everyday packaging like plastic bottles and cardboard boxes into creative, useful DIY projects!</Text>
      <Text style={styles.content}>Just scan the item, and Crafty suggests fun, sustainable ways to repurpose it—cutting down waste while sparking your creativity. Reuse more. Waste less. Get crafty!</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 20, 
    backgroundColor: '#c3c4b1',
  },
  scroll: {
    padding: 20,
    alignItems: 'center', 
  },
  title: {
    fontSize: 50,
    fontWeight: 'bold',
    paddingTop: -400,
    fontFamily: 'Ojuju-Regular',
    color: '#344b33',
  },
  appname: {
    fontSize: 50,
    color: '#344b33',
    fontWeight: 'bold',
    paddingTop: -400,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  content:{
    fontSize: 25,
    paddingTop: 20,
    textAlign: 'left', 
    color: '#344b33',
  },
  logo: {
    width: 300,
    height: 300,
    marginTop: 10,
    marginBottom: 20,
  },
});
