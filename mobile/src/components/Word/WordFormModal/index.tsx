import {useFormik} from 'formik';
import React, {useState} from 'react';
import {
  Div,
  Modal,
  Text,
  Button,
  ScrollDiv,
  Input,
  Radio,
  Icon,
} from 'react-native-magnus';
import {TouchableOpacity} from 'react-native';
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
import axios from 'axios';
import CategoryModal from '../../Category/CategoryModal';

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
      if (word?.id) {
        setCategories(
          categories.map(c => {
            if (c.id === category_id) {
              return {
                ...c,
                words: c?.words?.map(w => {
                  if (w.id === word.id) {
                    return newWord;
                  }
                  return w;
                }),
              };
            }
            return c;
          }),
        );
      } else {
        setCategories(
          categories.map(c => {
            if (c.id === category_id) {
              return {
                ...c,
                words: [newWord, ...(c?.words || [])],
              };
            }
            return c;
          }),
        );
      }
      !!onSave && onSave(newWord);
      onClose();
      resetForm();
    },
  });
  const [isOpena, setIsOpen] = useState(false);

  return (
    <ModalLayout
      title={word ? 'Edit Word' : 'Add Word'}
      isOpen={isOpen}
      onClose={onClose}
      isDisabled={!values.word}
      onButtonPress={() => handleSubmit()}>
      <Div>
        <ModalField label="Word" isRequired={true}>
          <Input
            placeholder="Word"
            value={values.word}
            onChangeText={handleChange('word')}
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
                  checked={values?.proficiency_id === p.id}
                  onChange={isChecked => {
                    if (isChecked) {
                      setValues({...values, proficiency_id: p.id});
                    }
                  }}>
                  <Text>{p.name}</Text>
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
                  activeColor={getFrequencyTagColor(f.id)?.bg}
                  checked={values?.frequency_id === f.id}
                  onChange={isChecked => {
                    if (isChecked) {
                      setValues({...values, frequency_id: f.id});
                    }
                  }}>
                  <Text>{f.name}</Text>
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
                  const response = await axios.get(
                    `https://api.dictionaryapi.dev/api/v2/entries/en/${values.word}`,
                  );
                  const data = response.data[0];
                  let meanings: string[] = [];
                  let examples: string[] = [];
                  for (const m of data.meanings) {
                    for (const d of m.definitions) {
                      if (d.definition) {
                        meanings.push(d.definition);
                      }
                      if (d.example) {
                        examples.push(d.example);
                      }
                    }
                  }
                  console.log('data:', meanings, 'e----', examples);

                  if (data.meanings && data.meanings.length > 0) {
                    setValues({
                      ...values,
                      meaning: meanings[0] || '',
                      example1: examples[0] || '',
                      example2: examples[1] || '',
                      example3: examples[2] || '',
                    });
                  }
                }}>
                <Icon
                  name="auto-fix"
                  fontFamily="MaterialCommunityIcons"
                  fontSize={18}
                  color="blue500"
                />
              </TouchableOpacity>
            )
          }>
          <Input
            placeholder="Meaning"
            value={values.meaning}
            onChangeText={handleChange('meaning')}
            multiline={true}
          />
        </ModalField>
        <ModalField label="Example">
          <Input
            mb="sm"
            placeholder="Example1"
            value={values.example1}
            onChangeText={handleChange('example1')}
            multiline={true}
          />
          <Input
            mb="sm"
            placeholder="Example2"
            editable={!!values.example1}
            value={values.example2}
            onChangeText={handleChange('example2')}
            multiline={true}
          />
          <Input
            placeholder="Example3"
            value={values.example3}
            editable={!!values.example2}
            onChangeText={handleChange('example3')}
            multiline={true}
          />
        </ModalField>

        <ModalField label="Note">
          <Input
            placeholder="Note"
            value={values.note}
            onChangeText={handleChange('note')}
            multiline={true}
          />
        </ModalField>
      </Div>
    </ModalLayout>
  );
};

export default WordFormModal;
