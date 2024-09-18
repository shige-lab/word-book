import {Transaction} from 'react-native-sqlite-storage';
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
				 category
          ORDER BY
         order_index 
         ASC
         ;`,
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

export const sortCategories = async (
  categories: Category[],
  transaction?: Transaction,
): Promise<Category[]> => {
  const query = (tx: Transaction) => {
    categories.forEach((category, index) => {
      tx.executeSql(
        `UPDATE category SET order_index = ? WHERE id = ?`,
        [index, category.id],
        (tx, results) => {
          console.log('Category sorted:', results);
        },
        (tx, error) => {
          console.log('Error sorting category:', tx, error);
        },
      );
    });
  };
  if (transaction) {
    query(transaction);
    return categories;
  }
  const db = openDb();
  return new Promise((resolves, rejects) => {
    db.transaction(
      tx => {
        query(tx);
        resolves(categories);
      },
      error => {
        console.log('Error during transaction:', error);
      },
    );
  });
};

export const saveCategory = async (
  category: Partial<Category>,
  categories: Category[],
): Promise<Category[]> => {
  const db = openDb();
  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        if (category.id) {
          tx.executeSql(
            `UPDATE category SET name = ?, order_index = ?, childrenLength = ? WHERE id = ?`,
            [
              category.name,
              category.order_index,
              category.childrenLength,
              category.id,
            ],
            (tx, results) => {
              console.log('Category updated:', results);
              const updatedCategories = categories.map(c =>
                c.id === category.id ? (category as Category) : c,
              );
              resolve(updatedCategories);
            },
            (tx, error) => {
              console.log('Error updating category:', tx, error);
              reject(error);
            },
          );
          return;
        }
        tx.executeSql(
          `INSERT INTO category (name, order_index, childrenLength) VALUES (?, ?, ?)`,
          [category.name, category.order_index, category.childrenLength],
          async (tx, results) => {
            const sortedCategories = await sortCategories(
              [
                {
                  id: results.insertId,
                  ...category,
                } as Category,
                ...categories,
              ],
              tx,
            );
            console.log('sortedCategories:', sortedCategories);
            resolve(sortedCategories);
          },
          (tx, error) => {
            console.log('Error saving category:', tx, error);
            reject(error);
          },
        );
      },
      error => {
        console.log('Error during transaction:', error);
      },
    );
  });
};
