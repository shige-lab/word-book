import React from 'react';
import {Text, Div, Icon} from 'react-native-magnus';
import {TouchableOpacity} from 'react-native';
import {headerColor} from '../../utils/color/color';
import {useNavigation} from '@react-navigation/native';
import {navigationProp} from '../../types/navigator/RouteProps';
import {useColor} from '../../hooks/common/useColor';
import {iconFontFamilyType} from 'react-native-magnus/lib/typescript/src/ui/icon/icon.type';

export type LeftButtonProps = {
  isNotIcon?: boolean;
  type: 'setting' | 'back' | 'select-all' | 'deselect-all';
  onPress?: () => void;
};

export type RightButtonProps = {
  isNotIcon?: boolean;
  type: 'new' | 'edit' | 'check' | string;
  onPress: () => void;
};

export type HeaderProps = {
  title: string;
  leftButton?: LeftButtonProps;
  rightButton?: RightButtonProps[];
};

const getIconProps = (
  icon: string,
): {
  name: string;
  fontFamily?: iconFontFamilyType;
} => {
  switch (icon) {
    case 'new':
      return {name: 'plus', fontFamily: 'Octicons'};
    case 'edit':
      return {name: 'edit-2', fontFamily: 'Feather'};
    case 'check':
      return {name: 'check', fontFamily: 'Feather'};
    case 'setting':
      return {name: 'settings', fontFamily: 'Feather'};
    case 'back':
      return {name: 'left'};
    default:
      return {name: icon};
  }
};

const Header: React.FC<HeaderProps> = ({
  title,
  leftButton,
  rightButton = [],
}) => {
  const navigation = useNavigation<navigationProp>();
  const {baseColor, primary} = useColor();

  const iconStyle = {
    fontSize: 20,
    color: 'white',
  };

  const renderLeftButton = (b?: LeftButtonProps) => {
    if (!b) {
      return null;
    }
    return (
      <TouchableOpacity
        onPress={b.type === 'back' ? () => navigation.goBack() : b.onPress}>
        {b.isNotIcon ? (
          <Text fontSize={18} color="white">
            {b.type === 'select-all'
              ? 'Select All'
              : b.type === 'deselect-all'
              ? 'Deselect All'
              : ''}
          </Text>
        ) : (
          <Icon {...getIconProps(b.type)} {...iconStyle} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <Div w="100%">
      <Div
        bg={headerColor}
        h={40}
        px="lg"
        py="xs"
        flexDir="row"
        justifyContent="space-between"
        w={'100%'}
        alignSelf="center"
        alignItems="center">
        <Div w="30%" alignItems="flex-start">
          {renderLeftButton(leftButton)}
        </Div>
        <Text
          fontSize={18}
          fontWeight="bold"
          numberOfLines={1}
          color="white"
          ellipsizeMode="tail"
          maxW={200}>
          {title}
        </Text>
        <Div row w="30%" justifyContent="flex-end">
          {rightButton.map((item, index) => (
            <TouchableOpacity key={index} onPress={item.onPress}>
              <Icon ml="md" {...getIconProps(item.type)} {...iconStyle} />
            </TouchableOpacity>
          ))}
        </Div>
      </Div>
    </Div>
  );
};

export default Header;
