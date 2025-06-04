import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity,
  Image, Alert, Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';
import defaultProfile from '../icon/profile.png';

export default function EditProfileScreen({ navigation }: any) {
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [userId, setUserId] = useState('');

  useEffect(() => {
  const loadUserData = async () => {
    const storedId = await AsyncStorage.getItem('userId');
    const storedName = await AsyncStorage.getItem('userName');
    const storedImage = await AsyncStorage.getItem('userProfile');

    if (storedName) setUsername(storedName);
    if (storedImage) setProfileImage(storedImage);
    if (storedId) setUserId(storedId); // ini tambahan
  };
  loadUserData();
}, []);

  const handleSelectImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.7,
      selectionLimit: 1
    });

    if (result.didCancel) return;
    if (result.errorMessage) {
      Alert.alert('Error', result.errorMessage);
      return;
    }

    const uri = result.assets?.[0]?.uri;
    if (uri) {
      setProfileImage(uri);
      await AsyncStorage.setItem('userProfile', uri);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.back}>←</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Edit My Profile</Text>

      <TouchableOpacity onPress={handleSelectImage}>
        <Image
            source={profileImage ? { uri: profileImage } : defaultProfile}
            style={styles.avatar}
        />
        <Text style={styles.editText}>Edit Photo</Text>
      </TouchableOpacity>

      <Text style={styles.userId}>ID: {userId}</Text>

      <Text style={styles.label}>Username</Text>
      <TextInput style={styles.input} value={username} onChangeText={setUsername} />

      <Text style={styles.label}>Phone</Text>
      <TextInput style={styles.input} keyboardType="phone-pad" value={phone} onChangeText={setPhone} />

      <Text style={styles.label}>Email Address</Text>
      <TextInput style={styles.input} keyboardType="email-address" value={email} onChangeText={setEmail} />

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Update Profile</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#DCEAFF', padding: 20 },
  back: { fontSize: 24, color: '#333' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginVertical: 10 },
  avatar: {
    width: 100, height: 100, borderRadius: 50,
    alignSelf: 'center', marginTop: 10
  },
  editText: {
    textAlign: 'center',
    color: '#4E6EF2',
    fontSize: 12,
    marginTop: 4
  },
  userId: { textAlign: 'center', color: '#888', marginBottom: 20 },
  label: { fontWeight: '600', marginTop: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#fff',
    marginBottom: 10
  },
  button: {
    backgroundColor: '#4E6EF2',
    padding: 15,
    borderRadius: 10,
    marginTop: 20
  },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' }
});