// screens/ChatScreen.js
import React, { useState, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';
import axios from 'axios';

export default function ChatScreen() {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([]);
  const listRef = useRef();

  // Whenever messages change, scroll to bottom
  useEffect(() => {
    if (listRef.current && messages.length) {
      listRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const sendMessage = async () => {
    const trimmed = inputText.trim();
    if (!trimmed) return;

    // Append the user’s message locally
    const userMsg = { id: Date.now().toString(), text: trimmed, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');

    try {
      // On an iOS simulator, "http://localhost:8000" works.
      // On a physical device, replace "YOUR_IP_HERE" with your Mac’s LAN IP (e.g. "192.168.1.5").
      const API_URL =
        Platform.OS === 'ios'
          ? 'http://localhost:8000/api/ai-chat'
          : `http://YOUR_IP_HERE:8000/api/ai-chat`;

      const response = await axios.post(
        API_URL,
        { message: userMsg.text },
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.data.status === 'success') {
        const aiMsg = {
          id: (Date.now() + 1).toString(),
          text: response.data.answer,
          sender: 'ai',
        };
        setMessages(prev => [...prev, aiMsg]);
      } else {
        const errMsg = {
          id: (Date.now() + 2).toString(),
          text: '⚠️ Server error. Try again.',
          sender: 'ai',
        };
        setMessages(prev => [...prev, errMsg]);
      }
    } catch (err) {
      const errMsg = {
        id: (Date.now() + 3).toString(),
        text: '⚠️ Could not reach AI service.',
        sender: 'ai',
      };
      setMessages(prev => [...prev, errMsg]);
    }
  };

  const renderItem = ({ item }) => {
    const isUser = item.sender === 'user';
    return (
      <View style={[styles.bubble, isUser ? styles.userBubble : styles.aiBubble]}>
        <Text style={isUser ? styles.userText : styles.aiText}>{item.text}</Text>
      </View>
    );
  };

  return (
    <>
      {/* Make status bar translucent so our SafeAreaView can draw under it */}
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.keyboardAvoid}
          behavior="padding"
          // Offset should be roughly status bar (20) + navigation header (if any, e.g. 44)
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
          {/* ───── Message List ───── */}
          <FlatList
            ref={listRef}
            data={messages}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.chatContainer}
            style={styles.flatList}
          />

          {/* ───── Input Bar (floats above keyboard) ───── */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Type your question..."
              placeholderTextColor="#888"
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={sendMessage}
              returnKeyType="send"
              blurOnSubmit={false}
            />
            <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
              <Text style={styles.sendText}>Send</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardAvoid: {
    flex: 1,
  },
  flatList: {
    flex: 1,
    paddingHorizontal: 12,
  },
  chatContainer: {
    paddingVertical: 16,
  },
  bubble: {
    marginVertical: 4,
    maxWidth: '80%',
    borderRadius: 12,
    padding: 12,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
  },
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#e0e0e0',
  },
  userText: {
    color: '#fff',
    fontSize: 16,
  },
  aiText: {
    color: '#333',
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    fontSize: 16,
    color: '#000',
  },
  sendButton: {
    marginLeft: 8,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    paddingHorizontal: 16,
    height: 40,
  },
  sendText: {
    color: '#fff',
    fontSize: 16,
  },
});
