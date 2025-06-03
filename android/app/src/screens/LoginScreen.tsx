// import React from 'react';
// import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

// export default function LoginScreen({ navigation }) {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Login</Text>
//       <TextInput placeholder="Email" style={styles.input} />
//       <TextInput placeholder="Password" secureTextEntry style={styles.input} />
//       <Button title="Login" onPress={() => navigation.navigate('Home')} />
//       <Text style={styles.signIn} onPress={() => navigation.navigate('Register')}>Sign in</Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: 'center', padding: 20 },
//   title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
//   input: { borderWidth: 1, padding: 10, marginVertical: 8, borderRadius: 8 },
//   signIn: { marginTop: 15, textAlign: 'center', color: 'blue' },
// });

// import React from 'react';
// import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { checkUserExists, User } from '../db/db';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const ADMIN_CREDENTIAL = {
  email: 'admin123',
  password: 'adminpass',
  };

  type User = {
  id: number;
  name: string;
  email: string;
  password: string;
};

 const handleLogin = async () => {
  const user: User | null = await checkUserExists(email, password);
  if (user && email !== ADMIN_CREDENTIAL.email) {
    await AsyncStorage.setItem('userId', user.id.toString());
    await AsyncStorage.setItem('userName', user.name); // ⬅️ tambahan ini
    navigation.navigate('Home');
  } else if (email === ADMIN_CREDENTIAL.email && password === ADMIN_CREDENTIAL.password) {
    navigation.navigate('Admin');
  } else {
    Alert.alert('Login Failed', 'Email Or Password Invalid!');
  }
};


  return (
    <View style={loginStyles.container}>
      <Text style={loginStyles.title}>Login</Text>

      <TextInput placeholder="Email" style={loginStyles.input} keyboardType="email-address" onChangeText={setEmail} value={email} />
      <TextInput placeholder="Password" style={loginStyles.input} secureTextEntry onChangeText={setPassword} value={password} />

      <TouchableOpacity style={loginStyles.button} onPress={handleLogin}>
        <Text style={loginStyles.buttonText}>Log in</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={loginStyles.link}>Don't have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const loginStyles = StyleSheet.create({
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
