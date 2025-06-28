// screens/HistoryScreen.js
import React, { useContext, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ExpenseContext } from '../context/ExpenseContext';

export default function HistoryScreen() {
  const { expenses } = useContext(ExpenseContext);

  // Track which date-groups are expanded
  const [expandedDates, setExpandedDates] = useState({});

  // Group expenses by date
  const groupedExpenses = useMemo(() => {
    return expenses.reduce((acc, item) => {
      const dateKey = item.date;
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(item);
      return acc;
    }, {});
  }, [expenses]);

  // Sort dates descending
  const sortedDates = useMemo(() => {
    return Object.keys(groupedExpenses).sort((a, b) => {
      return new Date(b) - new Date(a);
    });
  }, [groupedExpenses]);

  const toggleDate = (dateKey) =>
    setExpandedDates((prev) => ({
      ...prev,
      [dateKey]: !prev[dateKey],
    }));

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerText}> History</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {expenses.length === 0 ? (
          <Text style={styles.empty}>No expense logs yet.</Text>
        ) : (
          sortedDates.map((date) => {
            const isExpanded = !!expandedDates[date];
            return (
              <View key={date} style={styles.groupContainer}>
                <TouchableOpacity
                  style={styles.dateHeaderContainer}
                  onPress={() => toggleDate(date)}
                >
                  <Text style={styles.dateHeader}>{date}</Text>
                  <Text style={styles.arrow}>
                    {isExpanded ? '▲' : '▼'}
                  </Text>
                </TouchableOpacity>

                {isExpanded &&
                  groupedExpenses[date].map((item, idx) => (
                    <View key={`${date}-${idx}`} style={styles.entry}>
                      <Text style={styles.metaText}>
                        {item.type.toUpperCase()}
                      </Text>

                      {item.type === 'image' && item.value ? (
                        <Image
                          source={{ uri: item.value }}
                          style={styles.image}
                          resizeMode="cover"
                        />
                      ) : (
                        <Text style={styles.valueText}>{item.value}</Text>
                      )}
                    </View>
                  ))}
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    padding: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderColor: '#eee',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: '600',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  groupContainer: {
    marginBottom: 20,
  },
  dateHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
  },
  dateHeader: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333',
  },
  arrow: {
    fontSize: 14,
    color: '#333',
  },
  entry: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    marginTop: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  metaText: {
    marginBottom: 6,
    fontSize: 13,
    color: '#555',
  },
  valueText: {
    fontSize: 16,
    color: '#222',
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 8,
  },
  empty: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
    marginTop: 40,
  },
});
