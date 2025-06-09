// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import StartScreen from './screens/StartScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import ChatScreen from './screens/ChatScreen';
import MainTabs from './navigation/MainTabs';

import { ExpenseProvider } from './context/ExpenseContext';
import { UserProvider } from './context/UserContext';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <UserProvider>
      <ExpenseProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Start"
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen
              name="Start"
              component={StartScreen}
              options={{
                title: '',
                headerShown: true,
                headerStyle: { backgroundColor: '#FFC107' },
                headerTitleAlign: 'center',
                headerTintColor: '#000',
              }}
            />

            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{
                title: '',
                headerShown: true,
                headerStyle: { backgroundColor: '#FFC107' },
                headerTitleAlign: 'center',
                headerTintColor: '#000',
              }}
            />

            <Stack.Screen
              name="Signup"
              component={SignupScreen}
              options={{
                title: '',
                headerShown: true,
                headerStyle: { backgroundColor: '#FFC107' },
                headerTitleAlign: 'center',
                headerTintColor: '#000',
              }}
            />

            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{
                title: 'Register',
                headerShown: true,
                headerStyle: { backgroundColor: '#FFC107' },
                headerTitleAlign: 'center',
                headerTintColor: '#000',
              }}
            />

            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{
                title: 'Dashboard',
                headerShown: true,
                headerStyle: { backgroundColor: '#FFC107' },
                headerTitleAlign: 'center',
                headerTintColor: '#000',
              }}
            />

            <Stack.Screen
              name="Chat"
              component={ChatScreen}
              options={{
                title: 'AI Assistant',
                headerShown: true,
                headerStyle: { backgroundColor: '#FFC107' },
                headerTitleAlign: 'center',
                headerTintColor: '#000',
              }}
            />

            <Stack.Screen
              name="MainTabs"
              component={MainTabs}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </ExpenseProvider>
    </UserProvider>
  );
}
