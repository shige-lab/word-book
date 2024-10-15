import axios from 'axios';

export const fetchWordInfoFromDictionaryApi = async (word: string) => {
  if (!word?.trim()) {
    return {meanings: [], examples: [], phonetics: []};
  }

  try {
    const response = await axios.get(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`,
    );
    const data = response.data[0];
    let meanings: string[] = [];
    let examples: string[] = [];
    for (const m of data.meanings) {
      for (const d of m.definitions) {
        if (d.definition) {
          meanings.push(d.definition);
        }
        if (d.example) {
          examples.push(d.example);
        }
      }
    }
    return {meanings, examples, phonetics: data.phonetics};
  } catch (error) {
    console.error('Error fetching data:', error);
    return {meanings: [], examples: [], phonetics: []};
  }
};
