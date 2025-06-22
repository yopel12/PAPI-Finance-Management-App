// src/screens/LoginScreen.js

import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  GoogleSignin,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';
import { useNavigation } from '@react-navigation/native';

import { auth, db } from '../../firebase';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

// ─── Google-Signin SDK config ───────────────────────────────────────────────
GoogleSignin.configure({
  webClientId:   process.env.EXPO_PUBLIC_WEB_ID,
  iosClientId:   process.env.EXPO_PUBLIC_IOS_ID,
  scopes:        ['profile', 'email'],
  offlineAccess: true,
});

// ─── Helpers ────────────────────────────────────────────────────────────────
const GoogleLogin = async () => {
  await GoogleSignin.hasPlayServices();
  const result = await GoogleSignin.signIn();
  return result.data || {};
};

const googleSignIn = async () => {
  try {
    const { idToken, user } = await GoogleLogin();
    if (!idToken) return false;
    const credential = GoogleAuthProvider.credential(idToken);
    const fbUserCred = await signInWithCredential(auth, credential);
    const { uid, displayName, email: eml, photoURL } = fbUserCred.user;
    const profileRef = doc(db, 'users', uid);
    if (!(await getDoc(profileRef)).exists()) {
      await setDoc(profileRef, {
        name:      displayName ?? '',
        email:     eml         ?? '',
        photoURL:  photoURL    ?? '',
        createdAt: Date.now(),
      });
    }
    return true;
  } catch (error) {
    console.log('googleSignIn error:', error);
    return false;
  }
};

// ─── UI Component ───────────────────────────────────────────────────────────
export default function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');

  const handleGoogleSignIn = async () => {
    const ok = await googleSignIn();
    if (ok) navigation.replace('Register');
  };

  const handleEmailLogin = () => {
    // Validate inputs
    if (!email.trim() || !password) {
      return Alert.alert(
        'Missing Information',
        'Please enter both email and password.'
      );
    }
    // TODO: implement your email/password login logic here
    console.log('Email login with:', email);
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.logoCircle}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.title}>Login to your Account</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#666"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#666"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.loginButton} onPress={handleEmailLogin}>
          <Text style={styles.loginButtonText}>Log in</Text>
        </TouchableOpacity>

        <View style={styles.orRow}>
          <View style={styles.line} />
          <Text style={styles.orText}>Sign in with Google</Text>
          <View style={styles.line} />
        </View>

        <GoogleSigninButton
          style={styles.googleButton}
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Dark}
          onPress={handleGoogleSignIn}
        />

        <View style={styles.signUpRow}>
          <Text style={styles.signUpText}>Don't have an account yet?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.signUpLink}> Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFC731',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 24,
    alignItems: 'center',
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 3,
  },
  logo: {
    width: 90,
    height: 90,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Montserrat-Bold',
    color: '#000',
    marginBottom: 16,
  },
  input: {
    width: '100%',
    height: 48,
    borderColor: '#DDD',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    backgroundColor: '#F9F9F9',
    color: '#000',
  },
  loginButton: {
    width: '100%',
    backgroundColor: '#000',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  orRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 16,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#DDD',
  },
  orText: {
    marginHorizontal: 8,
    color: '#666',
    fontSize: 14,
  },
  googleButton: {
    width: '100%',
    height: 48,
    borderRadius: 8,
  },
  signUpRow: {
    flexDirection: 'row',
    marginTop: 24,
  },
  signUpText: {
    color: '#000',
    fontSize: 14,
  },
  signUpLink: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});
