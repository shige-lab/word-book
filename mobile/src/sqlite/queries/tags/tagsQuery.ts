import {Frequency, Proficiency} from '../../../types/navigator/type';
import {openDb} from '../../openDb';

export const getProficiencyAndFrequency = async (): Promise<{
  proficiencies: Proficiency[];
  frequencies: Frequency[];
}> => {
  const db = openDb();
  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        tx.executeSql(
          `SELECT * FROM proficiency`,
          [],
          (tx, results) => {
            const proficiencies = results.rows.raw();
            tx.executeSql(
              `SELECT * FROM frequency`,
              [],
              (tx, results) => {
                const frequencies = results.rows.raw();
                resolve({proficiencies, frequencies});
              },
              (tx, error) => {
                console.log('Error getting frequencies:', tx, error);
                reject(error);
              },
            );
          },
          (tx, error) => {
            console.log('Error getting proficiencies:', tx, error);
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
