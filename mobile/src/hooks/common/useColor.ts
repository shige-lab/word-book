import {useContext, useEffect, useState} from 'react';
import {Appearance} from 'react-native';
import {ThemeContext, ThemeType} from 'react-native-magnus';
import {baseTheme} from '../../App';
import {darkColor, whiteColor} from '../../utils/color/color';

export const useColor = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Get current color scheme
    const colorScheme = Appearance.getColorScheme();
    setIsDarkMode(colorScheme === 'dark');

    // Listen for color scheme changes
    const subscription = Appearance.addChangeListener(({colorScheme}) => {
      setIsDarkMode(colorScheme === 'dark');
    });

    // Clean up the event listener on unmount
    return () => {
      subscription.remove();
    };
  }, []);
  const primary = isDarkMode ? 'white' : 'black';
  const baseColor = isDarkMode ? darkColor : whiteColor;
  const reverseBase = isDarkMode ? 'white' : 'black';

  const theme: ThemeType = {
    // if dark mode, set default font color to white, otherwise set it to black
    name: isDarkMode ? 'dark' : 'light',
    colors: {
      ...baseColor,
      primary,
      brand25: '#F5FAFF',
      brand50: '#EBF5FF',
      brand100: '#D1E9FE',
      brand150: '#B7DEFD',
      brand200: '#9DD2FC',
      brand300: '#7ABDF9',
      brand400: '#4FA9F5',
      brand500: '#4299E1', // Base color
      brand600: '#3B87CC',
      brand700: '#326FA8',
      brand800: '#26517A',
      brand900: '#1A3A53',
    },
    spacing: {
      none: 0 as 0,
      xs: 2,
      sm: 4,
      md: 8,
      lg: 12,
    },
    components: {
      Text: {
        color: primary,
      },
      Input: {
        color: primary,
        bg: baseColor.base1,
      },
    },
  };

  return {
    isDarkMode,
    theme,
    primary,
    reverseBase,
    baseColor,
  };
};
