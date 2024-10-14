import React from 'react';
import {Div, Text} from 'react-native-magnus';
import {Word} from '../../../types/navigator/type';
import {TouchableOpacity} from 'react-native';
import {navigationProp} from '../../../types/navigator/RouteProps';
import {useNavigation} from '@react-navigation/native';
import Swipeable, {
  SwipeableMethods,
} from 'react-native-gesture-handler/ReanimatedSwipeable';
import {RightSwipeIcon} from '../../Common/RightSwipeIcon';
import {useColor} from '../../../hooks/common/useColor';
import ProficiencyAndFrequencyTagBadge from '../../Tag/ProficiencyAndFrequencyTagBadge';
import CustomCheckBox from '../../Common/CustomCheckBox';
import useStateStore from '../../../hooks/zustand/useStateStore';
import {useShallow} from 'zustand/react/shallow';

interface WordCardProps {
  word: Word;
  onDelete?: () => void;
  isEditMode?: boolean;
  resetSwipeable?: () => void;
}

const WordCard = React.forwardRef<SwipeableMethods, WordCardProps>(
  ({word, onDelete, isEditMode = false, resetSwipeable}, ref) => {
    const navigation = useNavigation<navigationProp>();
    const {primary} = useColor();
    const {categories, setCategories} = useStateStore(
      useShallow(state => ({
        categories: state.categories,
        setCategories: state.setCategories,
      })),
    );

    const baseItem = () => {
      return (
        <>
          <ProficiencyAndFrequencyTagBadge
            proficiency_id={word.proficiency_id}
            frequency_id={word.frequency_id}
          />
          <Text ml="md" fontSize={16} fontWeight="bold">
            {word.word}
          </Text>
        </>
      );
    };

    const card = () => {
      return (
        <Div w="100%" h={40} row py="sm" alignItems="center">
          {baseItem()}
        </Div>
      );
    };

    const editModeCard = () => {
      return (
        <Div w="100%" h={40} row py="sm" alignItems="center">
          {isEditMode && (
            <CustomCheckBox
              checked={!!word.selected}
              onPress={() => {
                setCategories(
                  categories.map(c =>
                    c.id === word.category_id
                      ? {
                          ...c,
                          words: (c?.words || []).map(w =>
                            w.id === word.id
                              ? {...w, selected: !w.selected}
                              : w,
                          ),
                        }
                      : c,
                  ),
                );
              }}
            />
          )}
          {baseItem()}
        </Div>
      );
    };

    if (isEditMode) {
      return editModeCard();
    }

    return (
      <TouchableOpacity
        onPressIn={
          !!resetSwipeable && onDelete ? () => resetSwipeable() : undefined
        }
        onPress={() => {
          navigation.navigate('Word', {
            id: word.id,
          });
        }}>
        {onDelete ? (
          <Swipeable
            ref={ref}
            onSwipeableWillOpen={() => !!resetSwipeable && resetSwipeable()}
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
        ) : (
          card()
        )}
      </TouchableOpacity>
    );
  },
);

export default WordCard;
