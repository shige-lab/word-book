export interface Category {
  id: number;
  name: string;
  order_index: number;
  words?: Word[];
  childrenLength?: number;
  selected?: boolean;
}

export interface Proficiency {
  id: number;
  name: string;
  order_index: number;
}

export interface Frequency {
  id: number;
  name: string;
  order_index: number;
}

export interface Word {
  id: number;
  word: string;
  meaning: string;
  category_id: number;
  proficiency: Proficiency;
  proficiency_id: number;
  frequency: Frequency;
  frequency_id: number;
  note: string;
  example1: string;
  example2: string;
  example3: string;
  image?: string;
  selected?: boolean;
}
