import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesome5, MaterialIcons, Entypo } from '@expo/vector-icons';

export default function BudgetScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Budget</Text>
      </View>

      {/* Title Section */}
      <View style={styles.section}>
        <Text style={styles.title}>Automatic Budgeting</Text>
        <Text style={styles.subtitle}>Auto-allocates funds into categories</Text>
      </View>

      {/* Amount */}
      <View style={styles.amountBox}>
        <Text style={styles.amountLabel}>Amount</Text>
        <Text style={styles.amountValue}>PHP 5,000</Text>
      </View>

      {/* Category Boxes */}
      <TouchableOpacity style={styles.category}>
        <FontAwesome5 name="utensils" size={20} />
        <Text style={styles.categoryLabel}>Food</Text>
        <Text style={styles.categoryAmount}>₱1,000</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.category}>
        <MaterialIcons name="payments" size={20} />
        <Text style={styles.categoryLabel}>Bills</Text>
        <Text style={styles.categoryAmount}>₱1,500</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.category}>
        <Entypo name="home" size={20} />
        <Text style={styles.categoryLabel}>Rent</Text>
        <Text style={styles.categoryAmount}>₱1,200</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.category}>
        <Text style={styles.categoryIcon}>＋</Text>
        <Text style={styles.categoryLabel}>Others</Text>
        <Text style={styles.categoryAmount}>₱300</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 25,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#F7B801',
    padding: 15,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
  },
  section: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    color: '#555',
  },
  amountBox: {
    paddingVertical: 10,
  },
  amountLabel: {
    color: '#555',
    marginBottom: 5,
  },
  amountValue: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  category: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F7B801',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 5,
  },
  categoryLabel: {
    flex: 1,
    marginLeft: 10,
    fontWeight: 'bold',
    fontSize: 16,
  },
  categoryAmount: {
    fontWeight: 'bold',
  },
  categoryIcon: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
