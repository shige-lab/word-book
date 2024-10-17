import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  StatusBar,
  Appearance,
  Platform,
  Dimensions,
} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Div} from 'react-native-magnus';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {headerColor} from '../../utils/color/color';
import Header, {HeaderProps} from '../Header/Header';

type MainLayoutProps = {
  headerProps?: HeaderProps;
  withPadding?: boolean;
  withoutHeader?: boolean;
  children: React.ReactNode;
};

const MainLayout: React.FC<MainLayoutProps> = ({
  headerProps,
  withPadding = true,
  withoutHeader = false,
  children,
}) => {
  const isDarkMode = Appearance.getColorScheme() === 'dark';
  const {height} = Dimensions.get('window');
  const insets = useSafeAreaInsets();

  // Dynamically calculate height considering safe area and header
  const calculatedHeight = height - insets.top - (withoutHeader ? 0 : 40);

  return (
    <>
      <SafeAreaView style={{height: insets.top, backgroundColor: headerColor}}>
        <StatusBar
          barStyle={isDarkMode ? 'dark-content' : 'light-content'}
          backgroundColor={headerColor}
        />
      </SafeAreaView>
      <SafeAreaView style={{flex: 1, backgroundColor: headerColor}}>
        <GestureHandlerRootView style={{flex: 1}}>
          {!withoutHeader && !!headerProps && <Header {...headerProps} />}
          <Div
            w="100%"
            h={calculatedHeight}
            p={withPadding ? 'lg' : 0}
            bg="base">
            {children}
          </Div>
        </GestureHandlerRootView>
      </SafeAreaView>
    </>
  );
};

export default MainLayout;
