import { create } from 'zustand';
import api from '../services/api';

interface AuthState {
  user: any;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: any) => Promise<void>;
  signup: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  fetchProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (data) => {
    try {
      const res = await api.login(data);
      if (res.token) {
        set({ user: res, isAuthenticated: true });
      } else {
        throw new Error(res.message || 'Login failed');
      }
    } catch (error) {
      throw error;
    }
  },

  signup: async (data) => {
    try {
      const res = await api.signup(data);
      if (res.token) {
        set({ user: res, isAuthenticated: true });
      } else {
        throw new Error(res.message || 'Signup failed');
      }
    } catch (error) {
      throw error;
    }
  },

  logout: async () => {
    try {
      await api.logout();
    } finally {
      set({ user: null, isAuthenticated: false });
    }
  },

  fetchProfile: async () => {
    set({ isLoading: true });
    try {
      if (typeof window !== 'undefined' && localStorage.getItem('orbyn_token')) {
        const user = await api.getProfile();
        if (user && !user.message) {
          set({ user, isAuthenticated: true, isLoading: false });
          return;
        }
      }
      set({ user: null, isAuthenticated: false, isLoading: false });
    } catch (error) {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  }
}));
