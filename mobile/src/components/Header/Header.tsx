import React from 'react';
import {Text, Div} from 'react-native-magnus';
import {headerColor} from '../../utils/color/color';

export type HeaderProps = {
  title: string;
  children?: React.ReactNode;
};

/**
 * this component is header template to customize
 * children can custmize right contents in top of header
 */

const Header: React.FC<HeaderProps> = ({title, children}) => {
  // const navigation = useNavigation<any>();

  return (
    <Div w="100%">
      <Div
        bg={headerColor}
        h={40}
        px="md"
        py="xs"
        flexDir="row"
        justifyContent="space-between"
        w={'100%'}
        alignSelf="center"
        alignItems="center">
        <Div></Div>
        <Text
          fontSize={18}
          fontWeight="bold"
          numberOfLines={1}
          color="dark600"
          ellipsizeMode="tail"
          maxW={200}>
          {title}
        </Text>
        <Div></Div>
      </Div>
      {children}
    </Div>
  );
};

export default Header;
