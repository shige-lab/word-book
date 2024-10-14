import React, {useEffect, useMemo, useState} from 'react';
import {Button, Div, ScrollDiv, Text} from 'react-native-magnus';
import {
  getFrequencyTagColor,
  getProficiencyTagColor,
} from '../../../utils/color/getTagColor';
import LinearGradient from 'react-native-linear-gradient';

interface ProficiencyAndFrequencyTagBadgeProps {
  proficiency_id: number;
  frequency_id: number;
}

const ProficiencyAndFrequencyTagBadge: React.FC<
  ProficiencyAndFrequencyTagBadgeProps
> = ({proficiency_id, frequency_id}) => {
  const proficiencyColor =
    getProficiencyTagColor(proficiency_id)?.bg || '#718096';
  const frequencyColor = getFrequencyTagColor(frequency_id)?.bg || '#718096';
  return (
    <Div w={20} alignItems="center">
      <LinearGradient
        colors={[proficiencyColor, frequencyColor]}
        start={{x: 0, y: 0.5}}
        end={{x: 1, y: 0.5}}
        style={{
          width: 20,
          height: 20,
          borderRadius: 100,
        }}
      />
    </Div>
  );
};

export default ProficiencyAndFrequencyTagBadge;
