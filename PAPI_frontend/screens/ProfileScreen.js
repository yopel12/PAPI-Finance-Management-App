// screens/ProfileScreen.js
import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { UserContext } from '../context/UserContext';
import { Ionicons, Feather } from '@expo/vector-icons';

export default function ProfileScreen({ navigation }) {
  const { user, updateUser } = useContext(UserContext);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    name: user.name || '',
    place: user.place || '',
    dob: user.dob || '',
    gender: user.gender || '',
    image: user.image || null,
  });
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleChange = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const toggleEdit = () => {
    if (isEditing) {
      updateUser(form);
      Alert.alert('Profile Saved', 'Your information has been updated.');
    }
    setIsEditing(prev => !prev);
  };

  const pickImage = async () => {
    if (!isEditing) return;
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) return Alert.alert('Permission needed', 'Allow access to your photos.');
    const result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, quality: 1 });
    if (!result.canceled && result.assets.length > 0) handleChange('image', { uri: result.assets[0].uri });
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) handleChange('dob', selectedDate.toISOString());
  };

  const formatDate = (iso) =>
    iso
      ? new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
      : '';

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity onPress={toggleEdit}>
          <Feather name={isEditing ? 'check' : 'edit'} size={20} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Avatar */}
      <View style={styles.profile}>
        <TouchableOpacity onPress={pickImage} activeOpacity={isEditing ? 0.6 : 1}>
          {form.image ? (
            <Image source={form.image} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>  
              <Ionicons name="person" size={60} color="#aaa" />
            </View>
          )}
          {isEditing && <Text style={styles.changePhoto}>Change Photo</Text>}
        </TouchableOpacity>
      </View>

      {/* Form Fields */}
      <View style={styles.infoContainer}>
        {/* Full Name */}
        <View style={styles.fieldWrapper}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={[styles.input, !isEditing && styles.readOnly]}
            value={form.name}
            onChangeText={text => handleChange('name', text)}
            editable={isEditing}
            placeholder={isEditing ? 'Enter full name' : ''}
          />
        </View>

        {/* Place of Birth */}
        <View style={styles.fieldWrapper}>
          <Text style={styles.label}>Place of Birth</Text>
          <TextInput
            style={[styles.input, !isEditing && styles.readOnly]}
            value={form.place}
            onChangeText={text => handleChange('place', text)}
            editable={isEditing}
            placeholder={isEditing ? 'Enter place of birth' : ''}
          />
        </View>

        {/* Date of Birth */}
        <View style={styles.fieldWrapper}>
          <Text style={styles.label}>Date of Birth</Text>
          <TouchableOpacity
            style={[styles.input, !isEditing && styles.readOnly]}
            onPress={() => isEditing && setShowDatePicker(true)}
            activeOpacity={isEditing ? 0.6 : 1}
          >
            <Text style={styles.inputText}>
              {formatDate(form.dob) || (isEditing ? 'Select date' : '')}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={form.dob ? new Date(form.dob) : new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onDateChange}
              style={styles.datePicker}
            />
          )}
        </View>

        {/* Gender */}
        <View style={styles.fieldWrapper}>
          <Text style={styles.label}>Gender</Text>
          <View style={[styles.input, !isEditing && styles.readOnly]}>  
            {isEditing ? (
              <Picker
                selectedValue={form.gender}
                onValueChange={value => handleChange('gender', value)}
                style={styles.picker}
              >
                <Picker.Item label="Select gender" value="" />
                <Picker.Item label="Male" value="Male" />
                <Picker.Item label="Female" value="Female" />
                <Picker.Item label="Other" value="Other" />
              </Picker>
            ) : (
              <Text style={styles.inputText}>{form.gender}</Text>
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#F7B801', paddingVertical: 12, paddingHorizontal: 20,
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },

  profile: { alignItems: 'center', marginVertical: 20 },
  avatar: { width: 140, height: 140, borderRadius: 70, marginBottom: 6 },
  avatarPlaceholder: { backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center' },
  changePhoto: { fontSize: 12, color: '#555', textAlign: 'center' },

  infoContainer: { paddingHorizontal: 20 },
  fieldWrapper: { marginBottom: 20 },
  label: { color: '#555', marginBottom: 4, fontSize: 13 },

  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  readOnly: { backgroundColor: '#f5f5f5' },
  inputText: { fontSize: 15, color: '#333' },

  datePicker: { width: '100%' },
  picker: { width: '100%' },
});
