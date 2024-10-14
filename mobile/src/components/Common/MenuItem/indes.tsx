import {Menu} from 'react-native-paper';
import React from 'react';
import {MenuProps} from '../../Header/Header';
import {Icon, Div, Text, DivProps} from 'react-native-magnus';
import {getIconProps} from '../../../utils/icon/getIconProps';

const MenuItem: React.FC<MenuProps> = ({type, onPress, label}) => {
  const baseStyle: DivProps = {
    w: '100%',
    h: 20,
    mt: -5,
    row: true,
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
    // bg: 'red',
  };
  const getItem = () => {
    switch (type) {
      case 'delete':
        return (
          <Div {...baseStyle}>
            <Text fontSize={16}>{label}</Text>
            <Icon {...getIconProps('delete')} fontSize={18} color="red500" />
          </Div>
        );
      case 'move':
        return (
          <Div {...baseStyle}>
            <Text fontSize={16}>{label}</Text>
            <Icon {...getIconProps('folder')} fontSize={18} color="gray500" />
          </Div>
        );
    }
  };

  return (
    <Menu.Item
      onPress={onPress}
      title={getItem()}
      style={{
        // backgroundColor: 'blue',
        justifyContent: 'center',
        height: 30,
      }}
      contentStyle={{
        height: 30,
      }}
    />
  );
};

export default MenuItem;
