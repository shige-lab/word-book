import {useFormik} from 'formik';
import React, {useEffect, useRef} from 'react';
import {Div, Text, Input, Radio, Icon, ScrollDiv} from 'react-native-magnus';
import {Alert, ScrollView, TextInput, TouchableOpacity} from 'react-native';
import {useShallow} from 'zustand/react/shallow';
import useStateStore from '../../../hooks/zustand/useStateStore';
import {saveWord} from '../../../sqlite/queries/words/wordQuery';
import {Word} from '../../../types/navigator/type';
import {
  getFrequencyTagColor,
  getProficiencyTagColor,
} from '../../../utils/color/getTagColor';
import ModalField from '../../Common/ModalField';
import ModalLayout from '../../Common/ModalLayout';
import {fetchWordInfoFromDictionaryApi} from '../../../hooks/api/fetchWordInfoFromDictionaryApi';
import {handleSetWord} from '../../../utils/word/handleSetWord';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

interface WordFormModalProps {
  word?: Partial<Word>;
  category_id: number;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (w: Word) => void;
}

const WordFormModal: React.FC<WordFormModalProps> = ({
  word,
  category_id,
  isOpen,
  onClose,
  onSave,
}) => {
  const {categories, setCategories, proficiencies, frequencies} = useStateStore(
    useShallow(state => ({
      categories: state.categories,
      setCategories: state.setCategories,
      proficiencies: state.proficiencies,
      frequencies: state.frequencies,
    })),
  );
  const scrollRef = useRef<ScrollView>();
  const wordInputRef = useRef<TextInput>(null);
  const meaningInputRef = useRef<TextInput>(null);
  const {values, setValues, handleChange, handleSubmit, resetForm} = useFormik({
    initialValues: word || {
      word: '',
      meaning: '',
      note: '',
      category_id: category_id,
      proficiency_id: 1,
      frequency_id: 1,
      example1: '',
      example2: '',
      example3: '',
      image: '',
    },
    onSubmit: async v => {
      const newWord = await saveWord(v);
      handleSetWord({
        word: newWord,
        categories,
        setCategories,
        isUpdate: !!word?.id,
      });
      !!onSave && onSave(newWord);
      onClose();
      resetForm();
    },
  });

  useEffect(() => {
    const focusAsync = async () => {
      await new Promise(resolve => setTimeout(resolve, 200));
      wordInputRef.current?.focus();
    };
    if (isOpen) {
      if (word) {
        setValues(word);
      } else {
        focusAsync();
      }
    } else {
      resetForm();
    }
  }, [isOpen, word, setValues, resetForm]);

  return (
    <ModalLayout
      title={word ? 'Edit Word' : 'Add Word'}
      isOpen={isOpen}
      onClose={onClose}
      isDisabled={!values.word}
      onButtonPress={() => handleSubmit()}>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        // contentContainerStyle={{paddingBottom: 100}}
        innerRef={ref => (scrollRef.current = ref as unknown as ScrollView)}
        // extraScrollHeight={50}
      >
        <ModalField label="Word" isRequired={true}>
          <Input
            ref={wordInputRef}
            placeholder="e.g. Apple"
            value={values.word}
            onChangeText={handleChange('word')}
            returnKeyType="next"
            onSubmitEditing={() => {
              meaningInputRef.current?.focus();
            }}
          />
        </ModalField>
        <ModalField label="Proficiency">
          <Div>
            <Radio.Group
              row
              defaultValue={
                proficiencies?.find(p => p.id === values?.proficiency_id)?.id
              }
              onChange={v => {
                setValues({...values, proficiency_id: v});
              }}>
              {proficiencies?.map(p => (
                <Radio
                  mr="sm"
                  key={p.id}
                  value={p.id}
                  activeColor={getProficiencyTagColor(p.id)?.bg}
                  activeIcon={
                    <Icon
                      m={3}
                      // mr={2}
                      name={p.icon}
                      fontFamily="FontAwesome5"
                      color="brand500"
                      fontSize={22}
                    />
                  }
                  checked={values?.proficiency_id === p.id}
                  onChange={isChecked => {
                    if (isChecked) {
                      setValues({...values, proficiency_id: p.id});
                    }
                  }}>
                  <Text fontSize={12}>{p.name}</Text>
                </Radio>
              ))}
            </Radio.Group>
          </Div>
        </ModalField>
        <ModalField label="Frequency">
          <Div>
            <Radio.Group
              row
              defaultValue={
                frequencies?.find(f => f.id === values?.frequency_id)?.id
              }
              onChange={v => {
                setValues({...values, frequency_id: v});
              }}>
              {frequencies?.map(f => (
                <Radio
                  mr="sm"
                  key={f.id}
                  value={f.id}
                  activeColor={`${f.color}600`}
                  checked={values?.frequency_id === f.id}
                  onChange={isChecked => {
                    if (isChecked) {
                      setValues({...values, frequency_id: f.id});
                    }
                  }}>
                  <Text fontSize={12}>{f.name}</Text>
                </Radio>
              ))}
            </Radio.Group>
          </Div>
        </ModalField>
        <ModalField
          label="Meaning"
          rightIcon={
            !!values?.word && (
              <TouchableOpacity
                onPress={async () => {
                  const data = await fetchWordInfoFromDictionaryApi(
                    values?.word || '',
                  );
                  if (data.meanings && data.meanings.length > 0) {
                    const {meanings, examples, phonetics} = data;
                    const usPhonetics = phonetics?.find(p =>
                      p.audio.includes('-us'),
                    );
                    const audio = usPhonetics?.audio?.includes('mp3')
                      ? usPhonetics?.audio
                      : '';
                    setValues({
                      ...values,
                      meaning: meanings[0] || '',
                      example1: examples[0] || '',
                      example2: examples[1] || '',
                      example3: examples[2] || '',
                      phonetic: usPhonetics?.text || values?.phonetic,
                      audio,
                    });
                  } else {
                    Alert.alert('The word is not found.');
                  }
                }}>
                <Icon
                  name="auto-fix"
                  fontFamily="MaterialCommunityIcons"
                  fontSize={22}
                  color="brand500"
                />
              </TouchableOpacity>
            )
          }>
          <Input
            ref={meaningInputRef}
            placeholder="e.g. A fruit"
            value={values.meaning}
            onChangeText={handleChange('meaning')}
            multiline={true}
          />
        </ModalField>
        <ModalField label="Example">
          <Input
            mb="sm"
            bg="base1"
            placeholder="e.g. I like apple."
            value={values.example1}
            onChangeText={handleChange('example1')}
            multiline={true}
          />
          <Input
            mb="sm"
            placeholder={
              !values.example1
                ? 'Fill Example1 first'
                : 'e.g. She eats an apple.'
            }
            editable={!!values.example1}
            value={values.example2}
            onChangeText={handleChange('example2')}
            multiline={true}
          />
          <Input
            value={values.example3}
            editable={!!values.example2}
            placeholder={
              !values.example2
                ? 'Fill Example2 first'
                : 'e.g. This apple is very sweet.'
            }
            onChangeText={handleChange('example3')}
            multiline={true}
          />
        </ModalField>
        <ModalField label="Note">
          <Div pb={50}>
            <Input
              placeholder="e.g. Synonyms: Malus pumila, "
              value={values.note}
              onChangeText={t => {
                setValues({...values, note: t});
                scrollRef.current?.scrollToEnd({animated: true});
              }}
              multiline={true}
              onFocus={() => {
                scrollRef.current?.scrollToEnd({animated: true});
              }}
            />
          </Div>
        </ModalField>
      </KeyboardAwareScrollView>
    </ModalLayout>
  );
};

export default WordFormModal;
