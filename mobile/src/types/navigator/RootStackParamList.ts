export type RootStackParamList = {
  Home: undefined;
  Category: {id: number; previousScreenName?: keyof RootStackParamList};
  Word: {id: number; previousScreenName?: keyof RootStackParamList};
};
