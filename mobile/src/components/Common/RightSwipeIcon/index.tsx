import React, {useEffect, useState} from 'react';
import {Button, Div, Icon, Text} from 'react-native-magnus';
import Reanimated, {
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';

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
          fontSize={24}
          bg="red500"
          color="white"
          name="delete"
          fontFamily="MaterialCommunityIcons"
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
  console.log('icon', icon);
  const styleAnimation = useAnimatedStyle(() => {
    console.log('showRightProgress:', prog.value);
    console.log('appliedTranslation:', drag.value);

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
