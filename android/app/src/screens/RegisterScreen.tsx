// zidaneew/skripsi/SKRIPSI-7d8b0537cffa8b6c6c51d7b7b6ca87b693e42de4/android/app/src/screens/RegisterScreen.tsx

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { insertUser } from '../db/db';
import { Picker } from '@react-native-picker/picker';

// Menambahkan tipe untuk props navigasi agar lebih aman
type RegisterScreenProps = {
  navigation: {
    navigate: (screen: string) => void;
  };
};

export function RegisterScreen({ navigation }: RegisterScreenProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [occupation, setOccupation] = useState('');
  const [gender, setGender] = useState('');

  const handleRegister = () => {
    // Memperbaiki panggilan fungsi agar sesuai dengan definisi di db.tsx
    // Fungsi insertUser sekarang menerima 6 argumen untuk data pengguna.
    insertUser(
      name,
      email,
      password,
      phone,
      occupation,
      gender,
      () => {
        Alert.alert('Success', 'Account created successfully');
        navigation.navigate('Login');
      },
      // Menambahkan tipe eksplisit 'string' untuk errorMessage
      (errorMessage: string) => {
        Alert.alert('Validation Error', errorMessage);
      }
    );
  };

  return (
    <ScrollView contentContainerStyle={registerStyles.container}>
      <Text style={registerStyles.title}>Register</Text>

      <TextInput
        placeholder="Full Name"
        style={registerStyles.input}
        onChangeText={setName}
        value={name}
      />
      <TextInput
        placeholder="Email"
        style={registerStyles.input}
        keyboardType="email-address"
        onChangeText={setEmail}
        value={email}
      />
      <TextInput
        placeholder="Password"
        style={registerStyles.input}
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />
      <TextInput
        placeholder="Phone Number"
        style={registerStyles.input}
        keyboardType="phone-pad"
        onChangeText={setPhone}
        value={phone}
      />
      <TextInput
        placeholder="Occupation"
        style={registerStyles.input}
        onChangeText={setOccupation}
        value={occupation}
      />
      <View style={registerStyles.pickerContainer}>
        <Picker
          selectedValue={gender}
          // Menambahkan tipe eksplisit 'string' untuk itemValue
          onValueChange={(itemValue: string) => setGender(itemValue)}
          style={registerStyles.picker}
        >
          <Picker.Item label="Select Gender" value="" />
          <Picker.Item label="Male" value="male" />
          <Picker.Item label="Female" value="female" />
        </Picker>
      </View>

      <TouchableOpacity style={registerStyles.button} onPress={handleRegister}>
        <Text style={registerStyles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={registerStyles.link}>Already have an account? Log in</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const registerStyles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#1E90FF',
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  input: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  pickerContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  button: {
    backgroundColor: '#FF6347',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  link: {
    marginTop: 20,
    textAlign: 'center',
    color: '#FFFFFF',
    fontWeight: '500',
  },
});

export default RegisterScreen;