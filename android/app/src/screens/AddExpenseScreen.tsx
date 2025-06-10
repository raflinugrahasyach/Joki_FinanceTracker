import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  SafeAreaView,
  Modal,
  FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import db from '../db/db';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

// Import Ikon SVG
import HomeIcon from '../components/icons/HomeIcon';
import PlusIcon from '../components/icons/PlusIcon';
import ChartIcon from '../components/icons/ChartIcon';
import CalendarIcon from '../components/icons/CalendarIcon';
import DownArrowIcon from '../components/icons/DownArrowIcon';
import GroceriesIcon from '../components/icons/GroceriesIcon';
import TransportIcon from '../components/icons/TransportIcon';
import EntertainmentIcon from '../components/icons/EntertainmentIcon';
import BillsIcon from '../components/icons/BillsIcon';
import HealthIcon from '../components/icons/HealthIcon';
import EducationIcon from '../components/icons/EducationIcon';

const categories = [
    { name: 'Makanan', icon: GroceriesIcon, color: '#FFC837' },
    { name: 'Transportasi', icon: TransportIcon, color: '#00C4DF' },
    { name: 'Hiburan', icon: EntertainmentIcon, color: '#FF82A9' },
    { name: 'Tagihan', icon: BillsIcon, color: '#7A4DFF' },
    { name: 'Kesehatan', icon: HealthIcon, color: '#34D399' },
    { name: 'Pendidikan', icon: EducationIcon, color: '#8B5CF6' },
];

