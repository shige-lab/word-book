import React, {useEffect, useState} from 'react';
import MainLayout from '../../components/MainLayout';
import {Button, Div, ScrollDiv, Text} from 'react-native-magnus';
import {
  deleteCategories,
  deleteCategory,
  getCategories,
  sortCategories,
} from '../../sqlite/queries/categories/categoriesQuery';
import useStateStore from '../../hooks/zustand/useStateStore';
import {useShallow} from 'zustand/react/shallow';
import {Category} from '../../types/navigator/type';
import {Alert, Dimensions, FlatList} from 'react-native';
import CategoryCard from '../../components/Category/CategoryCard';
import {useColor} from '../../hooks/common/useColor';
import {borderBottom} from '../../utils/color/color';
import CategoryModal from '../../components/Category/CategoryModal';
import {getProficiencyAndFrequency} from '../../sqlite/queries/tags/tagsQuery';
import {DragSortableView} from 'react-native-drag-sort';
import {LeftButtonProps} from '../../components/Header/Header';
import BottomActionButton from '../../components/Common/BottomActionButton';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const Home: React.FC = () => {
  const {categories, setCategories, setProficiencies, setFrequencies} =
    useStateStore(
      useShallow(state => ({
        categories: state.categories,
        setCategories: state.setCategories,
        setProficiencies: state.setProficiencies,
        setFrequencies: state.setFrequencies,
      })),
    );
  const {baseColor} = useColor();
  const {width} = Dimensions.get('window');

  useEffect(() => {
    const fetchData = async () => {
      const data = await getCategories();
      const d = await getProficiencyAndFrequency();
      setProficiencies(d?.proficiencies);
      setFrequencies(d?.frequencies);
      setCategories(data);
    };
    fetchData();
  }, [setCategories, setProficiencies, setFrequencies]);

  const onRightPress = () => {
    setIsOpen(true);
  };
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category>();
  const [isEditMode, setIsEditMode] = useState(false);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const insets = useSafeAreaInsets();
  const bottomSpace = insets.bottom + 10;

  const onDeleteCategory = (category: Category) => {
    const deleteCategoryAsync = async (category: Category) => {
      await deleteCategory(category);
      setCategories(categories.filter(c => c.id !== category.id));
    };
    Alert.alert(
      'Warning',
      'Are you sure you want to delete this category?',
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {text: 'OK', onPress: async () => deleteCategoryAsync(category)},
      ],
      {cancelable: false},
    );
  };

  const selectAll = (): LeftButtonProps => {
    const categoryLength = categories?.length;
    const selectedLength = categories?.filter(c => c.selected).length;
    if (categoryLength === selectedLength) {
      return {
        isNotIcon: true,
        type: 'deselect-all',
        onPress: () => {
          setCategories(categories.map(c => ({...c, selected: false})));
        },
      };
    } else {
      return {
        isNotIcon: true,
        type: 'select-all',
        onPress: () => {
          setCategories(categories.map(c => ({...c, selected: true})));
        },
      };
    }
  };

  const endEditMode = () => {
    setIsEditMode(false);
    setCategories(categories.map(c => ({...c, selected: false})));
  };

  return (
    <MainLayout
      headerProps={{
        title: 'Word Book',
        leftButton: isEditMode ? selectAll() : undefined,
        rightButton: isEditMode
          ? [{type: 'check', onPress: () => endEditMode()}]
          : [
              {type: 'edit', onPress: () => setIsEditMode(true)},
              {type: 'new', onPress: onRightPress},
            ],
      }}
      withPadding={false}>
      <CategoryModal
        category={selectedCategory}
        isOpen={isOpen || !!selectedCategory}
        onClose={() => {
          setIsOpen(false);
          setSelectedCategory(undefined);
        }}
      />
      {isEditMode ? (
        <ScrollDiv
          p={8}
          scrollEnabled={scrollEnabled}
          // contentContainerStyle={{paddingBottom:  bottomSpace}}
        >
          <DragSortableView
            dataSource={categories}
            parentWidth={width - 16}
            childrenWidth={width - 16}
            childrenHeight={40}
            scaleStatus={'scaleY'}
            onDragStart={() => {
              setScrollEnabled(false);
            }}
            onDragEnd={() => {
              setScrollEnabled(true);
            }}
            onDataChange={async data => {
              const c = await sortCategories(data);
              setCategories(c);
            }}
            keyExtractor={(item, index) => item.id} // FlatList作用一样，优化
            // onClickItem={(data, item, index) => {}}
            renderItem={(item, index) => (
              <Div
                w={width - 16}
                row
                {...(index !== categories?.length - 1
                  ? {...borderBottom}
                  : undefined)}>
                <CategoryCard
                  pressable={!isEditMode}
                  category={item}
                  onDelete={() => onDeleteCategory(item)}
                  onLongPress={() => setSelectedCategory(item)}
                />
              </Div>
            )}
          />
        </ScrollDiv>
      ) : (
        <FlatList
          style={{width: '100%', padding: 8, paddingBottom: 50}}
          contentContainerStyle={{
            paddingBottom: bottomSpace,
          }}
          data={categories}
          renderItem={({item, index}) => (
            <Div
              row
              {...(index !== categories?.length - 1
                ? {...borderBottom}
                : undefined)}>
              <CategoryCard
                category={item}
                onDelete={() => onDeleteCategory(item)}
                onLongPress={() => setSelectedCategory(item)}
              />
            </Div>
          )}
        />
      )}
      {isEditMode && (
        <BottomActionButton
          onCancel={() => endEditMode()}
          actions={[
            {
              label: 'Delete',
              onPress: () => {
                const selected = categories.filter(c => c.selected);
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
                        await deleteCategories(selected);
                        setCategories(categories.filter(c => !c.selected));
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

export default Home;
