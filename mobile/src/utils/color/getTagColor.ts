export const proficiencyTagColors = [
  {id: 1, bg: '#FFCCCC', color: 'black'},
  {id: 2, bg: '#FF6666', color: 'black'},
  {id: 3, bg: '#FF0000', color: 'white'},
  {id: 4, bg: '#990000', color: 'white'},
];

export const getProficiencyTagColor = (id: number) => {
  return proficiencyTagColors.find(
    proficiencyTagColor => proficiencyTagColor.id === id,
  );
};

export const frequencyTagColors = [
  {id: 1, bg: '#CCCCFF', color: 'black'},
  {id: 2, bg: '#6666FF', color: 'black'},
  {id: 3, bg: '#0000FF', color: 'white'},
  {id: 4, bg: '#000099', color: 'white'},
];

export const getFrequencyTagColor = (id: number) => {
  return frequencyTagColors.find(
    frequencyTagColor => frequencyTagColor.id === id,
  );
};

export const mixedTagColors = [
  {proficiency: 1, frequency: 1, color: '#E5B3E5'}, // Lightest Red + Lightest Blue
  {proficiency: 1, frequency: 2, color: '#B599E5'}, // Lightest Red + Lighter Blue
  {proficiency: 1, frequency: 3, color: '#8066FF'}, // Lightest Red + Deeper Blue
  {proficiency: 1, frequency: 4, color: '#806699'}, // Lightest Red + Deepest Blue

  {proficiency: 2, frequency: 1, color: '#E599B3'}, // Lighter Red + Lightest Blue
  {proficiency: 2, frequency: 2, color: '#B566B3'}, // Lighter Red + Lighter Blue
  {proficiency: 2, frequency: 3, color: '#8033FF'}, // Lighter Red + Deeper Blue
  {proficiency: 2, frequency: 4, color: '#803366'}, // Lighter Red + Deepest Blue

  {proficiency: 3, frequency: 1, color: '#E566B3'}, // Deeper Red + Lightest Blue
  {proficiency: 3, frequency: 2, color: '#B533B3'}, // Deeper Red + Lighter Blue
  {proficiency: 3, frequency: 3, color: '#8000FF'}, // Deeper Red + Deeper Blue
  {proficiency: 3, frequency: 4, color: '#800066'}, // Deeper Red + Deepest Blue

  {proficiency: 4, frequency: 1, color: '#B366B3'}, // Deepest Red + Lightest Blue
  {proficiency: 4, frequency: 2, color: '#803366'}, // Deepest Red + Lighter Blue
  {proficiency: 4, frequency: 3, color: '#4C0099'}, // Deepest Red + Deeper Blue
  {proficiency: 4, frequency: 4, color: '#4C004C'}, // Deepest Red + Deepest Blue
];

export const getMixedTagColor = (
  proficiencyId: number,
  frequencyId: number,
) => {
  return mixedTagColors.find(
    mixedTagColor =>
      mixedTagColor.proficiency === proficiencyId &&
      mixedTagColor.frequency === frequencyId,
  )?.color;
};
