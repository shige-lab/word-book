import {Category, Word} from '../../types/navigator/type';

interface WordFormModalProps {
  word: Word;
  setCategories: (c: Category[]) => void;
  categories: Category[];
  isUpdate: boolean;
}

export const handleSetWord = ({
  word,
  setCategories,
  categories,
  isUpdate,
}: WordFormModalProps) => {
  if (isUpdate) {
    setCategories(
      categories.map(c => {
        if (c.id === word.category_id) {
          return {
            ...c,
            words: c?.words?.map(w => {
              if (w.id === word.id) {
                return word;
              }
              return w;
            }),
          };
        }
        return c;
      }),
    );
  } else {
    setCategories(
      categories.map(c => {
        if (c.id === word.category_id) {
          return {
            ...c,
            words: [word, ...(c?.words || [])],
            childrenLength: (c?.childrenLength || 0) + 1,
          };
        }
        return c;
      }),
    );
  }
};
