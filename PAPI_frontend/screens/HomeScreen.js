import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { ExpenseContext } from '../context/ExpenseContext';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { CommonActions } from '@react-navigation/native'; // add this import

export default function HomeScreen() {
  const [text, setText] = useState('');
  const { addExpense } = useContext(ExpenseContext);

  const navigation = useNavigation();

  const handleOpenCamera = async () => {
  const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

  if (permissionResult.granted === false) {
    alert('Camera access is required!');
    return;
  }

  const result = await ImagePicker.launchCameraAsync({
    allowsEditing: false,
    quality: 1,
  });

  if (!result.canceled) {
    // Save to expense context or local state
    addExpense({
      type: 'image',
      value: result.assets[0].uri,
      date: new Date().toLocaleDateString(),
        });
      }
    };

  const handleAddExpense = () => {
    if (text.trim()) {
      addExpense({
        type: 'text',
        value: text,
        date: new Date().toLocaleDateString(),
      });
      setText('');
    }
  };

  return (

    <ScrollView contentContainerStyle={styles.scrollContainer} >
      <View style={styles.logoutWrapper}>
      <TouchableOpacity
      style={styles.logoutButton}
      onPress={() => {
      navigation.dispatch(
      CommonActions.reset({
      index: 0,
      routes: [{ name: 'Start' }],
            })
          );
      }}
      >
      <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
      </View>

      <View style={styles.header}>
        <View style={styles.circle}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        </View>
        <Text style={styles.appName}>PinansyalApp</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.captureTitle}>Capture an expense</Text>
        <Text style={styles.captureDesc}>
          Store your daily expenses using text, screenshots, voices and videos.
        </Text>

        <TouchableOpacity style={styles.captureButton} onPress={handleOpenCamera}>
          <MaterialIcons name="screenshot" size={24} color="black" />
          <Text style={styles.captureText}>Screenshot</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.captureButton}>
          <Ionicons name="mic-outline" size={24} color="black" />
          <Text style={styles.captureText}>Voice</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.captureButton}>
          <FontAwesome name="video-camera" size={24} color="black" />
          <Text style={styles.captureText}>Video</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Enter expense"
        placeholderTextColor="#aaa"
        value={text}
        onChangeText={setText}
      />

      <TouchableOpacity style={styles.addButton} onPress={handleAddExpense}>
        <Text style={styles.addButtonText}>Add Expense</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 20,
    backgroundColor: '#F7B801',
    flexGrow: 1,
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 30,
    height: 35,
    marginRight: 10,
    resizeMode: 'contain',
  },
  appName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    padding: 7,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  captureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F7B801',
    marginBottom: 5,
    textAlign: 'center',
  },
  captureDesc: {
    fontSize: 12,
    color: '#444',
    textAlign: 'center',
    marginBottom: 20,
  },
  captureButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eee',
    padding: 12,
    marginBottom: 10,
    borderRadius: 10,
    justifyContent: 'center',
  },
  captureText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#000',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    marginBottom: 40,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  circle:{
    width: 40,
    height: 40,
    borderRadius: 40,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
  },
  logoutbutton: {
  backgroundColor: '#fff',
  paddingHorizontal: 20,   // more space left/right
  paddingVertical: 10,     // more space top/bottom
  borderRadius: 20,        // more rounded edges
  elevation: 4,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 3,
  },
  logoutWrapper: {
  alignItems: 'flex-end',
  marginBottom: 150,
  },
  logoutText: {
  backgroundColor: 'white',
  color: 'black',
  fontWeight: 'bold',
}
});
