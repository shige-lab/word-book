import {openDb} from '../../openDb';

export const createCategoriesAndWords = () => {
  // Sample categories
  const categories = [
    {name: 'Fruits', order_index: 0, childrenLength: 1},
    {name: 'Animals', order_index: 1, childrenLength: 1},
  ];

  // Sample words using category_id, proficiency_id, and frequency_id
  const words = [
    {
      word: 'Apple',
      meaning: 'A fruit that is sweet and crunchy.',
      category_id: 1, // Fruits category
      priority_id: 1, // Assuming priority_id 1 exists
      proficiency_id: 1, // Beginner proficiency
      frequency_id: 3, // Frequent frequency
      example1: 'An apple a day keeps the doctor away.',
      example2: 'She ate an apple for breakfast.',
      example3: 'This apple is very sweet.',
      image: null,
    },
    {
      word: 'Lion',
      meaning: 'A large wild animal of the cat family.',
      category_id: 2, // Animals category
      priority_id: 2, // Assuming priority_id 2 exists
      proficiency_id: 2, // Intermediate proficiency
      frequency_id: 2, // Occasional frequency
      example1: 'The lion is the king of the jungle.',
      example2: 'A lion can run at great speed.',
      example3: 'Lions live in Africa and Asia.',
      image: null,
    },
  ];
  const db = openDb();

  db.transaction(
    tx => {
      // check if some categories exists
      //   if it does, not insert categories and words and return function
      tx.executeSql(
        `SELECT 
		count(id) as count
		FROM 
		category;`,
        [],
        (tx, results) => {
          const rows = results.rows;
          if (rows?.length > 0) {
            console.log('Categories exists');
            return;
          }
          // Insert categories
          categories.forEach(category => {
            tx.executeSql(
              'INSERT INTO Category (name, `order_index`, childrenLength) VALUES (?, ?, ?)',
              [category.name, category.order_index, category.childrenLength],
              (tx, result) => {
                console.log(`Inserted Category: ${category.name}`);
              },
              (tx, error) => {
                console.log(
                  `Error inserting category: ${category.name}`,
                  tx,
                  error,
                );
              },
            );
          });
          // Insert words
          words.forEach(word => {
            tx.executeSql(
              `INSERT INTO Word (word, meaning, category_id, priority_id, proficiency_id, frequency_id, example1, example2, example3, image) 
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                word.word,
                word.meaning,
                word.category_id,
                word.priority_id,
                word.proficiency_id,
                word.frequency_id,
                word.example1,
                word.example2,
                word.example3,
                word.image,
              ],
              (tx, result) => {
                console.log(`Inserted Word: ${word.word}`);
              },
              (tx, error) => {
                console.log(`Error inserting word: ${word.word}`, tx, error);
              },
            );
          });
        },
      );
    },
    error => {
      console.log('Error during transaction:', error);
    },
    () => {
      console.log('Categories and Words inserted successfully');
    },
  );
};
