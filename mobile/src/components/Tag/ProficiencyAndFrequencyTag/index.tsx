import React, {useEffect, useMemo, useState} from 'react';
import {Word} from '../../../types/navigator/type';
import {Div, Text, Icon, Tag} from 'react-native-magnus';
import useStateStore from '../../../hooks/zustand/useStateStore';
import {useShallow} from 'zustand/react/shallow';
import {
  frequencyTagColor,
  getFrequencyTagColor,
  getMixedTagColor,
  getProficiencyTagColor,
  mixedTagColors,
  proficiencyTagColor,
} from '../../../utils/color/getTagColor';

interface ProficiencyAndFrequencyTagProps {
  word: Word;
}

const ProficiencyAndFrequencyTag: React.FC<ProficiencyAndFrequencyTagProps> = ({
  word,
}) => {
  const {proficiencies, frequencies} = useStateStore(
    useShallow(state => ({
      proficiencies: state.proficiencies,
      frequencies: state.frequencies,
    })),
  );

  const tag = useMemo(() => {
    return {
      proficiency: proficiencies.find(p => p.id === word?.proficiency_id),
      frequency: frequencies.find(f => f.id === word?.frequency_id),
      proficiencyTagColor: getProficiencyTagColor(word?.proficiency_id),
      frequencyTagColor: getFrequencyTagColor(word?.frequency_id),
    };
  }, [word, proficiencies, frequencies]);

  if (!tag?.proficiency || !tag?.frequency) {
    return null;
  }

  return (
    <Div flexDir="row">
      {/* <Div
        rounded={5}
        h={20}
        w={20}
        bg={getMixedTagColor(tag?.proficiency?.id, tag?.frequency?.id)}
        mr={2}
	/> */}
      <Tag
        fontSize={12}
        h={18}
        py={0}
        px={5}
        mr={2}
        bg={tag?.proficiencyTagColor?.bg}
        color={tag?.proficiencyTagColor?.color}>
        {tag?.proficiency?.name}
      </Tag>
      <Tag
        fontSize={12}
        h={18}
        px={5}
        py={0}
        bg={tag?.frequencyTagColor?.bg}
        color={tag?.frequencyTagColor?.color}>
        {tag?.frequency?.name}
      </Tag>
    </Div>
  );
};

export default ProficiencyAndFrequencyTag;
