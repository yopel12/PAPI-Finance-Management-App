// screens/RegisterScreen.js
import React, { useState, useContext } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  StatusBar,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/Ionicons';

// pull the signed-in user
import { AuthContext } from '../context/AuthContext';
import { UserContext } from '../context/UserContext';

export default function RegisterScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const { updateUser } = useContext(UserContext);

  // if somehow user is null, bail out
  const uid = user?.uid;
  if (!uid) {
    // you might show a spinner or redirect to login
    return <Text>Loading…</Text>;
  }

  const [form, setForm] = useState({
    name: '',
    place: '',
    dob: null,
    gender: '',
  });
  const [showDatePicker, setShowDatePicker]     = useState(false);
  const [showGenderPicker, setShowGenderPicker] = useState(false);

  const handleChange = (key, val) => {
    setForm(f => ({ ...f, [key]: val }));
  };

  const handleRegister = async () => {
    const { name, place, dob, gender } = form;
    if (!name.trim() || !place.trim() || !dob || !gender) {
      return alert('Please fill in all fields.');
    }

    try {
      await updateUser(uid, {
        fullName:     name.trim(),
        placeOfBirth: place.trim(),
        dateOfBirth:  dob,
        gender,
      });
      // drop into your main tabs
      navigation.replace('MainTabs');
    } catch (err) {
      alert(`Error saving profile: ${err.message}`);
    }
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
          >
            {/* Full Name */}
            <View style={styles.inputWrapper}>
              <Icon name="person-outline" size={20} color="#888" style={styles.icon} />
              <TextInput
                style={styles.textInput}
                placeholder="Full Name"
                placeholderTextColor="#666"
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
                placeholderTextColor="#666"
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
              <Text style={[styles.touchableText, { color: form.dob ? '#000' : '#666' }]}>
                {form.dob ? form.dob.toDateString() : 'Select Date of Birth'}
              </Text>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={showDatePicker}
              mode="date"
              date={form.dob || new Date()}
              onConfirm={date => {
                handleChange('dob', date);
                setShowDatePicker(false);
              }}
              onCancel={() => setShowDatePicker(false)}
              textColor="black"
            />

            {/* Gender */}
            <TouchableOpacity
              style={styles.inputWrapper}
              onPress={() => setShowGenderPicker(v => !v)}
            >
              <Icon name="male-female-outline" size={20} color="#888" style={styles.icon} />
              <Text style={[styles.touchableText, { color: form.gender ? '#000' : '#666' }]}>
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
                  <Picker.Item label="Select Gender..." value="" color="#666" />
                  <Picker.Item label="Male"   value="Male"   />
                  <Picker.Item label="Female" value="Female" />
                  <Picker.Item label="Other"  value="Other"  />
                </Picker>
              </View>
            )}

            {/* Register Button */}
            <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
              <Text style={styles.registerText}>Register</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1, backgroundColor: '#F7F7F7'
  },
  scrollContainer: {
    padding: 20, paddingTop: 40
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderColor: '#DDD',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
    height: 50,
  },
  icon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1, fontSize: 16, color: '#000'
  },
  touchableText: {
    flex: 1, fontSize: 16
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderColor: '#DDD',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    overflow: Platform.OS === 'android' ? 'hidden' : 'visible',
  },
  registerButton: {
    backgroundColor: '#FF8C00',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  registerText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
});
