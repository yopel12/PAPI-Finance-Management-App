import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Image, SafeAreaView } from 'react-native';
import { UserContext } from '../context/UserContext';
import { Ionicons, Feather } from '@expo/vector-icons';

export default function ProfileScreen() {
  const { user, updateUser } = useContext(UserContext);

  const [form, setForm] = useState({
    name: user.name,
    place: user.place || '',
    dob: user.dob || '',
    gender: user.gender || '',
    image: user.image,
  });

  const handleChange = (key, value) => {
    const updated = { ...form, [key]: value };
    setForm(updated);
    updateUser({ [key]: value });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} color="#000" />
        <Text style={styles.headerTitle}>Profile</Text>
        <Feather name="edit" size={20} color="#000" />
      </View>

      {/* Avatar and Name */}
      <View style={styles.profile}>
        <Image source={form.image} style={styles.avatar} />
        <TextInput
          style={styles.name}
          value={form.name}
          placeholder="Full Name"
          onChangeText={(text) => handleChange('name', text)}
        />
      </View>

      {/* More Fields */}
      <View style={styles.infoContainer}>
        <LabelInput label="Place of Birth" value={form.place} onChangeText={(text) => handleChange('place', text)} />
        <LabelInput label="Date of Birth" value={form.dob} onChangeText={(text) => handleChange('dob', text)} />
        <LabelInput label="Gender" value={form.gender} onChangeText={(text) => handleChange('gender', text)} />
      </View>
    </SafeAreaView>
  );
}

// Label Input
function LabelInput({ label, value, onChangeText }) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput style={styles.input} value={value} onChangeText={onChangeText} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff', 
    padding: 25,
  },
  header: {
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center', 
    backgroundColor: '#F7B801', 
    padding: 15, 
    borderRadius: 10,
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
    width: 80, 
    height: 80, 
    borderRadius: 40, 
    marginBottom: 10, 
  },
  name: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    borderBottomWidth: 1, 
    width: '80%', 
  },
  infoContainer: { 
    marginTop: 10, 
  },
  label: { 
    color: '#aaa', 
    marginBottom: 4, 
    fontSize: 12,
  },
  input: {
    borderWidth: 1, 
    borderColor: '#ddd',
    padding: 10, 
    borderRadius: 8, 
    fontSize: 14,
  },
});
