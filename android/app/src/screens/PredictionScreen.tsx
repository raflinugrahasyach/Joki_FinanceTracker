// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, ScrollView } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import db from '../db/db';
// import { PieChart } from 'react-native-chart-kit';
// import { Dimensions } from 'react-native';

// const screenWidth = Dimensions.get('window').width;

// export function PredictionScreen() {
//   const [expenses, setExpenses] = useState<any[]>([]);

//   useEffect(() => {
//   const loadData = async () => {
//     const userId = await AsyncStorage.getItem('userId');
//     db.transaction(tx => {
//       tx.executeSql(
//         'SELECT * FROM expenses WHERE user_id = ?',
//         [userId],
//         (_, result) => {
//           const data: any[] = [];
//           for (let i = 0; i < result.rows.length; i++) {
//             data.push(result.rows.item(i));
//           }
//           setExpenses(data);
//         },
//         (_, error) => {
//           console.log('Select error:', error);
//           return true;
//         }
//       );
//     });
//   };
//   loadData();
// }, []);

//   const groupByType = expenses.reduce((acc, curr) => {
//     const month = new Date(curr.createdAt).getMonth();
//     if (!acc[curr.type]) acc[curr.type] = [];
//     acc[curr.type][month] = (acc[curr.type][month] || 0) + curr.amount;
//     return acc;
//   }, {} as { [key: string]: number[] });

//   const linearRegression = (data: number[]) => {
//     const n = data.length;
//     const x = Array.from({ length: n }, (_, i) => i + 1);
//     const sumX = x.reduce((a, b) => a + b, 0);
//     const sumY = data.reduce((a, b) => a + b, 0);
//     const sumXY = data.reduce((acc, y, i) => acc + y * x[i], 0);
//     const sumX2 = x.reduce((acc, xi) => acc + xi * xi, 0);
//     const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
//     const intercept = (sumY - slope * sumX) / n;
//     return slope * (n + 1) + intercept;
//   };

//   const entries = Object.entries(groupByType) as [string, number[]][];

//   const predictionData = entries.map(([type, values], i) => {
//     const clean = values.filter((v: number) => typeof v === 'number');
//     const predicted = clean.length ? linearRegression(clean) : 0;
//     return {
//       name: type,
//       amount: predicted,
//       color: ['#3B82F6', '#FBBF24', '#F472B6', '#10B981'][i % 4],
//       legendFontColor: '#7F7F7F',
//       legendFontSize: 14,
//     };
//   }
// );

//   const total = predictionData.reduce((sum, item) => sum + item.amount, 0).toFixed(2);

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.title}>Next Month's Prediction</Text>
//       <Text style={styles.total}>${total}</Text>
//       <Text style={styles.note}>Based on previous months</Text>

//       <PieChart
//         data={predictionData}
//         width={screenWidth - 40}
//         height={220}
//         chartConfig={{ color: () => '#000' }}
//         accessor="amount"
//         backgroundColor="transparent"
//         paddingLeft="15"
//         absolute
//       />

//       {predictionData.map((item, i) => (
//         <Text key={i} style={styles.label}>
//           {item.name}: ${item.amount.toFixed(2)}
//         </Text>
//       ))}
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { padding: 20 },
//   title: { fontSize: 22, fontWeight: 'bold' },
//   total: { fontSize: 32, marginVertical: 10 },
//   note: { marginBottom: 20, fontSize: 12, color: 'gray' },
//   label: { fontSize: 16, marginTop: 4 },
// });

// import React, { useEffect, useState } from 'react'; //tanggal 29/05/2025
// import { View, Text, StyleSheet, ScrollView } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import db from '../db/db';
// import { PieChart } from 'react-native-chart-kit';
// import { Dimensions } from 'react-native';

// const screenWidth = Dimensions.get('window').width;

// export function PredictionScreen() {
//   const [expenses, setExpenses] = useState<any[]>([]);

//   useEffect(() => {
//     const loadData = async () => {
//       const userId = await AsyncStorage.getItem('userId');
//       if (!userId) {
//         console.log('User ID not found');
//         return;
//       }

