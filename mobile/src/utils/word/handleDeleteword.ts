import {Alert} from 'react-native';
import {deleteWord} from '../../sqlite/queries/words/wordQuery';
import {Category, Word} from '../../types/navigator/type';

interface HandleDeleteWordProps {
  word: Word;
  categories: Category[];
  setCategories: (c: Category[]) => void;
  onSucess?: () => void;
}

export const handleDeleteWord = ({
  word,
  categories,
  setCategories,
  onSucess,
}: HandleDeleteWordProps) => {
  const deleteWordAsync = async (word: Word) => {
    await deleteWord(word);
    setCategories(
      categories.map(c =>
        c.id === word.category_id
          ? {
              ...c,
              words: c?.words?.filter(w => w.id !== word.id),
              childrenLength: (c?.childrenLength || 0) - 1,
            }
          : c,
      ),
    );
    onSucess && onSucess();
  };
  Alert.alert(
    'Warning',
    'Are you sure you want to delete this word?',
    [
      {
        text: 'Cancel',
        onPress: () => {},
        style: 'cancel',
      },
      {text: 'OK', onPress: async () => deleteWordAsync(word)},
    ],
    {cancelable: false},
  );
};
