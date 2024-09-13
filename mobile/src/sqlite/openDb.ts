import SQLite from 'react-native-sqlite-storage';

// Open or create the database
export const openDb = () => {
  return SQLite.openDatabase(
    {
      name: 'myDatabase.db',
      location: 'default',
    },
    () => {
      console.log('Database opened');
    },
    error => {
      console.log('Error opening database:', error);
    },
  );
};
