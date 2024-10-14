import React, {useContext, useEffect} from 'react';
import {ThemeContext} from 'react-native-magnus';
import {useColor} from '../../../hooks/common/useColor';

const MagnusThemeSwitcher: React.FC = () => {
  const {setTheme} = useContext(ThemeContext);
  const {theme, isDarkMode} = useColor();

  useEffect(
    () => {
      setTheme(theme);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isDarkMode],
  );

  return null;
};

export default MagnusThemeSwitcher;
