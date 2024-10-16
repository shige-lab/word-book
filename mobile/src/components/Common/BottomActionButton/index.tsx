import React, {useEffect, useMemo, useState} from 'react';
import {Button, Div, ScrollDiv, Text} from 'react-native-magnus';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Dimensions} from 'react-native';
import {useColor} from '../../../hooks/common/useColor';

interface ActionProps {
  label: 'Delete' | 'Move';
  onPress: () => void;
  disabled?: boolean;
}

export interface BottomActionButtonProps {
  onCancel: () => void;
  actions: ActionProps[];
}

const BottomActionButton: React.FC<BottomActionButtonProps> = ({
  actions,
  onCancel,
}) => {
  const insets = useSafeAreaInsets();
  const {width} = Dimensions.get('window');
  const {baseColor, primary} = useColor();

  const buttonWidth = useMemo(() => {
    const len = actions.length + 1;
    return (width - 12 * (len + 1)) / len;
  }, [actions.length, width]);

  return (
    <Div
      mt="auto"
      // position="absolute"
      // bottom={0}
      borderBottomWidth={1}
      pb={insets.bottom + 10}
      bg="base1"
      w="100%"
      p={12}
      flexDir="row"
      justifyContent="space-between"
      alignItems="center">
      <Button
        w={buttonWidth}
        bg="base1"
        color={primary}
        borderWidth={1}
        borderColor="gray500"
        onPress={onCancel}>
        Cancel
      </Button>
      {actions.map((action, index) => (
        <Button
          key={index}
          w={buttonWidth}
          bg={action.label === 'Delete' ? 'red600' : 'blue600'}
          disabled={action.disabled}
          onPress={action.onPress}>
          {action.label}
        </Button>
      ))}
    </Div>
  );
};

export default BottomActionButton;
