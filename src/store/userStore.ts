import { create } from 'zustand';
import { AuthService } from '../services/authService';
import { Models } from 'appwrite';

interface UserState {
  user: Models.User<Models.Preferences> | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  checkSession: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  checkSession: async () => {
    set({ isLoading: true });
    const user = await AuthService.getCurrentUser();
    set({ user, isAuthenticated: !!user, isLoading: false });
  },

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      await AuthService.login(email, password);
      const user = await AuthService.getCurrentUser();
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  register: async (email, password, name) => {
    set({ isLoading: true });
    try {
      await AuthService.register(email, password, name);
      const user = await AuthService.getCurrentUser();
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    await AuthService.logout();
    set({ user: null, isAuthenticated: false });
  },
}));
