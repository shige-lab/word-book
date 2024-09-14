import {Category} from '../../../types/navigator/type';
import {openDb} from '../../openDb';

export const getCategories = async (): Promise<Category[]> => {
  const db = openDb();
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT 
				 *
			   FROM 
				 category;`,
        [],
        (tx, results) => {
          const rows = results.rows;
          let categories = [];

          for (let i = 0; i < rows.length; i++) {
            categories.push(rows.item(i));
          }
          console.log('categories:', categories);
          resolve(categories); // Resolve with the data
        },
        (tx, error) => {
          console.log('Error getting categories:', tx, error);
          reject(error); // Reject in case of error
        },
      );
    });
  });
};
