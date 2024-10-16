import React, {useCallback, useEffect, useMemo, useState} from 'react';
import MainLayout from '../../components/MainLayout';
import {Div, Text, Icon} from 'react-native-magnus';
import useStateStore from '../../hooks/zustand/useStateStore';
import {useShallow} from 'zustand/react/shallow';
import {Word} from '../../types/navigator/type';
import {Alert, StyleSheet, TouchableOpacity, View} from 'react-native';
import {FlashCardRoute, navigationProp} from '../../types/navigator/RouteProps';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {searchWords} from '../../sqlite/queries/words/wordQuery';
import FlashWordCard from '../../components/Word/FlashWordCard';
import {headerColor} from '../../utils/color/color';
import Swiper from 'react-native-swiper';

const FlashCard: React.FC = () => {
  const navigation = useNavigation<navigationProp>();
  const route = useRoute<FlashCardRoute>();
  const [words, setWords] = useState<Word[]>([]);
  const [targetWords, setTargetWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const limit = route.params.limit || 10;

  const {categories, setCategories} = useStateStore(
    useShallow(state => ({
      categories: state.categories,
      setCategories: state.setCategories,
    })),
  );

  useFocusEffect(
    useCallback(
      () => {
        const searchAsync = async () => {
          const data = await searchWords(route.params);
          setWords(data);
          setTargetWords(data.slice(0, limit));
        };
        searchAsync();
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [route.params],
    ),
  );

  return (
    <MainLayout
      withPadding={false}
      headerProps={{
        title: `${currentIndex + 1}/${targetWords.length}`,
        rightButton: [
          {
            type: 'check',
            onPress: () => {
              navigation.goBack();
            },
            isNotIcon: true,
          },
        ],
      }}>
      <Swiper
        key={targetWords.length}
        loadMinimal
        onIndexChanged={index => {
          if (currentIndex === targetWords.length - 1 && index === 0) {
            console.log(
              '---',
              targetWords?.[targetWords.length - 1],
              words?.[words.length - 1],
            );

            const isFinished =
              targetWords?.[targetWords.length - 1].id ===
              words?.[words.length - 1].id;
            Alert.alert('Great job!', "You've finished all the words", [
              {
                text: 'Stay here',
              },
              !isFinished
                ? {
                    text: 'Go next',
                    onPress: () => {
                      const lastWordIndex = words.findIndex(
                        word =>
                          word.id === targetWords[targetWords.length - 1].id,
                      );
                      const nextIndex = lastWordIndex + 1;
                      setTargetWords([
                        ...words.slice(nextIndex, nextIndex + limit),
                      ]);
                    },
                  }
                : {
                    text: 'Finish',
                    onPress: () => {
                      navigation.goBack();
                    },
                  },
            ]);
          }
          console.log('index', index);
          setCurrentIndex(index);
        }}
        // bounces={true}
        // on={() => {
        //   console.log('onTouchEnd');
        // }}
        // index={currentIndex}
        // loop={false}
        // showsButtons={true}
        showsPagination={false}>
        {targetWords.map((word, index) => {
          return <FlashWordCard word={word} key={index} />;
        })}
      </Swiper>
    </MainLayout>
  );
};

export default FlashCard;
