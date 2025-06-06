import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { UserContext } from '../context/UserContext';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/Ionicons';

export default function RegisterScreen({ navigation }) {
  const { updateUser } = useContext(UserContext);

  const [form, setForm] = useState({
    name: '',
    place: '',
    dob: null,
    gender: '',
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGenderPicker, setShowGenderPicker] = useState(false);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleRegister = () => {

     const fallbackDOB = form.dob || new Date();

    if (form.name && form.dob && form.gender) {
      updateUser({...form,
        dob: fallbackDOB,
      });
      console.log("Registering user:", form);
      navigation.replace('MainTabs');
    } else {
      alert('Please fill in all fields.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        onChangeText={(val) => handleChange('name', val)}
      />

      <TextInput
        style={styles.input}
        placeholder="Place of Birth"
        onChangeText={(val) => handleChange('place', val)}
      />

      {/* Date of Birth Picker */}
      <TouchableOpacity 
      style={styles.inputWithIcon} 
      onPress={() => setShowDatePicker(true)}
      activeOpacity={0.8}
      >
        <View style={styles.textWrapper}>
        <Text style={{ color: form.dob ? 'black' : '#999' }}>
          {form.dob ? new Date(form.dob).toDateString() : 'Select Date of Birth'}
        </Text>
        </View>
        <Icon name="calendar-outline" size={20} color="#888" />
      </TouchableOpacity>


      <DateTimePickerModal
        isVisible={showDatePicker}
        mode="date"
        date={form.dob || new Date()}
        onConfirm={(date) => {
          handleChange('dob', date.toDateString());
          setShowDatePicker(false);
        }}
        onCancel={() => setShowDatePicker(false)}
        textColor='black'
      />

      {/* Gender Picker Trigger */}
      <TouchableOpacity style={styles.input} onPress={() => setShowGenderPicker(!showGenderPicker)}>
        <Text>{form.gender ? form.gender : 'Select Gender...'}</Text>
      </TouchableOpacity>

      {/* Gender Picker Dropdown */}
      {showGenderPicker && (
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={form.gender}
            onValueChange={(itemValue) => {
              handleChange('gender', itemValue);
              setShowGenderPicker(false); // hide picker after selection
            }}
          >
            <Picker.Item label="Select Gender..." value="" />
            <Picker.Item label="Male" value="Male" />
            <Picker.Item label="Female" value="Female" />
            <Picker.Item label="Other" value="Other" />
          </Picker>
        </View>
      )}

      <Button title="Register" onPress={handleRegister} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    justifyContent: 'center',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 12,
    overflow: Platform.OS === 'android' ? 'hidden' : 'visible',
  },
  inputWithIcon: {
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 8,
  padding: 12,
  marginBottom: 12,
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
},
textWrapper: {
  flex: 1, // this makes the text fill the available space
},
});