//       db.transaction(tx => {
//         tx.executeSql(
//           'SELECT * FROM expenses WHERE user_id = ?',
//           [userId],
//           (_, result) => {
//             const data: any[] = [];
//             for (let i = 0; i < result.rows.length; i++) {
//               data.push(result.rows.item(i));
//             }
//             setExpenses(data);
//           },
//           (_, error) => {
//             console.log('Select error:', error);
//             return true;
//           }
//         );
//       });
//     };

//     loadData();
//   }, []);

//   // Grouping per kategori & bulan
//   const groupByType = expenses.reduce((acc, curr) => {
//     const month = new Date(curr.createdAt).getMonth();
//     if (!acc[curr.type]) acc[curr.type] = [];
//     acc[curr.type][month] = (acc[curr.type][month] || 0) + curr.amount;
//     return acc;
//   }, {} as { [key: string]: number[] });

//   // Regresi linier
//   const linearRegression = (data: number[]) => {
//     const n = data.length;
//     if (n === 0) return 0;
//     const x = Array.from({ length: n }, (_, i) => i + 1);
//     const sumX = x.reduce((a, b) => a + b, 0);
//     const sumY = data.reduce((a, b) => a + b, 0);
//     const sumXY = data.reduce((acc, y, i) => acc + y * x[i], 0);
//     const sumX2 = x.reduce((acc, xi) => acc + xi * xi, 0);
//     const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
//     const intercept = (sumY - slope * sumX) / n;
//     const prediction = slope * (n + 1) + intercept;
//     return prediction < 0 ? 0 : prediction; // Jangan biarkan nilai negatif
//   };

//   const entries = Object.entries(groupByType) as [string, number[]][];

//   const predictionData = entries.map(([type, values], i) => {
//     const clean = values.filter((v: number) => typeof v === 'number');
//     const predicted = clean.length ? linearRegression(clean) : 0;
//     return {
//       name: type,
//       amount: predicted,
//       color: ['#3B82F6', '#FBBF24', '#F472B6', '#10B981'][i % 4],
//       legendFontColor: '#7F7F7F',
//       legendFontSize: 14,
//     };
//   });

//   const total = predictionData.reduce((sum, item) => sum + item.amount, 0).toFixed(2);

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.title}>Next Month's Prediction</Text>
//       <Text style={styles.total}>${total}</Text>
//       <Text style={styles.note}>Based on previous months</Text>

//       {predictionData.length === 0 ? (
//         <Text style={{ marginTop: 20, color: 'gray' }}>No data available for prediction</Text>
//       ) : (
//         <>
//           <PieChart
//             data={predictionData}
//             width={screenWidth - 40}
//             height={220}
//             chartConfig={{ color: () => '#000' }}
//             accessor="amount"
//             backgroundColor="transparent"
//             paddingLeft="15"
//             absolute
//           />

//           {predictionData.map((item, i) => (
//             <Text key={i} style={styles.label}>
//               {item.name}: ${item.amount.toFixed(2)}
//             </Text>
//           ))}
//         </>
//       )}
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { padding: 20 },
//   title: { fontSize: 22, fontWeight: 'bold' },
//   total: { fontSize: 32, marginVertical: 10 },
//   note: { marginBottom: 20, fontSize: 12, color: 'gray' },
//   label: { fontSize: 16, marginTop: 4 },
// });


// Per Tanggal 31 Mei 
// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   Dimensions,
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import db from '../db/db';
// import { BarChart, PieChart } from 'react-native-chart-kit';
// import RNFS from 'react-native-fs';
// import XLSX from 'xlsx';
// import Share from 'react-native-share';
// import RNHTMLtoPDF from 'react-native-html-to-pdf';

// const screenWidth = Dimensions.get('window').width;

// export function PredictionScreen() {
//   const [activeTab, setActiveTab] = useState<'Prediction' | 'Analisis'>('Prediction');
//   const [expenses, setExpenses] = useState<any[]>([]);

//   useEffect(() => {
//     const loadData = async () => {
//       const userId = await AsyncStorage.getItem('userId');
//       if (!userId) return;

