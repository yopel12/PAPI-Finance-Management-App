// BudgetScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fetchCategoryDetails } from '../context/fetchAirtable';

export default function BudgetScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [entries, setEntries] = useState([]);

  const [incomeTotal, setIncomeTotal] = useState(0);
  const [expenseTotal, setExpenseTotal] = useState(0);
  const [liabilityTotal, setLiabilityTotal] = useState(0);
  const [assetTotal, setAssetTotal] = useState(0);
  const [netProfit, setNetProfit] = useState(0);

  useEffect(() => {
    const loadTotals = async () => {
      const incRows = await fetchCategoryDetails('Income');
      const expRows = await fetchCategoryDetails('Expense');
      const liaRows = await fetchCategoryDetails('Liability');
      const astRows = await fetchCategoryDetails('Asset');
      const sumAmounts = rows => rows.reduce((acc, item) => {
        const key = Object.keys(item.fields).find(k => k.toLowerCase().includes('amount'));
        return acc + (parseFloat(item.fields[key]) || 0);
      }, 0);

      const incTotal = sumAmounts(incRows);
      const expTotal = sumAmounts(expRows);
      const liaTotal = sumAmounts(liaRows);
      const astTotal = sumAmounts(astRows);

      setIncomeTotal(incTotal);
      setExpenseTotal(expTotal);
      setLiabilityTotal(liaTotal);
      setAssetTotal(astTotal);
      const profit = liaTotal > 0 ? incTotal - expTotal - liaTotal : incTotal - expTotal;
      setNetProfit(profit);
    };
    loadTotals();
  }, []);

  const onCategoryPress = async cat => {
    setSelectedCategory(cat);
    const rows = await fetchCategoryDetails(cat);
    setEntries(rows);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Report Summary</Text>
      <View style={styles.card}>
        {[
          { label: 'Income', value: incomeTotal },
          { label: 'Expense', value: expenseTotal },
          { label: 'Liability', value: liabilityTotal },
          { label: 'Asset', value: assetTotal },
        ].map(({ label, value }) => (
          <TouchableOpacity
            key={label}
            style={styles.row}
            onPress={() => onCategoryPress(label)}
          >
            <Text style={styles.label}>{label}</Text>
            <View style={styles.rowRight}>
              <Text style={styles.value}>₱{value.toLocaleString()}</Text>
              <Ionicons name="chevron-forward" size={20} color="#888" />
            </View>
          </TouchableOpacity>
        ))}

        <View style={styles.separator} />
        <View style={styles.netRow}>
          <Text style={styles.netLabel}>Net Profit:</Text>
          <Text style={styles.netValue}>₱{netProfit.toLocaleString()}</Text>
        </View>
      </View>

      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>{selectedCategory} Details</Text>
          <FlatList
            data={entries}
            keyExtractor={item => item.id}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No entries in this category.</Text>
            }
            renderItem={({ item }) => {
              const fields = item.fields;
              const amountKey = Object.keys(fields).find(k => k.toLowerCase().includes('amount'));
              const descKey = Object.keys(fields).find(k => k.toLowerCase().includes('desc'));
              const dateKey = Object.keys(fields).find(k => k.toLowerCase().includes('date'));
              return (
                <View style={styles.entry}>
                  <View style={styles.entryRow}>
                    <Text style={styles.entryDesc}>{fields[descKey] || '—'}</Text>
                    <Text style={styles.entryAmount}>₱{Number(fields[amountKey] || 0).toLocaleString()}</Text>
                  </View>
                  <Text style={styles.entryDate}>
                    {fields[dateKey] ? new Date(fields[dateKey]).toLocaleDateString() : '—'}
                  </Text>
                </View>
              );
            }}
          />
          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            style={styles.closeBtn}
          >
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
    backgroundColor: '#fdbf00',
    padding: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
    padding: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  label: { fontSize: 18, fontWeight: '600' },
  rowRight: { flexDirection: 'row', alignItems: 'center' },
  value: { fontSize: 18, marginRight: 8 },
  separator: { borderBottomWidth: 1, borderColor: '#ccc', marginVertical: 10 },
  netRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  netLabel: { fontSize: 18, fontWeight: 'bold' },
  netValue: { fontSize: 18, fontWeight: 'bold' },
  modal: { flex: 1, padding: 20, backgroundColor: '#fff' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  entry: { marginBottom: 16 },
  entryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  entryDesc: { flex: 1 },
  entryAmount: { fontWeight: 'bold' },
  entryDate: { color: '#666', marginTop: 4 },
  emptyText: { textAlign: 'center', marginTop: 20 },
  closeBtn: { marginTop: 20, alignSelf: 'center' },
  closeText: { color: '#007AFF', fontSize: 16 },
});
