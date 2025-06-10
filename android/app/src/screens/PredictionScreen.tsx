import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
  Alert,
  SafeAreaView,
  FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import db from '../db/db';
import RNFS from 'react-native-fs';
import XLSX from 'xlsx';
import Share from 'react-native-share';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import { BarChart, PieChart } from 'react-native-gifted-charts';

// Import Ikon SVG
import GroceriesIcon from '../components/icons/GroceriesIcon';
import TransportIcon from '../components/icons/TransportIcon';
import EntertainmentIcon from '../components/icons/EntertainmentIcon';
import BillsIcon from '../components/icons/BillsIcon';
import WalletIcon from '../components/icons/WalletIcon';
import DocumentIcon from '../components/icons/DocumentIcon';
import SearchIcon from '../components/icons/SearchIcon';
import CalendarIcon from '../components/icons/CalendarIcon';
import UserIcon from '../components/icons/UserIcon';
import ExcelIcon from '../components/icons/ExcelIcon';

const categoryIcons: { [key: string]: React.FC<any> } = {
    'Makanan': GroceriesIcon,
    'Transportasi': TransportIcon,
    'Hiburan': EntertainmentIcon,
    'Tagihan': BillsIcon,
    'Default': BillsIcon,
};

export function PredictionScreen({ navigation }: any) {
  const [activeTab, setActiveTab] = useState<'Prediction' | 'Analisis'>('Prediction');
  const [expenses, setExpenses] = useState<any[]>([]);
  const [predictedTotal, setPredictedTotal] = useState(0);

  const requestStoragePermission = async () => {
    if (Platform.OS === 'android' && Platform.Version < 29) {
      try {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) { return false; }
    }
    return true;
  };

  const linearRegression = (data: { x: number; y: number }[]) => {
    if (data.length < 2) return { slope: 0, intercept: data.length === 1 ? data[0].y : 0 };
    const n = data.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
    for (const point of data) {
      sumX += point.x;
      sumY += point.y;
      sumXY += point.x * point.y;
      sumX2 += point.x * point.x;
    }
    const denominator = (n * sumX2 - sumX * sumX);
    if (denominator === 0) return { slope: 0, intercept: sumY / n };
    const slope = (n * sumXY - sumX * sumY) / denominator;
    const intercept = (sumY - slope * sumX) / n;
    return { slope, intercept };
  };

  useEffect(() => {
    const loadData = async () => {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) return;
      db.transaction(tx => {
        tx.executeSql('SELECT * FROM expenses WHERE user_id = ? AND type != "Pemasukan" ORDER BY createdAt ASC', [parseInt(userId)],
          (_, result) => {
            const data: any[] = [];
            for (let i = 0; i < result.rows.length; i++) data.push(result.rows.item(i));
            setExpenses(data);
            const expenseData = data.map((e, index) => ({ x: index + 1, y: e.amount }));
            const { slope, intercept } = linearRegression(expenseData);
            const nextPrediction = slope * (expenseData.length + 1) + intercept;
            setPredictedTotal(isNaN(nextPrediction) || nextPrediction < 0 ? 0 : nextPrediction);
          });
      });
    };
    loadData();
  }, []);
  
  // FUNGSI YANG HILANG SEBELUMNYA - SEKARANG SUDAH ADA
  const handleDownload = () => {
    Alert.alert(
        "Download Report",
        "Pilih format file yang ingin Anda download:",
        [
            { text: "PDF", onPress: () => exportToPDF() },
            { text: "Excel", onPress: () => exportToExcel() },
            { text: "Batal", style: "cancel" },
        ]
    );
  }

  const exportToExcel = async () => {
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) {
        Alert.alert("Izin Ditolak", "Izin penyimpanan diperlukan untuk menyimpan file.");
        return;
    }
    const dataToExport = expenses.map(e => ({
        Tipe: e.type,
        Jumlah: e.amount,
        Tanggal: new Date(e.createdAt).toISOString(),
    }));
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Expenses');
    const wbout = XLSX.write(wb, { type: 'binary', bookType: 'xlsx' });
    const file = `${RNFS.DownloadDirectoryPath}/pengeluaran_${Date.now()}.xlsx`;
    try {
        await RNFS.writeFile(file, wbout, 'ascii');
        Alert.alert("Sukses!", `File Excel disimpan di folder Downloads.`);
        await Share.open({ url: 'file://' + file, type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    } catch(error: any) {
        if (error.message.includes("User did not share")) {
            console.log("Pengguna membatalkan dialog share.");
        } else {
            console.error("Error exporting to Excel:", error);
            Alert.alert("Gagal Ekspor", `Terjadi kesalahan: ${error.message}`);
        }
    }
  };

  const exportToPDF = async () => {
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) {
        Alert.alert("Izin Ditolak", "Izin penyimpanan diperlukan untuk menyimpan file.");
        return;
    }
    const htmlContent = `
      <html><head><style>body{font-family:sans-serif}h1,h2{color:#0D253C}table{width:100%;border-collapse:collapse}th,td{border:1px solid #ddd;padding:8px;text-align:left}th{background-color:#f2f2f2}</style></head>
      <body><h1>Laporan Pengeluaran</h1><h2>Prediksi Bulan Berikutnya</h2><p>Total Prediksi:<strong>Rp ${predictedTotal.toLocaleString('id-ID')}</strong></p><h2>Riwayat Transaksi:</h2><table><thead><tr><th>Tipe</th><th>Jumlah</th><th>Tanggal</th></tr></thead><tbody>${expenses.map((e:any)=>`<tr><td>${e.type}</td><td>Rp ${e.amount.toLocaleString('id-ID')}</td><td>${new Date(e.createdAt).toLocaleDateString('id-ID')}</td></tr>`).join('')}</tbody></table></body></html>`;
    const options = { html: htmlContent, fileName: `laporan_${Date.now()}`, directory: 'Documents' };
    try {
        const pdf = await RNHTMLtoPDF.convert(options);
        Alert.alert("Sukses!", `File PDF disimpan di: ${pdf.filePath}`);
        await Share.open({ url: 'file://' + pdf.filePath, type: 'application/pdf' });
    } catch(error: any) {
        if (error.message.includes("User did not share")) {
            console.log("Pengguna membatalkan dialog share.");
        } else {
            console.error("Error exporting to PDF:", error);
            Alert.alert("Gagal Ekspor", `Terjadi kesalahan: ${error.message}`);
        }
    }
  };

  const barChartData = expenses.map((e, i) => ({ value: e.amount, label: ['M','T','W','T','F','S','S'][i % 7], frontColor: '#0052FF' }));
  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
  const categoryData = expenses.reduce((acc, exp) => {
    if (!acc[exp.type]) acc[exp.type] = { total: 0, count: 0 };
    acc[exp.type].total += exp.amount;
    acc[exp.type].count += 1;
    return acc;
  }, {} as Record<string, { total: number, count: number }>);

  const colors = ['#0052FF', '#00C4DF', '#FFC837', '#FF82A9', '#7A4DFF'];
  const pieChartData = Object.keys(categoryData).map((key, index) => ({
    value: categoryData[key].total,
    color: colors[index % colors.length],
    label: key,
    count: categoryData[key].count,
  }));
  
  const renderRecentTransaction = ({ item }: { item: any }) => {
    const Icon = categoryIcons[item.type] || categoryIcons['Default'];
    const iconColor = pieChartData.find(d => d.label === item.type)?.color || '#A1A1A1';
    return (
        <View style={styles.transactionItem}>
          <View style={[styles.transactionIconContainer, { backgroundColor: `${iconColor}20` }]}>
              <Icon stroke={iconColor} width={28} height={28} /> 
          </View>
          <View style={styles.transactionDetails}>
            <Text style={styles.transactionTitle}>{item.type}</Text>
            <Text style={styles.transactionDate}>{new Date(item.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</Text>
          </View>
          <Text style={styles.transactionAmount}>-Rp{item.amount.toLocaleString('id-ID')}</Text>
        </View>
      );
  }

  const renderAnalysisItem = (item: typeof pieChartData[0]) => {
      const Icon = categoryIcons[item.label] || categoryIcons['Default'];
      const percentage = totalExpense > 0 ? (item.value / totalExpense) * 100 : 0;
      return (
          <View style={styles.analysisItem} key={item.label}>
              <View style={[styles.analysisIconContainer, { backgroundColor: `${item.color}30` }]}>
                  <Icon stroke={item.color} width={28} height={28} />
              </View>
              <View style={styles.analysisDetails}>
                  <Text style={styles.analysisLabel}>{item.label}</Text>
                  <Text style={styles.analysisCount}>{item.count} transaksi</Text>
              </View>
              <View style={styles.analysisAmountContainer}>
                  <Text style={styles.analysisAmount}>-Rp{item.value.toLocaleString('id-ID')}</Text>
                  <Text style={styles.analysisPercentage}>{percentage.toFixed(1)}%</Text>
              </View>
          </View>
      );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Prediction</Text>
        <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
            <View style={styles.profileIcon}>
                <UserIcon stroke="#FFFFFF" width={28} height={28}/>
            </View>
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <View style={styles.tabPillContainer}>
            <TouchableOpacity style={[styles.tabPill, activeTab === 'Prediction' && styles.activeTabPill]} onPress={() => setActiveTab('Prediction')}>
                <Text style={[styles.tabText, activeTab === 'Prediction' && styles.activeTabText]}>Prediction</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tabPill, activeTab === 'Analisis' && styles.activeTabPill]} onPress={() => setActiveTab('Analisis')}>
                <Text style={[styles.tabText, activeTab === 'Analisis' && styles.activeTabText]}>Analysis</Text>
            </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            <Text style={styles.pageTitle}>{activeTab === 'Prediction' ? 'Next Month Prediction' : 'This Month Analysis'}</Text>
            
            {activeTab === 'Prediction' ? (
                <>
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.cardTitle}>Income & Expenses</Text>
                            <View style={styles.cardIcons}>
                                <TouchableOpacity><SearchIcon stroke="#0052FF" /></TouchableOpacity>
                                <TouchableOpacity style={{marginLeft: 15}}><CalendarIcon stroke="#0052FF" /></TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.barChartWrapper}>
                            <BarChart data={barChartData} barWidth={8} spacing={35} roundedTop barBorderRadius={4} yAxisThickness={0} xAxisThickness={0} yAxisTextStyle={{color: '#858585'}}/>
                        </View>
                        <View style={styles.predictionRow}>
                            <View style={styles.predictionItem}>
                                <WalletIcon stroke="#0052FF" width={32} height={32}/>
                                <View style={styles.predictionTextContainer}>
                                    <Text style={styles.predictionLabel}>Expense</Text>
                                    <Text style={styles.predictionAmount}>Rp{predictedTotal.toLocaleString('id-ID')}</Text>
                                </View>
                            </View>
                            <TouchableOpacity style={styles.predictionItem} onPress={handleDownload}>
                                <DocumentIcon stroke="#0052FF" width={32} height={32}/>
                                <View style={styles.predictionTextContainer}>
                                    <Text style={styles.predictionLabel}>Download</Text>
                                    <Text style={styles.predictionAmount}>Report</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <Text style={styles.transactionSectionTitle}>Transaction</Text>
                    <FlatList
                        data={expenses.slice(0, 5)} 
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderRecentTransaction}
                        scrollEnabled={false}
                    />
                </>
            ) : (
                <>
                    <View style={styles.card}>
                        <View style={styles.analysisContainer}>
                            <PieChart 
                                data={pieChartData}
                                donut
                                innerRadius={50}
                                radius={80}
                                showText={false}
                                centerLabelComponent={() => (
                                    <View style={{justifyContent: 'center', alignItems: 'center'}}>
                                        <Text style={{fontSize: 12, color: '#858585'}}>Total</Text>
                                        <Text style={{fontSize: 18, fontWeight: 'bold', color: '#0D253C'}}>{`Rp${(totalExpense/1000).toFixed(0)}k`}</Text>
                                    </View>
                                )}
                            />
                            <View style={styles.analysisLegend}>
                                {pieChartData.map(item => (
                                    <View key={item.label} style={styles.legendItem}>
                                        <View style={[styles.legendDot, {backgroundColor: item.color}]} />
                                        <Text style={styles.legendText}>{item.label}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    </View>
                    {pieChartData.map(renderAnalysisItem)}
                </>
            )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#0052FF' },
    container: { flex: 1, backgroundColor: '#E6F0FF' },
    scrollContent: { paddingHorizontal: 24, paddingBottom: 40 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15, backgroundColor: '#0052FF' },
    backButton: { fontSize: 28, color: '#FFFFFF', fontWeight: 'bold' },
    headerTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' },
    profileIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.3)', justifyContent: 'center', alignItems: 'center' },
    tabPillContainer: { flexDirection: 'row', backgroundColor: '#FFFFFF', padding: 8, marginHorizontal: 24, borderRadius: 30, marginTop: 10, borderWidth: 1, borderColor: '#FFFFFF', elevation: 3 },
    tabPill: { flex: 1, paddingVertical: 10, borderRadius: 25 },
    activeTabPill: { backgroundColor: '#0052FF' },
    tabText: { textAlign: 'center', color: '#0052FF', fontWeight: 'bold', fontSize: 16 },
    activeTabText: { color: '#FFFFFF' },
    pageTitle: { fontSize: 24, fontWeight: 'bold', color: '#0D253C', marginTop: 20, marginBottom: 10 },
    card: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20, marginBottom: 20, marginTop: 10 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#0D253C' },
    cardIcons: { flexDirection: 'row' },
    barChartWrapper: { paddingVertical: 10, alignSelf: 'center' },
    predictionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, paddingTop: 20, borderTopWidth: 1, borderTopColor: '#F0F4F8' },
    predictionItem: { flexDirection: 'row', alignItems: 'center' },
    predictionTextContainer: { marginLeft: 12 },
    predictionLabel: { fontSize: 14, color: '#858585' },
    predictionAmount: { fontSize: 16, fontWeight: 'bold', color: '#0D253C' },
    transactionSectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#0D253C', marginTop: 10, marginBottom: 15 },
    transactionItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', padding: 15, borderRadius: 20, marginBottom: 15, elevation: 2 },
    transactionIconContainer: { width: 50, height: 50, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
    transactionDetails: { flex: 1 },
    transactionTitle: { fontSize: 16, fontWeight: 'bold', color: '#0D253C' },
    transactionDate: { fontSize: 14, color: '#858585', marginTop: 4 },
    transactionAmount: { fontSize: 16, fontWeight: 'bold', color: '#FF4545' },
    analysisContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 20 },
    analysisLegend: { flex: 1, marginLeft: 20 },
    legendItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    legendDot: { width: 12, height: 12, borderRadius: 6, marginRight: 8 },
    legendText: { fontSize: 14, color: '#0D253C' },
    analysisItem: { flexDirection: 'row', backgroundColor: '#FFFFFF', borderRadius: 20, padding: 15, marginBottom: 15, alignItems: 'center', elevation: 2 },
    analysisIconContainer: { width: 50, height: 50, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
    analysisDetails: { flex: 1 },
    analysisLabel: { fontSize: 16, fontWeight: 'bold', color: '#0D253C' },
    analysisCount: { fontSize: 12, color: '#858585', marginTop: 2 },
    analysisAmountContainer: { alignItems: 'flex-end' },
    analysisAmount: { fontSize: 16, fontWeight: 'bold', color: '#0D253C' },
    analysisPercentage: { fontSize: 12, color: '#858585', marginTop: 2 },
});