// screens/HomeScreen.js

import React, { useState, useContext, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  Dimensions,
  Animated,
  Image,
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

import { ExpenseContext } from '../context/ExpenseContext';
import { AuthContext } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import logo from '../assets/logo.png';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const INFO_PANEL_WIDTH = 300;
const INFO_PANEL_MAX_HEIGHT = 350;

export default function HomeScreen({ route }) {
  /* ─────────────── state ─────────────── */
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'bot',
      text: 'Welcome! How can I help you today?',
      status: 'sent',
    },
  ]);
  const [entry, setEntry] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [infoVisible, setInfoVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(INFO_PANEL_WIDTH)).current;

  const flatListRef = useRef(null);
  const { addExpense } = useContext(ExpenseContext);
  const { logout } = useContext(AuthContext);
  const navigation = useNavigation();
  const userName = route.params?.name?.trim() || 'guest';

  /* ─────────────── effects ─────────────── */
  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  /* ─────────────── helpers ─────────────── */
  const updateMessageStatus = (id, newStatus) =>
    setMessages(prev =>
      prev.map(m => (m.id === id ? { ...m, status: newStatus } : m))
    );

  const looksLikeExpense = text => {
    const parts = text.split('-');
    if (parts.length !== 2) return false;
    const amount = parseFloat(parts[1].trim());
    return parts[0].trim().length > 0 && !isNaN(amount);
  };

  /* ─────────────── sendMessage ─────────────── */
  const sendMessage = async retryMsg => {
    const trimmed = retryMsg ? retryMsg.text : entry.trim();
    if (!trimmed) return;

    const timestamp = Date.now();
    const userMsg = retryMsg ?? {
      id: timestamp.toString(),
      sender: 'user',
      text: trimmed,
      status: 'sending',
    };

    if (!retryMsg) {
      setMessages(prev => [...prev, userMsg]);
      setEntry('');
    } else {
      updateMessageStatus(userMsg.id, 'sending');
    }

    // Manual expense entry
    if (looksLikeExpense(trimmed)) {
      const [catRaw, amtRaw] = trimmed.split('-');
      addExpense({
        type: 'text',
        value: catRaw.trim().toLowerCase(),
        amount: parseFloat(amtRaw.trim()),
        date: new Date().toLocaleDateString(),
      });

      updateMessageStatus(userMsg.id, 'sent');
      setMessages(prev => [
        ...prev,
        {
          id: (timestamp + 1).toString(),
          sender: 'bot',
          text: '✅ Expense added.',
          status: 'sent',
        },
      ]);
      return;
    }

    // Send to n8n webhook
    setIsLoading(true);
    try {
      const API_URL =
        Platform.OS === 'android'
          ? 'http://10.0.2.2:5678/webhook-test/papi-finance'
          
          :  'http://localhost:5678/webhook/papi-finance';

      const res = await axios.post(
        API_URL,
        { message: trimmed, sessionId: userName },
        { headers: { 'Content-Type': 'application/json' } }
      );

      const botText =
        res.data.answer?.trim() ||
        (typeof res.data === 'string' ? res.data : JSON.stringify(res.data));

      updateMessageStatus(userMsg.id, 'sent');
      setMessages(prev => [
        ...prev,
        {
          id: (timestamp + 1).toString(),
          sender: 'bot',
          text: botText,
          status: 'sent',
        },
      ]);
    } catch (err) {
      updateMessageStatus(userMsg.id, 'failed');
      setMessages(prev => [
        ...prev,
        {
          id: (timestamp + 1).toString(),
          sender: 'bot',
          text: '⚠️ Could not reach service.',
          status: 'sent',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  /* ─────────────── screenshot ─────────────── */
  const onScreenshot = async () => {
    const { granted } = await ImagePicker.requestCameraPermissionsAsync();
    if (!granted) {
      alert('Camera permission required!');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      quality: 1,
      base64: true,
    });
    if (result.canceled) return;

    setIsLoading(true);
    try {
      const API_URL =
        Platform.OS === 'android'
          ? 'http://10.0.2.2:5678/webhook-test/papi-finance'
          : 'http://localhost:5678/webhook-test/papi-finance';

      const data = new FormData();
      data.append('type', 'image');
      data.append('date', new Date().toISOString());
      data.append('image', {
        uri: result.assets[0].uri,
        type: 'image/jpeg',
        name: 'receipt.jpg',
      });

      const res = await axios.post(API_URL, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: res.data.answer || '📸 Screenshot sent to backend.',
          status: 'sent',
        },
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 2).toString(),
          sender: 'bot',
          text: '⚠️ Could not send image.',
          status: 'sent',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  /* ─────────────── voice upload ─────────────── */
  const onVoice = async voiceUri => {
    if (!voiceUri) {
      alert('No voice file found!');
      return;
    }
    const formData = new FormData();
    formData.append('sessionId', userName);
    formData.append('type', 'voice');
    formData.append('file', {
      uri: voiceUri,
      name: 'voice.aac',
      type: 'audio/aac',
    });

    setIsLoading(true);
    try {
      const API_URL =
        Platform.OS === 'android'
          ? 'http://10.0.2.2:5678/webhook-test/papi-finance'
          : 'http://localhost:5678/webhook-test/papi-finance';

      const res = await axios.post(API_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: res.data.answer || '🎤 Voice sent.',
          status: 'sent',
        },
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: '❌ Could not send voice.',
          status: 'sent',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  /* ─────────────── info panel ─────────────── */
  const openInfo = () => {
    setInfoVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };
  const closeInfo = () => {
    Animated.timing(slideAnim, {
      toValue: INFO_PANEL_WIDTH,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setInfoVisible(false));
  };

  /* ─────────────── render bubbles ─────────────── */
  const renderItem = ({ item }) => {
    const isUser = item.sender === 'user';
    return (
      <View
        style={[
          styles.bubble,
          isUser ? styles.userBubble : styles.botBubble,
        ]}>
        <Text style={isUser ? styles.userText : styles.botText}>
          {item.text}
        </Text>
        {isUser && item.status === 'failed' && (
          <TouchableOpacity
            style={styles.resendBtn}
            onPress={() => sendMessage(item)}>
            <Ionicons name="refresh" size={16} color="#e74c3c" />
            <Text style={styles.resendTxt}>Resend</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  /* ─────────────── JSX ─────────────── */
  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.select({ ios: 'padding', android: undefined })}>
      <SafeAreaView style={styles.safeArea}>
        <Image source={logo} style={styles.watermark} />

        {/* header */}
        <View style={styles.iconRow}>
          <TouchableOpacity
            onPress={async () => {
              try {
                await logout();
                navigation.replace('Login');
              } catch (err) {
                alert('Logout Failed: ' + err.message);
              }
            }}
            style={styles.logoutButton}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={openInfo} style={styles.infoButton}>
            <Ionicons
              name="information-circle-outline"
              size={28}
              color="#fff"
            />
          </TouchableOpacity>
        </View>

        {/* chat list */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={i => i.id}
          renderItem={renderItem}
          contentContainerStyle={styles.chat}
        />

        {/* loading overlay */}
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#fff" />
          </View>
        )}

        {/* input row */}
        <View style={styles.inputRow}>
          <TouchableOpacity onPress={onScreenshot} style={styles.iconButton}>
            <FontAwesome name="camera" size={24} color="#444" />
          </TouchableOpacity>
          <TouchableOpacity onPress={onVoice} style={styles.iconButton}>
            <MaterialIcons name="keyboard-voice" size={24} color="#444" />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={entry}
            onChangeText={setEntry}
            onSubmitEditing={() => sendMessage()}
          />
          <TouchableOpacity
            onPress={() => sendMessage()}
            style={styles.sendButton}
            disabled={isLoading || !entry.trim()}>
            <MaterialIcons
              name="send"
              size={24}
              color={entry.trim() ? '#fff' : '#AAA'}
            />
          </TouchableOpacity>
        </View>

        {/* info panel */}
        {infoVisible && (
          <View style={styles.overlayContainer}>
            <TouchableOpacity style={styles.backdrop} onPress={closeInfo} />
            <Animated.View
              style={[
                styles.infoPanel,
                { transform: [{ translateX: slideAnim }] },
              ]}>
              <View style={styles.panelHeader}>
                <Text style={styles.panelHeaderText}>About Papi</Text>
                <TouchableOpacity onPress={closeInfo}>
                  <Ionicons name="close-circle" size={24} color="#F7B801" />
                </TouchableOpacity>
              </View>
              <View style={styles.panelContent}>
                <Text style={styles.staticTitle}>What is Papi?</Text>
                <Text style={styles.staticText}>
                  Papi helps you track expenses, set budgets, and gain insights
                  into your spending.
                </Text>
                <Text style={styles.staticText}>
                  • Add expenses by typing “category – amount”
                  {'\n'}• Ask the AI anything about your finances
                  {'\n'}• Use the chart icon to view budgets
                  {'\n'}• Need help? Contact support in Settings.
                </Text>
              </View>
            </Animated.View>
          </View>
        )}
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: '#fff' },
  watermark: {
    position: 'absolute',
    top: '30%',
    alignSelf: 'center',
    width: 250,
    height: 250,
    opacity: 0.3,
    resizeMode: 'contain',
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    backgroundColor: '#F7B801',
    height: 56,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
    height: 36,
  },
  logoutText: { color: 'black', fontWeight: 'bold' },
  infoButton: {
    backgroundColor: '#F7B801',
    borderRadius: 20,
    height: 36,
    width: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chat: {
    paddingHorizontal: 12,
    paddingBottom: 8,
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  bubble: { marginVertical: 4, padding: 10, borderRadius: 12, maxWidth: '80%' },
  userBubble: { backgroundColor: '#DCF8C6', alignSelf: 'flex-end' },
  botBubble: { backgroundColor: '#EEE', alignSelf: 'flex-start' },
  userText: { color: '#000' },
  botText: { color: '#000' },
  resendBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  resendTxt: {
    marginLeft: 4,
    fontSize: 12,
    color: '#e74c3c',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderTopWidth: 1,
    borderColor: '#DDD',
    backgroundColor: '#FFF',
  },
  iconButton: { padding: 8 },
  input: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#CCC',
    paddingHorizontal: 12,
    marginHorizontal: 6,
    backgroundColor: '#F9F9F9',
  },
  sendButton: { backgroundColor: '#007AFF', borderRadius: 20, padding: 10 },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' },
  infoPanel: {
    position: 'absolute',
    top: 70,
    right: 20,
    width: INFO_PANEL_WIDTH,
    maxHeight: INFO_PANEL_MAX_HEIGHT,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 8,
  },
  panelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  panelHeaderText: { fontSize: 18, fontWeight: '600', color: '#F7B801' },
  panelContent: { paddingBottom: 8 },
  staticTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 6,
    color: '#F7B801',
  },
  staticText: { fontSize: 14, color: '#333', lineHeight: 20, marginBottom: 8 },
});
