import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, TouchableOpacity } from 'react-native';

export default function SignupScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmpassword, setconfirmPassword] = useState('');

  const handleSignup = () => {
    navigation.navigate('Login'); 
  };

  const handleGoogleLogin = () => {
    // Handle Google login logic here
    console.log('Google Login clicked');
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />
      <Text style={styles.title}>Create your Account</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
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

      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        secureTextEntry
        value={confirmpassword}
        onChangeText={setconfirmPassword}
      />

      <TouchableOpacity style={styles.signInButton} onPress={handleSignup}>
        <Text style={styles.signInButtonText}>Sign up</Text>
      </TouchableOpacity>

      <Text style={styles.orSignInWith}>- Or sign up with -</Text>

      <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
        <Image source={require('../assets/google.png')} style={styles.socialIcon} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  logo: {
    width: 170,
    height: 170,
    marginBottom: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#000000',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  signInButton: {
    backgroundColor: '#FFC107',
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 20,
  },
  signInButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  orSignInWith: {
    marginBottom: 20,
    color: '#000000',
  },
  googleButton: {
    backgroundColor: '#FFF',
    elevation: 10,
    width: 100,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 20,
  },
  socialIcon: {
    width: 24,
    height: 24,
  },
  signUpText: {
    color: '#000000',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});
