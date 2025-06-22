// src/screens/RegisterScreen.js

import React, { useState, useContext } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  StatusBar,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Picker }         from '@react-native-picker/picker';
import Icon               from 'react-native-vector-icons/Ionicons';
import { UserContext }    from '../../context/UserContext';

export default function RegisterScreen({ navigation }) {
  const { user, updateUser, loading } = useContext(UserContext);

  const [form, setForm] = useState({ name: '', place: '', dob: null, gender: '' });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGenderPicker, setShowGenderPicker] = useState(false);

  const handleChange = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleRegister = async () => {
    const { name, place, dob, gender } = form;
    if (!name.trim() || !place.trim() || !dob || !gender) {
      return alert('Please fill in all fields.');
    }
    try {
      await updateUser({ name: name.trim(), place: place.trim(), dob, gender });
      const rootNav = navigation.getParent();
      rootNav?.replace('AppTabs');
    } catch (err) {
      alert(`Error saving profile: ${err.message}`);
    }
  };

  if (loading || !user) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>Loading profile…</Text>
      </SafeAreaView>
    );
  }
  if (!user.uid) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>Missing account info. Please sign up again.</Text>
      </SafeAreaView>
    );
  }

  return (
    <>
      <StatusBar backgroundColor={styles.container.backgroundColor} barStyle="light-content" />
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
          >
            {/* Brand: Logo in white circle + App Name */}
            <View style={styles.brandContainer}>
              <View style={styles.logoCircle}>
                <Image
                  source={require('../../assets/logo.png')}
                  style={styles.logo}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.appName}>Papi</Text>
            </View>

            {/* White form panel */}
            <View style={styles.form}>
              <Text style={styles.registerHeader}>Register</Text>

              {/* Full Name */}
              <View style={styles.inputWrapper}>
                <Icon name="person-outline" size={20} color="#888" style={styles.icon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Full Name"
                  placeholderTextColor="#999"
                  value={form.name}
                  onChangeText={text => handleChange('name', text)}
                />
              </View>

              {/* Place of Birth */}
              <View style={styles.inputWrapper}>
                <Icon name="location-outline" size={20} color="#888" style={styles.icon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Place of Birth"
                  placeholderTextColor="#999"
                  value={form.place}
                  onChangeText={text => handleChange('place', text)}
                />
              </View>

              {/* Date of Birth */}
              <TouchableOpacity
                style={styles.inputWrapper}
                onPress={() => setShowDatePicker(true)}
              >
                <Icon name="calendar-outline" size={20} color="#888" style={styles.icon} />
                <Text style={[styles.textInput, { color: form.dob ? '#000' : '#999' }]}> 
                  {form.dob ? form.dob.toDateString() : 'Select Date of Birth'}
                </Text>
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={showDatePicker}
                mode="date"
                date={form.dob || new Date()}
                onConfirm={date => { handleChange('dob', date); setShowDatePicker(false); }}
                onCancel={() => setShowDatePicker(false)}
              />

              {/* Gender */}
              <TouchableOpacity
                style={styles.inputWrapper}
                onPress={() => setShowGenderPicker(v => !v)}
              >
                <Icon name="male-female-outline" size={20} color="#888" style={styles.icon} />
                <Text style={[styles.textInput, { color: form.gender ? '#000' : '#999' }]}> 
                  {form.gender || 'Select Gender'}
                </Text>
              </TouchableOpacity>
              {showGenderPicker && (
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={form.gender}
                    onValueChange={val => {
                      handleChange('gender', val);
                      setShowGenderPicker(false);
                    }}
                  >
                    <Picker.Item label="Select Gender..." value="" color="#999" />
                    <Picker.Item label="Male" value="Male" />
                    <Picker.Item label="Female" value="Female" />
                    <Picker.Item label="Other" value="Other" />
                  </Picker>
                </View>
              )}

              {/* Register button */}
              <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
                <Text style={styles.registerText}>Register</Text>
              </TouchableOpacity>

              {/* Sign in link */}
              <View style={styles.signInRow}>
                <Text style={styles.signInText}>Already have an account?</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Text style={styles.signInLink}> Sign in</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}

// ─── Styles ─────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFB731',  
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    padding: 20,
    alignItems: 'center',
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoCircle: {
    backgroundColor: '#fff',
    borderRadius: 40,
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  logo: {
    width: 80,
    height: 80,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'Montseratt',
  },
  form: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  registerHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'Montseratt',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#DDD',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 50,
    marginBottom: 16,
    backgroundColor: '#F9F9F9',
  },
  icon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  pickerContainer: {
    borderColor: '#DDD',
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: '#F9F9F9',
  },
  registerButton: {
    backgroundColor: '#FFB731',
    borderRadius: 8,

    paddingVertical: 14,
    alignItems: 'center',
    width: '100%',
  },
  registerText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '600',
  },
  signInRow: {
    flexDirection: 'row',
    marginTop: 16,
  },
  signInText: {
    color: '#fff',
    fontSize: 15,
  },
  signInLink: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});
