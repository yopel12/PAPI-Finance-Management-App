// App.js
import React, { useContext } from 'react';
import { NavigationContainer }      from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons }                 from '@expo/vector-icons';

// Contexts
import { AuthProvider, AuthContext } from './context/AuthContext';
import { ExpenseProvider }           from './context/ExpenseContext';
import { UserProvider }              from './context/UserContext';

// Auth screens
import LoginScreen    from './screens/LoginScreen';
import SignupScreen   from './screens/SignupScreen';
import RegisterScreen from './screens/RegisterScreen';

// Main-app tab screens
import HomeScreen    from './screens/HomeScreen';
import HistoryScreen from './screens/HistoryScreen';
import BudgetScreen  from './screens/BudgetScreen';
import ProfileScreen from './screens/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab   = createBottomTabNavigator();

// Bottom tabs
function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#000',
        tabBarInactiveTintColor: '#888',
        tabBarIcon: ({ color, size }) => {
          const icons = {
            Home:    'home-outline',
            History: 'time-outline',
            Budget:  'wallet-outline',
            Profile: 'person-outline',
          };
          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home"    component={HomeScreen}    />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Budget"  component={BudgetScreen}  />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// Root navigator: if you're NOT signed in, you get Login / Signup / Register;
// once you are signed in, you get just the MainTabs.
function RootNavigator() {
  const { user } = useContext(AuthContext);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        // ↳ Not signed in: show auth flow (including Register)
        <>
          <Stack.Screen name="Login"    component={LoginScreen}  />
          <Stack.Screen name="Signup"   component={SignupScreen} />
          <Stack.Screen name="Register" component={RegisterScreen}/>
        </>
      ) : (
        // ↳ Signed in: drop straight into your tabs
        <Stack.Screen name="MainTabs" component={AppTabs} />
      )}
    </Stack.Navigator>
  );
}

// App entrypoint
export default function App() {
  return (
    <AuthProvider>
      <ExpenseProvider>
        <UserProvider>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </UserProvider>
      </ExpenseProvider>
    </AuthProvider>
  );
}
