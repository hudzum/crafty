import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';

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
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
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
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="info-circle"
                    size={25}
                    color={Colors[colorScheme ?? 'light'].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
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
        name="three"
        options={{
          title: 'Main',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              name="home"
              color={focused ? '#344b33' : '#8d8e7c'} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="four"
        options={{
          title: 'Scan',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              name="barcode"
              color={focused ? '#344b33' : '#8d8e7c'} 
            />
          ),
        }}
      />
    </Tabs>
  );
}
