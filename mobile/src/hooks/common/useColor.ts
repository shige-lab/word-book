import {Appearance} from 'react-native';
import {darkColor, whiteColor} from '../../utils/color/color';

export const useColor = () => {
  const isDarkMode = Appearance.getColorScheme() === 'dark';
  return {
    primary: isDarkMode ? 'white' : 'black',
    reverseBase: isDarkMode ? 'white' : 'black',
    baseColor: isDarkMode ? darkColor : whiteColor,
  };
};
