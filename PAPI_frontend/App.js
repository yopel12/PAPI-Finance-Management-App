// ─── App.js  (project root) ────────────────────────────────────────────────

import React, { useEffect, useState } from 'react';
import { NavigationContainer }        from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator }   from '@react-navigation/bottom-tabs';
import Ionicons                       from 'react-native-vector-icons/Ionicons';
import { GoogleSignin }               from '@react-native-google-signin/google-signin';


// Context providers
import { AuthProvider }    from './context/AuthContext';
import { ExpenseProvider } from './context/ExpenseContext';
import { UserProvider }    from './context/UserContext';

// Auth screens
import StartScreen    from './src/screens/StartScreen';
import LoginScreen    from './src/screens/LoginScreen';
import SignupScreen   from './src/screens/SignupScreen';
import RegisterScreen from './src/screens/RegisterScreen';

// App screens (tabs)
import HomeScreen     from './src/screens/HomeScreen';
import BudgetScreen   from './src/screens/BudgetScreen';
import SettingsScreen from './src/screens/SettingsScreen';

const RootStack = createNativeStackNavigator();
const Tab      = createBottomTabNavigator();

// ─── 1. Auth flow: Start → Login → Signup → Register ─────────────────────
function AuthStack() {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      <RootStack.Screen name="Start"    component={StartScreen}    />
      <RootStack.Screen name="Login"    component={LoginScreen}    />
      <RootStack.Screen name="Signup"   component={SignupScreen}   />
      <RootStack.Screen name="Register" component={RegisterScreen} />
    </RootStack.Navigator>
  );
}

// ─── 2. MainTabs flow: Home / Budget / Settings ───────────────────────────
function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#000',
        tabBarInactiveTintColor: '#888',
        tabBarIcon: ({ focused, size }) => {
          const icons = {
            Home:     focused ? 'home'          : 'home-outline',
            Budget:   focused ? 'pie-chart'     : 'pie-chart-outline',
            Settings: focused ? 'settings'      : 'settings-outline',
          };
          return <Ionicons name={icons[route.name]} size={size} />;
        },
      })}
    >
      <Tab.Screen name="Home"     component={HomeScreen}   />
      <Tab.Screen name="Budget"   component={BudgetScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen}/>
    </Tab.Navigator>
  );
}

// ─── DEV TOGGLE ─────────────────────────────────────────────────────────────
const DEV_FORCE_START = true; // set to false (or __DEV__) in production

// ─── App root ───────────────────────────────────────────────────────────────
export default function App() {


  const [isSignedIn, setIsSignedIn] = useState(false);
  const [checking,    setChecking]  = useState(true);

  // Silent check for cached Google user on mount
  useEffect(() => {
    (async () => {
      try {
        const current = await GoogleSignin.getCurrentUser();
        setIsSignedIn(!!current);
      } finally {
        setChecking(false);
      }
    })();
  }, []);

  if (checking) return null; // or a splash screen

  // Decide which flow to show first
  const initialRoute = isSignedIn && !DEV_FORCE_START
    ? 'AppTabs'   // user is already signed in → go straight to tabs
    : 'AuthStack';// otherwise show auth flow

  return (
    <AuthProvider>
      <ExpenseProvider>
        <UserProvider>
          <NavigationContainer>
            <RootStack.Navigator
              screenOptions={{ headerShown: false }}
              initialRouteName={initialRoute}
            >
              <RootStack.Screen name="AuthStack" component={AuthStack} />
              <RootStack.Screen name="AppTabs"   component={AppTabs}   />
            </RootStack.Navigator>
          </NavigationContainer>
        </UserProvider>
      </ExpenseProvider>
    </AuthProvider>
  );
}
