import {NavigationProp, RouteProp} from '@react-navigation/native';
import {RootStackParamList} from './RootStackParamList';

export type navigationProp = NavigationProp<RootStackParamList>;

export type CategoryRoute = RouteProp<RootStackParamList, 'Category'>;
export type WordRoute = RouteProp<RootStackParamList, 'Word'>;
