import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { ExpenseContext } from '../context/ExpenseContext';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HistoryScreen() {
  const { expenses } = useContext(ExpenseContext);

  return (
    <SafeAreaView>
    <ScrollView style={styles.container}>
      {expenses.length === 0 ? (
        <Text style={styles.empty}>No expense logs yet.</Text>
      ) : (
       expenses.map((item, index) => (
  <View key={index} style={styles.entry}>
    <Text style={{ marginBottom: 6 }}>
      {item.date} | {item.type.toUpperCase()}
    </Text>

    {item.type === 'image' && item.value ? (
      <Image
        source={{ uri: item.value }}
        style={{ width: '100%', height: 200, borderRadius: 10 }}
        resizeMode="cover"
      />
    ) : (
      <Text>{item.value}</Text>
    )}
  </View>
))


        
      )}
    </ScrollView>
    </SafeAreaView>
  );
  
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    padding: 16,
    backgroundColor: '#fff',
    paddingBottom: 900, 
  },
  entry: {
    padding: 12,
  borderWidth: 1,
  borderColor: '#ddd',
  borderRadius: 10,
  marginBottom: 12,
  backgroundColor: '#fefefe',
  },
  empty: {
    textAlign: 'center',
    color: '#888',
    marginTop: 30,
  },
  entry: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 10,
  },
});
