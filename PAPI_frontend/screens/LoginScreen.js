// screens/LoginScreen.js

import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';

export default function LoginScreen({ navigation }) {
  const { login } = useContext(AuthContext);
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);

  const handleLogin = async () => {
  if (!email.trim() || !password) {
    Alert.alert('Error', 'Please enter both email and password.');
    return;
  }

  setLoading(true);
  try {
    console.log('🔑 Attempting login for', email.trim());
    await login(email.trim(), password);

    console.log('✅ Login successful, navigating to AppTabs');
    navigation.replace('AppTabs');
  } catch (err) {
    console.log('❌ Login error', err);
    Alert.alert('Login Failed', err.message);
  } finally {
    setLoading(false);
  }
};


  const handleGoogleLogin = () => {
    console.log('Google Login clicked');
    // TODO: wire up Google sign-in here
  };

  return (
    <View style={styles.container}>
      {/* Logo above the “Papi” title */}
      <View style={styles.logoRow}>
        <Image
          source={require('../assets/logo.png')}
          style={styles.logo}
        />
        <Text style={styles.appName}>Papi</Text>
      </View>

      <Text style={styles.title}>Login to your Account</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={[styles.signInButton, loading && styles.signInButtonDisabled]}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.signInButtonText}>Sign in</Text>
        }
      </TouchableOpacity>

      <Text style={styles.orSignInWith}>- Or sign in with -</Text>
      <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
        <Image
          source={require('../assets/google.png')}
          style={styles.socialIcon}
        />
      </TouchableOpacity>

      <View style={styles.tip}>
        <Text style={styles.signUpText}>Don't have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.signupcolor}> Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:             1,
    justifyContent:  'center',
    alignItems:      'center',
    backgroundColor: '#FFFFFF',
    padding:         20,
  },
  logoRow: {
    flexDirection:  'column',    // stack vertically
    alignItems:     'center',
    marginBottom:   15,
  },
  logo: {
    width:        100,
    height:       100,
    resizeMode:  'contain',
  },
  appName: {
    fontSize:    28,
    fontWeight: 'bold',
    color:      '#000',
    marginTop:   8,
  },
  title: {
    fontSize:     24,
    fontWeight:   'bold',
    color:        '#000',
    marginBottom: 20,
  },
  input: {
    width:            '100%',
    height:           50,
    borderColor:     '#000',
    borderWidth:      1,
    borderRadius:     8,
    paddingHorizontal:10,
    marginBottom:     15,
  },
  signInButton: {
    backgroundColor: '#FFC107',
    width:           '100%',
    height:          50,
    justifyContent: 'center',
    alignItems:     'center',
    borderRadius:    8,
    marginBottom:   20,
  },
  signInButtonDisabled: {
    opacity: 0.6,
  },
  signInButtonText: {
    color:      '#fff',
    fontWeight: 'bold',
    fontSize:    16,
  },
  orSignInWith: {
    marginBottom: 20,
    color:        '#000',
  },
  googleButton: {
    backgroundColor: '#fff',
    elevation:        10,
    width:            100,
    height:           40,
    justifyContent:  'center',
    alignItems:      'center',
    borderRadius:     8,
    marginBottom:    20,
  },
  socialIcon: {
    width:  24,
    height: 24,
  },
  tip: {
    flexDirection: 'row',
  },
  signUpText: {
    color:    '#000',
    fontSize: 14,
  },
  signupcolor: {
    color:           '#FFC107',
    paddingHorizontal: 5,
  },
});
