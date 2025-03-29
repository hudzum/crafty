import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        // Remove headers from all screens by setting headerShown to false
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              name="user"
              color={focused ? '#344b33' : '#8d8e7c'} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: 'Community',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              name="users"
              color={focused ? '#344b33' : '#8d8e7c'} 
            />
          ),
        }}
      />
     
      
      <Tabs.Screen
        name="four"
        options={{
          title: 'Search',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              name="search"
              color={focused ? '#344b33' : '#8d8e7c'} 
            />
          ),
        }}
      />
    </Tabs>
  );
}