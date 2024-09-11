import React from 'react';
import {
  NavigationContainer,
  useNavigation,
  useNavigationContainerRef,
} from '@react-navigation/native';
import {Appearance} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {RootStackParamList} from './types/navigator/RootStackParamList';
import Home from './screens/home';
import {ThemeProvider, ThemeType} from 'react-native-magnus';

const Stack = createStackNavigator<RootStackParamList>();

function App(): React.JSX.Element {
  const isDarkMode = Appearance.getColorScheme() === 'dark';
  const navigationRef = useNavigationContainerRef<any>();

  const theme: ThemeType = {
    // if dark mode, set default font color to white, otherwise set it to black
    colors: {
      primary: isDarkMode ? 'white' : 'black',
    },
    spacing: {
      none: 0 as 0,
      xs: 2,
      sm: 4,
      md: 8,
      lg: 12,
    },
  };

  return (
    <ThemeProvider theme={theme}>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator initialRouteName={'Home'}>
          <Stack.Screen
            name="Home"
            component={Home}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}

export default App;
