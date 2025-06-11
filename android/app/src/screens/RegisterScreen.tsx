import React, { useState } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    StyleSheet, 
    Alert, 
    ScrollView, 
    SafeAreaView 
} from 'react-native';
import { insertUser } from '../db/db';
import { Picker } from '@react-native-picker/picker';
import EyeIcon from '../components/icons/EyeIcon';

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
  const [occupation, setOccupation] = useState('');
  const [gender, setGender] = useState('');

  const [securePassword, setSecurePassword] = useState(true);
  const [secureConfirmPassword, setSecureConfirmPassword] = useState(true);

  const handleRegister = () => {
    if (password !== confirmPassword) {
        Alert.alert('Error', 'Password dan Konfirmasi Password tidak cocok.');
        return;
    }
    // Mengirim semua data termasuk kolom tambahan
    insertUser(
      name, email, password, phone, occupation, gender,
      () => {
        Alert.alert('Sukses', 'Akun berhasil dibuat, silakan login.');
        navigation.navigate('Login');
      },
      (errorMessage: string) => {
        Alert.alert('Validasi Gagal', errorMessage);
      }
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Register</Text>
        </View>
        <View style={styles.formContainer}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput 
            placeholder="Your full name" 
            style={styles.input} 
            onChangeText={setName} 
            value={name} 
            placeholderTextColor="#A1A1A1"
          />

          <Text style={styles.label}>Email</Text>
          <TextInput 
            placeholder="example@example.com" 
            style={styles.input} 
            keyboardType="email-address" 
            onChangeText={setEmail} 
            value={email} 
            autoCapitalize="none"
            placeholderTextColor="#A1A1A1"
          />

          {/* --- KOLOM TAMBAHAN DIMASUKKAN DI SINI --- */}
          <Text style={styles.label}>Phone Number</Text>
          <TextInput 
            placeholder="Your phone number" 
            style={styles.input} 
            keyboardType="phone-pad"
            onChangeText={setPhone} 
            value={phone} 
            placeholderTextColor="#A1A1A1"
          />

          <Text style={styles.label}>Occupation</Text>
          <TextInput 
            placeholder="Your occupation" 
            style={styles.input} 
            onChangeText={setOccupation} 
            value={occupation} 
            placeholderTextColor="#A1A1A1"
          />

          <Text style={styles.label}>Gender</Text>
          <View style={styles.pickerWrapper}>
            <Picker 
              selectedValue={gender} 
              onValueChange={(itemValue: string) => setGender(itemValue)} 
              style={styles.picker}
              dropdownIconColor="#0D253C"
            >
                <Picker.Item label="Pilih Gender..." value="" />
                <Picker.Item label="Laki-laki" value="male" />
                <Picker.Item label="Perempuan" value="female" />
            </Picker>
          </View>
          {/* --- AKHIR DARI KOLOM TAMBAHAN --- */}

          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordContainer}>
              <TextInput 
                  placeholder="••••••••" 
                  style={styles.inputPassword} 
                  secureTextEntry={securePassword} 
                  onChangeText={setPassword} 
                  value={password} 
                  placeholderTextColor="#A1A1A1"
              />
              <TouchableOpacity onPress={() => setSecurePassword(!securePassword)}>
                  <EyeIcon stroke={securePassword ? '#A1A1A1' : '#0052FF'} />
              </TouchableOpacity>
          </View>
          
          <Text style={styles.label}>Confirm Password</Text>
          <View style={styles.passwordContainer}>
              <TextInput 
                  placeholder="••••••••" 
                  style={styles.inputPassword} 
                  secureTextEntry={secureConfirmPassword} 
                  onChangeText={setConfirmPassword} 
                  value={confirmPassword} 
                  placeholderTextColor="#A1A1A1"
              />
              <TouchableOpacity onPress={() => setSecureConfirmPassword(!secureConfirmPassword)}>
                  <EyeIcon stroke={secureConfirmPassword ? '#A1A1A1' : '#0052FF'} />
              </TouchableOpacity>
          </View>
          
          <Text style={styles.termsText}>By continuing, you agree to Terms of Use and Privacy Policy.</Text>

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
    safeArea: {
        flex: 1,
        backgroundColor: '#0052FF',
    },
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },
    header: {
        paddingTop: 60,
        paddingBottom: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    formContainer: {
        flex: 1,
        backgroundColor: '#E6F0FF',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        paddingHorizontal: 24,
        paddingTop: 30,
        paddingBottom: 20
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
        marginBottom: 15,
        color: '#0D253C',
    },
    pickerWrapper: {
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        marginBottom: 15,
        justifyContent: 'center'
    },
    picker: {
        width: '100%',
        color: '#0D253C',
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        marginBottom: 15,
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
    termsText: {
        color: '#858585',
        textAlign: 'center',
        marginVertical: 20,
        fontSize: 12,
        lineHeight: 18,
    },
    buttonPrimary: {
        backgroundColor: '#0052FF',
        paddingVertical: 18,
        borderRadius: 15,
        alignItems: 'center',
    },
    buttonTextPrimary: {
        color: '#FFFFFF',
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

export default RegisterScreen;