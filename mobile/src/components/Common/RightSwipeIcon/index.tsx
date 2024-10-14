import React, {useEffect, useState} from 'react';
import {Button, Div, Icon, Text} from 'react-native-magnus';
import Reanimated, {
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import {getIconProps} from '../../../utils/icon/getIconProps';

interface RightSwipeIconProps {
  onPress: () => void;
  icon: 'delete';
  prog: SharedValue<number>;
  drag: SharedValue<number>;
}

const getIcon = (icon: string) => {
  switch (icon) {
    case 'delete':
      return (
        <Icon
          fontSize={18}
          bg="red500"
          color="white"
          {...getIconProps('delete')}
        />
      );
    default:
      return <></>;
  }
};

export const RightSwipeIcon = ({
  onPress,
  icon,
  prog,
  drag,
}: RightSwipeIconProps) => {
  const styleAnimation = useAnimatedStyle(() => {
    return {
      transform: [{translateX: drag.value + 50}],
    };
  });

  return (
    <Reanimated.View style={styleAnimation}>
      <Button bg="red500" h={'100%'} w={50} onPress={onPress}>
        {getIcon(icon)}
      </Button>
    </Reanimated.View>
  );
};
