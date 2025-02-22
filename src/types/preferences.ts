import { Gender } from '@/db/schema';

export interface UserPreferences {
  firstName: string;
  lastName: string;
  gender: Gender;
  mainLanguage: string;
  preferredLanguage: string;
  age: number;
}

export type PreferenceStep = 
  | 'name'
  | 'gender'
  | 'languages'
  | 'age'
  | 'complete'; 