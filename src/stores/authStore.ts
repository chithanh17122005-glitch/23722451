import { create } from 'zustand';
import { STUDENT, examStamp } from '@constants/student';

interface AuthState {
  token: string | null;
  login: (inputVal: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  login: (inputVal: string) => {
    if (inputVal.trim().length > 0) {
      const fakeToken = `ktxgo-${STUDENT.mssv}-${examStamp()}`;
      set({ token: fakeToken });
    }
  },
  logout: () => set({ token: null }),
}));