//       db.transaction(tx => {
//         tx.executeSql(
//           'SELECT * FROM expenses WHERE user_id = ?',
//           [userId],
//           (_, result) => {
//             const data: any[] = [];
//             for (let i = 0; i < result.rows.length; i++) {
//               data.push(result.rows.item(i));
//             }
//             setExpenses(data);
//           },
//           (_, error) => {
//             console.log('Select error:', error);
//             return true;
//           }
//         );
//       });
//     };

//     loadData();
//   }, []);

//   const linearRegression = (data: number[]): number => {
//     const n = data.length;
//     if (n === 0) return 0;
//     const x = Array.from({ length: n }, (_, i) => i + 1);
//     const sumX = x.reduce((a, b) => a + b, 0);
//     const sumY = data.reduce((a, b) => a + b, 0);
//     const sumXY = data.reduce((acc, y, i) => acc + y * x[i], 0);
//     const sumX2 = x.reduce((acc, xi) => acc + xi * xi, 0);
//     const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX || 1);
//     const intercept = (sumY - slope * sumX) / n;
//     const prediction = slope * (n + 1) + intercept;
//     return isNaN(prediction) || prediction < 0 ? 0 : prediction;
//   };

//   const getWeekRange = (dateStr: string) => {
//     const day = new Date(dateStr).getDate();
//     if (day <= 7) return '1-7';
//     if (day <= 14) return '8-14';
//     if (day <= 21) return '15-21';
//     return '22-31';
//   };

//   const weeklyTotals: { [week: string]: number[] } = {};
//   expenses.forEach((e) => {
//     const week = getWeekRange(e.createdAt);
//     if (!weeklyTotals[week]) weeklyTotals[week] = [];
//     weeklyTotals[week].push(e.amount);
//   });

//   const labels: string[] = ['1-7', '8-14', '15-21', '22-31'];
//   const weeklySums: number[] = labels.map((week) => {
//     return (weeklyTotals[week] || []).reduce((sum, val) => sum + val, 0);
//   });

//   const predictedTotal = linearRegression(weeklySums);

//   const groupedByCategory = expenses.reduce((acc, curr) => {
//     if (!acc[curr.category]) acc[curr.category] = 0;
//     acc[curr.category] += curr.amount;
//     return acc;
//   }, {} as { [key: string]: number });

//   const categoryColors: { [key: string]: string } = {
//     'Makanan & Minuman': '#F97316', Groceries: '#22C55E', Shopping: '#EC4899',
//     'Top Up E-Money': '#3B82F6', Transportasi: '#92400E', Hiburan: '#A21CAF',
//     Liburan: '#8B5CF6', Tagihan: '#6D28D9', Kesehatan: '#EF4444', Sosial: '#84CC16',
//     Asuransi: '#0F766E', Investasi: '#1D4ED8', Edukasi: '#14B8A6', Keluarga: '#DC2626',
//     Pinjaman: '#9333EA', 'Biaya-biaya': '#EA580C', 'Uang Keluar': '#FACC15'
//   };

//   const pieChartData = Object.entries(groupedByCategory).map(([category, amount]) => ({
//     name: category,
//     amount,
//     color: categoryColors[category] || '#D1D5DB',
//     legendFontColor: '#374151',
//     legendFontSize: 13,
//   }));

//   const exportToExcel = async () => {
//     const ws = XLSX.utils.json_to_sheet(expenses);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, 'Expenses');
//     const wbout = XLSX.write(wb, { type: 'binary', bookType: 'xlsx' });
//     const file = `${RNFS.DownloadDirectoryPath}/prediksi_${Date.now()}.xlsx`;
//     await RNFS.writeFile(file, wbout, 'ascii');
//     await Share.open({ url: 'file://' + file });
//   };

//   const exportToPDF = async () => {
//     const htmlContent = `
//       <h1>Prediksi Bulan Depan</h1>
//       <p>Total: Rp ${predictedTotal.toLocaleString('id-ID')}</p>
//       <h2>Riwayat Transaksi:</h2>
//       <ul>
//         ${expenses.map(e => `<li>${e.type} - Rp ${e.amount.toLocaleString('id-ID')}</li>`).join('')}
//       </ul>
//     `;
//     const options = {
//       html: htmlContent,
//       fileName: `prediksi_${Date.now()}`,
//       directory: 'Documents',
//     };
//     const pdf = await RNHTMLtoPDF.convert(options);
//     await Share.open({ url: 'file://' + pdf.filePath });
//   };

