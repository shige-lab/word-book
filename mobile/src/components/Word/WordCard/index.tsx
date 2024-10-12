import React from 'react';
import {Div, Text} from 'react-native-magnus';
import {Word} from '../../../types/navigator/type';
import {TouchableOpacity} from 'react-native';
import {navigationProp} from '../../../types/navigator/RouteProps';
import {useNavigation} from '@react-navigation/native';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import {RightSwipeIcon} from '../../Common/RightSwipeIcon';

interface WordCardProps {
  word: Word;
  onDelete: () => void;
}

const WordCard: React.FC<WordCardProps> = ({word, onDelete}) => {
  const navigation = useNavigation<navigationProp>();
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
        <Div h={40} py="sm" justifyContent="center">
          <Text fontSize={16} fontWeight="bold">
            {word.word}
          </Text>
        </Div>
      </Swipeable>
    </TouchableOpacity>
  );
};

export default WordCard;
