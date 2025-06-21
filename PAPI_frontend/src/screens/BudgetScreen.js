// screens/BudgetScreen.js
import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { FontAwesome5, MaterialIcons, Entypo } from '@expo/vector-icons';
import { ExpenseContext } from '../../context/ExpenseContext';

export default function BudgetScreen() {
  const { getBudgetTotals = () => ({ Food: 0, Bills: 0, Rent: 0, Others: 0 }) } =
    useContext(ExpenseContext) || {};
  const totals = getBudgetTotals();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* ─── Header ─────────────────────────────────────────── */}
        <View style={styles.header}>
          <Text style={styles.headerText}> Budget</Text>
        </View>

        {/* ─── Description ───────────────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.title}>Automatic Budgeting</Text>
          <Text style={styles.subtitle}>
            Allocates based on your expense logs
          </Text>
        </View>

        {/* ─── Category Totals ───────────────────────────────── */}
        <View style={styles.category}>
          <FontAwesome5 name="utensils" size={20} />
          <Text style={styles.categoryLabel}>Food</Text>
          <Text style={styles.categoryAmount}>₱{totals.Food}</Text>
        </View>

        <View style={styles.category}>
          <MaterialIcons name="payments" size={20} />
          <Text style={styles.categoryLabel}>Bills</Text>
          <Text style={styles.categoryAmount}>₱{totals.Bills}</Text>
        </View>

        <View style={styles.category}>
          <Entypo name="home" size={20} />
          <Text style={styles.categoryLabel}>Rent</Text>
          <Text style={styles.categoryAmount}>₱{totals.Rent}</Text>
        </View>

        <View style={styles.category}>
          <Text style={styles.categoryIcon}>＋</Text>
          <Text style={styles.categoryLabel}>Others</Text>
          <Text style={styles.categoryAmount}>₱{totals.Others}</Text>
        </View>
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
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    backgroundColor: '#F7B801',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
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
    fontSize: 14,
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
    fontSize: 16,
  },
  categoryIcon: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
