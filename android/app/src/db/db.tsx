import SQLite, { SQLError, Transaction } from 'react-native-sqlite-storage';

// Tipe User diperbarui dengan semua kolom
export type User = {
  id: number;
  name: string;
  email: string;
  password: string;
  phone: string;
  occupation: string;
  gender: string;
  dateOfBirth: string; // Kolom Baru
  occupationDescription: string; // Kolom Baru
};

const db = SQLite.openDatabase(
  {
    name: 'FinanceTracker.db',
    location: 'default',
  },
  () => {
    console.log('✅ Database opened');
  },
  (error: any) => {
    console.log('❌ Error opening database:', error);
  }
);

// --- PERBAIKAN DI SINI ---
// Skema tabel USERS diperbarui dengan kolom baru
export const createUserTable = () => {
  db.transaction((tx: Transaction) => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT UNIQUE,
        password TEXT,
        phone TEXT,
        occupation TEXT,
        gender TEXT,
        dateOfBirth TEXT,
        occupationDescription TEXT
      )`,
      [],
      () => console.log('✅ User table created with all columns'),
      (txObj: Transaction, error: SQLError): boolean => {
        console.log('❌ Failed to create user table:', error);
        return true;
      }
    );
  });
};

// Tabel EXPENSES tetap sama
export const createExpenseTable = () => {
  db.transaction((tx) => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS expenses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        amount REAL,
        type TEXT,
        createdAt TEXT,
        title TEXT,
        description TEXT
      )`,
      [],
      () => console.log('✅ Expense table created'),
      (_, error) => {
        console.log('❌ Failed to create expense table:', error);
        return true;
      }
    );
  });
};

// --- PERBAIKAN DI SINI ---
// Fungsi insertUser diperbarui untuk menerima kolom baru
export const insertUser = (
  name: string, email: string, password: string, phone: string,
  occupation: string, gender: string, dateOfBirth: string, occupationDescription: string,
  onSuccess: () => void,
  onError: (message: string) => void
) => {
  // Validasi lengkap...
  if (!name.trim()) return onError('Nama harus diisi');
  if (!email.trim()) return onError('Email harus diisi');
  if (!password.trim()) return onError('Password harus diisi');
  if (!phone.trim()) return onError('Nomor HP harus diisi');
  if (!occupation.trim()) return onError('Pekerjaan harus dipilih');
  if (!gender.trim()) return onError('Gender harus dipilih');
  if (!dateOfBirth.trim()) return onError('Tanggal Lahir harus diisi');
  
  db.transaction(tx => {
    tx.executeSql(
      'INSERT INTO users (name, email, password, phone, occupation, gender, dateOfBirth, occupationDescription) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name, email, password, phone, occupation, gender, dateOfBirth, occupationDescription],
      () => {
        console.log('✅ User inserted');
        onSuccess();
      },
      (_, error) => {
        console.log('❌ Insert user error:', error);
        onError('Gagal membuat akun. Email mungkin sudah digunakan.');
        return false;
      }
    );
  });
};

// Fungsi lainnya tidak berubah
export const checkUserExists = async (email: string, password: string): Promise<User | null> => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM users WHERE email = ? AND password = ?',
        [email, password],
        (_, { rows }) => {
          if (rows.length > 0) resolve(rows.item(0));
          else resolve(null);
        },
        (_, error) => reject(error)
      );
    });
  });
};

export const getAllUsers = (onSuccess: (users: any[]) => void, onError: (err: any) => void) => {
  db.transaction(tx => {
    tx.executeSql('SELECT * FROM users', [],
      (tx, results) => {
        const users = [];
        for (let i = 0; i < results.rows.length; i++) {
          users.push(results.rows.item(i));
        }
        onSuccess(users);
      },
      (_, error) => {
        onError(error);
        return false;
      }
    );
  });
};

export default db;