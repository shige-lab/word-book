import React, {useEffect, useMemo, useRef, useState} from 'react';
import MainLayout from '../../components/MainLayout';
import {Div, Text} from 'react-native-magnus';
import useStateStore from '../../hooks/zustand/useStateStore';
import {useShallow} from 'zustand/react/shallow';
import {FlatList} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {CategoryRoute, navigationProp} from '../../types/navigator/RouteProps';
import {
  deleteWords,
  getWords,
  moveWords,
} from '../../sqlite/queries/words/wordQuery';
import {borderBottom} from '../../utils/color/color';
import WordCard from '../../components/Word/WordCard';
import WordFormModal from '../../components/Word/WordFormModal';
import {Alert} from 'react-native';
import {LeftButtonProps} from '../../components/Header/Header';
import BottomActionButton from '../../components/Common/BottomActionButton';
import SelectCategoryModal from '../../components/Category/SelectCategoryModal';
import {handleDeleteWord} from '../../utils/word/handleDeleteword';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {SwipeableMethods} from 'react-native-gesture-handler/lib/typescript/components/ReanimatedSwipeable';
import {Category} from '../../types/navigator/type';

const CategoryDetail: React.FC = () => {
  const route = useRoute<CategoryRoute>();
  const navigation = useNavigation<navigationProp>();
  const {id} = route.params;
  const insets = useSafeAreaInsets();
  const bottomSpace = insets.bottom + 10;
  const [isEditMode, setIsEditMode] = useState(false);
  const [isVisibleSelectCategoryModal, setVisibleSelectCategoryModal] =
    useState(false);
  const {categories, setCategories} = useStateStore(
    useShallow(state => ({
      categories: state.categories,
      setCategories: state.setCategories,
    })),
  );
  const [isOpened, setIsOpened] = useState(false);
  const swipeableRef = useRef<SwipeableMethods[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const category = selectedCategory || categories.find(c => c.id === id);
      if (category) {
        const data = await getWords(id);
        setCategories(
          categories.map(c => (c.id === id ? {...c, words: data} : c)),
        );
      }
    };
    if (id) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const selectedCategory = useMemo(() => {
    return categories.find(c => c.id === id);
  }, [categories, id]);

  const selectAll = (): LeftButtonProps => {
    const wordLength = selectedCategory?.words?.length;
    const selectedLength = selectedCategory?.words?.filter(
      w => w.selected,
    )?.length;
    if (wordLength === selectedLength) {
      return {
        isNotIcon: true,
        type: 'deselect-all',
        onPress: () => {
          setCategories(
            categories.map(c =>
              c.id === selectedCategory?.id
                ? {
                    ...c,
                    words: (c?.words || [])?.map(w => ({
                      ...w,
                      selected: false,
                    })),
                  }
                : c,
            ),
          );
        },
      };
    } else {
      return {
        isNotIcon: true,
        type: 'select-all',
        onPress: () => {
          setCategories(
            categories.map(c =>
              c.id === selectedCategory?.id
                ? {
                    ...c,
                    words: (c?.words || [])?.map(w => ({
                      ...w,
                      selected: true,
                    })),
                  }
                : c,
            ),
          );
        },
      };
    }
  };

  const endEditMode = () => {
    setIsEditMode(false);
    setCategories(
      categories.map(c =>
        c.id === selectedCategory?.id
          ? {...c, words: (c?.words || [])?.map(w => ({...w, selected: false}))}
          : c,
      ),
    );
  };

  const resetSwipeable = (index?: number) => {
    for (let i = 0; i < swipeableRef.current.length; i++) {
      if (i === index) {
        continue;
      }
      swipeableRef?.current?.[i]?.close();
    }
  };

  return (
    <MainLayout
      headerProps={{
        title: selectedCategory?.name || '',
        leftButton: isEditMode
          ? selectAll()
          : {
              type: 'back',
            },
        rightButton: isEditMode
          ? [{type: 'check', onPress: () => endEditMode(), isNotIcon: true}]
          : [
              ...(selectedCategory?.words?.length
                ? [
                    {
                      type: 'flash-card',
                      onPress: () =>
                        navigation.navigate('FlashCard', {
                          category_id: selectedCategory?.id,
                        }),
                    },
                    {
                      type: 'edit',
                      onPress: () => setIsEditMode(true),
                    },
                  ]
                : []),
              {type: 'new', onPress: () => setIsOpened(true)},
            ],
      }}
      withPadding={false}>
      {!!selectedCategory && (
        <WordFormModal
          isOpen={isOpened}
          onClose={() => setIsOpened(false)}
          category_id={selectedCategory.id}
        />
      )}
      {!!selectedCategory && (
        <SelectCategoryModal
          isOpen={isVisibleSelectCategoryModal}
          onClose={() => setVisibleSelectCategoryModal(false)}
          onSelect={async category_id => {
            await moveWords({
              words: selectedCategory?.words?.filter(w => w.selected) || [],
              categoryId: category_id,
              previousCategoryId: selectedCategory?.id,
            });
            setCategories(
              categories.map(c =>
                c.id === category_id
                  ? {
                      ...c,
                      childrenLength:
                        (c?.childrenLength || 0) +
                        (selectedCategory?.words?.filter(w => w.selected)
                          ?.length || 0),
                    }
                  : c.id === selectedCategory?.id
                  ? {
                      ...c,
                      words: (selectedCategory?.words || [])?.filter(
                        w => !w.selected,
                      ),
                      childrenLength:
                        (c?.childrenLength || 0) -
                        (selectedCategory?.words?.filter(w => w.selected)
                          ?.length || 0),
                    }
                  : c,
              ),
            );
            setVisibleSelectCategoryModal(false);
          }}
          categories={categories?.filter(c => c.id !== selectedCategory?.id)}
          buttonText="Move"
        />
      )}
      {!selectedCategory?.words?.length && (
        <Div mt={50} alignItems="center">
          <Text fontSize="xl" color="gray500">
            No words found.
          </Text>
        </Div>
      )}
      <FlatList
        // style={{width: '100%', padding: 12}}
        contentContainerStyle={{
          padding: 12,
          borderRadius: 10,
          paddingBottom: !isEditMode ? bottomSpace : 10,
          //   backgroundColor: baseColor.base1,
        }}
        onScroll={() => resetSwipeable()}
        data={selectedCategory?.words || []}
        renderItem={({item, index}) => (
          <Div
            {...(index !== (selectedCategory?.words || [])?.length - 1
              ? {...borderBottom}
              : undefined)}>
            <WordCard
              ref={el => {
                if (el) {
                  swipeableRef.current[index] = el;
                }
              }}
              word={item}
              onDelete={async () => {
                await handleDeleteWord({
                  word: item,
                  setCategories,
                  categories,
                  onSucess: () => {
                    swipeableRef.current.splice(index, 1);
                  },
                });
                if (swipeableRef.current[index]) {
                  swipeableRef.current[index].close();
                }
              }}
              isEditMode={isEditMode}
              resetSwipeable={() => resetSwipeable(index)}
            />
          </Div>
        )}
      />
      {isEditMode && (
        <BottomActionButton
          onCancel={() => endEditMode()}
          actions={[
            {
              disabled: !selectedCategory?.words?.filter(w => w.selected)
                ?.length,
              label: 'Move',
              onPress: () => {
                setVisibleSelectCategoryModal(true);
              },
            },
            {
              disabled: !selectedCategory?.words?.filter(w => w.selected)
                ?.length,
              label: 'Delete',
              onPress: () => {
                const selected =
                  selectedCategory?.words?.filter(c => c.selected) || [];
                if (selected.length === 0) {
                  return;
                }
                Alert.alert(
                  'Warning',
                  'Are you sure you want to delete these categories?',
                  [
                    {
                      text: 'Cancel',
                      onPress: () => {},
                      style: 'cancel',
                    },
                    {
                      text: 'OK',
                      onPress: async () => {
                        await deleteWords(selected);
                        swipeableRef.current = swipeableRef.current.filter(
                          (c, index) =>
                            !selectedCategory?.words
                              ?.filter(w => w.selected)
                              .some(
                                w =>
                                  w.id === selectedCategory?.words?.[index].id,
                              ),
                        );
                        setCategories(
                          categories.map(c =>
                            c.id === selectedCategory?.id
                              ? {
                                  ...c,
                                  words: (c?.words || [])?.filter(
                                    w => !w.selected,
                                  ),
                                  childrenLength:
                                    (c?.childrenLength || 0) - selected.length,
                                }
                              : c,
                          ),
                        );
                      },
                    },
                  ],
                  {cancelable: false},
                );
              },
            },
          ]}
        />
      )}
    </MainLayout>
  );
};

export default CategoryDetail;
