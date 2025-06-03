// import React from 'react';
// import { View, Text, TextInput, Button } from 'react-native';

// export default function RegisterScreen({ navigation }) {
//   return (
//     <View style={{ padding: 20 }}>
//       <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Welcome to Finance Tracker</Text>
//       <Text style={{ marginTop: 10 }}>Register your account below</Text>
//       <TextInput placeholder="Email" style={{ borderWidth: 1, marginVertical: 10 }} />
//       <TextInput placeholder="Password" secureTextEntry style={{ borderWidth: 1, marginBottom: 10 }} />
//       <Button title="Register" onPress={() => navigation.navigate('Login')} />
//       <Text style={{ marginTop: 20 }}>Already registered?</Text>
//       <Button title="Go to Login" onPress={() => navigation.navigate('Login')} />
//     </View>
//   );
// }

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { insertUser } from '../db/db';

export function RegisterScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<{ name: string; email: string; password: string }>({
    name: '',
    email: '',
    password: ''
});

  const handleRegister = () => {
    insertUser(name, email, password,
  () => {
    Alert.alert('Success', 'Account created successfully');
    navigation.navigate('Login');
  },
  (errorMessage) => {
  Alert.alert('Validation Error', errorMessage);

  if (errorMessage.includes('Nama')) {
    setError(prev => ({ ...prev, name: errorMessage }));
  } else if (errorMessage.includes('Email')) {
    setError(prev => ({ ...prev, email: errorMessage }));
  } else if (errorMessage.includes('Password')) {
    setError(prev => ({ ...prev, password: errorMessage }));
  } else {
    // fallback: tampilkan di bawah email jika tidak dikenali
    setError(prev => ({ ...prev, email: errorMessage }));
  }
}
);
  };

  return (
    <View style={registerStyles.container}>
      <Text style={registerStyles.title}>Register</Text>

      <TextInput placeholder="Name" style={registerStyles.input} onChangeText={setName} value={name} />
      <TextInput placeholder="Email" style={registerStyles.input} keyboardType="email-address" onChangeText={setEmail} value={email} />
      <TextInput placeholder="Password" style={registerStyles.input} secureTextEntry onChangeText={setPassword} value={password} />

      <TouchableOpacity style={registerStyles.button} onPress={handleRegister}>
        <Text style={registerStyles.buttonText}>Create account</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={registerStyles.link}>Already have an account? Login</Text>
      </TouchableOpacity>

      {/* <TouchableOpacity onPress={() => navigation.navigate('LoginAsAdmin')}>
        <Text style={registerStyles.link}>Login as admin?</Text>
      </TouchableOpacity> */}
    </View>
  );
}

const registerStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 24, justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 24, textAlign: 'left' },
  input: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0'
  },
  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    elevation: 2
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  link: { marginTop: 20, textAlign: 'center', color: '#2563eb', fontWeight: '500' }
});

export default RegisterScreen;
