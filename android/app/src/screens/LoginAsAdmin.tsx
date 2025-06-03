import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { getAllUsers } from '../db/db';
import { useNavigation } from '@react-navigation/native';

const ADMIN_CREDENTIAL = {
  id: 'admin123',
  password: 'adminpass',
};

const LoginAsAdmin = () => {
 const [adminId, setAdminId] = useState<string>(''); 
 const [adminPassword, setAdminPassword] = useState<string>(''); 
  const navigation = useNavigation();

  const handleLogin = () => {
    if (adminId === ADMIN_CREDENTIAL.id && adminPassword === ADMIN_CREDENTIAL.password) {
      console.log('Admin login successful');
      (navigation as any).navigate('Admin');
    } else {
      Alert.alert('Login Gagal', 'ID atau Password Admin salah');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login Admin</Text>

      <TextInput
        placeholder="Admin ID"
        value={adminId}
        onChangeText={setAdminId}
        style={styles.input}
      />

      <TextInput
        placeholder="Password"
        value={adminPassword}
        onChangeText={setAdminPassword}
        secureTextEntry
        style={styles.input}
      />

      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
});

export default LoginAsAdmin;
