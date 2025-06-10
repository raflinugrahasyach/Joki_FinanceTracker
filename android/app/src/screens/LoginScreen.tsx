import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { checkUserExists, User } from '../db/db';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EyeIcon from '../components/icons/EyeIcon'; // Ganti path Image ke komponen Ikon

export function LoginScreen({ navigation, onLoginSuccess }: any) { 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);
  const ADMIN_CREDENTIAL = {
    email: 'admin123',
    password: 'adminpass',
  };

  const handleLogin = async () => {
    try {
      if (email.toLowerCase() === ADMIN_CREDENTIAL.email && password === ADMIN_CREDENTIAL.password) {
        navigation.navigate('Admin');
        return;
      }
      const user: User | null = await checkUserExists(email, password);
      if (user) {
        await AsyncStorage.setItem('userId', user.id.toString());
        await AsyncStorage.setItem('userName', user.name);
        if (onLoginSuccess) {
            onLoginSuccess();
        }
      } else {
        Alert.alert('Login Gagal', 'Email atau Password tidak valid!');
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert('Error', 'Terjadi kesalahan saat mencoba login.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Welcome</Text>
      </View>
      <View style={styles.formContainer}>
        <Text style={styles.label}>Username Or Email</Text>
        <TextInput 
          placeholder="example@example.com" 
          style={styles.input} 
          keyboardType="email-address" 
          onChangeText={setEmail} 
          value={email} 
          autoCapitalize="none"
        />
        
        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput 
            placeholder="••••••••" 
            style={styles.inputPassword} 
            secureTextEntry={secureText}
            onChangeText={setPassword} 
            value={password}
          />
          <TouchableOpacity onPress={() => setSecureText(!secureText)}>
            <EyeIcon style={styles.eyeIcon} stroke={secureText ? '#A1A1A1' : '#0052FF'} />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity>
            <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonPrimary} onPress={handleLogin}>
          <Text style={styles.buttonTextPrimary}>Log In</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonSecondary} onPress={() => navigation.navigate('Register')}>
          <Text style={styles.buttonTextSecondary}>Sign Up</Text>
        </TouchableOpacity>

        <View style={styles.footerTextContainer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={[styles.footerText, styles.link]}>Sign Up</Text>
            </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0052FF',
    },
    header: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    formContainer: {
        flex: 2.5,
        backgroundColor: '#E6F0FF',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        paddingHorizontal: 24,
        paddingTop: 30,
    },
    label: {
        fontSize: 16,
        color: '#0D253C',
        fontWeight: '600',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        paddingHorizontal: 20,
        paddingVertical: 15,
        fontSize: 16,
        marginBottom: 20,
        color: '#0D253C',
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        marginBottom: 10,
        paddingHorizontal: 20,
    },
    inputPassword: {
        flex: 1,
        paddingVertical: 15,
        fontSize: 16,
        color: '#0D253C',
    },
    eyeIcon: {
        width: 24,
        height: 24,
    },
    forgotPassword: {
        textAlign: 'right',
        color: '#0052FF',
        marginBottom: 30,
    },
    buttonPrimary: {
        backgroundColor: '#0052FF',
        paddingVertical: 18,
        borderRadius: 15,
        alignItems: 'center',
        marginBottom: 15,
    },
    buttonTextPrimary: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    buttonSecondary: {
        backgroundColor: '#CDE0FF',
        paddingVertical: 18,
        borderRadius: 15,
        alignItems: 'center',
    },
    buttonTextSecondary: {
        color: '#0052FF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    footerTextContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    footerText: {
        color: '#858585',
        fontSize: 14,
    },
    link: {
        color: '#0052FF',
        fontWeight: 'bold',
    },
});