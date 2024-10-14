import {openDb} from '../../openDb';

export const createProficiencyAndFrequency = () => {
  const proficiencyLevels = [
    {name: 'Beginner', order_index: 0},
    {name: 'Intermediate', order_index: 1},
    {name: 'Advanced', order_index: 2},
    {name: 'Expert', order_index: 3},
  ];

  const frequencyLevels = [
    {name: 'Very Frequent', order_index: 0},
    {name: 'Frequent', order_index: 1},
    {name: 'Occasional', order_index: 2},
    {name: 'Rare', order_index: 3},
  ];
  const db = openDb();

  db.transaction(
    tx => {
      // check if the proficiency records exists
      //   if it does, not insert proficiency and frequency
      tx.executeSql(
        `SELECT 
		COUNT(id) as count
		FROM 
		proficiency;`,
        [],
        (tx, results) => {
          if (results?.rows?.item(0)?.count > 0) {
            console.log('proficiency records exists');
            return;
          }
          // Insert proficiency levels
          proficiencyLevels.forEach(level => {
            tx.executeSql(
              'INSERT INTO proficiency (name, `order_index`) VALUES (?, ?)',
              [level.name, level.order_index],
              (tx, result) => {
                console.log(`Inserted proficiency: ${level.name}`);
              },
              (tx, error) => {
                console.log(
                  `Error inserting proficiency: ${level.name}`,
                  error,
                );
              },
            );
          });

          // Insert frequency levels
          frequencyLevels.forEach(level => {
            tx.executeSql(
              'INSERT INTO frequency (name, `order_index`) VALUES (?, ?)',
              [level.name, level.order_index],
              (tx, result) => {
                console.log(`Inserted frequency: ${level.name}`);
              },
              (tx, error) => {
                console.log(`Error inserting frequency: ${level.name}`, error);
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
      console.log('proficiency and frequency levels inserted successfully');
    },
  );
};
