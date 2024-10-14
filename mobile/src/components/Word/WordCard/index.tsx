import React from 'react';
import {Div, Text} from 'react-native-magnus';
import {Word} from '../../../types/navigator/type';
import {TouchableOpacity} from 'react-native';
import {navigationProp} from '../../../types/navigator/RouteProps';
import {useNavigation} from '@react-navigation/native';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import {RightSwipeIcon} from '../../Common/RightSwipeIcon';
import {useColor} from '../../../hooks/common/useColor';
import ProficiencyAndFrequencyTagBadge from '../../Tag/ProficiencyAndFrequencyTagBadge';
import CustomCheckBox from '../../Common/CustomCheckBox';
import useStateStore from '../../../hooks/zustand/useStateStore';
import {useShallow} from 'zustand/react/shallow';

interface WordCardProps {
  word: Word;
  onDelete: () => void;
  pressable?: boolean;
}

const WordCard: React.FC<WordCardProps> = ({
  word,
  onDelete,
  pressable = true,
}) => {
  const navigation = useNavigation<navigationProp>();
  const {primary} = useColor();
  const {categories, setCategories} = useStateStore(
    useShallow(state => ({
      categories: state.categories,
      setCategories: state.setCategories,
    })),
  );

  const card = () => {
    return (
      <Div w="100%" h={40} row py="sm" alignItems="center">
        {!pressable && (
          <CustomCheckBox
            checked={!!word.selected}
            onPress={() => {
              setCategories(
                categories.map(c =>
                  c.id === word.category_id
                    ? {
                        ...c,
                        words: (c?.words || []).map(w =>
                          w.id === word.id ? {...w, selected: !w.selected} : w,
                        ),
                      }
                    : c,
                ),
              );
            }}
          />
        )}
        <ProficiencyAndFrequencyTagBadge
          proficiency_id={word.proficiency_id}
          frequency_id={word.frequency_id}
        />
        <Text ml="md" fontSize={16} fontWeight="bold">
          {word.word}
        </Text>
      </Div>
    );
  };

  if (!pressable) {
    return card();
  }

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('Word', {
          id: word.id,
        });
      }}>
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
  );
};

export default WordCard;
