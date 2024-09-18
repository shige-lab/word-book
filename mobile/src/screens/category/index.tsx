import React, {useEffect, useMemo} from 'react';
import MainLayout from '../../components/MainLayout';
import {Button, Div, Text} from 'react-native-magnus';
import {getCategories} from '../../sqlite/queries/categories/categoriesQuery';
import useStateStore from '../../hooks/zustand/useStateStore';
import {useShallow} from 'zustand/react/shallow';
import {Category} from '../../types/navigator/type';
import {FlatList} from 'react-native';
import CategoryCard from '../../components/Word/WordCard';
import {useColor} from '../../hooks/common/useColor';
import {useNavigation, useRoute} from '@react-navigation/native';
import {
  CategoryNavigation,
  CategoryRoute,
  navigationProp,
} from '../../types/navigator/RouteProps';
import {getWords} from '../../sqlite/queries/words/wordQuery';
import {borderBottom} from '../../utils/color/color';
import WordCard from '../../components/Word/WordCard';

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

  return (
    <MainLayout
      headerProps={{
        title: selectedCategory?.name || '',
        leftIcon: 'back',
        rightIcon: 'new',
      }}
      withPadding={false}>
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
            <WordCard word={item} />
          </Div>
        )}
      />
    </MainLayout>
  );
};

export default CategoryDetail;
