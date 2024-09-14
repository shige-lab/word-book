import {create} from 'zustand';
import {Category, Frequency, Proficiency} from '../../types/navigator/type';

interface stateStore {
  categories: Category[];
  setCategories: (v: Category[]) => void;
  proficiencies: Proficiency[];
  setProficiencies: (v: Proficiency[]) => void;
  frequencies: Frequency[];
  setFrequencies: (v: Frequency[]) => void;
}

const useStateStore = create<stateStore>(set => {
  return {
    categories: [],
    setCategories: v => set({categories: v}),
    proficiencies: [],
    setProficiencies: v => set({proficiencies: v}),
    frequencies: [],
    setFrequencies: v => set({frequencies: v}),
  };
});

export default useStateStore;
