import React from 'react';
import {Div, Text} from 'react-native-magnus';
import {Category} from '../../types/navigator/type';
import {TouchableOpacity} from 'react-native';

const CategoryCard = ({category}: {category: Category}) => {
  return (
    <TouchableOpacity>
      <Div h={40} py="sm" justifyContent="center">
        <Text fontSize={16} fontWeight="bold">
          {category.name}
        </Text>
      </Div>
    </TouchableOpacity>
  );
};

export default CategoryCard;
