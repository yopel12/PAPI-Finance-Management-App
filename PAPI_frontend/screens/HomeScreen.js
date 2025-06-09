
import React, { useState, useContext, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Platform,
  RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { ExpenseContext } from '../context/ExpenseContext';
import { useNavigation, CommonActions } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

export default function HomeScreen() {
  const [entry, setEntry] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const { addExpense } = useContext(ExpenseContext);
  const navigation = useNavigation();

  const looksLikeExpense = (text) => {
    const parts = text.split('-');
    if (parts.length !== 2) return false;
    const amount = parseFloat(parts[1].trim());
    return parts[0].trim().length > 0 && !isNaN(amount);
  };

  const handleEntrySubmit = async () => {
    const trimmed = entry.trim();
    if (!trimmed) return;

    if (looksLikeExpense(trimmed)) {
      // ───── Expense flow: send to backend ─────
      const [categoryRaw, amountRaw] = trimmed.split('-');
      const category = categoryRaw.trim();
      const amountValue = parseFloat(amountRaw.trim());

      const API_URL =
        Platform.OS === 'android'
          ? 'http://10.0.2.2:8000/api/expenses'
          : 'http://localhost:8000/api/expenses';

      try {
        const res = await axios.post(
          API_URL,
          {
            type: 'text',
            value: category,
            amount: amountValue,
            date: new Date().toISOString().split('T')[0], // 'YYYY-MM-DD'
          },
          { headers: { 'Content-Type': 'application/json' } }
        );

        if (res.status === 201) {
          addExpense({
            type: 'text',
            value: category,
            amount: amountValue,
            date: new Date().toLocaleDateString(),
          });
          setEntry('');
          setAiResponse(null);
          Alert.alert('Success', 'Expense added!');
        } else {
          Alert.alert('Error', 'Unexpected server response.');
        }
      } catch (err) {
        Alert.alert('Error', 'Could not add expense. Please check your connection and backend.');
        console.log(err);
      }
    } else {
      // ───── AI Chat flow ─────
      setIsLoading(true);
      setAiResponse(null);

      try {
        const API_URL =
          Platform.OS === 'android'
            ? 'http://10.0.2.2:8000/api/ai-chat'
            : 'http://localhost:8000/api/ai-chat';

        const res = await axios.post(
          API_URL,
          { message: trimmed },
          { headers: { 'Content-Type': 'application/json' } }
        );

        if (res.data.status === 'success') {
          setAiResponse(res.data.answer.trim());
        } else {
          setAiResponse('⚠️ Server error. Try again later.');
        }
      } catch (err) {
        console.warn('AI Chat error:', err.message);
        setAiResponse('⚠️ Could not reach AI service.');
      } finally {
        setIsLoading(false);
        setEntry('');
      }
    }
  };

  const handleOpenCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      alert('Camera access is required!');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      quality: 1,
    });
    if (!result.canceled) {
      addExpense({
        type: 'image',
        value: result.assets[0].uri,
        amount: 0,
        date: new Date().toLocaleDateString(),
      });
    }
  };

  // Called when user pulls down to refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);

    setTimeout(() => {
      setAiResponse(null);
      setRefreshing(false);
    }, 1000);
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F7B801' }}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#000"
            title={refreshing ? 'Refreshing...' : 'Pull to refresh'}
            titleColor="#555"
          />
        }
      >
        {/* ───── Logout / Header ───── */}
        <View style={styles.logoutWrapper}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() =>
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: 'Start' }],
                })
              )
            }
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

        {/* ───── Expense Capture Card ───── */}
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

        {/* ───── Conditionally Render Instructions ───── */}
        {!isFocused && (
          <View style={styles.instructionsBox}>
            <Text style={styles.instructionText}>• To add expense: e.g., groceries – 150</Text>
            <Text style={styles.instructionText}>• To ask AI: just type your question</Text>
          </View>
        )}

        {/* ───── Combined TextInput ───── */}
        <TextInput
          style={styles.input}
          placeholder="Type here..."
          placeholderTextColor="#555"
          value={entry}
          onChangeText={setEntry}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onSubmitEditing={handleEntrySubmit}
          returnKeyType="send"
          blurOnSubmit={false}
        />

        <TouchableOpacity style={styles.addButton} onPress={handleEntrySubmit}>
          <Text style={styles.addButtonText}>
            {looksLikeExpense(entry) ? 'Add Expense' : 'Ask AI'}
          </Text>
        </TouchableOpacity>

        {/* ───── AI Response Box ───── */}
        {isLoading && (
          <View style={styles.aiResponseContainer}>
            <ActivityIndicator size="small" color="#555" />
            <Text style={styles.aiStatusText}>Thinking...</Text>
          </View>
        )}
        {aiResponse !== null && !isLoading && (
          <View style={styles.aiResponseContainer}>
            <Text style={styles.aiText}>{aiResponse}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 20,
    backgroundColor: '#F7B801',
    flexGrow: 1,
    paddingTop: 10,
    justifyContent: 'flex-start',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 50,
    height: 50,
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
    marginBottom: 20,
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
  instructionsBox: {
    backgroundColor: '#f7f7f7',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  instructionText: {
    fontSize: 13,
    color: '#666',
    marginBottom: 2,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    marginBottom: 10,
    color: '#000',
  },
  addButton: {
    backgroundColor: '#000',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  aiResponseContainer: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 20,
  },
  aiText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  aiStatusText: {
    marginTop: 4,
    fontSize: 14,
    color: '#555',
  },
  logoutButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  logoutWrapper: {
    alignItems: 'flex-end',
    marginBottom: 40,
  },
  logoutText: {
    backgroundColor: 'white',
    color: 'black',
    fontWeight: 'bold',
  },
  circle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    justifyContent: 'center',
    elevation: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
});
