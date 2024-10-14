import {openDb} from '../openDb';

// Function to create the tables
export const createTables = (init?: boolean) => {
  const db = openDb();

  db.transaction(tx => {
    if (init) {
      // Drop table category
      tx.executeSql(
        `DROP TABLE IF EXISTS category;`,
        [],
        (tx, result) => {
          console.log('category table dropped successfully');
        },
        error => {
          console.log('Error dropping category table:', error);
        },
      );

      // Drop table proficiency
      tx.executeSql(
        `DROP TABLE IF EXISTS proficiency;`,
        [],
        (tx, result) => {
          console.log('proficiency table dropped successfully');
        },
        error => {
          console.log('Error dropping proficiency table:', error);
        },
      );

      // Drop table frequency
      tx.executeSql(
        `DROP TABLE IF EXISTS frequency;`,
        [],
        (tx, result) => {
          console.log('frequency table dropped successfully');
        },
        error => {
          console.log('Error dropping frequency table:', error);
        },
      );

      // Drop table word
      tx.executeSql(
        `DROP TABLE IF EXISTS word;`,
        [],
        (tx, result) => {
          console.log('word table dropped successfully');
        },
        error => {
          console.log('Error dropping word table:', error);
        },
      );

      // Drop table search_history
      tx.executeSql(
        `DROP TABLE IF EXISTS search_history;`,
        [],
        (tx, result) => {
          console.log('search_history table dropped successfully');
        },
        error => {
          console.log('Error dropping search_history table:', error);
        },
      );
    }
    // Create category table
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS category (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT DEFAULT "",
        order_index INTEGER,
        childrenLength INTEGER
      );`,
      [],
      (tx, result) => {
        console.log('category table created successfully');
      },
      error => {
        console.log('Error creating category table:', error);
      },
    );

    // Create proficiency table
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS proficiency (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT DEFAULT "",
        order_index INTEGER NOT NULL
      );`,
      [],
      (tx, result) => {
        console.log('proficiency table created successfully');
      },
      error => {
        console.log('Error creating proficiency table:', error);
      },
    );

    // Create frequency table
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS frequency (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT DEFAULT "",
        order_index INTEGER NOT NULL
      );`,
      [],
      (tx, result) => {
        console.log('frequency table created successfully');
      },
      error => {
        console.log('Error creating frequency table:', error);
      },
    );
    // drop table word
    // tx.executeSql(
    //   `DROP TABLE IF EXISTS word;`,
    //   [],
    //   (tx, result) => {
    //     console.log('word table dropped successfully');
    //   },
    //   error => {
    //     console.log('Error dropping word table:', error);
    //   },
    // );

    // Create word table
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS word (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        word TEXT DEFAULT "",
        meaning TEXT DEFAULT "",
        category_id INTEGER,
        proficiency_id INTEGER,
        frequency_id INTEGER,
        example1 TEXT,
        example2 TEXT,
        example3 TEXT,
        image TEXT,
        FOREIGN KEY (category_id) REFERENCES category(id) ON DELETE CASCADE,
        FOREIGN KEY (proficiency_id) REFERENCES proficiency(id),
        FOREIGN KEY (frequency_id) REFERENCES frequency(id)
      );`,
      [],
      (tx, result) => {
        console.log('word table created successfully');
      },
      error => {
        console.log('Error creating word table:', error);
      },
    );

    // drop search_history table
    // tx.executeSql(
    //   `DROP TABLE IF EXISTS search_history;`,
    //   [],
    //   (tx, result) => {
    //     console.log('search_history dropped successfully');
    //   },
    //   error => {
    //     console.log('Error dropping search_history:', error);
    //   },
    // );

    // Create search_history table
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS search_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        word TEXT DEFAULT "",
        search_count INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );`,
      [],
      (tx, result) => {
        console.log('search_history table created successfully');
      },
      error => {
        console.log('Error creating search_history table:', error);
      },
    );
  });
};
