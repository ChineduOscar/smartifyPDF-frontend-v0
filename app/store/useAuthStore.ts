import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthStore {
  email: string;
  setEmail: (email: string) => void;
  resetEmail: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      email: '',
      setEmail: (email) => set({ email }),
      resetEmail: () => set({ email: '' }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
