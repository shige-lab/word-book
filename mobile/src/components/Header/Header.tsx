import React, {Fragment} from 'react';
import {Text, Div, Icon} from 'react-native-magnus';
import {TouchableOpacity} from 'react-native';
import {borderBottom, headerColor} from '../../utils/color/color';
import {useNavigation} from '@react-navigation/native';
import {navigationProp} from '../../types/navigator/RouteProps';
import {useColor} from '../../hooks/common/useColor';
import {iconFontFamilyType} from 'react-native-magnus/lib/typescript/src/ui/icon/icon.type';
import {Menu, Divider} from 'react-native-paper';
import MenuItem from '../Common/MenuItem/indes';
import {getIconProps} from '../../utils/icon/getIconProps';

export interface LeftButtonProps {
  isNotIcon?: boolean;
  type: 'setting' | 'back' | 'select-all' | 'deselect-all';
  onPress?: () => void;
}

export interface RightButtonProps {
  isNotIcon?: boolean;
  type: 'new' | 'edit' | 'check' | 'search' | string;
  onPress: () => void;
}
export interface MenuProps {
  type: 'delete' | 'move';
  label: string;
  onPress: () => void;
}

export interface HeaderProps {
  title: string;
  leftButton?: LeftButtonProps;
  rightButton?: RightButtonProps[];
  menu?: MenuProps[];
}

const Header: React.FC<HeaderProps> = ({
  title,
  leftButton,
  rightButton = [],
  menu = [],
}) => {
  const navigation = useNavigation<navigationProp>();
  const {baseColor, primary} = useColor();
  const [visibleMenu, setVisibleMenu] = React.useState(false);

  const iconStyle = {
    fontSize: 22,
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
        <Div w="40%" alignItems="center">
          <Text
            fontSize={18}
            fontWeight="bold"
            numberOfLines={1}
            color="white"
            ellipsizeMode="tail"
            maxW={200}>
            {title}
          </Text>
        </Div>
        <Div row w="30%" justifyContent="flex-end">
          {rightButton.map((item, index) => (
            <TouchableOpacity key={index} onPress={item.onPress}>
              {item.isNotIcon ? (
                <Text fontSize={18} color="white">
                  {item.type === 'check' ? 'Done' : ''}
                </Text>
              ) : (
                <Icon ml="lg" {...getIconProps(item.type)} {...iconStyle} />
              )}
            </TouchableOpacity>
          ))}
          {!!menu?.length && (
            // <Div flex={1} justifyContent="center" alignItems="center">
            <Menu
              style={{paddingTop: 20, paddingRight: -20}}
              statusBarHeight={0}
              contentStyle={{
                alignItems: 'center',
                borderRadius: 5,
                paddingTop: 0,
                paddingBottom: 0,
                height: 30 * menu.length,
                width: 180,
              }}
              visible={visibleMenu}
              onDismiss={() => setVisibleMenu(false)}
              anchor={
                <TouchableOpacity
                  onPress={() => {
                    if (!visibleMenu) {
                      setVisibleMenu(true);
                    }
                  }}>
                  <Icon ml="md" {...getIconProps('menu')} {...iconStyle} />
                </TouchableOpacity>
              }>
              {menu.map((item, index) => (
                <Fragment key={index}>
                  <MenuItem key={index} {...item} />
                  {index !== menu.length - 1 && (
                    <Div
                      w="100%"
                      borderBottomWidth={0.3}
                      borderColor="gray500"
                    />
                  )}
                </Fragment>
              ))}
            </Menu>
            // </Div>
          )}
        </Div>
      </Div>
    </Div>
  );
};

export default Header;
