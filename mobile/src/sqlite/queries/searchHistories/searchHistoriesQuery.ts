import {Alert} from 'react-native';
import {SearchHistory} from '../../../types/navigator/type';
import {openDb} from '../../openDb';

export const getSearchHistories = async (): Promise<SearchHistory[]> => {
  const db = openDb();
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT 
				 *
			   FROM 
		search_history
		  ORDER BY
		 updated_at 
		 DESC
		 LIMIT 20
		 ;`,
        [],
        (tx, results) => {
          const rows = results.rows;
          let searchHistories = [];

          for (let i = 0; i < rows.length; i++) {
            searchHistories.push(rows.item(i));
          }
          console.log('searchHistories:', searchHistories);
          resolve(searchHistories); // Resolve with the data
        },
        (tx, error) => {
          console.log('Error getting searchHistories:', tx, error);
          Alert.alert('Error getting searchHistories');
          reject(error); // Reject in case of error
        },
      );
    });
  });
};

export const saveSearchHistory = async (word: string) => {
  const db = openDb();
  db.transaction(
    tx => {
      tx.executeSql(
        `SELECT * FROM search_history WHERE word = ? LIMIT 1`,
        [word],
        (tx, results) => {
          const rows = results.rows;
          console.log('rows:', rows?.length);

          if (rows?.length > 0) {
            tx.executeSql(
              `UPDATE search_history SET updated_at = ?, search_count = search_count + 1 WHERE word = ?`,
              [new Date().toISOString(), word],
              (tx, results) => {
                console.log('Search history updated:', results);
              },
              (tx, error) => {
                console.log('Error updating search history:', tx, error);
                Alert.alert('Error updating search history');
              },
            );
          } else {
            tx.executeSql(
              `INSERT INTO search_history (word) VALUES (?)`,
              [word],
              (tx, results) => {
                console.log('Search history inserted:', results);
              },
              (tx, error) => {
                console.log('Error inserting search history:', tx, error);
                Alert.alert('Error inserting search history');
              },
            );
          }
        },
      );
    },
    error => {
      console.log('Error during transaction:', error);
      Alert.alert('Error during transaction');
    },
  );
};

export const deleteSearchHistory = async (word: string) => {
  const db = openDb();
  db.transaction(
    tx => {
      tx.executeSql(
        `DELETE FROM search_history WHERE word = ?`,
        [word],
        (tx, results) => {
          console.log('Search history deleted:', results);
        },
        (tx, error) => {
          console.log('Error deleting search history:', tx, error);
          Alert.alert('Error deleting search history');
        },
      );
    },
    error => {
      console.log('Error during transaction:', error);
      Alert.alert('Error during transaction');
    },
  );
};
