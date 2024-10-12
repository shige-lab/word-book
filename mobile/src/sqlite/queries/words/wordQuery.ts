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
		word.category_id = ?
    ORDER BY
    word.id
    DESC
    ;`,
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

export const saveWord = async (word: Partial<Word>): Promise<Word> => {
  const db = openDb();
  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        if (word.id) {
          tx.executeSql(
            `UPDATE word SET 
            word = ?,
            meaning = ?,
            category_id = ?,
            proficiency_id = ?,
            frequency_id = ?,
            example1 = ?,
            example2 = ?,
            example3 = ?,
            image = ?
            WHERE id = ?`,
            [
              word.word,
              word.meaning,
              word.category_id,
              word.proficiency_id,
              word.frequency_id,
              word.example1,
              word.example2,
              word.example3,
              word.image,
              word.id,
            ],
            (tx, result) => {
              console.log(`Updated Word: ${word.word}`);
              resolve(word as Word);
            },
            (tx, error) => {
              console.log(`Error updating word: ${word.word}`, tx, error);
              reject(error);
            },
          );
          return;
        }
        tx.executeSql(
          `INSERT INTO word (word, meaning, category_id, proficiency_id, frequency_id, example1, example2, example3, image) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            word.word,
            word.meaning,
            word.category_id,
            word.proficiency_id,
            word.frequency_id,
            word.example1,
            word.example2,
            word.example3,
            word.image,
          ],
          (tx, result) => {
            console.log(`Inserted Word: ${word.word}`);
            word.id = result.insertId;
            resolve(word as Word);
          },
          (tx, error) => {
            console.log(`Error inserting word: ${word.word}`, tx, error);
            reject(error);
          },
        );
      },
      error => {
        console.log('Error during transaction:', error);
        reject(error);
      },
    );
  });
};