//   return (
//     <View style={{ flex: 1 }}>
//       <View style={styles.tabContainer}>
//         <TouchableOpacity
//           style={[styles.tab, activeTab === 'Prediction' && styles.activeTab]}
//           onPress={() => setActiveTab('Prediction')}
//         >
//           <Text style={[styles.tabText, activeTab === 'Prediction' && styles.activeTabText]}>Prediction</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={[styles.tab, activeTab === 'Analisis' && styles.activeTab]}
//           onPress={() => setActiveTab('Analisis')}
//         >
//           <Text style={[styles.tabText, activeTab === 'Analisis' && styles.activeTabText]}>Analisis</Text>
//         </TouchableOpacity>
//       </View>

//       <ScrollView contentContainerStyle={styles.container}>
//         {activeTab === 'Prediction' ? (
//           <>
//             <Text style={styles.title}>Prediksi Bulan Depan</Text>
//             <Text style={styles.total}>Rp {predictedTotal.toLocaleString('id-ID')}</Text>
//             <Text style={styles.note}>Berdasarkan histori bulan sebelumnya</Text>
//             <BarChart
//               data={{ labels, datasets: [{ data: weeklySums }] }}
//               width={screenWidth - 40}
//               height={220}
//               fromZero
//               yAxisLabel="Rp "
//               yAxisSuffix=""
//               chartConfig={{
//                 backgroundGradientFrom: '#fff',
//                 backgroundGradientTo: '#fff',
//                 color: () => '#3B82F6',
//                 labelColor: () => '#000',
//                 decimalPlaces: 0,
//                 propsForBackgroundLines: { stroke: '#E5E7EB' },
//               }}
//               style={{ borderRadius: 16, marginVertical: 10, overflow: 'hidden' }}
//             />
//             <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
//               <TouchableOpacity style={[styles.exportButton, { backgroundColor: '#1E3A8A' }]} onPress={exportToPDF}>
//                 <Text style={{ color: '#fff' }}>Export PDF</Text>
//               </TouchableOpacity>
//               <TouchableOpacity style={[styles.exportButton, { backgroundColor: '#059669' }]} onPress={exportToExcel}>
//                 <Text style={{ color: '#fff' }}>Export Excel</Text>
//               </TouchableOpacity>
//             </View>
//             <Text style={[styles.title, { fontSize: 18, marginTop: 20 }]}>Riwayat Transaksi</Text>
//             {expenses.map((item, index) => (
//               <View style={styles.transactionItem} key={index.toString()}>
//                 <Text style={styles.transactionTitle}>📌 {item.type}</Text>
//                 <Text style={styles.transactionAmount}>-Rp {item.amount.toLocaleString('id-ID')}</Text>
//                 <Text style={styles.transactionDate}>{new Date(item.createdAt).toLocaleString('id-ID')}</Text>
//               </View>
//             ))}
//           </>
//         ) : (
//           <>
//             <Text style={styles.title}>Analisis Pengeluaran</Text>
//             <PieChart
//               data={pieChartData}
//               width={screenWidth - 40}
//               height={220}
//               chartConfig={{ color: () => '#000' }}
//               accessor="amount"
//               backgroundColor="transparent"
//               paddingLeft="15"
//               absolute
//             />
//           </>
//         )}
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { padding: 20 },
//   title: { fontSize: 22, fontWeight: 'bold', marginBottom: 5 },
//   total: { fontSize: 32, marginVertical: 10 },
//   note: { marginBottom: 20, fontSize: 12, color: 'gray' },
//   transactionItem: {
//     backgroundColor: '#f9f9f9', padding: 12, borderRadius: 8, marginVertical: 6,
//   },
//   transactionTitle: { fontWeight: 'bold', fontSize: 14 },
//   transactionAmount: { fontSize: 14, color: '#ef4444', marginVertical: 2 },
//   transactionDate: { fontSize: 12, color: 'gray' },
//   tabContainer: {
//     flexDirection: 'row', justifyContent: 'space-around', marginTop: 20,
//     backgroundColor: '#E5E7EB', borderRadius: 10, marginHorizontal: 20,
//   },
//   tab: { paddingVertical: 10, flex: 1, alignItems: 'center', borderRadius: 10 },
//   activeTab: { backgroundColor: '#3B82F6' },
//   tabText: { color: '#374151', fontWeight: '600' },
//   activeTabText: { color: '#FFFFFF' },
//   exportButton: {
//     flex: 1,
//     padding: 12,
//     borderRadius: 8,
//     alignItems: 'center',
//   }
// });

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import db from '../db/db';
import { BarChart, PieChart } from 'react-native-chart-kit';
import RNFS from 'react-native-fs';
import XLSX from 'xlsx';
import Share from 'react-native-share';
import RNHTMLtoPDF from 'react-native-html-to-pdf';

