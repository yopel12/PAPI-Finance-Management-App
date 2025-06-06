// screens/HomeScreen.js
import React, { useState, useContext, useCallback, useRef } from 'react';
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
  Dimensions,
  Animated,
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { ExpenseContext } from '../context/ExpenseContext';
import { useNavigation, CommonActions } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
// Increase panel size so all info is visible; for example, 300px wide and up to 350px tall
const INFO_PANEL_WIDTH = 300;
const INFO_PANEL_MAX_HEIGHT = 350;

export default function HomeScreen({ route }) {
  const [entry, setEntry] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Track whether the info panel is mounted (visible or animating)
  const [infoVisible, setInfoVisible] = useState(false);
  // Animated value for slide-in/out from the RIGHT
  const slideAnim = useRef(new Animated.Value(INFO_PANEL_WIDTH)).current;

  const { addExpense } = useContext(ExpenseContext);
  const navigation = useNavigation();

  // Grab the name passed from RegisterScreen; fallback to 'Guest' if missing
  const userName = route.params?.name?.trim() || 'Guest';

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
      // ───── Expense flow ─────
      const [categoryRaw, amountRaw] = trimmed.split('-');
      const category = categoryRaw.trim().toLowerCase();
      const amountValue = parseFloat(amountRaw.trim());

      addExpense({
        type: 'text',
        value: category,
        amount: amountValue,
        date: new Date().toLocaleDateString(),
      });
      setEntry('');
      setAiResponse(null);
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

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setAiResponse(null);
      // If you need to re-fetch expenses, call your reload logic here.
      setRefreshing(false);
    }, 1000);
  }, []);

  // Animate the info panel in from the RIGHT
  const openInfo = () => {
    setInfoVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,             // move from +INFO_PANEL_WIDTH → 0
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // Animate it out to the RIGHT and then unmount
  const closeInfo = () => {
    Animated.timing(slideAnim, {
      toValue: INFO_PANEL_WIDTH, // move from 0 → +INFO_PANEL_WIDTH (off-screen)
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setInfoVisible(false);
    });
  };

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
        {/* ───── Logout + Info Icons Side by Side ───── */}
        <View style={styles.iconRow}>
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

          {/* Info button (ℹ️) */}
          <TouchableOpacity style={styles.infoButton} onPress={openInfo}>
            <Ionicons name="information-circle-outline" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* ───── App Logo + Name ───── */}
        <View style={styles.header}>
          <View style={styles.circle}>
            <Image source={require('../assets/logo.png')} style={styles.logo} />
          </View>
          <Text style={styles.appName}>PinansyalApp</Text>
        </View>

        {/* ───── Welcome Message (Now dynamic!) ───── */}
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>Welcome, {userName}!</Text>
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

        {/* ───── Instructions (if TextInput not focused) ───── */}
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

      {/* ───── Animated Info Panel Overlay ───── */}
      {infoVisible && (
        <View style={styles.overlayContainer}>
          {/* Backdrop: tapping here closes the panel */}
          <TouchableOpacity
            style={styles.backdrop}
            onPress={closeInfo}
            activeOpacity={1}
          />

          {/* Info Panel (Animated) */}
          <Animated.View
            style={[
              styles.infoPanel,
              { transform: [{ translateX: slideAnim }] },
            ]}
          >
            <View style={styles.panelHeader}>
              <Text style={styles.panelHeaderText}>About PinansyalApp</Text>
              <TouchableOpacity
                onPress={closeInfo}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="close-circle" size={24} color="#F7B801" />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.panelContent}>
              <Text style={styles.staticTitle}>What is PinansyalApp?</Text>
              <Text style={styles.staticText}>
                PinansyalApp helps you track expenses, set budgets, and gain insights into your spending.
              </Text>
              <Text style={styles.staticText}>
                • To add an expense: e.g., groceries – 150{'\n'}
                • To ask AI: just type your question in the input box{'\n'}
                • Use the “Budget” tab to see your budget summary{'\n'}
                • Need help? Go to Settings → Support.
              </Text>
            </ScrollView>
          </Animated.View>
        </View>
      )}
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

  // ──────────────────────────────
  // LOGOUT + INFO ICONS ROW
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end', // align both icons to the right
    alignItems: 'center',
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  logoutText: {
    color: 'black',
    fontWeight: 'bold',
  },
  infoButton: {
    marginLeft: 12, // space between logout and info
    padding: 6,
    backgroundColor: '#F7B801',
    borderRadius: 20,
  },

  // ──────────────────────────────
  // HEADER (Logo + App Name)
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  circle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
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

  // ──────────────────────────────
  // WELCOME MESSAGE
  welcomeContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#fff',
  },

  // ──────────────────────────────
  // EXPENSE CAPTURE CARD
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

  // ──────────────────────────────
  // INSTRUCTIONS BOX
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

  // ──────────────────────────────
  // TEXT INPUT + ADD BUTTON
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

  // ──────────────────────────────
  // AI RESPONSE BOX
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

  // ──────────────────────────────
  // OVERLAY & INFO PANEL STYLES
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    zIndex: 100,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  infoPanel: {
    position: 'absolute',
    top: 70,                          // sits below header row
    right: 20,                        // offset from right edge
    width: INFO_PANEL_WIDTH,          // 300px wide
    maxHeight: INFO_PANEL_MAX_HEIGHT, // up to 350px tall
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  panelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  panelHeaderText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F7B801',
  },
  panelContent: {
    paddingBottom: 12,
  },
  staticTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 6,
    color: '#F7B801',
  },
  staticText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 8,
  },
});
