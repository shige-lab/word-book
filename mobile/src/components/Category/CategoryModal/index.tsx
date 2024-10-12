import React, {useEffect, useRef, useState} from 'react';
import {Div, Text, Button, ScrollDiv, Input} from 'react-native-magnus';
import {
  Dimensions,
  Platform,
  TouchableOpacity,
  View,
  Modal,
  Keyboard,
  KeyboardAvoidingView,
  TextInput,
  Alert,
} from 'react-native';
import {Category} from '../../../types/navigator/type';
import {useFormik} from 'formik';
import {headerColor} from '../../../utils/color/color';
import useStateStore from '../../../hooks/zustand/useStateStore';
import {useShallow} from 'zustand/react/shallow';
import {saveCategory} from '../../../sqlite/queries/categories/categoriesQuery';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: Category;
}

const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  category,
}) => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const {categories, setCategories} = useStateStore(
    useShallow(state => ({
      categories: state.categories,
      setCategories: state.setCategories,
    })),
  );
  const inputRef = useRef<TextInput>(null);
  const {values, setValues, handleChange, handleSubmit, resetForm} = useFormik({
    initialValues: category || {
      name: '',
      order_index: 0,
      childrenLength: 0,
    },
    onSubmit: async v => {
      const newCategories = await saveCategory(v, categories);
      if (newCategories) {
        setCategories(newCategories);
        resetForm();
        // Alert.alert('Success', 'Category created successfully');
      }
      onClose();
    },
  });

  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      'keyboardWillShow',
      event => {
        setKeyboardHeight(event.endCoordinates.height);
      },
    );

    const keyboardWillHideListener = Keyboard.addListener(
      'keyboardWillHide',
      event => {
        setKeyboardHeight(0);
      },
    );

    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      if (category) {
        setValues(category);
      }
    }
  }, [isOpen, category, setValues]);

  return (
    <Modal transparent={true} visible={isOpen} onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#00000080',
          marginBottom: keyboardHeight,
        }}>
        <Div alignItems="center" w={300} bg="base" rounded={10}>
          <Div w="100%" alignItems="center" px="lg">
            <Text fontWeight={'bold'} fontSize={18} lineHeight={24} my="lg">
              {category ? 'Edit folder' : 'Create new folder'}
            </Text>
            <Input
              bg="base1"
              value={values.name}
              onChangeText={handleChange('name')}
              ref={inputRef}
              placeholder="Folder name"
            />
          </Div>
          <Div
            w={'100%'}
            mt={'lg'}
            borderTopWidth={0.5}
            borderTopColor="reverseBase"
            row
            justifyContent={'space-between'}
            alignItems="center">
            <TouchableOpacity
              onPress={() => {
                onClose();
              }}>
              <Div
                borderRightWidth={0.5}
                borderRightColor="reverseBase"
                h={45}
                w={150}
                alignItems={'center'}
                justifyContent="center">
                <Text fontSize={18} fontWeight="bold" color={headerColor}>
                  Cancel
                </Text>
              </Div>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={!values.name}
              onPress={() => {
                handleSubmit();
              }}>
              <Div h={45} w={150} alignItems={'center'} justifyContent="center">
                <Text
                  fontSize={18}
                  fontWeight="bold"
                  color={values.name ? headerColor : 'gray500'}>
                  Create
                </Text>
              </Div>
            </TouchableOpacity>
          </Div>
        </Div>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default CategoryModal;
