import React from 'react';
import {Div, Text} from 'react-native-magnus';
import {Word} from '../../types/navigator/type';
import {TouchableOpacity} from 'react-native';
import {navigationProp} from '../../types/navigator/RouteProps';
import {useNavigation} from '@react-navigation/native';

const WordCard = ({word}: {word: Word}) => {
  const navigation = useNavigation<navigationProp>();
  return (
    <TouchableOpacity>
      <Div h={40} py="sm" justifyContent="center">
        <Text fontSize={16} fontWeight="bold">
          {word.word}
        </Text>
      </Div>
    </TouchableOpacity>
  );
};

export default WordCard;
