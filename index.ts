export interface User {
  name: string;
  email: string;
  verified: boolean;
  hasSurvey: boolean;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  gradeLevel: string;
  subjects: string[];
  learningStyle: string;
  interests: string[];
}

export interface UserStore {
  user: User | null;
  setUser: (user: User | null) => void;
  updatePreferences: (preferences: UserPreferences) => void;
  clearUser: () => void;
}