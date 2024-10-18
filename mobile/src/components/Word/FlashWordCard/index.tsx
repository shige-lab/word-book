import React, {useEffect, useState} from 'react';
import {Div, Text, Icon, Radio} from 'react-native-magnus';
import useStateStore from '../../../hooks/zustand/useStateStore';
import {useShallow} from 'zustand/react/shallow';
import {Word} from '../../../types/navigator/type';
import {Dimensions, TouchableOpacity} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {navigationProp, WordRoute} from '../../../types/navigator/RouteProps';
import {saveWord} from '../../../sqlite/queries/words/wordQuery';
import {useSound} from '../../../hooks/common/useSound';
import {fetchWordInfoFromDictionaryApi} from '../../../hooks/api/fetchWordInfoFromDictionaryApi';
import ProficiencyAndFrequencyTagBadge from '../../Tag/ProficiencyAndFrequencyTagBadge';
import AudioButton from '../../Common/AudioButton';

interface FlashWordCardProps {
  word: Word;
}

const FlashWordCard: React.FC<FlashWordCardProps> = ({word}) => {
  const route = useRoute<WordRoute>();
  const navigation = useNavigation<navigationProp>();
  const id = route.params.id;
  const [selectedWord, setSelectedWord] = useState<Word>(word);
  const [isOpened, setIsOpened] = useState(false);
  const {width, height} = Dimensions.get('window');
  const [isFlipped, setIsFlipped] = useState(false);

  const {playSound, stopSound} = useSound();

  const {categories, setCategories, proficiencies, frequencies} = useStateStore(
    useShallow(state => ({
      categories: state.categories,
      setCategories: state.setCategories,
      proficiencies: state.proficiencies,
      frequencies: state.frequencies,
    })),
  );

  useEffect(() => {
    if (word) {
      setIsFlipped(false);
      setSelectedWord(word);
      if (!word.phonetic && !word.audio) {
        fetchPronunciationAndPhonetics(word?.word);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [word]);

  const [isVisibleSelectCategoryModal, setVisibleSelectCategoryModal] =
    useState(false);

  const fetchPronunciationAndPhonetics = async (w: string) => {
    const data = await fetchWordInfoFromDictionaryApi(w);

    if (data.phonetics && data.phonetics.length > 0) {
      const newWord = {
        ...selectedWord,
        phonetic: data.phonetics[0]?.text || selectedWord?.phonetic,
        audio: data.phonetics[0]?.audio || selectedWord?.audio,
      };
      await saveWord(newWord);
      setSelectedWord(newWord);
    }
  };

  const frontCard = () => {
    return (
      <>
        <Text fontSize={30} fontWeight="bold" color="white">
          {selectedWord?.word}
        </Text>
      </>
    );
  };

  const backCard = () => {
    return (
      <>
        <Text fontSize={20} color="white">
          {selectedWord?.meaning}
        </Text>
      </>
    );
  };

  return (
    <TouchableOpacity
      onPress={() => {
        setIsFlipped(!isFlipped);
      }}>
      <Div w="100%" h="100%" p={12} bg={isFlipped ? 'teal400' : 'brand300'}>
        <Div row alignItems="center" justifyContent="space-between">
          <Div>
            <Div
              w={32}
              h={32}
              bg="white"
              alignItems="center"
              justifyContent="center"
              rounded="circle">
              <ProficiencyAndFrequencyTagBadge
                proficiency_id={selectedWord?.proficiency_id}
                frequency_id={selectedWord?.frequency_id}
                size={26}
              />
            </Div>
            {/* <ProficiencyAndFrequencyTag
              word={selectedWord}
              setSelectedWord={setSelectedWord}
            /> */}
          </Div>
          <AudioButton
            audio={selectedWord.audio}
            word={selectedWord.word}
            size={30}
            color="white"
          />
        </Div>
        <Div alignItems="center" mt={100} mx="lg">
          {isFlipped ? backCard() : frontCard()}
        </Div>
        {isFlipped && (
          <Div mt={'auto'} mb={40}>
            <Radio.Group
              row
              alignSelf="center"
              onChange={async value => {
                await saveWord({
                  ...selectedWord,
                  proficiency_id: value,
                });
                setSelectedWord({
                  ...selectedWord,
                  proficiency_id: value,
                });
              }}
              defaultValue={
                proficiencies?.find(p => p.id === selectedWord?.proficiency_id)
                  ?.id
              }>
              {proficiencies?.map(p => (
                <Radio
                  mr="sm"
                  key={p.id}
                  value={p.id}
                  activeIcon={
                    <Icon
                      m={3}
                      // mr={2}
                      name={p.icon}
                      fontFamily="FontAwesome5"
                      color={
                        (frequencies.find(
                          f => f.id === selectedWord.frequency_id,
                        )?.color || 'brand') + '600'
                      }
                      fontSize={22}
                    />
                  }
                  checked={selectedWord?.proficiency_id === p.id}>
                  <Text fontSize={12} color="white">
                    {p.name}
                  </Text>
                </Radio>
              ))}
            </Radio.Group>
          </Div>
        )}

        {/* <Button
          onPress={() => navigation.navigate('Word', {id: selectedWord?.id})}>
          s
        </Button> */}
      </Div>
    </TouchableOpacity>
  );
};

export default FlashWordCard;
