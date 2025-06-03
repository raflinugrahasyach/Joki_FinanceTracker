

import React, { useEffect, useState, useRef } from 'react'; //tanggal 29/05/2025 
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  SafeAreaView, Dimensions, Animated
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PieChart } from 'react-native-chart-kit';
import db from '../db/db';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }: any) {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [userName, setUserName] = useState('');
  const totalBalance = 1200;

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();

    const loadData = async () => {
      const userId = await AsyncStorage.getItem('userId');
      const storedName = await AsyncStorage.getItem('userName');
      if (storedName) setUserName(storedName);

      if (!userId) {
        console.log('User ID not found.');
        return;
      }

      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM expenses WHERE user_id = ?',
          [userId],
          (_, result) => {
            const data: any[] = [];
            for (let i = 0; i < result.rows.length; i++) {
              data.push(result.rows.item(i));
            }
            setExpenses(data);
          },
          (_, error) => {
            console.log('Select error:', error);
            return true;
          }
        );
      });
    };

    loadData();
  }, []);

  const renderExpense = ({ item }: any) => (
    <View style={styles.expenseRow}>
      <View style={styles.expenseIcon} />
      <View style={styles.expenseInfo}>
        <Text style={styles.expenseLabel}>{item.type}</Text>
        <Text style={styles.expenseDate}>{item.createdAt.slice(0, 10)}</Text>
      </View>
      <Text style={styles.expenseAmount}>-${item.amount.toFixed(2)}</Text>
    </View>
  );

  const chartData = expenses.map((e, i) => ({
    name: e.type,
    amount: e.amount,
    color: ['#2A9D8F', '#E76F51', '#F4A261', '#264653'][i % 4],
    legendFontColor: '#333',
    legendFontSize: 14,
  }));

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <SafeAreaView style={{ flex: 1 }}>
        <FlatList
          ListHeaderComponent={
            <>
              <View style={styles.header}>
                {/* ✅ Tambahan menampilkan nama user */}
                <Text style={styles.userGreeting}>Hi, {userName}</Text>

                <Text style={styles.accountTitle}>Main Account</Text>
                <Text style={styles.balance}>${totalBalance.toFixed(2)}</Text>
                <Text style={styles.balanceChange}>+2,775$ this month</Text>
              </View>

              <View style={styles.chartContainer}>
                <PieChart
                  data={chartData}
                  width={width - 32}
                  height={180}
                  accessor="amount"
                  backgroundColor="transparent"
                  paddingLeft="15"
                  absolute
                  chartConfig={{ color: () => '#000' }}
                  style={styles.pieChart}
                />
              </View>

              <View style={styles.transactionHeader}>
                <Text style={styles.transactionTitle}>Recent Transactions</Text>
              </View>
            </>
          }
          data={expenses}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderExpense}
          contentContainerStyle={styles.listContainer}
        />

        <View style={styles.fabContainer}>
          <TouchableOpacity style={[styles.fab, styles.fabAdd]} onPress={() => navigation.navigate('AddExpense')}>
            <Text style={styles.fabText}>＋</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.fab, styles.fabChart]} onPress={() => navigation.navigate('Prediction')}>
            <Text style={styles.fabText}>📈</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F4F8' },
  header: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#4E6EF2',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20
  },
  userGreeting: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 6
  },
  accountTitle: { fontSize: 16, color: '#FFF' },
  balance: { fontSize: 32, fontWeight: 'bold', color: '#FFF' },
  balanceChange: { fontSize: 14, color: '#D0E1FD', marginTop: 4 },
  chartContainer: { paddingHorizontal: 16, marginTop: 20 },
  pieChart: { marginVertical: 8, borderRadius: 16, alignSelf: 'center' },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 24
  },
  transactionTitle: { fontSize: 18, fontWeight: '600', color: '#333' },
  listContainer: { paddingHorizontal: 16, paddingBottom: 120 },
  expenseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12
  },
  expenseIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E0E0E0',
    marginRight: 12
  },
  expenseInfo: { flex: 1 },
  expenseLabel: { fontSize: 16, color: '#333' },
  expenseDate: { fontSize: 12, color: '#888' },
  expenseAmount: { fontSize: 16, fontWeight: '600', color: '#E76F51' },
  fabContainer: {
    position: 'absolute',
    right: 24,
    bottom: 16,
    flexDirection: 'column',
    alignItems: 'center'
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16
  },
  fabAdd: { backgroundColor: '#2A9D8F' },
  fabChart: { backgroundColor: '#264653' },
  fabText: { fontSize: 24, color: '#FFF' }
});
