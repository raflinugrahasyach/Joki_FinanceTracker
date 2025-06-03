// // import React, { useState } from 'react';
// // import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
// // import db from '../db';

// // export default function AddExpenseScreen({ navigation }) {
// //   const [amount, setAmount] = useState('');
// //   const [type, setType] = useState('');

// //   const handleAdd = () => {
// //     const numericAmount = parseFloat(amount);
// //     if (!isNaN(numericAmount) && type) {
// //       const month = new Date().getMonth() + 1;
// //       const createdAt = new Date().toISOString();
// //       db.transaction(tx => {
// //         tx.executeSql(
// //           'INSERT INTO expenses (amount, month, type, createdAt) VALUES (?, ?, ?, ?)',
// //           [numericAmount, month, type, createdAt],
// //           () => navigation.goBack()
// //         );
// //       });
// //     }
// //   };

// //   return (
// //     <View style={styles.container}>
// //       <Text style={styles.title}>Add Expense</Text>
// //       <TextInput
// //         placeholder="Amount"
// //         value={amount}
// //         onChangeText={setAmount}
// //         keyboardType="numeric"
// //         style={styles.input}
// //       />
// //       <TextInput
// //         placeholder="Description"
// //         value={type}
// //         onChangeText={setType}
// //         style={styles.input}
// //       />
// //       <Button title="Add Expense" onPress={handleAdd} />
// //     </View>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: { padding: 20 },
// //   title: { fontSize: 22, marginBottom: 10 },
// //   input: { borderWidth: 1, marginBottom: 10, padding: 10, borderRadius: 8 },
// // });

// import React, { useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import db from '../db/db'; 

// export function AddExpenseScreen({ navigation }: any) {
//   const [amount, setAmount] = useState('');
//   const [description, setDescription] = useState('');

//   const addExpense = async () => {
//     const numericAmount = parseFloat(amount);
//     if (isNaN(numericAmount) || !description) {
//       Alert.alert('Error', 'Mohon isi nominal dan deskripsi!');
//       return;
//     }

//     try {
//       const userId = await AsyncStorage.getItem('userId');
//       if (!userId) {
//         Alert.alert('Error', 'User tidak ditemukan. Silakan login ulang.');
//         return;
//       }

//       const createdAt = new Date().toISOString();

//       db.transaction((tx) => {
//         tx.executeSql(
//           'INSERT INTO expenses (user_id, amount, type, createdAt) VALUES (?, ?, ?, ?)',
//           [parseInt(userId), numericAmount, description, createdAt],
//           () => {
//             Alert.alert('Success', 'Pengeluaran berhasil ditambahkan');
//             navigation.goBack();
//           },
//           (_, error) => {
//             console.log('Insert Error:', error);
//             return true;
//           }
//         );
//       });
//     } catch (error) {
//       console.log('AsyncStorage error:', error);
//     }
//   };

//   return (
//     <View style={addStyles.container}>
//       <Text style={addStyles.title}>Add Expense</Text>

//       <TextInput
//         placeholder="Amount"
//         keyboardType="numeric"
//         value={amount}
//         onChangeText={setAmount}
//         style={addStyles.input}
//       />
//       <TextInput
//         placeholder="Description"
//         value={description}
//         onChangeText={setDescription}
//         style={addStyles.input}
//       />

//       <TouchableOpacity style={addStyles.button} onPress={addExpense}>
//         <Text style={addStyles.buttonText}>Add Expense</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const addStyles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#fff', padding: 24, justifyContent: 'center' },
//   title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24, textAlign: 'left' },
//   input: {
//     backgroundColor: '#f1f5f9',
//     paddingHorizontal: 16,
//     paddingVertical: 14,
//     borderRadius: 8,
//     marginBottom: 16,
//     fontSize: 16,
//     borderWidth: 1,
//     borderColor: '#e2e8f0',
//   },
//   button: {
//     backgroundColor: '#2563eb',
//     paddingVertical: 14,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginTop: 8,
//     elevation: 2,
//   },
//   buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
// });

// import React, { useState } from 'react'; //tanggal 29/5/2025
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Alert
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import db from '../db/db';

// export function AddExpenseScreen({ navigation }: any) {
//   const [displayAmount, setDisplayAmount] = useState('');
//   const [description, setDescription] = useState('');

//   const handleAmountChange = (text: string) => {
//     const clean = text.replace(/\D/g, ''); // Hapus semua non-angka
//     if (clean.length === 0) {
//       setDisplayAmount('');
//       return;
//     }
//     const formatted = 'Rp ' + new Intl.NumberFormat('id-ID').format(Number(clean));
//     setDisplayAmount(formatted);
//   };

//   const addExpense = async () => {
//     const cleanedAmount = displayAmount.replace(/[^0-9]/g, ''); // hanya angka
//     const numericAmount = parseFloat(cleanedAmount);

