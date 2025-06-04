import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import HistoryScreen from '../screens/HistoryScreen';
import BudgetScreen from '../screens/BudgetScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'Home') {
            return <Ionicons name="home" size={size} color={color} />;
          } else if (route.name === 'History') {
            return <MaterialIcons name="history" size={size} color={color} />;
          } else if (route.name === 'Budget') {
            return <Ionicons name="wallet-outline" size={size} color={color} />;
          } else if (route.name === 'Profile') {
            return <FontAwesome name="user" size={size} color={color} />;
          }
        },
        tabBarActiveTintColor: '#F7B801',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: ' HomeTab' }} />
      <Tab.Screen name="History" component={HistoryScreen} options={{ title: ' HistoryTab' }} />
      <Tab.Screen name="Budget" component={BudgetScreen} options={{ title: ' Budget' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: ' Profile' }} />
    </Tab.Navigator>
  );
}
