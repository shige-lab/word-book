import React from 'react';
import {Div, Text} from 'react-native-magnus';
import {Category} from '../../types/navigator/type';
import {TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {navigationProp} from '../../types/navigator/RouteProps';

const CategoryCard = ({category}: {category: Category}) => {
  const navigation = useNavigation<navigationProp>();
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('Category', {
          id: category.id,
        })
      }>
      <Div h={40} py="sm" justifyContent="center">
        <Text fontSize={16} fontWeight="bold">
          {category.name}
        </Text>
      </Div>
    </TouchableOpacity>
  );
};

export default CategoryCard;
