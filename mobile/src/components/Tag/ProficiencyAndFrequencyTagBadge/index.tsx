import React, {useEffect, useMemo, useState} from 'react';
import {Button, Div, Icon, ScrollDiv, Text} from 'react-native-magnus';
import {
  getFrequencyTagColor,
  getProficiencyTagColor,
} from '../../../utils/color/getTagColor';
import LinearGradient from 'react-native-linear-gradient';
import useStateStore from '../../../hooks/zustand/useStateStore';
import {useShallow} from 'zustand/react/shallow';
import {TouchableOpacity} from 'react-native';

interface ProficiencyAndFrequencyTagBadgeProps {
  proficiency_id: number;
  frequency_id: number;
  onPress?: () => void;
  size?: number;
}

const ProficiencyAndFrequencyTagBadge: React.FC<
  ProficiencyAndFrequencyTagBadgeProps
> = ({proficiency_id, frequency_id, size, onPress}) => {
  const {proficiencies, frequencies} = useStateStore(
    useShallow(state => ({
      proficiencies: state.proficiencies,
      frequencies: state.frequencies,
    })),
  );
  const IconSize = size || 18;
  const iconName = proficiencies.find(p => p.id === proficiency_id)?.icon || '';
  const iconColor = frequencies.find(f => f.id === frequency_id)?.color || '';

  const renderIcon = (
    <Icon
      name={iconName}
      fontFamily="FontAwesome5"
      color={`${iconColor}600`}
      fontSize={IconSize}
    />
  );
  return (
    <Div w={IconSize} row>
      {onPress ? (
        <TouchableOpacity onPress={onPress}>{renderIcon}</TouchableOpacity>
      ) : (
        renderIcon
      )}
      {/* <LinearGradient
        colors={[proficiencyColor, frequencyColor]}
        start={{x: 0, y: 0.5}}
        end={{x: 1, y: 0.5}}
        style={{
          width: 20,
          height: 20,
          borderRadius: 100,
        }}
      /> */}
    </Div>
  );
};

export default ProficiencyAndFrequencyTagBadge;
