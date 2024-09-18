import React, {useEffect, useState} from 'react';
import MainLayout from '../../components/MainLayout';
import {Button, Div, Text} from 'react-native-magnus';
import {getCategories} from '../../sqlite/queries/categories/categoriesQuery';
import useStateStore from '../../hooks/zustand/useStateStore';
import {useShallow} from 'zustand/react/shallow';
import {Category} from '../../types/navigator/type';
import {FlatList} from 'react-native';
import CategoryCard from '../../components/Category/CategoryCard';
import {useColor} from '../../hooks/common/useColor';
import {borderBottom} from '../../utils/color/color';
import CategoryModal from '../../components/Category/CategoryModal';

const Home: React.FC = () => {
  const {categories, setCategories} = useStateStore(
    useShallow(state => ({
      categories: state.categories,
      setCategories: state.setCategories,
    })),
  );
  const {baseColor} = useColor();

  useEffect(() => {
    const fetchData = async () => {
      const data = await getCategories();
      setCategories(data);
    };
    fetchData();
  }, [setCategories]);

  const onRightPress = () => {
    setIsOpen(true);
  };
  const [isOpen, setIsOpen] = useState(false);

  return (
    <MainLayout
      headerProps={{
        title: 'Word Book',
        leftIcon: 'setting',
        rightButton: [{icon: 'new', onPress: onRightPress}],
      }}
      withPadding={false}>
      <CategoryModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
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
            <CategoryCard category={item} />
          </Div>
        )}
      />
    </MainLayout>
  );
};

export default Home;
