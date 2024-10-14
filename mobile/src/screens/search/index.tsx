import React, {useEffect, useRef, useState} from 'react';
import MainLayout from '../../components/MainLayout';
import {Button, Div, Icon, Input, ScrollDiv, Text} from 'react-native-magnus';
import {
  deleteCategories,
  deleteCategory,
  getCategories,
  sortCategories,
} from '../../sqlite/queries/categories/categoriesQuery';
import {headerColor} from '../../utils/color/color';
import {TouchableOpacity, TextInput} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {navigationProp} from '../../types/navigator/RouteProps';
import {getIconProps} from '../../utils/icon/getIconProps';
import {SearchHistory, Word} from '../../types/navigator/type';
import {searchWords} from '../../sqlite/queries/words/wordQuery';
import {FlatList} from 'react-native';
import WordCard from '../../components/Word/WordCard';
import SearchHistoryCard from '../../components/Search/SearchHistoryCard';
import {
  deleteSearchHistory,
  getSearchHistories,
  saveSearchHistory,
} from '../../sqlite/queries/searchHistories/searchHistoriesQuery';

const Search: React.FC = () => {
  const navigation = useNavigation<navigationProp>();
  const [word, setWord] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchedWords, setSearchedWords] = useState<Word[]>([]);
  const [searchHistories, setSearchHistories] = useState<SearchHistory[]>([]);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    const getHistoriesAndFocusInput = async () => {
      const h = await getSearchHistories();
      console.log('useEffect getHistoriesAndFocusInput h', h);

      setSearchHistories(h);
      inputRef?.current?.focus();
    };
    getHistoriesAndFocusInput();
  }, []);

  const onSubmit = (w: string) => {
    const onSearch = async () => {
      const data = await searchWords(w);
      console.log('data', data);

      setSearchedWords(data);
      setIsSearching(false);
      await saveSearchHistory(w);
      const newHistory = {word: w, created_at: new Date()} as SearchHistory;
      console.log('onSubmit newHistory', newHistory);

      setSearchHistories(histories => {
        return [newHistory, ...histories?.filter(h => h.word !== w)];
      });
    };
    onSearch();
  };

  const searchBar = () => {
    return (
      <Div
        bg={headerColor}
        h={50}
        px="lg"
        py="xs"
        flexDir="row"
        justifyContent="space-between"
        w={'100%'}
        alignSelf="center"
        alignItems="center">
        <Div flex={1} alignItems="flex-start">
          <Input
            ref={inputRef}
            py={0}
            px="md"
            h={30}
            value={word}
            prefix={<Icon {...getIconProps('search')} fontSize={18} />}
            placeholder="Keyword search"
            onFocus={() => {
              setIsSearching(true);
            }}
            onChangeText={e => {
              setWord(e);
            }}
            onSubmitEditing={() => {
              onSubmit(word);
            }}
            suffix={
              word?.length ? (
                <Button
                  rounded="circle"
                  p={3}
                  bg="gray400"
                  onPress={() => {
                    setWord('');
                    setIsSearching(true);
                    inputRef?.current?.focus();
                  }}>
                  <Icon
                    {...getIconProps('close')}
                    fontSize={12}
                    color="black"
                  />
                </Button>
              ) : null
            }
          />
        </Div>
        <Div ml="lg" w={60} alignItems="flex-start">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text fontSize={18} color="white">
              Cancel
            </Text>
          </TouchableOpacity>
        </Div>
      </Div>
    );
  };

  const searchResult = () => {
    return (
      <>
        {searchedWords?.length ? (
          <FlatList
            data={searchedWords}
            renderItem={({item}) => {
              return <WordCard word={item} />;
            }}
          />
        ) : (
          <Div mt={50} alignItems="center">
            <Text fontSize="xl" color="gray500">
              No results found.
            </Text>
          </Div>
        )}
      </>
    );
  };
  console.log('searchHistories', searchHistories);

  const searchHistory = () => {
    return (
      <Div mt={30} mx="lg">
        <Text fontSize={20} fontWeight="bold" mb="md">
          Recent Searches
        </Text>
        {searchHistories?.slice(0, 5)?.map((item, index) => {
          return (
            <Div key={index}>
              <SearchHistoryCard
                history={item}
                onPress={() => {
                  setWord(item.word);
                  onSubmit(item.word);
                }}
                onDelete={async () => {
                  await deleteSearchHistory(item.word);
                  console.log('delete', searchHistories);

                  setSearchHistories(histories =>
                    histories.filter(h => h.word !== item.word),
                  );
                }}
              />
            </Div>
          );
        })}
      </Div>
    );
  };

  return (
    <MainLayout withPadding={false}>
      {searchBar()}
      <Div>{isSearching ? searchHistory() : searchResult()}</Div>
    </MainLayout>
  );
};

export default Search;
