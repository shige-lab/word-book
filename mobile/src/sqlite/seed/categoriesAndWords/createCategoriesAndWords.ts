import {openDb} from '../../openDb';

export const createCategoriesAndWords = () => {
  // Sample words using category_id, proficiency_id, and frequency_id

  const animals = [
    {
      word: 'Lion',
      meaning: 'A large wild animal of the cat family.',
      category_id: 2, // Animals category
      proficiency_id: 2, // Intermediate proficiency
      frequency_id: 2, // Occasional frequency
      example1: 'The lion is the king of the jungle.',
      example2: 'A lion can run at great speed.',
      example3: 'Lions live in Africa and Asia.',
      image: null,
    },
    {
      word: 'Elephant',
      meaning: 'The largest land animal with a trunk and tusks.',
      category_id: 2,
      proficiency_id: 1,
      frequency_id: 4, // Very frequent frequency
      example1: 'Elephants use their trunks to drink water.',
      example2: 'The elephant is a symbol of wisdom in many cultures.',
      example3: 'Elephants are known for their impressive memory.',
      image: null,
    },
    {
      word: 'Tiger',
      meaning: 'A large carnivorous feline with orange fur and black stripes.',
      category_id: 2,
      proficiency_id: 2, // Intermediate proficiency
      frequency_id: 3,
      example1: 'Tigers are excellent swimmers.',
      example2: 'The Bengal tiger is the most common tiger species.',
      example3: 'The tiger silently stalked its prey.',
      image: null,
    },
    {
      word: 'Giraffe',
      meaning: 'The tallest land animal, known for its long neck.',
      category_id: 2,
      proficiency_id: 1,
      frequency_id: 2,
      example1:
        'The giraffe uses its long neck to reach leaves high in the trees.',
      example2: 'Giraffes are native to Africa.',
      example3: 'A baby giraffe can stand within hours of being born.',
      image: null,
    },
    {
      word: 'Penguin',
      meaning:
        'A flightless bird that lives in cold regions and is known for its distinctive black and white coloring.',
      category_id: 2,
      proficiency_id: 2,
      frequency_id: 3,
      example1: 'Penguins waddle as they walk on land.',
      example2: 'Penguins are expert swimmers.',
      example3: 'The emperor penguin is the largest of all penguin species.',
      image: null,
    },
    {
      word: 'Kangaroo',
      meaning: 'A marsupial known for its large hind legs and pouch.',
      category_id: 2,
      proficiency_id: 2,
      frequency_id: 2,
      example1: 'Kangaroos are native to Australia.',
      example2: 'A baby kangaroo is called a joey.',
      example3: 'Kangaroos can hop at high speeds to escape predators.',
      image: null,
    },
    {
      word: 'Panda',
      meaning:
        'A large bear-like mammal known for its black and white fur and fondness for bamboo.',
      category_id: 2,
      proficiency_id: 2,
      frequency_id: 4,
      example1: 'Pandas are native to China and are an endangered species.',
      example2: 'Pandas spend most of their day eating bamboo.',
      example3: 'The giant panda is a national symbol of China.',
      image: null,
    },
    {
      word: 'Dolphin',
      meaning: 'An intelligent aquatic mammal known for its playful behavior.',
      category_id: 2,
      proficiency_id: 1,
      frequency_id: 3,
      example1: 'Dolphins are highly social animals.',
      example2:
        'Dolphins communicate with each other using clicks and whistles.',
      example3:
        'The bottlenose dolphin is one of the most well-known dolphin species.',
      image: null,
    },
    {
      word: 'Wolf',
      meaning:
        'A wild carnivorous mammal that is the largest member of the dog family.',
      category_id: 2,
      proficiency_id: 3, // Advanced proficiency
      frequency_id: 2,
      example1: 'Wolves live and hunt in packs.',
      example2: 'The gray wolf is the most widespread wolf species.',
      example3: 'Wolves communicate with each other through howling.',
      image: null,
    },
    {
      word: 'Zebra',
      meaning:
        'A wild horse-like animal with distinctive black and white stripes.',
      category_id: 2,
      proficiency_id: 1,
      frequency_id: 2,
      example1: 'Zebras use their stripes as camouflage in the wild.',
      example2: 'Zebras are native to Africa.',
      example3: 'Each zebra has a unique pattern of stripes.',
      image: null,
    },
  ];
  const fruits = [
    {
      word: 'Apple',
      meaning: 'A fruit that is sweet and crunchy.',
      category_id: 1, // Fruits category
      proficiency_id: 1, // Beginner proficiency
      frequency_id: 3, // Frequent frequency
      example1: 'An apple a day keeps the doctor away.',
      example2: 'She ate an apple for breakfast.',
      example3: 'This apple is very sweet.',
      image: null,
    },
    {
      word: 'Banana',
      meaning: 'A long yellow fruit that is soft inside.',
      category_id: 1,
      proficiency_id: 1,
      frequency_id: 4, // Very frequent frequency
      example1: 'Bananas are rich in potassium.',
      example2: 'He added a banana to his smoothie.',
      example3: 'This banana is perfectly ripe.',
      image: null,
    },
    {
      word: 'Cherry',
      meaning: 'A small, round fruit that is typically red and sweet.',
      category_id: 1,
      proficiency_id: 2, // Intermediate proficiency
      frequency_id: 2, // Moderate frequency
      example1: 'Cherries are in season during summer.',
      example2: 'She loves eating cherries as a snack.',
      example3: 'The cherry pie was delicious.',
      image: null,
    },
    {
      word: 'Grape',
      meaning:
        'A small, round fruit that grows in clusters and can be red, green, or purple.',
      category_id: 1,
      proficiency_id: 1,
      frequency_id: 3,
      example1: 'He ate a bunch of grapes.',
      example2: 'Red grapes are my favorite.',
      example3: 'Grapes are often used to make wine.',
      image: null,
    },
    {
      word: 'Orange',
      meaning: 'A citrus fruit with a tough skin and juicy flesh.',
      category_id: 1,
      proficiency_id: 1,
      frequency_id: 4,
      example1: 'Orange juice is a popular breakfast drink.',
      example2: 'She peeled an orange for her snack.',
      example3: 'The orange was very juicy and sweet.',
      image: null,
    },
    {
      word: 'Strawberry',
      meaning: 'A small, red fruit with tiny seeds on the surface.',
      category_id: 1,
      proficiency_id: 2,
      frequency_id: 3,
      example1: 'Strawberries are great with cream.',
      example2: 'She added strawberries to her salad.',
      example3: 'This strawberry is very sweet and fresh.',
      image: null,
    },
    {
      word: 'Pineapple',
      meaning: 'A tropical fruit with spiky skin and sweet, yellow flesh.',
      category_id: 1,
      proficiency_id: 2,
      frequency_id: 2,
      example1: 'Pineapples grow in tropical climates.',
      example2: 'She used pineapple in her fruit salad.',
      example3: 'The pineapple was ripe and juicy.',
      image: null,
    },
    {
      word: 'Mango',
      meaning: 'A tropical fruit with sweet, orange flesh and a large seed.',
      category_id: 1,
      proficiency_id: 2,
      frequency_id: 3,
      example1: 'Mangoes are in season during summer.',
      example2: 'He made a mango smoothie for breakfast.',
      example3: 'The mango was incredibly sweet and juicy.',
      image: null,
    },
    {
      word: 'Watermelon',
      meaning: 'A large, green fruit with red, juicy flesh and black seeds.',
      category_id: 1,
      proficiency_id: 3, // Advanced proficiency
      frequency_id: 2,
      example1: 'Watermelon is perfect for hot summer days.',
      example2: 'She cut up a watermelon for the party.',
      example3: 'This watermelon is so refreshing!',
      image: null,
    },
    {
      word: 'Blueberry',
      meaning: 'A small, round fruit that is blue and sweet.',
      category_id: 1,
      proficiency_id: 3,
      frequency_id: 3,
      example1: 'Blueberries are rich in antioxidants.',
      example2: 'He sprinkled blueberries on his cereal.',
      example3: 'The blueberry pie was delicious.',
      image: null,
    },
  ];

  // Sample categories
  const categories = [
    {name: 'Fruits', order_index: 0, childrenLength: fruits.length},
    {name: 'Animals', order_index: 1, childrenLength: animals.length},
    // {name: 'Animals2', order_index: 2, childrenLength: 50},
    // {name: 'Countries', order_index: 3, childrenLength: 0},
    // {name: 'Jobs', order_index: 4, childrenLength: 0},
    // {name: 'Sports', order_index: 5, childrenLength: 0},
    // {name: 'Transportation', order_index: 6, childrenLength: 0},
    // {name: 'Weather', order_index: 7, childrenLength: 0},
    // {name: 'Food', order_index: 8, childrenLength: 0},
    // {name: 'Technology', order_index: 9, childrenLength: 0},
    // {name: 'Music', order_index: 10, childrenLength: 0},
    // {name: 'Nature', order_index: 11, childrenLength: 0},
    // {name: 'Science', order_index: 12, childrenLength: 0},
    // {name: 'Art', order_index: 13, childrenLength: 0},
    // {name: 'History', order_index: 14, childrenLength: 0},
    // {name: 'Culture', order_index: 15, childrenLength: 0},
    // {name: 'Health', order_index: 16, childrenLength: 0},
    // {name: 'Education', order_index: 17, childrenLength: 0},
    // {name: 'Business', order_index: 18, childrenLength: 0},
    // {name: 'Travel', order_index: 19, childrenLength: 0},
    // {name: 'Family', order_index: 20, childrenLength: 0},
  ];
  const words = [
    ...fruits,
    ...animals,
    // ...animals.map(animal => ({
    //   ...animal,
    //   category_id: 3,
    // })),
    // ...animals.map(animal => ({
    //   ...animal,
    //   category_id: 3,
    // })),
    // ...animals.map(animal => ({
    //   ...animal,
    //   category_id: 3,
    // })),
    // ...animals.map(animal => ({
    //   ...animal,
    //   category_id: 3,
    // })),
    // ...animals.map(animal => ({
    //   ...animal,
    //   category_id: 3,
    // })),
    // Add more words here
  ];
  const db = openDb();

  return new Promise((resolve, reject) => {
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

            if (rows?.item(0)?.count > 0) {
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
                `INSERT INTO Word (word, meaning, category_id, proficiency_id, frequency_id, example1, example2, example3, image) 
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
  });
};
