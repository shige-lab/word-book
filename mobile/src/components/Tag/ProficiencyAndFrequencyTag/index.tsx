import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Word} from '../../../types/navigator/type';
import {Div, Text, Icon, Tag, Select, SelectRef} from 'react-native-magnus';
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
import {saveWord} from '../../../sqlite/queries/words/wordQuery';

interface ProficiencyAndFrequencyTagProps {
  word: Word;
  setSelectedWord?: (word: Word) => void;
}

const ProficiencyAndFrequencyTag: React.FC<ProficiencyAndFrequencyTagProps> = ({
  word,
  setSelectedWord,
}) => {
  const {proficiencies, frequencies} = useStateStore(
    useShallow(state => ({
      proficiencies: state.proficiencies,
      frequencies: state.frequencies,
    })),
  );
  const selectProficiencyRef = useRef<SelectRef>(null);
  const selectFrequencyRef = useRef<SelectRef>(null);

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
      <Select
        value={word?.proficiency_id}
        onSelect={async v => {
          const w = await saveWord({
            ...word,
            proficiency_id: v,
          });
          if (setSelectedWord) {
            setSelectedWord(w);
          }
        }}
        ref={selectProficiencyRef}
        title="Select Proficiency"
        mt="md"
        message=""
        roundedTop="xl"
        data={proficiencies}
        renderItem={item => (
          <Select.Option value={item.id} py="md" px="xl">
            <Text fontWeight="bold" color={getProficiencyTagColor(item.id)?.bg}>
              {item.name}
            </Text>
          </Select.Option>
        )}
      />
      <Select
        value={word?.frequency_id}
        onSelect={async v => {
          const w = await saveWord({
            ...word,
            frequency_id: v,
          });
          if (setSelectedWord) {
            setSelectedWord(w);
          }
        }}
        ref={selectFrequencyRef}
        title="Select Frequency"
        mt="md"
        message=""
        roundedTop="xl"
        data={frequencies}
        renderItem={item => (
          <Select.Option value={item.id} py="md" px="xl">
            <Text fontWeight="bold" color={getFrequencyTagColor(item.id)?.bg}>
              {item.name}
            </Text>
          </Select.Option>
        )}
      />
      <Tag
        onPress={() => {
          selectProficiencyRef.current?.open();
        }}
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
        onPress={() => {
          selectFrequencyRef.current?.open();
        }}
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
