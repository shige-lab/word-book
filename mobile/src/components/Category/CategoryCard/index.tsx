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
          <Div ml="sm" mr="lg">
            <Checkbox
              checked={category.selected}
              onPress={() => {
                setCategories(
                  categories.map(c =>
                    c.id === category.id
                      ? {...c, selected: !category.selected}
                      : c,
                  ),
                );
              }}>
              {({checked}) => (
                <Div
                  bg={checked ? 'blue600' : 'transparent'}
                  w={20}
                  h={20}
                  borderWidth={2}
                  borderColor={checked ? 'blue600' : 'gray300'}
                  rounded="circle">
                  {checked && (
                    <Icon
                      name="check"
                      fontFamily="Feather"
                      fontSize={16}
                      color="white"
                    />
                  )}
                </Div>
              )}
            </Checkbox>
          </Div>
        )}
        <Icon
          name="folder"
          fontFamily="Feather"
          fontSize={20}
          color="gray500"
        />
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
