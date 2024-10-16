export type RootStackParamList = {
  Home: undefined;
  Category: {id: number; previousScreenName?: keyof RootStackParamList};
  Word: {id: number; previousScreenName?: keyof RootStackParamList};
  Search: undefined;
  FlashCard: {
    category_id?: number;
    proficiency_id?: number;
    frequency_id?: number;
    limit?: number;
    page?: number;
    isRandom?: boolean;
  };
};
