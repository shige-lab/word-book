import React, {useContext, useEffect} from 'react';
import {
  NavigationContainer,
  useNavigation,
  useNavigationContainerRef,
} from '@react-navigation/native';
import {
  Alert,
  Appearance,
  NativeEventEmitter,
  NativeModules,
} from 'react-native';
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
import Search from './screens/search';
import FlashCard from './screens/flashCard';
import * as BootSplash from 'react-native-bootsplash';
import useStateStore from './hooks/zustand/useStateStore';
import {useShallow} from 'zustand/react/shallow';
import {getCategories} from './sqlite/queries/categories/categoriesQuery';
import {getProficiencyAndFrequency} from './sqlite/queries/tags/tagsQuery';
import Tts from 'react-native-tts';

const Stack = createStackNavigator<RootStackParamList>();

function App(): React.JSX.Element {
  const navigationRef = useNavigationContainerRef<any>();

  const {isDarkMode, theme} = useColor();
  const {categories, setCategories, setProficiencies, setFrequencies} =
    useStateStore(
      useShallow(state => ({
        categories: state.categories,
        setCategories: state.setCategories,
        setProficiencies: state.setProficiencies,
        setFrequencies: state.setFrequencies,
      })),
    );

  useEffect(() => {
    const initDatabase = async () => {
      await createTables();
      await createProficiencyAndFrequency();
    };
    const fetchData = async () => {
      await initDatabase();
      const data = await getCategories();
      const d = await getProficiencyAndFrequency();
      setProficiencies(d?.proficiencies);
      setFrequencies(d?.frequencies);
      setCategories(data);
      if (!data?.length) {
        Alert.alert('No data found', 'Do you want to get some samples', [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Yes',
            onPress: async () => {
              await createCategoriesAndWords();
              const data = await getCategories();
              setCategories(data);
            },
          },
        ]);
      }
    };
    fetchData();
  }, [setCategories, setProficiencies, setFrequencies]);

  useEffect(() => {
    Tts.setDefaultLanguage('en-US');
    Tts.setDefaultRate(0.5);
    Tts.setDefaultPitch(1.0);
    const ee = new NativeEventEmitter(NativeModules.TextToSpeech);
    const s = ee.addListener('tts-start', () => {});
    const f = ee.addListener('tts-finish', () => {});
    const c = ee.addListener('tts-cancel', () => {});

    return () => {
      s.remove();
      f.remove();
      c.remove();
    };
  }, []);

  useEffect(() => {
    async function hideBootSplash() {
      await BootSplash.hide({fade: true}); // Tried without `fade` and `duration ` params as well.
      // Tried BootSplash.hide() with `import BootSplash from 'react-native-bootsplash' ` import. But nothing worked.
    }
    setTimeout(() => {
      hideBootSplash();
    }, 500);
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
            <Stack.Screen
              name="Search"
              component={Search}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="FlashCard"
              component={FlashCard}
              options={{headerShown: false}}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </ThemeProvider>
  );
}

export default App;
