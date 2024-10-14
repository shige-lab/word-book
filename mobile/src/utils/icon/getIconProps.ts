import {iconFontFamilyType} from 'react-native-magnus/lib/typescript/src/ui/icon/icon.type';

export const getIconProps = (
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
    case 'menu':
      return {name: 'dots-three-horizontal', fontFamily: 'Entypo'};
    case 'setting':
      return {name: 'settings', fontFamily: 'Feather'};
    case 'back':
      return {name: 'left'};
    case 'delete':
      return {name: 'trash-outline', fontFamily: 'Ionicons'};
    case 'folder':
      return {name: 'folder', fontFamily: 'Feather'};
    case 'search':
      return {name: 'search', fontFamily: 'Feather'};
    case 'close':
      return {name: 'close'};
    case 'history':
      return {name: 'history', fontFamily: 'Octicons'};
    default:
      return {name: icon};
  }
};