export function AddExpenseScreen({ navigation }: any) {
  const [amount, setAmount] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<{name: string, icon: React.FC<any>, color: string} | null>(null);
  const [date, setDate] = useState(new Date());
  
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isCategoryModalVisible, setCategoryModalVisible] = useState(false);

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
        setDate(selectedDate);
    }
  };
  
  const handleAmountChange = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, '');
    if (numericValue === '') {
        setAmount('');
        return;
    }
    const formattedValue = 'Rp ' + parseInt(numericValue, 10).toLocaleString('id-ID');
    setAmount(formattedValue);
  };

  const handleSave = async () => {
    const numericAmount = parseFloat(amount.replace(/[^0-9]/g, ''));
    if (isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert('Input Tidak Valid', 'Mohon masukkan jumlah yang benar.');
      return;
    }
    if (!category || !title.trim()) {
      Alert.alert('Input Tidak Valid', 'Kategori dan Judul Pengeluaran wajib diisi.');
      return;
    }

    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        Alert.alert('Error', 'User tidak ditemukan. Silakan login ulang.');
        navigation.replace('Login');
        return;
      }
      
      // --- PERBAIKAN DI SINI ---
      // Perintah INSERT sekarang mengirimkan semua 6 kolom sesuai skema baru
      db.transaction((tx) => {
        tx.executeSql(
          'INSERT INTO expenses (user_id, amount, type, createdAt, title, description) VALUES (?, ?, ?, ?, ?, ?)',
          [parseInt(userId, 10), numericAmount, category.name, date.toISOString(), title, description],
          () => {
            Alert.alert('Sukses', 'Pengeluaran berhasil disimpan!');
            navigation.goBack();
          },
          (_, error) => {
            // Log detail error ke konsol Metro
            console.log('Gagal menyimpan ke DB:', error);
            Alert.alert('Gagal', 'Gagal menyimpan pengeluaran.');
            return true;
          }
        );
      });
    } catch (error) {
      console.log('System error:', error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={styles.backButton}>←</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Add Expenses</Text>
            <View style={{width: 28}} />
        </View>

        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
            <View style={styles.form}>
                <Text style={styles.label}>Date</Text>
                <TouchableOpacity style={styles.inputContainer} onPress={() => setShowDatePicker(true)}>
                    <Text style={styles.inputTextValue}>{date.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</Text>
                    <CalendarIcon stroke="#0D253C" width={24} height={24} />
                </TouchableOpacity>
                {showDatePicker && (
                    <DateTimePicker
                        value={date}
                        mode="date"
                        display="default"
                        onChange={onDateChange}
                    />
                )}

                <Text style={styles.label}>Category</Text>
                <TouchableOpacity style={styles.inputContainer} onPress={() => setCategoryModalVisible(true)}>
                    <Text style={styles.inputTextValue}>{category ? category.name : 'Pilih kategori'}</Text>
                    <DownArrowIcon stroke="#0D253C" width={24} height={24} />
                </TouchableOpacity>

                <Text style={styles.label}>Amount</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Rp 0"
                        placeholderTextColor="#A1A1A1"
                        keyboardType="numeric"
                        value={amount}
                        onChangeText={handleAmountChange}
                    />
                </View>

                <Text style={styles.label}>Expense Title</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Contoh: Makan siang"
                        placeholderTextColor="#A1A1A1"
                        value={title}
                        onChangeText={setTitle}
                    />
                </View>

                <Text style={styles.label}>Description</Text>
                <View style={[styles.inputContainer, styles.descriptionContainer]}>
                    <TextInput
                        style={[styles.input, styles.descriptionInput]}
                        placeholder="Deskripsi tambahan (opsional)"
                        placeholderTextColor="#A1A1A1"
                        multiline
                        value={description}
                        onChangeText={setDescription}
                    />
                </View>

                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
        
        <View style={styles.bottomNav}>
            <TouchableOpacity style={styles.navButtonActive}>
                <PlusIcon stroke="#FFFFFF"/>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Home')}>
                <HomeIcon stroke="#A1A1A1"/>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Prediction')}>
                <ChartIcon stroke="#A1A1A1"/>
            </TouchableOpacity>
        </View>

        <Modal
            animationType="slide"
            transparent={true}
            visible={isCategoryModalVisible}
            onRequestClose={() => setCategoryModalVisible(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Pilih Kategori</Text>
                    <FlatList
                        data={categories}
                        numColumns={3}
                        keyExtractor={(item) => item.name}
                        renderItem={({ item }) => {
                            const Icon = item.icon;
                            return (
                                <TouchableOpacity 
                                    style={styles.categoryItem} 
                                    onPress={() => {
                                        setCategory(item);
                                        setCategoryModalVisible(false);
                                    }}
                                >
                                    <View style={[styles.categoryIconContainer, {backgroundColor: `${item.color}30`}]}>
                                        <Icon stroke={item.color} width={32} height={32}/>
                                    </View>
                                    <Text style={styles.categoryName}>{item.name}</Text>
                                </TouchableOpacity>
                            )
                        }}
                    />
                    <TouchableOpacity style={styles.closeButton} onPress={() => setCategoryModalVisible(false)}>
                        <Text style={styles.closeButtonText}>Tutup</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#0052FF' },
    header: { backgroundColor: '#0052FF', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15, paddingTop: 40 },
    backButton: { fontSize: 28, color: '#FFFFFF', fontWeight: 'bold' },
    headerTitle: { color: '#FFFFFF', fontSize: 22, fontWeight: 'bold' },
    container: { flex: 1, backgroundColor: '#0052FF' },
    scrollContent: { flexGrow: 1, backgroundColor: '#E6F0FF', borderTopLeftRadius: 40, borderTopRightRadius: 40, padding: 24 },
    form: { paddingBottom: 120 },
    label: { fontSize: 16, color: '#0D253C', fontWeight: '600', marginBottom: 8, marginTop: 15 },
    inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 15, paddingHorizontal: 20, minHeight: 55 },
    input: { flex: 1, paddingVertical: 15, fontSize: 16, color: '#0D253C' },
    inputTextValue: { flex: 1, paddingVertical: 15, fontSize: 16, color: '#0D253C' },
    descriptionContainer: { height: 120, alignItems: 'flex-start', },
    descriptionInput: { textAlignVertical: 'top', height: '100%', },
    saveButton: { backgroundColor: '#0052FF', paddingVertical: 18, borderRadius: 15, alignItems: 'center', marginTop: 30 },
    saveButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
    bottomNav: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', backgroundColor: '#FFFFFF', paddingVertical: 10, position: 'absolute', bottom: 0, left: 0, right: 0, borderTopLeftRadius: 30, borderTopRightRadius: 30, elevation: 10 },
    navButton: { alignItems: 'center', justifyContent: 'center', padding: 10 },
    navButtonActive: { backgroundColor: '#0052FF', width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginTop: -35, elevation: 5 },
    modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
    modalContainer: { backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '60%' },
    modalTitle: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
    categoryItem: { flex: 1, alignItems: 'center', margin: 10, maxWidth: '30%' },
    categoryIconContainer: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
    categoryName: { fontSize: 14, textAlign: 'center' },
    closeButton: { backgroundColor: '#E6F0FF', padding: 15, borderRadius: 15, alignItems: 'center', marginTop: 20 },
    closeButtonText: { color: '#0052FF', fontWeight: 'bold', fontSize: 16 },
});