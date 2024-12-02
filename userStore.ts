import { create } from 'zustand';
import { User, UserStore, UserPreferences } from '../types';

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user: User | null) => {
    set({ user });
    if (user) {
      localStorage.setItem(`user_${user.name.toLowerCase()}`, JSON.stringify(user));
    }
  },
  updatePreferences: (preferences: UserPreferences) =>
    set((state) => {
      if (!state.user) return state;
      const updatedUser = {
        ...state.user,
        preferences,
        hasSurvey: true,
      };
      localStorage.setItem(
        `user_${state.user.name.toLowerCase()}`,
        JSON.stringify(updatedUser)
      );
      return { user: updatedUser };
    }),
  clearUser: () => set({ user: null }),
}));