import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary, ImagePickerResponse, Asset } from 'react-native-image-picker';
import db from '../db/db';
import UserIcon from '../components/icons/UserIcon';
import CameraIcon from '../components/icons/CameraIcon';

export default function EditNewProfile({ navigation }: any) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [occupation, setOccupation] = useState('');
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    useEffect(() => {
        const loadProfile = async () => {
            const userId = await AsyncStorage.getItem('userId');
            if (userId) {
                setCurrentUserId(userId);
                db.transaction(tx => {
                    tx.executeSql('SELECT * FROM users WHERE id = ?', [parseInt(userId, 10)], (_, { rows }) => {
                        if (rows.length > 0) {
                            const user = rows.item(0);
                            setName(user.name || '');
                            setEmail(user.email || '');
                            setPhone(user.phone || '');
                            setOccupation(user.occupation || '');
                        }
                    });
                });
            }
        };
        loadProfile();
    }, []);

    const handleChoosePhoto = () => {
        launchImageLibrary({ mediaType: 'photo', quality: 0.5 }, (response: ImagePickerResponse) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.errorCode) {
                console.log('ImagePicker Error: ', response.errorMessage);
                Alert.alert('Error', 'Gagal memuat gambar.');
            } else if (response.assets && response.assets.length > 0) {
                const selectedImage: Asset = response.assets[0];
                setProfileImage(selectedImage.uri || null);
            }
        });
    };

    const handleSaveChanges = async () => {
        if (!name.trim()) {
            Alert.alert('Gagal', 'Nama tidak boleh kosong.');
            return;
        }
        
        if (currentUserId) {
            db.transaction(tx => {
                tx.executeSql(
                    'UPDATE users SET name = ?, phone = ?, occupation = ? WHERE id = ?',
                    [name, phone, occupation, parseInt(currentUserId, 10)],
                    async (tx, results) => {
                        if (results.rowsAffected > 0) {
                            await AsyncStorage.setItem('userName', name);
                            Alert.alert('Sukses', 'Profil berhasil diperbarui.');
                            navigation.goBack();
                        } else {
                            Alert.alert('Gagal', 'Tidak ada data yang diperbarui.');
                        }
                    },
                    (tx, error) => {
                        Alert.alert('Gagal', 'Tidak dapat memperbarui profil di database.');
                        console.log(error);
                        return true; // prevent transaction rollback
                    }
                );
            });
        } else {
            Alert.alert('Error', 'User ID tidak ditemukan, silakan login ulang.');
        }
    };
    
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backButton}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit Profile</Text>
                <View style={{width: 28}} />
            </View>
            <ScrollView style={styles.container}>
                <View style={styles.profileSection}>
                    <TouchableOpacity style={styles.avatarContainer} onPress={handleChoosePhoto}>
                        {profileImage ? (
                            <Image source={{ uri: profileImage }} style={styles.avatar} />
                        ) : (
                            <View style={styles.avatarPlaceholder}>
                                <UserIcon stroke="#0052FF" width={60} height={60} />
                            </View>
                        )}
                        <View style={styles.cameraButton}>
                            <CameraIcon stroke="#FFFFFF" width={20} height={20} />
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={styles.form}>
                    <Text style={styles.label}>Full Name</Text>
                    <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Masukkan nama lengkap" />

                    <Text style={styles.label}>Email</Text>
                    <TextInput style={[styles.input, styles.disabledInput]} value={email} editable={false} selectTextOnFocus={false} />

                    <Text style={styles.label}>Phone Number</Text>
                    <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" placeholder="Masukkan nomor telepon" />

                    <Text style={styles.label}>Occupation</Text>
                    <TextInput style={styles.input} value={occupation} onChangeText={setOccupation} placeholder="Masukkan pekerjaan" />
                </View>

                <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
                    <Text style={styles.saveButtonText}>Save Changes</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#0052FF' },
    container: { flex: 1, backgroundColor: '#E6F0FF' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15 },
    backButton: { fontSize: 28, color: '#FFFFFF', fontWeight: 'bold' },
    headerTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' },
    profileSection: { alignItems: 'center', marginVertical: 30 },
    avatarContainer: { position: 'relative', width: 120, height: 120 },
    avatar: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#FFFFFF' },
    avatarPlaceholder: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#CDE0FF', justifyContent: 'center', alignItems: 'center' },
    cameraButton: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#0052FF', padding: 8, borderRadius: 20, borderWidth: 2, borderColor: '#FFFFFF' },
    form: { paddingHorizontal: 24 },
    label: { fontSize: 16, color: '#0D253C', fontWeight: '600', marginBottom: 8 },
    input: { backgroundColor: '#FFFFFF', borderRadius: 15, paddingHorizontal: 20, paddingVertical: 15, fontSize: 16, marginBottom: 20, color: '#0D253C' },
    disabledInput: { backgroundColor: '#F0F4F8', color: '#858585' },
    saveButton: { backgroundColor: '#0052FF', marginHorizontal: 24, paddingVertical: 18, borderRadius: 15, alignItems: 'center', marginTop: 10, marginBottom: 40 },
    saveButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
});