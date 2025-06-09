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
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
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

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleToggleEdit = () => {
    if (isEditing) {
      updateUser(form);
      Alert.alert('Profile Saved', 'Your information has been updated.');
    }
    setIsEditing(prev => !prev);
  };

  const handlePickImage = async () => {
    if (!isEditing) return;
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) {
      Alert.alert('Permission needed', 'Please allow access to your photo library.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled && result.assets.length > 0) {
      handleChange('image', { uri: result.assets[0].uri });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}> Profile</Text>
        <TouchableOpacity onPress={handleToggleEdit}>
          <Feather name={isEditing ? 'check' : 'edit'} size={20} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.profile}>
        <TouchableOpacity
          onPress={handlePickImage}
          activeOpacity={isEditing ? 0.6 : 1}
        >
          {form.image ? (
            <Image source={form.image} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Ionicons name="person" size={60} color="#aaa" />
            </View>
          )}
          {isEditing && <Text style={styles.changePhotoText}>Change Photo</Text>}
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <LabelInput
          label="Full Name"
          value={form.name}
          onChangeText={text => handleChange('name', text)}
          editable={isEditing}
        />
        <LabelInput
          label="Place of Birth"
          value={form.place}
          onChangeText={text => handleChange('place', text)}
          editable={isEditing}
        />
        <LabelInput
          label="Date of Birth"
          value={
            form.dob
              ? new Date(form.dob).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })
              : ''
          }
          onChangeText={text => handleChange('dob', text)}
          editable={isEditing}
        />
        <LabelInput
          label="Gender"
          value={form.gender}
          onChangeText={text => handleChange('gender', text)}
          editable={isEditing}
        />
      </View>
    </SafeAreaView>
  );
}

function LabelInput({ label, value, onChangeText, editable }) {
  return (
    <View style={styles.fieldWrapper}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, !editable && styles.readOnly]}
        value={value}
        onChangeText={onChangeText}
        editable={editable}
        placeholder={editable ? `Enter ${label.toLowerCase()}` : ''}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F7B801',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  profile: {
    alignItems: 'center',
    marginVertical: 20,
  },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
    marginBottom: 6,
  },
  avatarPlaceholder: {
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  changePhotoText: {
    fontSize: 12,
    color: '#555',
    textAlign: 'center',
  },
  infoContainer: {
    paddingHorizontal: 20,
  },
  fieldWrapper: {
    marginBottom: 16,
  },
  label: {
    color: '#555',
    marginBottom: 4,
    fontSize: 13,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    fontSize: 15,
    backgroundColor: '#fff',
  },
  readOnly: {
    backgroundColor: '#f5f5f5',
    color: '#888',
  },
});
