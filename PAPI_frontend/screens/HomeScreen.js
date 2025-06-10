// screens/HomeScreen.js

import React, { useState, useContext, useRef } from 'react';
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
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

import { ExpenseContext } from '../context/ExpenseContext';
import { AuthContext }    from '../context/AuthContext';
import { useNavigation }  from '@react-navigation/native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const INFO_PANEL_WIDTH      = 300;
const INFO_PANEL_MAX_HEIGHT = 350;

export default function HomeScreen({ route }) {
  const [messages, setMessages]     = useState([
    { id: 'welcome', sender: 'bot', text: 'Welcome! How can I help you today?' }
  ]);
  const [entry, setEntry]           = useState('');
  const [isLoading, setIsLoading]   = useState(false);
  const [infoVisible, setInfoVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(INFO_PANEL_WIDTH)).current;

  const { addExpense } = useContext(ExpenseContext);
  const { logout }     = useContext(AuthContext);
  const userName       = route.params?.name?.trim() || 'Guest';

  const looksLikeExpense = (text) => {
    const parts = text.split('-');
    if (parts.length !== 2) return false;
    const amount = parseFloat(parts[1].trim());
    return parts[0].trim().length > 0 && !isNaN(amount);
  };

  const sendMessage = async () => {
    const trimmed = entry.trim();
    if (!trimmed) return;

    const timestamp = Date.now();
    const userMsg = {
      id: timestamp.toString(),
      sender: 'user',
      text: trimmed,
    };

    setEntry('');

    // Expense case
    if (looksLikeExpense(trimmed)) {
      const [catRaw, amtRaw] = trimmed.split('-');
      addExpense({
        type: 'text',
        value: catRaw.trim().toLowerCase(),
        amount: parseFloat(amtRaw.trim()),
        date: new Date().toLocaleDateString(),
      });

      const ackMsg = {
        id: (timestamp + 1).toString(),
        sender: 'bot',
        text: '✅ Expense added.',
      };

      setMessages(prev => [...prev, userMsg, ackMsg]);
      return;
    }

    // AI chat case
    setIsLoading(true);
    try {
      const API_URL = Platform.OS === 'android'
        ? 'http://10.0.2.2:8000/api/ai-chat'
        : 'http://localhost:8000/api/ai-chat';

      const res = await axios.post(
        API_URL,
        { message: trimmed },
        { headers: { 'Content-Type': 'application/json' } }
      );

      const botText = res.data.status === 'success'
        ? res.data.answer.trim()
        : '⚠️ Server error. Try again later.';

      const botMsg = {
        id: (timestamp + 1).toString(),
        sender: 'bot',
        text: botText,
      };

      setMessages(prev => [...prev, userMsg, botMsg]);
    } catch (err) {
      const errMsg = {
        id: (timestamp + 1).toString(),
        sender: 'bot',
        text: '⚠️ Could not reach AI service.',
      };
      setMessages(prev => [...prev, userMsg, errMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const onScreenshot = async () => {
    const { granted } = await ImagePicker.requestCameraPermissionsAsync();
    if (!granted) {
      alert('Camera permission required!');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ quality: 1 });
    if (!result.canceled) {
      addExpense({
        type: 'image',
        value: result.assets[0].uri,
        amount: 0,
        date: new Date().toLocaleDateString(),
      });
      const ackMsg = {
        id: (Date.now()+1).toString(),
        sender: 'bot',
        text: '📸 Screenshot saved as expense.',
      };
      setMessages(prev => [...prev, ackMsg]);
    }
  };

  const onVoice = async () => {
    // replace with your voice-to-text implementation
    const transcript = '…transcribed text…';
    if (transcript) {
      setEntry(prev => prev + transcript);
    }
  };

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

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.bubble,
        item.sender === 'user' ? styles.userBubble : styles.botBubble
      ]}
    >
      <Text style={ item.sender==='user' ? styles.userText : styles.botText }>
        {item.text}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.iconRow}>
        <TouchableOpacity onPress={logout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={openInfo} style={styles.infoButton}>
          <Ionicons name="information-circle-outline" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={messages}
        keyExtractor={i => i.id}
        renderItem={renderItem}
        contentContainerStyle={styles.chat}
      />

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}

      <KeyboardAvoidingView
        behavior={Platform.select({ ios: 'padding', android: undefined })}
        keyboardVerticalOffset={Platform.select({ ios: 80, android: 0 })}
      >
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
            multiline
            value={entry}
            onChangeText={setEntry}
          />
          <TouchableOpacity
            onPress={sendMessage}
            style={styles.sendButton}
            disabled={isLoading || !entry.trim()}
          >
            <MaterialIcons
              name="send"
              size={24}
              color={entry.trim() ? "#fff" : "#AAA"}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {infoVisible && (
        <View style={styles.overlayContainer}>
          <TouchableOpacity style={styles.backdrop} onPress={closeInfo} />
          <Animated.View
            style={[
              styles.infoPanel,
              { transform: [{ translateX: slideAnim }] }
            ]}
          >
            <View style={styles.panelHeader}>
              <Text style={styles.panelHeaderText}>About Papi</Text>
              <TouchableOpacity onPress={closeInfo}>
                <Ionicons name="close-circle" size={24} color="#F7B801" />
              </TouchableOpacity>
            </View>
            <View style={styles.panelContent}>
              <Text style={styles.staticTitle}>What is Papi?</Text>
              <Text style={styles.staticText}>
                Papi helps you track expenses, set budgets, and gain insights into your spending.
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
  );
}

const styles = StyleSheet.create({
  safeArea:      { flex: 1, backgroundColor: '#fff' },
  iconRow:       {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    backgroundColor: '#F7B801',
    height: 56,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  logoutButton:  {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
    height: 36,

  },
  logoutText:    { color: 'black', fontWeight: 'bold' },
  infoButton:    { backgroundColor: '#F7B801', borderRadius: 20, height: 36, width: 36, justifyContent: 'center', alignItems: 'center' },
  chat:          { paddingHorizontal: 12, paddingBottom: 6 },
  bubble:        {
    marginVertical: 4,
    padding:        10,
    borderRadius:   12,
    maxWidth:       '80%'
  },
  userBubble:    { backgroundColor: '#DCF8C6', alignSelf: 'flex-end' },
  botBubble:     { backgroundColor: '#EEE', alignSelf: 'flex-start' },
  userText:      { color: '#000' },
  botText:       { color: '#000' },
  inputRow:      {
    flexDirection: 'row',
    alignItems:    'flex-end',
    padding:       8,
    borderTopWidth: 1,
    borderColor:   '#DDD',
    backgroundColor: '#FFF'
  },
  iconButton:    { padding: 8, marginBottom: 4 },
  input:         {
    flex:            1,
    minHeight:       40,
    maxHeight:       120,
    borderRadius:    20,
    borderWidth:     1,
    borderColor:     '#CCC',
    paddingHorizontal: 12,
    paddingVertical:   8,
    marginHorizontal:  6,
    backgroundColor: '#F9F9F9'
  },
  sendButton:    {
    backgroundColor: '#007AFF',
    borderRadius:    20,
    padding:         10,
    marginBottom:    4
  },
  loadingOverlay:{ 
    ...StyleSheet.absoluteFillObject, 
    backgroundColor:'rgba(0,0,0,0.2)', 
    justifyContent:'center', 
    alignItems:'center' 
  },
  overlayContainer:{
    position: 'absolute',
    top: 0, left: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  backdrop:      { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' },
  infoPanel:     {
    position: 'absolute',
    top: 70, right: 20,
    width: INFO_PANEL_WIDTH,
    maxHeight: INFO_PANEL_MAX_HEIGHT,
    backgroundColor: '#fff',
    borderRadius:    12,
    padding:         16,
    elevation:       8
  },
  panelHeader:   {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems:    'center',
    marginBottom:  12
  },
  panelHeaderText:{ fontSize:18, fontWeight:'600', color:'#F7B801' },
  panelContent:  { paddingBottom: 8 },
  staticTitle:   { fontSize:16, fontWeight:'500', marginBottom:6, color:'#F7B801' },
  staticText:    { fontSize:14, color:'#333', lineHeight:20, marginBottom:8 }
});
