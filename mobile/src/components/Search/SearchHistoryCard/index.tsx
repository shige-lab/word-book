import React from 'react';
import {Div, Icon, Text} from 'react-native-magnus';
import {SearchHistory} from '../../../types/navigator/type';
import {getIconProps} from '../../../utils/icon/getIconProps';
import {TouchableOpacity} from 'react-native';

interface SearchHistoryCardProps {
  history: SearchHistory;
  onPress: () => void;
  onDelete: () => void;
}

const SearchHistoryCard: React.FC<SearchHistoryCardProps> = ({
  history,
  onPress,
  onDelete,
}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Div w="100%" h={40} row py="sm" alignItems="center">
        <Icon {...getIconProps('history')} fontSize={18} color="gray700" />
        <Text ml="md" fontSize={16} fontWeight="bold">
          {history.word}
        </Text>
        <Div ml="auto">
          <TouchableOpacity onPress={onDelete}>
            <Icon {...getIconProps('close')} fontSize={20} color="gray500" />
          </TouchableOpacity>
        </Div>
      </Div>
    </TouchableOpacity>
  );
};

export default SearchHistoryCard;
