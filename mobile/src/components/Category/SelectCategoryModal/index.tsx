import React, {useEffect, useMemo, useState} from 'react';
import {Button, Div, Icon, Text} from 'react-native-magnus';
import {FlatList, TouchableOpacity} from 'react-native';
import {Category} from '../../../types/navigator/type';
import ModalLayout from '../../Common/ModalLayout';
import CategoryCard from '../CategoryCard';
import {borderBottom} from '../../../utils/color/color';
import CustomCheckBox from '../../Common/CustomCheckBox';

interface SelectCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (category_id: number) => void;
  categories: Category[];
  buttonText?: string;
}

const SelectCategoryModal: React.FC<SelectCategoryModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  categories,
  buttonText,
}) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>();

  useEffect(() => {
    if (!isOpen) {
      setSelectedCategoryId(undefined);
    }
  }, [isOpen]);

  const card = (category: Category) => {
    return (
      <Div w="100%" h={40} row py="sm" alignItems="center">
        <CustomCheckBox
          checked={category.id === selectedCategoryId}
          onPress={() => {
            setSelectedCategoryId(category.id);
          }}
        />
        <Icon
          name="folder"
          fontFamily="Feather"
          fontSize={20}
          color="gray500"
        />
        <Text ml="md" fontSize={16} fontWeight="bold">
          {category.name}
        </Text>
      </Div>
    );
  };

  return (
    <ModalLayout
      title={'Select Category'}
      isOpen={isOpen}
      onClose={onClose}
      isDisabled={!selectedCategoryId}
      buttonText={buttonText ? buttonText : 'Select'}
      onButtonPress={() => {
        !!selectedCategoryId && onSelect(selectedCategoryId);
      }}>
      <FlatList
        style={{width: '100%', padding: 8, paddingBottom: 50}}
        // contentContainerStyle={{
        //   paddingBottom: bottomSpace,
        // }}
        data={categories}
        renderItem={({item, index}) => (
          <Div
            {...(index !== categories?.length - 1
              ? {...borderBottom}
              : undefined)}>
            {card(item)}
          </Div>
        )}
      />
    </ModalLayout>
  );
};

export default SelectCategoryModal;
