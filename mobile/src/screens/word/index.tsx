import React, {useEffect, useState} from 'react';
import MainLayout from '../../components/MainLayout';
import {Div, Text, Icon} from 'react-native-magnus';
import useStateStore from '../../hooks/zustand/useStateStore';
import {useShallow} from 'zustand/react/shallow';
import {Word} from '../../types/navigator/type';
import {TouchableOpacity} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {navigationProp, WordRoute} from '../../types/navigator/RouteProps';
import {
  getWordDetail,
  moveWords,
  saveWord,
} from '../../sqlite/queries/words/wordQuery';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import axios from 'axios';
import {useSound} from '../../hooks/common/useSound';
import ProficiencyAndFrequencyTag from '../../components/Tag/ProficiencyAndFrequencyTag';
import {getProficiencyAndFrequency} from '../../sqlite/queries/tags/tagsQuery';
import WordFormModal from '../../components/Word/WordFormModal';
import SelectCategoryModal from '../../components/Category/SelectCategoryModal';
import {handleDeleteWord} from '../../utils/word/handleDeleteword';
import {fetchWordInfoFromDictionaryApi} from '../../hooks/api/fetchWordInfoFromDictionaryApi';

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
      console.log('fetchPronunciationAndPhonetics', data.audio, data.phonetic);
      if (!data.phonetic && !data.audio) {
        console.log(
          'fetchPronunciationAndPhonetics2',
          data.audio,
          data.phonetic,
        );
        fetchPronunciationAndPhonetics(data);
      }
    };
    if (id) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const [isVisibleSelectCategoryModal, setVisibleSelectCategoryModal] =
    useState(false);
  const fetchPronunciationAndPhonetics = async (d: Word) => {
    const data = await fetchWordInfoFromDictionaryApi(d.word);

    if (data.phonetics && data.phonetics.length > 0) {
      const newWord = {
        ...d,
        phonetic: data.phonetics[0]?.text || d?.phonetic,
        audio: data.phonetics[0]?.audio || d?.audio,
      };
      await saveWord(newWord);
      setSelectedWord(newWord as Word);
    }
  };

  return (
    <MainLayout
      headerProps={{
        title: selectedWord?.word || '',
        leftButton: {
          type: 'back',
        },
        rightButton: [
          {
            type: 'edit',
            onPress: () => {
              setIsOpened(true);
            },
          },
        ],
        menu: [
          {
            type: 'move',
            label: 'Move Word',
            onPress: () => {
              setVisibleSelectCategoryModal(true);
            },
          },
          {
            type: 'delete',
            label: 'Delete',
            onPress: async () => {
              if (selectedWord) {
                await handleDeleteWord({
                  word: selectedWord,
                  setCategories,
                  categories,
                  onSucess: () => {
                    navigation.goBack();
                  },
                });
              }
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
      {!!selectedWord && (
        <SelectCategoryModal
          isOpen={isVisibleSelectCategoryModal}
          onClose={() => setVisibleSelectCategoryModal(false)}
          onSelect={async category_id => {
            await moveWords({
              words: [selectedWord],
              categoryId: category_id,
              previousCategoryId: selectedWord?.category_id,
            });
            setCategories(
              categories.map(c =>
                c.id === category_id
                  ? {
                      ...c,
                      childrenLength: (c?.childrenLength || 0) + 1,
                    }
                  : c.id === selectedWord.category_id
                  ? {
                      ...c,
                      words: (c?.words || [])?.filter(
                        w => w.id !== selectedWord.id,
                      ),
                      childrenLength: (c?.childrenLength || 0) - 1,
                    }
                  : c,
              ),
            );
            setVisibleSelectCategoryModal(false);
          }}
          categories={categories?.filter(
            c => c.id !== selectedWord.category_id,
          )}
          buttonText="Move"
        />
      )}
      <Div w="100%">
        <Text fontSize={30} fontWeight="bold">
          {selectedWord?.word}
        </Text>
        {(!!selectedWord?.audio || !!selectedWord?.phonetic) && (
          <Div w="100%" flexDir="row" alignItems="center">
            <Text color="brand500" fontSize={16}>
              {selectedWord?.phonetic}
            </Text>
            <TouchableOpacity
              onPress={() => {
                playSound(selectedWord?.audio);
              }}>
              <Div ml={2}>
                <Icon
                  name="volume-high"
                  fontSize={24}
                  color="brand500"
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
