import React, {useEffect, useState} from 'react';
import MainLayout from '../../components/MainLayout';
import {Button, Div, Text} from 'react-native-magnus';
import {
  deleteCategory,
  getCategories,
} from '../../sqlite/queries/categories/categoriesQuery';
import useStateStore from '../../hooks/zustand/useStateStore';
import {useShallow} from 'zustand/react/shallow';
import {Category} from '../../types/navigator/type';
import {Alert, FlatList} from 'react-native';
import CategoryCard from '../../components/Category/CategoryCard';
import {useColor} from '../../hooks/common/useColor';
import {borderBottom} from '../../utils/color/color';
import CategoryModal from '../../components/Category/CategoryModal';
import {getProficiencyAndFrequency} from '../../sqlite/queries/tags/tagsQuery';

const Home: React.FC = () => {
  const {categories, setCategories, setProficiencies, setFrequencies} =
    useStateStore(
      useShallow(state => ({
        categories: state.categories,
        setCategories: state.setCategories,
        setProficiencies: state.setProficiencies,
        setFrequencies: state.setFrequencies,
      })),
    );
  const {baseColor} = useColor();

  useEffect(() => {
    const fetchData = async () => {
      const data = await getCategories();
      const d = await getProficiencyAndFrequency();
      setProficiencies(d?.proficiencies);
      setFrequencies(d?.frequencies);
      setCategories(data);
    };
    fetchData();
  }, [setCategories, setProficiencies, setFrequencies]);

  const onRightPress = () => {
    setIsOpen(true);
  };
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category>();

  const onDeleteCategory = (category: Category) => {
    const deleteCategoryAsync = async (category: Category) => {
      await deleteCategory(category);
      setCategories(categories.filter(c => c.id !== category.id));
    };
    Alert.alert(
      'Warning',
      'Are you sure you want to delete this category?',
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {text: 'OK', onPress: async () => deleteCategoryAsync(category)},
      ],
      {cancelable: false},
    );
  };

  return (
    <MainLayout
      headerProps={{
        title: 'Word Book',
        leftIcon: 'setting',
        rightButton: [{icon: 'new', onPress: onRightPress}],
      }}
      withPadding={false}>
      <CategoryModal
        category={selectedCategory}
        isOpen={isOpen || !!selectedCategory}
        onClose={() => {
          setIsOpen(false);
          setSelectedCategory(undefined);
        }}
      />
      <FlatList
        style={{width: '100%', padding: 8}}
        contentContainerStyle={{
          padding: 8,
          borderRadius: 10,
          //   backgroundColor: baseColor.base1,
        }}
        data={categories}
        renderItem={({item, index}) => (
          <Div
            {...(index !== categories?.length - 1
              ? {...borderBottom}
              : undefined)}>
            <CategoryCard
              category={item}
              onDelete={() => onDeleteCategory(item)}
              onLongPress={() => setSelectedCategory(item)}
            />
          </Div>
        )}
      />
    </MainLayout>
  );
};

export default Home;
