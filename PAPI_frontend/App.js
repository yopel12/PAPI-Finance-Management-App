import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StartScreen from './screens/StartScreen';
import RegisterScreen from './screens/RegisterScreen';
import MainTabs from './navigation/MainTabs';
import { ExpenseProvider } from './context/ExpenseContext';
import { UserProvider } from './context/UserContext'; 

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <UserProvider> 
      <ExpenseProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Start" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Start" component={StartScreen}  options={{
                title: '',
                headerShown: true,
                headerStyle: {
                  backgroundColor: '#FFC107',
                },
                headerTitleAlign: 'center',
                headerTintColor: '#000', 
              }}/>
            <Stack.Screen name="Register" component={RegisterScreen}  options={{
                title: 'Register',
                headerShown: true,
                headerStyle: {
                  backgroundColor: '#FFC107',
                },
                headerTitleAlign: 'center',
                headerTintColor: '#000',
              }}/>
            <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }}
/>
          </Stack.Navigator>
        </NavigationContainer>
      </ExpenseProvider>
    </UserProvider>
  );
}