const screenWidth = Dimensions.get('window').width;

export function PredictionScreen() {
  const [activeTab, setActiveTab] = useState<'Prediction' | 'Analisis'>('Prediction');
  const [expenses, setExpenses] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) return;

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

  const linearRegression = (data: number[]): number => {
    const n = data.length;
    if (n === 0) return 0;
    const x = Array.from({ length: n }, (_, i) => i + 1);
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = data.reduce((a, b) => a + b, 0);
    const sumXY = data.reduce((acc, y, i) => acc + y * x[i], 0);
    const sumX2 = x.reduce((acc, xi) => acc + xi * xi, 0);
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX || 1);
    const intercept = (sumY - slope * sumX) / n;
    const prediction = slope * (n + 1) + intercept;
    return isNaN(prediction) || prediction < 0 ? 0 : prediction;
  };

  const getWeekRange = (dateStr: string) => {
    const day = new Date(dateStr).getDate();
    if (day <= 7) return '1-7';
    if (day <= 14) return '8-14';
    if (day <= 21) return '15-21';
    return '22-31';
  };

  const weeklyTotals: { [week: string]: number[] } = {};
  expenses.forEach((e) => {
    const week = getWeekRange(e.createdAt);
    if (!weeklyTotals[week]) weeklyTotals[week] = [];
    weeklyTotals[week].push(e.amount);
  });

  const labels: string[] = ['1-7', '8-14', '15-21', '22-31'];
  const weeklySums: number[] = labels.map((week) => {
    return (weeklyTotals[week] || []).reduce((sum, val) => sum + val, 0);
  });

  const predictedTotal = linearRegression(weeklySums);

  const groupedByCategory = expenses.reduce((acc, curr) => {
    if (!acc[curr.category]) acc[curr.category] = 0;
    acc[curr.category] += curr.amount;
    return acc;
  }, {} as { [key: string]: number });

  const categoryColors: { [key: string]: string } = {
    'Makanan & Minuman': '#F97316', Groceries: '#22C55E', Shopping: '#EC4899',
    'Top Up E-Money': '#3B82F6', Transportasi: '#92400E', Hiburan: '#A21CAF',
    Liburan: '#8B5CF6', Tagihan: '#6D28D9', Kesehatan: '#EF4444', Sosial: '#84CC16',
    Asuransi: '#0F766E', Investasi: '#1D4ED8', Edukasi: '#14B8A6', Keluarga: '#DC2626',
    Pinjaman: '#9333EA', 'Biaya-biaya': '#EA580C', 'Uang Keluar': '#FACC15'
  };

  const pieChartData = Object.entries(groupedByCategory).map(([category, amount]) => ({
    name: category,
    amount,
    color: categoryColors[category] || '#D1D5DB',
    legendFontColor: '#374151',
    legendFontSize: 13,
  }));

  const exportToExcel = async () => {
    const ws = XLSX.utils.json_to_sheet(expenses);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Expenses');
    const wbout = XLSX.write(wb, { type: 'binary', bookType: 'xlsx' });
    const file = `${RNFS.DownloadDirectoryPath}/prediksi_${Date.now()}.xlsx`;
    await RNFS.writeFile(file, wbout, 'ascii');
    await Share.open({ url: 'file://' + file });
  };

  const exportToPDF = async () => {
    const htmlContent = `
      <h1>Prediksi Bulan Depan</h1>
      <p>Total: Rp ${predictedTotal.toLocaleString('id-ID')}</p>
      <h2>Riwayat Transaksi:</h2>
      <ul>
        ${expenses.map(e => `<li>${e.type} - Rp ${e.amount.toLocaleString('id-ID')}</li>`).join('')}
      </ul>
    `;
    const options = {
      html: htmlContent,
      fileName: `prediksi_${Date.now()}`,
      directory: 'Documents',
    };
    const pdf = await RNHTMLtoPDF.convert(options);
    await Share.open({ url: 'file://' + pdf.filePath });
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Prediction' && styles.activeTab]}
          onPress={() => setActiveTab('Prediction')}
        >
          <Text style={[styles.tabText, activeTab === 'Prediction' && styles.activeTabText]}>Prediction</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Analisis' && styles.activeTab]}
          onPress={() => setActiveTab('Analisis')}
        >
          <Text style={[styles.tabText, activeTab === 'Analisis' && styles.activeTabText]}>Analisis</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {activeTab === 'Prediction' ? (
          <>
            <Text style={styles.title}>Prediksi Bulan Depan</Text>
            <Text style={styles.total}>Rp {predictedTotal.toLocaleString('id-ID')}</Text>
            <Text style={styles.note}>Berdasarkan histori bulan sebelumnya</Text>
            <BarChart
              data={{ labels, datasets: [{ data: weeklySums }] }}
              width={screenWidth - 40}
              height={220}
              fromZero
              yAxisLabel="Rp "
              yAxisSuffix=""
              chartConfig={{
                backgroundGradientFrom: '#fff',
                backgroundGradientTo: '#fff',
                color: () => '#3B82F6',
                labelColor: () => '#000',
                decimalPlaces: 0,
                propsForBackgroundLines: { stroke: '#E5E7EB' },
              }}
              style={{ borderRadius: 16, marginVertical: 10, overflow: 'hidden' }}
            />
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
              <TouchableOpacity style={[styles.exportButton, { backgroundColor: '#1E3A8A' }]} onPress={exportToPDF}>
                <Text style={{ color: '#fff' }}>Export PDF</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.exportButton, { backgroundColor: '#059669' }]} onPress={exportToExcel}>
                <Text style={{ color: '#fff' }}>Export Excel</Text>
              </TouchableOpacity>
            </View>
            <Text style={[styles.title, { fontSize: 18, marginTop: 20 }]}>Riwayat Transaksi</Text>
            <FlatList
              data={expenses}
              keyExtractor={(_, index) => index.toString()}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <View style={styles.transactionItem}>
                  <Text style={styles.transactionTitle}>📌 {item.type}</Text>
                  <Text style={styles.transactionAmount}>-Rp {item.amount.toLocaleString('id-ID')}</Text>
                  <Text style={styles.transactionDate}>{new Date(item.createdAt).toLocaleString('id-ID')}</Text>
                </View>
              )}
            />
          </>
        ) : (
          <>
            <Text style={styles.title}>Analisis Pengeluaran</Text>
            <PieChart
              data={pieChartData}
              width={screenWidth - 40}
              height={220}
              chartConfig={{ color: () => '#000' }}
              accessor="amount"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 5 },
  total: { fontSize: 32, marginVertical: 10 },
  note: { marginBottom: 20, fontSize: 12, color: 'gray' },
  transactionItem: {
    backgroundColor: '#f9f9f9', padding: 12, borderRadius: 8, marginVertical: 6,
  },
  transactionTitle: { fontWeight: 'bold', fontSize: 14 },
  transactionAmount: { fontSize: 14, color: '#ef4444', marginVertical: 2 },
  transactionDate: { fontSize: 12, color: 'gray' },
  tabContainer: {
    flexDirection: 'row', justifyContent: 'space-around', marginTop: 20,
    backgroundColor: '#E5E7EB', borderRadius: 10, marginHorizontal: 20,
  },
  tab: { paddingVertical: 10, flex: 1, alignItems: 'center', borderRadius: 10 },
  activeTab: { backgroundColor: '#3B82F6' },
  tabText: { color: '#374151', fontWeight: '600' },
  activeTabText: { color: '#FFFFFF' },
  exportButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
});