//     if (isNaN(numericAmount) || numericAmount <= 0 || !description.trim()) {
//       Alert.alert('Error', 'Nominal harus valid dan deskripsi tidak boleh kosong!');
//       return;
//     }

//     try {
//       const userId = await AsyncStorage.getItem('userId');
//       if (!userId) {
//         Alert.alert('Error', 'User tidak ditemukan. Silakan login ulang.');
//         return;
//       }

//       const createdAt = new Date().toISOString();

//       db.transaction((tx) => {
//         tx.executeSql(
//           'INSERT INTO expenses (user_id, amount, type, createdAt) VALUES (?, ?, ?, ?)',
//           [parseInt(userId), numericAmount, description, createdAt],
//           () => {
//             Alert.alert('Success', 'Pengeluaran berhasil ditambahkan');
//             setDisplayAmount('');
//             setDescription('');
//             navigation.goBack();
//           },
//           (_, error) => {
//             console.log('Insert Error:', error);
//             return true;
//           }
//         );
//       });
//     } catch (error) {
//       console.log('AsyncStorage error:', error);
//     }
//   };

//   return (
//     <View style={addStyles.container}>
//       <Text style={addStyles.title}>Add Expense</Text>

//       <TextInput
//         placeholder="Amount"
//         keyboardType="numeric"
//         value={displayAmount}
//         onChangeText={handleAmountChange}
//         style={addStyles.input}
//       />

//       <TextInput
//         placeholder="Description"
//         value={description}
//         onChangeText={setDescription}
//         style={addStyles.input}
//       />

//       <TouchableOpacity style={addStyles.button} onPress={addExpense}>
//         <Text style={addStyles.buttonText}>Add Expense</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const addStyles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#fff', padding: 24, justifyContent: 'center' },
//   title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24, textAlign: 'left' },
//   input: {
//     backgroundColor: '#f1f5f9',
//     paddingHorizontal: 16,
//     paddingVertical: 14,
//     borderRadius: 8,
//     marginBottom: 16,
//     fontSize: 16,
//     borderWidth: 1,
//     borderColor: '#e2e8f0',
//   },
//   button: {
//     backgroundColor: '#2563eb',
//     paddingVertical: 14,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginTop: 8,
//     elevation: 2,
//   },
//   buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
// });

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import db from '../db/db';

export function AddExpenseScreen({ navigation }: any) {
  const [displayAmount, setDisplayAmount] = useState('');
  const [description, setDescription] = useState('');

  const handleAmountChange = (text: string) => {
    const clean = text.replace(/\D/g, '');
    if (clean.length === 0) {
      setDisplayAmount('');
      return;
    }
    const formatted = 'Rp ' + new Intl.NumberFormat('id-ID').format(Number(clean));
    setDisplayAmount(formatted);
  };

  const addExpense = async () => {
    const cleanedAmount = displayAmount
      .replace(/^Rp\s?/i, '')
      .replace(/\./g, '')
      .replace(/,/g, '.');

    const numericAmount = parseFloat(cleanedAmount);

    if (isNaN(numericAmount) || numericAmount <= 0 || !description.trim()) {
      Alert.alert('Error', 'Nominal harus valid dan deskripsi tidak boleh kosong!');
      return;
    }

    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        Alert.alert('Error', 'User tidak ditemukan. Silakan login ulang.');
        return;
      }

      const createdAt = new Date().toISOString();

      db.transaction((tx) => {
        tx.executeSql(
          'INSERT INTO expenses (user_id, amount, type, createdAt) VALUES (?, ?, ?, ?)',
          [parseInt(userId), numericAmount, description, createdAt],
          () => {
            Alert.alert('Success', 'Pengeluaran berhasil ditambahkan');
            setDisplayAmount('');
            setDescription('');
            navigation.goBack();
          },
          (_, error) => {
            console.log('Insert Error:', error);
            Alert.alert('Error', 'Gagal menyimpan pengeluaran');
            return true;
          }
        );
      });
    } catch (error) {
      console.log('AsyncStorage error:', error);
      Alert.alert('Error', 'Terjadi kesalahan saat menyimpan');
    }
  };

  return (
    <View style={addStyles.container}>
      <Text style={addStyles.title}>Add Expense</Text>

      <TextInput
        placeholder="Amount"
        keyboardType="numeric"
        value={displayAmount}
        onChangeText={handleAmountChange}
        style={addStyles.input}
      />

      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        style={addStyles.input}
      />

      <TouchableOpacity style={addStyles.button} onPress={addExpense}>
        <Text style={addStyles.buttonText}>Add Expense</Text>
      </TouchableOpacity>
    </View>
  );
}

const addStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 24, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24, textAlign: 'left' },
  input: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    elevation: 2,
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
