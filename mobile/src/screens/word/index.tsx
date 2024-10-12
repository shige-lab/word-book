import React, {useEffect, useState} from 'react';
import MainLayout from '../../components/MainLayout';
import {Div, Text, Icon} from 'react-native-magnus';
import useStateStore from '../../hooks/zustand/useStateStore';
import {useShallow} from 'zustand/react/shallow';
import {Word} from '../../types/navigator/type';
import {TouchableOpacity} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {navigationProp, WordRoute} from '../../types/navigator/RouteProps';
import {getWordDetail} from '../../sqlite/queries/words/wordQuery';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import axios from 'axios';
import {useSound} from '../../hooks/common/useSound';
import ProficiencyAndFrequencyTag from '../../components/Tag/ProficiencyAndFrequencyTag';
import {getProficiencyAndFrequency} from '../../sqlite/queries/tags/tagsQuery';
import WordFormModal from '../../components/Word/WordFormModal';

const WordDetail: React.FC = () => {
  const route = useRoute<WordRoute>();
  const navigation = useNavigation<navigationProp>();
  const id = route.params.id;
  const [selectedWord, setSelectedWord] = useState<Word>();
  const [isOpened, setIsOpened] = useState(false);

  const {playSound, stopSound} = useSound();

  const performSearch = async () => {
    if ((await InAppBrowser.isAvailable()) && selectedWord?.word?.trim()) {
      const query = encodeURIComponent(selectedWord?.word);
      const googleImageSearchUrl = `https://www.google.com/search?tbm=isch&q=${query}`;
      await InAppBrowser.open(googleImageSearchUrl, {
        // iOS Properties
        dismissButtonStyle: 'cancel',
        readerMode: false,
        animated: true,
        modalPresentationStyle: 'fullScreen',
        modalTransitionStyle: 'coverVertical',
        modalEnabled: true,
        enableBarCollapsing: false,
      });
    }
  };
  console.log('---', id, selectedWord);

  const {categories, setCategories} = useStateStore(
    useShallow(state => ({
      categories: state.categories,
      setCategories: state.setCategories,
    })),
  );

  useEffect(() => {
    const fetchData = async () => {
      const data = await getWordDetail(id);
      setSelectedWord(data);
      fetchPronunciationAndPhonetics(data?.word);
    };
    if (id) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const [phonetics, setPhonetics] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPronunciationAndPhonetics = async (w: string) => {
    if (!w?.trim()) {
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${w}`,
      );
      const data = response.data[0];

      // Extract phonetic symbols and audio from the API response
      if (data.phonetics && data.phonetics.length > 0) {
        setPhonetics(data.phonetics);
        console.log(
          '---phonetics---',
          data.meanings?.map(m => m.definitions),
        );
      } else {
        setPhonetics([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setPhonetics([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout
      headerProps={{
        title: selectedWord?.word || '',
        leftIcon: 'back',
        rightButton: [
          {
            icon: 'edit',
            onPress: () => {
              setIsOpened(true);
            },
          },
        ],
      }}>
      {!!selectedWord && (
        <WordFormModal
          isOpen={isOpened}
          onClose={() => setIsOpened(false)}
          word={selectedWord}
          category_id={selectedWord.category_id}
          onSave={w => {
            setSelectedWord(w);
          }}
        />
      )}
      <Div w="100%">
        <Text fontSize={30} fontWeight="bold">
          {selectedWord?.word}
        </Text>
        {!!phonetics?.[0] && (
          <Div w="100%" flexDir="row" alignItems="center">
            <Text color="blue500" fontSize={16}>
              {phonetics?.[0]?.text}
            </Text>
            <TouchableOpacity
              onPress={() => {
                playSound(phonetics[0].audio);
              }}>
              <Div ml={2}>
                <Icon
                  name="volume-high"
                  fontSize={24}
                  color="blue500"
                  fontFamily="MaterialCommunityIcons"
                />
              </Div>
            </TouchableOpacity>
          </Div>
        )}
        {!!selectedWord && (
          <Div mt="md">
            <ProficiencyAndFrequencyTag
              word={selectedWord}
              setSelectedWord={setSelectedWord}
            />
          </Div>
        )}
        <Div mt="md" mb="lg">
          <Text mb="sm" fontSize={16} fontWeight="bold">
            meaning:
          </Text>
          <Text fontSize={16}>{selectedWord?.meaning}</Text>
        </Div>
        {(!!selectedWord?.example1 ||
          !!selectedWord?.example2 ||
          !!selectedWord?.example3) && (
          <Div>
            <Text mb="sm" fontSize={16} fontWeight="bold">
              examples:
            </Text>
            {!!selectedWord?.example1 && (
              <Text fontSize={16} mb="sm">
                1. {selectedWord?.example1}
              </Text>
            )}
            {!!selectedWord?.example2 && (
              <Text fontSize={16} mb="sm">
                2. {selectedWord?.example2}
              </Text>
            )}
            {!!selectedWord?.example3 && (
              <Text fontSize={16} mb="sm">
                3. {selectedWord?.example3}
              </Text>
            )}
          </Div>
        )}
        {!!selectedWord?.note && (
          <Div>
            <Text mb="sm" fontSize={16} fontWeight="bold">
              note:
            </Text>
            <Text fontSize={16}>{selectedWord?.note}</Text>
          </Div>
        )}
        <TouchableOpacity
          onPress={() => {
            performSearch();
          }}>
          <Text color="blue400">see images</Text>
        </TouchableOpacity>
      </Div>
    </MainLayout>
  );
};

export default WordDetail;
