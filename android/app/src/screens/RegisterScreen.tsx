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
    Platform
} from 'react-native';
import { insertUser } from '../db/db';
import { Picker } from '@react-native-picker/picker';
import EyeIcon from '../components/icons/EyeIcon';
import CalendarIcon from '../components/icons/CalendarIcon';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

type RegisterScreenProps = {
  navigation: {
    navigate: (screen: string) => void;
  };
};

export function RegisterScreen({ navigation }: RegisterScreenProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  
  // State untuk fitur baru
  const [occupation, setOccupation] = useState('');
  const [occupationDescription, setOccupationDescription] = useState('');
  const [gender, setGender] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [showDobPicker, setShowDobPicker] = useState(false);

  const [securePassword, setSecurePassword] = useState(true);
  const [secureConfirmPassword, setSecureConfirmPassword] = useState(true);

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDobPicker(Platform.OS === 'ios'); // Di iOS, picker bisa tetap terbuka
    if (selectedDate) {
      setDateOfBirth(selectedDate);
    }
  };

  const handleRegister = () => {
    if (password !== confirmPassword) {
        Alert.alert('Error', 'Password dan Konfirmasi Password tidak cocok.');
        return;
    }
    
    // Kirim semua data, termasuk yang baru
    insertUser(
      name, email, password, phone, occupation, gender,
      dateOfBirth ? dateOfBirth.toISOString() : '', 
      occupationDescription,
      () => {
        Alert.alert('Sukses', 'Akun berhasil dibuat, silakan login.');
        navigation.navigate('Login');
      },
      (errorMessage: string) => {
        Alert.alert('Validasi Gagal', errorMessage);
      }
    );
  };

  const RadioButton = ({ label, selected, onSelect }: { label: string, selected: boolean, onSelect: () => void }) => (
    <TouchableOpacity style={styles.radioContainer} onPress={onSelect}>
        <View style={[styles.radioOuter, selected && styles.radioOuterSelected]}>
            {selected && <View style={styles.radioInner} />}
        </View>
        <Text style={styles.radioLabel}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Register</Text>
        </View>
        <View style={styles.formContainer}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput 
            placeholder="Your full name" style={styles.input} 
            onChangeText={setName} value={name} placeholderTextColor="#A1A1A1"
          />

          <Text style={styles.label}>Email</Text>
          <TextInput 
            placeholder="example@example.com" style={styles.input} 
            keyboardType="email-address" onChangeText={setEmail} value={email} 
            autoCapitalize="none" placeholderTextColor="#A1A1A1"
          />

          <Text style={styles.label}>Phone Number</Text>
          <TextInput 
            placeholder="Your phone number" style={styles.input} 
            keyboardType="phone-pad" onChangeText={setPhone} value={phone} 
            placeholderTextColor="#A1A1A1"
          />

          <Text style={styles.label}>Date of Birth</Text>
          <TouchableOpacity style={styles.input} onPress={() => setShowDobPicker(true)}>
            <View style={styles.dateInputContainer}>
                <Text style={styles.dateText}>{dateOfBirth ? dateOfBirth.toLocaleDateString('id-ID') : 'Pilih Tanggal'}</Text>
                <CalendarIcon stroke="#0D253C" width={22} height={22} />
            </View>
          </TouchableOpacity>
          {showDobPicker && (
            <DateTimePicker
                testID="dateTimePicker"
                value={dateOfBirth || new Date()}
                mode="date"
                display="default"
                onChange={onDateChange}
            />
          )}

          <Text style={styles.label}>Occupation</Text>
          <View style={styles.pickerWrapper}>
            <Picker 
              selectedValue={occupation} 
              onValueChange={(itemValue: string) => setOccupation(itemValue)} 
              style={styles.picker}
              dropdownIconColor="#0D253C"
            >
                <Picker.Item label="Pilih Pekerjaan..." value="" />
                <Picker.Item label="Mahasiswa" value="Mahasiswa" />
                <Picker.Item label="Karyawan" value="Karyawan" />
                <Picker.Item label="Lainnya" value="Lainnya" />
            </Picker>
          </View>
          
          {(occupation === 'Karyawan' || occupation === 'Lainnya') && (
            <>
              <Text style={styles.label}>Deskripsi Pekerjaan / Lainnya</Text>
              <TextInput 
                placeholder="Contoh: Programmer di PT Maju" style={styles.input} 
                onChangeText={setOccupationDescription} value={occupationDescription} 
                placeholderTextColor="#A1A1A1"
              />
            </>
          )}

          <Text style={styles.label}>Gender</Text>
          <View style={styles.radioGroup}>
            <RadioButton label="Laki-laki" selected={gender === 'male'} onSelect={() => setGender('male')} />
            <RadioButton label="Perempuan" selected={gender === 'female'} onSelect={() => setGender('female')} />
          </View>
          
          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordContainer}>
              <TextInput 
                  placeholder="••••••••" style={styles.inputPassword} 
                  secureTextEntry={securePassword} onChangeText={setPassword} value={password} 
                  placeholderTextColor="#A1A1A1"
              />
              <TouchableOpacity onPress={() => setSecurePassword(!securePassword)}>
                  <EyeIcon stroke={securePassword ? '#A1A1A1' : '#0052FF'} />
              </TouchableOpacity>
          </View>
          
          <Text style={styles.label}>Confirm Password</Text>
          <View style={styles.passwordContainer}>
              <TextInput 
                  placeholder="••••••••" style={styles.inputPassword} 
                  secureTextEntry={secureConfirmPassword} onChangeText={setConfirmPassword} value={confirmPassword} 
                  placeholderTextColor="#A1A1A1"
              />
              <TouchableOpacity onPress={() => setSecureConfirmPassword(!secureConfirmPassword)}>
                  <EyeIcon stroke={secureConfirmPassword ? '#A1A1A1' : '#0052FF'} />
              </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.buttonPrimary} onPress={handleRegister}>
            <Text style={styles.buttonTextPrimary}>Sign Up</Text>
          </TouchableOpacity>

          <View style={styles.footerTextContainer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Text style={[styles.footerText, styles.link]}>Log In</Text>
              </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#0052FF' },
    container: { flex: 1 },
    scrollContent: { flexGrow: 1 },
    header: { paddingTop: 60, paddingBottom: 40, justifyContent: 'center', alignItems: 'center' },
    headerTitle: { fontSize: 40, fontWeight: 'bold', color: '#FFFFFF' },
    formContainer: { flex: 1, backgroundColor: '#E6F0FF', borderTopLeftRadius: 40, borderTopRightRadius: 40, paddingHorizontal: 24, paddingTop: 30, paddingBottom: 40 },
    label: { fontSize: 16, color: '#0D253C', fontWeight: '600', marginBottom: 8, marginTop: 10 },
    input: { backgroundColor: '#FFFFFF', borderRadius: 15, paddingHorizontal: 20, paddingVertical: 15, fontSize: 16, marginBottom: 5, color: '#0D253C' },
    passwordContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 15, marginBottom: 5, paddingHorizontal: 20, },
    inputPassword: { flex: 1, paddingVertical: 15, fontSize: 16, color: '#0D253C' },
    eyeIcon: { width: 24, height: 24 },
    pickerWrapper: { backgroundColor: '#FFFFFF', borderRadius: 15, marginBottom: 5 },
    picker: { width: '100%', color: '#0D253C' },
    dateInputContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' },
    dateText: { fontSize: 16, color: '#0D253C' },
    radioGroup: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
    radioContainer: { flexDirection: 'row', alignItems: 'center', marginRight: 20 },
    radioOuter: { height: 24, width: 24, borderRadius: 12, borderWidth: 2, borderColor: '#0052FF', alignItems: 'center', justifyContent: 'center' },
    radioOuterSelected: { borderColor: '#0052FF' },
    radioInner: { height: 12, width: 12, borderRadius: 6, backgroundColor: '#0052FF' },
    radioLabel: { marginLeft: 8, fontSize: 16, color: '#0D253C' },
    buttonPrimary: { backgroundColor: '#0052FF', paddingVertical: 18, borderRadius: 15, alignItems: 'center', marginTop: 30 },
    buttonTextPrimary: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
    footerTextContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
    footerText: { color: '#858585', fontSize: 14 },
    link: { color: '#0052FF', fontWeight: 'bold' },
});

export default RegisterScreen;