// navigation/MainTabs.js

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen    from '../screens/HomeScreen';
import HistoryScreen from '../screens/HistoryScreen';
import BudgetScreen  from '../screens/BudgetScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#F7B801',
        tabBarInactiveTintColor: 'gray',
        tabBarIcon: ({ color, size }) => {
          switch (route.name) {
            case 'Home':
              return <Ionicons name="home" size={size} color={color} />;
            case 'History':
              return <MaterialIcons name="history" size={size} color={color} />;
            case 'Budget':
              return <Ionicons name="wallet-outline" size={size} color={color} />;
            case 'Profile':
              return <FontAwesome name="user" size={size} color={color} />;
            default:
              return null;
          }
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Home' }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{ title: 'History' }}
      />
      <Tab.Screen
        name="Budget"
        component={BudgetScreen}
        options={{ title: 'Budget' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
}
