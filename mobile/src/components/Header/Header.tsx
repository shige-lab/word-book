import React from 'react';
import {Text, Div, Icon} from 'react-native-magnus';
import {TouchableOpacity} from 'react-native';
import {headerColor} from '../../utils/color/color';
import {useNavigation} from '@react-navigation/native';
import {navigationProp} from '../../types/navigator/RouteProps';
import {useColor} from '../../hooks/common/useColor';

export type HeaderProps = {
  title: string;
  leftIcon?: 'setting' | 'back';
  rightIcon?: 'new';
  onRightPress?: () => void;
};

const Header: React.FC<HeaderProps> = ({
  title,
  leftIcon,
  rightIcon,
  onRightPress,
}) => {
  const navigation = useNavigation<navigationProp>();
  const {baseColor, primary} = useColor();

  const iconStyle = {
    fontSize: 20,
    color: 'white',
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
        <Div>
          {leftIcon === 'setting' ? (
            <TouchableOpacity>
              <Icon fontFamily="Feather" name="settings" {...iconStyle} />
            </TouchableOpacity>
          ) : leftIcon === 'back' ? (
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}>
              <Icon name="left" {...iconStyle} />
            </TouchableOpacity>
          ) : null}
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
        <Div>
          {rightIcon === 'new' ? (
            <TouchableOpacity>
              <Icon name="plus" {...iconStyle} fontSize={24} />
            </TouchableOpacity>
          ) : null}
        </Div>
      </Div>
    </Div>
  );
};

export default Header;
