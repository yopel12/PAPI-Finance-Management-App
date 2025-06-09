import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

function StartScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />
      <Text style={styles.title}>Papi</Text>
      <Text style={styles.subtitle}>Start Managing your Finances</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

export default StartScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  logo: {
    width: 300,
    height: 300,
    marginBottom: 30,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 35,
    fontWeight: 'bold',
    color: '#F7B801',
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 14,
    color: '#F7B801',
    marginBottom: 50,
  },
  button: {
    backgroundColor: '#F7B801',
    paddingVertical: 12,
    paddingHorizontal: 60,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
