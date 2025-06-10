import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import db from '../db/db';
import { PieChart } from 'react-native-gifted-charts';

// Import ikon SVG
import UserIcon from '../components/icons/UserIcon';
import HomeIcon from '../components/icons/HomeIcon';
import PlusIcon from '../components/icons/PlusIcon';
import ChartIcon from '../components/icons/ChartIcon';
import GroceriesIcon from '../components/icons/GroceriesIcon';
import TransportIcon from '../components/icons/TransportIcon';
import BillsIcon from '../components/icons/BillsIcon';
import EntertainmentIcon from '../components/icons/EntertainmentIcon';

// Objek untuk memetakan kategori ke komponen Ikon SVG yang benar
// TIDAK ADA LAGI 'require()'
const categoryIcons: { [key: string]: React.FC<any> } = {
    'Makanan': GroceriesIcon,
    'Belanja': GroceriesIcon,
    'Transportasi': TransportIcon,
    'Hiburan': EntertainmentIcon,
    'Tagihan': BillsIcon,
    'Default': BillsIcon, // Ikon default jika kategori tidak cocok
};

export default function HomeScreen({ navigation }: any) {
  const [userName, setUserName] = useState('');
  const [totalBalance, setTotalBalance] = useState(2500000); // Sesuai mockup
  const [expenses, setExpenses] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        try {
          const userId = await AsyncStorage.getItem('userId');
          const storedName = await AsyncStorage.getItem('userName');
          
          if (storedName) {
            setUserName(storedName);
          }

          if (userId) {
            db.transaction(tx => {
              tx.executeSql(
                'SELECT * FROM expenses WHERE user_id = ? ORDER BY createdAt DESC',
                [userId],
                (_, { rows }) => {
                  const fetchedExpenses: any[] = [];
                  let spent = 0;
                  for (let i = 0; i < rows.length; i++) {
                    const item = rows.item(i);
                    fetchedExpenses.push(item);
                    spent += item.amount;
                  }
                  setExpenses(fetchedExpenses);
                  setTotalBalance(2500000 - spent); // Asumsi balance awal 2.5jt
                }
              );
            });
          }
        } catch (error) {
          console.error("Failed to load data from storage", error);
        }
      };

      loadData();
    }, [])
  );
  
  const categoryData = expenses.reduce((acc, expense) => {
    const { type, amount } = expense;
    if (!acc[type]) {
      acc[type] = 0;
    }
    acc[type] += amount;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.keys(categoryData).map((key, index) => {
      const colors = ['#0052FF', '#00C4DF', '#FFC837', '#FF82A9', '#7A4DFF'];
      return {
          value: categoryData[key],
          color: colors[index % colors.length],
          label: key
      }
  })

  const renderTransactionItem = ({ item }: { item: any }) => {
      const iconColors: { [key: string]: string } = {
          'Makanan': '#FFC837', 
          'Belanja': '#FF82A9',
          'Transportasi': '#00C4DF',
          'Hiburan': '#FF82A9',
          'Tagihan': '#7A4DFF'
        };
      const bgColor = iconColors[item.type] || '#E0E0E0';
      const IconComponent = categoryIcons[item.type] || categoryIcons['Default'];

      return (
        <View style={styles.transactionItem}>
          <View style={[styles.iconContainer, { backgroundColor: `${bgColor}30` }]}>
              <IconComponent stroke={bgColor} width={28} height={28} /> 
          </View>
          <View style={styles.transactionDetails}>
            <Text style={styles.transactionTitle}>{item.type}</Text>
            <Text style={styles.transactionDate}>
                {new Date(item.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} - {new Date(item.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'long' })}
            </Text>
          </View>
          <Text style={styles.transactionAmount}>-Rp{item.amount.toLocaleString('id-ID')}</Text>
        </View>
      );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 100}}>
                <View style={styles.header}>
                    <View>
                        <Text style={styles.greeting}>Hi, Welcome Back</Text>
                        <Text style={styles.username}>{userName}</Text>
                    </View>
                    <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
                        <View style={styles.profileIcon}>
                            <UserIcon stroke="#FFFFFF" width={28} height={28}/>
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={styles.balanceContainer}>
                    <Text style={styles.balanceTitle}>Balance</Text>
                    <Text style={styles.balanceAmount}>Rp{totalBalance.toLocaleString('id-ID')}</Text>
                    <View style={styles.chartContainer}>
                         <PieChart 
                            data={pieData} 
                            donut={false}
                            radius={80}
                            showText={false}
                            focusOnPress
                        />
                    </View>
                    <View style={styles.legendContainer}>
                        {pieData.map(item => (
                             <View key={item.label} style={styles.legendItem}>
                                <View style={[styles.legendDot, {backgroundColor: item.color}]} />
                                <Text style={styles.legendText}>{item.label}</Text>
                            </View>
                        ))}
                    </View>
                </View>
                
                <FlatList
                    data={expenses}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderTransactionItem}
                    scrollEnabled={false}
                    ListHeaderComponent={<Text style={styles.listHeader}>Transactions</Text>}
                />
            </ScrollView>
        </View>

        <View style={styles.bottomNav}>
            <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('AddExpense')}>
                <PlusIcon stroke="#A1A1A1"/>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Home')}>
                <HomeIcon stroke="#0052FF"/>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Prediction')}>
                <ChartIcon stroke="#A1A1A1"/>
            </TouchableOpacity>
        </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#E6F0FF',
    },
    container: {
        flex: 1,
        backgroundColor: '#E6F0FF',
    },
    header: {
        backgroundColor: '#0052FF',
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 60,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    greeting: {
        color: '#FFFFFF',
        fontSize: 16,
    },
    username: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: 'bold',
    },
    profileIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    balanceContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 30,
        padding: 20,
        marginHorizontal: 24,
        marginTop: -40,
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    balanceTitle: {
        color: '#858585',
        fontSize: 18,
    },
    balanceAmount: {
        color: '#0D253C',
        fontSize: 40,
        fontWeight: 'bold',
        marginTop: 5,
    },
    chartContainer: {
        marginVertical: 20,
    },
    legendContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'wrap',
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 15,
        marginBottom: 5
    },
    legendDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 8,
    },
    legendText: {
        fontSize: 16,
        color: '#0D253C',
    },
    listHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#0D253C',
        paddingHorizontal: 24,
        marginTop: 30,
        marginBottom: 10,
    },
    transactionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        marginHorizontal: 24,
        borderRadius: 20,
        padding: 15,
        marginBottom: 15,
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    transactionDetails: {
        flex: 1,
    },
    transactionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0D253C',
    },
    transactionDate: {
        fontSize: 14,
        color: '#858585',
        marginTop: 4,
    },
    transactionAmount: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FF4545',
    },
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingVertical: 10,
        elevation: 10,
    },
    navButton: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10
    },
});