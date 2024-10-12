import React from 'react';
import {Div, Text} from 'react-native-magnus';
import {Category} from '../../../types/navigator/type';
import {TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {navigationProp} from '../../../types/navigator/RouteProps';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import {RightSwipeIcon} from '../../Common/RightSwipeIcon';

interface CategoryCardProps {
  category: Category;
  onDelete: () => void;
  onLongPress?: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  onDelete,
  onLongPress,
}) => {
  const navigation = useNavigation<navigationProp>();
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('Category', {
          id: category.id,
        })
      }
      onLongPress={onLongPress}>
      <Swipeable
        renderRightActions={(prog, drag) =>
          RightSwipeIcon({
            onPress: onDelete,
            icon: 'delete',
            prog,
            drag,
          })
        }>
        <Div h={40} py="sm" justifyContent="center">
          <Text fontSize={16} fontWeight="bold">
            {category.name}
          </Text>
        </Div>
      </Swipeable>
    </TouchableOpacity>
  );
};

export default CategoryCard;
