import React from 'react';
import {Checkbox, Div, Icon, Text} from 'react-native-magnus';
import {Category} from '../../../types/navigator/type';
import {TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {navigationProp} from '../../../types/navigator/RouteProps';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import {RightSwipeIcon} from '../../Common/RightSwipeIcon';
import useStateStore from '../../../hooks/zustand/useStateStore';
import {useShallow} from 'zustand/react/shallow';
import CustomCheckBox from '../../Common/CustomCheckBox';
import {getIconProps} from '../../../utils/icon/getIconProps';

interface CategoryCardProps {
  category: Category;
  onDelete: () => void;
  onLongPress?: () => void;
  pressable?: boolean;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  onDelete,
  onLongPress,
  pressable = true,
}) => {
  const navigation = useNavigation<navigationProp>();
  const {categories, setCategories} = useStateStore(
    useShallow(state => ({
      categories: state.categories,
      setCategories: state.setCategories,
    })),
  );
  if (category.selected) {
  }
  const card = () => {
    return (
      <Div w="100%" h={40} row py="sm" alignItems="center">
        {!pressable && (
          <CustomCheckBox
            checked={!!category.selected}
            onPress={() => {
              setCategories(
                categories.map(c =>
                  c.id === category.id ? {...c, selected: !c.selected} : c,
                ),
              );
            }}
          />
        )}
        <Icon {...getIconProps('folder')} fontSize={20} color="gray500" />
        <Text ml="md" fontSize={16} fontWeight="bold">
          {category.name} ({category.childrenLength})
        </Text>
        {!pressable && (
          <Div ml="auto">
            <Icon
              name="menu"
              fontFamily="Feather"
              fontSize={20}
              color="gray700"
            />
          </Div>
        )}
      </Div>
    );
  };

  if (!pressable) {
    return card();
  }

  return (
    <Div w="100%">
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
          {card()}
        </Swipeable>
      </TouchableOpacity>
    </Div>
  );
};

export default CategoryCard;
