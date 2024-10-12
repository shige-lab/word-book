import React, {useEffect} from 'react';
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
import {createTables} from './sqlite/migrations/createTables';
import {createProficiencyAndFrequency} from './sqlite/seed/tags/createProficiencyAndFrequency';
import {createCategoriesAndWords} from './sqlite/seed/categoriesAndWords/createCategoriesAndWords';
import {useColor} from './hooks/common/useColor';
import CategoryDetail from './screens/category';
import WordDetail from './screens/word';

const Stack = createStackNavigator<RootStackParamList>();

function App(): React.JSX.Element {
  const isDarkMode = Appearance.getColorScheme() === 'dark';
  const navigationRef = useNavigationContainerRef<any>();

  const {baseColor} = useColor();

  const theme: ThemeType = {
    // if dark mode, set default font color to white, otherwise set it to black
    colors: {
      ...baseColor,
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
  };

  useEffect(() => {
    createTables();
    createProficiencyAndFrequency();
    createCategoriesAndWords();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator initialRouteName={'Home'}>
          <Stack.Screen
            name="Home"
            component={Home}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Category"
            component={CategoryDetail}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Word"
            component={WordDetail}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}

export default App;
