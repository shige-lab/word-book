import {Word} from '../../../types/navigator/type';
import {openDb} from '../../openDb';

export const getWords = async (categoryId: number): Promise<Word[]> => {
  const db = openDb();
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT 
		 *
		FROM 
		word
		WHERE
		word.category_id = ?;`,
        [categoryId],
        (tx, results) => {
          const rows = results.rows;
          let words = [];

          for (let i = 0; i < rows.length; i++) {
            words.push(rows.item(i));
          }
          console.log('words:', words);
          resolve(words); // Resolve with the data
        },
        (tx, error) => {
          console.log('Error getting words:', tx, error);
          reject(error); // Reject in case of error
        },
      );
    });
  });
};

export const getWordDetail = async (wordId: number): Promise<Word> => {
  const db = openDb();
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT 
		 *
		FROM 
		word
		WHERE
		word.id = ?;`,
        [wordId],
        (tx, results) => {
          const rows = results.rows;
          let word = rows.item(0);
          console.log('word:', word);
          resolve(word); // Resolve with the data
        },
        (tx, error) => {
          console.log('Error getting word:', tx, error);
          reject(error); // Reject in case of error
        },
      );
    });
  });
};
