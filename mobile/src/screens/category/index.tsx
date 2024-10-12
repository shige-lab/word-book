import React, {useEffect, useMemo, useState} from 'react';
import MainLayout from '../../components/MainLayout';
import {Button, Div, Text} from 'react-native-magnus';
import {getCategories} from '../../sqlite/queries/categories/categoriesQuery';
import useStateStore from '../../hooks/zustand/useStateStore';
import {useShallow} from 'zustand/react/shallow';
import {Category, Word} from '../../types/navigator/type';
import {FlatList} from 'react-native';
import CategoryCard from '../../components/Word/WordCard';
import {useColor} from '../../hooks/common/useColor';
import {useNavigation, useRoute} from '@react-navigation/native';
import {
  CategoryNavigation,
  CategoryRoute,
  navigationProp,
} from '../../types/navigator/RouteProps';
import {deleteWord, getWords} from '../../sqlite/queries/words/wordQuery';
import {borderBottom} from '../../utils/color/color';
import WordCard from '../../components/Word/WordCard';
import WordFormModal from '../../components/Word/WordFormModal';
import {Alert} from 'react-native';

const CategoryDetail: React.FC = () => {
  const route = useRoute<CategoryRoute>();
  const navigation = useNavigation<navigationProp>();
  const id = route.params.id;
  const {categories, setCategories} = useStateStore(
    useShallow(state => ({
      categories: state.categories,
      setCategories: state.setCategories,
    })),
  );
  const [isOpened, setIsOpened] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getWords(id);
      setCategories(
        categories.map(c => (c.id === id ? {...c, words: data} : c)),
      );
    };
    if (id) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const selectedCategory = useMemo(() => {
    return categories.find(c => c.id === id);
  }, [categories, id]);

  const onDeleteWord = (word: Word) => {
    const deleteWordAsync = async (word: Word) => {
      await deleteWord(word);
      setCategories(
        categories.map(c =>
          c.id === id
            ? {...c, words: c?.words?.filter(w => w.id !== word.id)}
            : c,
        ),
      );
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

  return (
    <MainLayout
      headerProps={{
        title: selectedCategory?.name || '',
        leftIcon: 'back',
        rightButton: [
          {
            icon: 'new',
            onPress: () => {
              setIsOpened(true);
            },
          },
        ],
      }}
      withPadding={false}>
      {!!selectedCategory && (
        <WordFormModal
          isOpen={isOpened}
          onClose={() => setIsOpened(false)}
          category_id={selectedCategory.id}
        />
      )}
      <FlatList
        // style={{width: '100%', padding: 12}}
        contentContainerStyle={{
          padding: 12,
          borderRadius: 10,
          //   backgroundColor: baseColor.base1,
        }}
        data={selectedCategory?.words || []}
        renderItem={({item, index}) => (
          <Div
            {...(index !== categories?.length - 1
              ? {...borderBottom}
              : undefined)}>
            <WordCard word={item} onDelete={() => onDeleteWord(item)} />
          </Div>
        )}
      />
    </MainLayout>
  );
};

export default CategoryDetail;
