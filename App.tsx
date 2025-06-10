// zidaneew/skripsi/SKRIPSI-7d8b0537cffa8b6c6c51d7b7b6ca87b693e42de4/App.tsx

import React, { useEffect, useState } from 'react';
import type { JSX } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, ActivityIndicator } from 'react-native';

import { LoginScreen } from './android/app/src/screens/LoginScreen';
import RegisterScreen from './android/app/src/screens/RegisterScreen';
import HomeScreen from './android/app/src/screens/HomeScreen';
import { AddExpenseScreen } from './android/app/src/screens/AddExpenseScreen';
import { PredictionScreen } from './android/app/src/screens/PredictionScreen';
import AdminUserList from './android/app/src/screens/AdminUserList';
import EditNewProfile from './android/app/src/screens/EditNewProfile';

import { createUserTable, createExpenseTable } from './android/app/src/db/db';

const Stack = createNativeStackNavigator();

export default function App(): JSX.Element {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    // Inisialisasi database
    createUserTable();
    createExpenseTable();

    // Cek status login pengguna
    const checkLoginStatus = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        setIsLoggedIn(!!userId);
      } catch (e) {
        console.error("Failed to fetch user ID from storage", e);
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  if (isLoggedIn === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isLoggedIn ? (
          // Grup layar jika pengguna sudah login
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="AddExpense" component={AddExpenseScreen} />
            <Stack.Screen name="Prediction" component={PredictionScreen} />
            <Stack.Screen name="EditProfile" component={EditNewProfile} />
            <Stack.Screen name="Admin" component={AdminUserList} />
          </>
        ) : (
          // Grup layar jika pengguna belum login
          <>
            <Stack.Screen name="Login">
              {(props) => <LoginScreen {...props} onLoginSuccess={handleLoginSuccess} />}
            </Stack.Screen>
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Admin" component={AdminUserList} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}