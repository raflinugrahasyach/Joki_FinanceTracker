import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getAllUsers } from '../db/db';
import UserIcon from '../components/icons/UserIcon';

interface User {
  id: number;
  name: string;
  email: string;
}

export default function AdminUserList({ navigation }: any) {
  const [users, setUsers] = useState<User[]>([]);

  useFocusEffect(
    useCallback(() => {
        getAllUsers(
          (fetchedUsers: User[]) => setUsers(fetchedUsers),
          (err: any) => console.log('Error fetching users:', err)
        );
    }, [])
  );

  const renderUserItem = ({ item }: { item: User }) => (
    <View style={styles.card}>
      <View style={styles.avatarPlaceholder}>
        <UserIcon stroke="#0052FF" width={28} height={28} />
      </View>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={styles.backButton}>←</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Admin</Text>
            <View style={{width: 28}} />
        </View>
        <FlatList
            data={users}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderUserItem}
            contentContainerStyle={styles.listContainer}
            ListHeaderComponent={<Text style={styles.listHeader}>All Users</Text>}
            ListEmptyComponent={<View><Text style={styles.emptyText}>Tidak ada pengguna terdaftar.</Text></View>}
        />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0052FF' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15 },
  backButton: { fontSize: 28, color: '#FFFFFF', fontWeight: 'bold' },
  headerTitle: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  listContainer: { flexGrow: 1, backgroundColor: '#E6F0FF', paddingTop: 20, paddingHorizontal: 24 },
  listHeader: { fontSize: 18, fontWeight: 'bold', color: '#0D253C', marginBottom: 20 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#CDE0FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0D253C',
  },
  userEmail: {
    fontSize: 14,
    color: '#858585',
    marginTop: 2,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#858585'
  }
});