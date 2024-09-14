import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  StatusBar,
  Appearance,
  Platform,
} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Div} from 'react-native-magnus';
import {headerColor} from '../../utils/color/color';
import Header from '../Header/Header';

type MainLayoutProps = {
  headerTitle: string;
  withPadding?: boolean;
  children: React.ReactNode;
};

const MainLayout: React.FC<MainLayoutProps> = ({
  headerTitle,
  withPadding = true,
  children,
}) => {
  const isDarkMode = Appearance.getColorScheme() === 'dark';
  return (
    <>
      <SafeAreaView
        style={{
          height: StatusBar.currentHeight,
          backgroundColor: headerColor,
          width: '100%',
        }}>
        <StatusBar
          barStyle={isDarkMode ? 'dark-content' : 'light-content'}
          backgroundColor={headerColor}
        />
      </SafeAreaView>
      <SafeAreaView
        style={{
          flex: 1,
          width: '100%',
        }}>
        <GestureHandlerRootView style={{flex: 1}}>
          <Header title={headerTitle} />
          <Div w="100%" h="100%" p={withPadding ? 'md' : 0} bg="base">
            {children}
          </Div>
        </GestureHandlerRootView>
      </SafeAreaView>
    </>
  );
};

export default MainLayout;
