import React, {useContext, useEffect} from 'react';
import {
  NavigationContainer,
  useNavigation,
  useNavigationContainerRef,
} from '@react-navigation/native';
import {Appearance} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {RootStackParamList} from './types/navigator/RootStackParamList';
import Home from './screens/home';
import {ThemeProvider} from 'react-native-magnus';
import {PaperProvider} from 'react-native-paper';
import {createTables} from './sqlite/migrations/createTables';
import {createProficiencyAndFrequency} from './sqlite/seed/tags/createProficiencyAndFrequency';
import {createCategoriesAndWords} from './sqlite/seed/categoriesAndWords/createCategoriesAndWords';
import {useColor} from './hooks/common/useColor';
import CategoryDetail from './screens/category';
import WordDetail from './screens/word';
import MagnusThemeSwitcher from './components/Common/MagnusThemeSwitcher';

const Stack = createStackNavigator<RootStackParamList>();

function App(): React.JSX.Element {
  const navigationRef = useNavigationContainerRef<any>();

  const {isDarkMode, theme} = useColor();

  useEffect(() => {
    createTables();
    createProficiencyAndFrequency();
    createCategoriesAndWords();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <PaperProvider>
        <MagnusThemeSwitcher />
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
      </PaperProvider>
    </ThemeProvider>
  );
}

export default App;
