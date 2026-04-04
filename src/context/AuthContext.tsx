import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

export type NativeLanguage = 'en' | 'fa';
export type Gender = 'male' | 'female' | 'other' | '';
export type AgeBracket = '' | '3-12' | '12-25' | '25-45' | '45+';
export type LearningLevel = '' | 'beginner' | 'intermediate' | 'advanced';

export type AuthState = {
  /** SQLite user id — 0 means not logged in */
  userId: number;
  username: string;
  email: string;
  nativeLanguage: NativeLanguage;
  purpose: string;
  dailyGoal: number;
  age: number;
  ageBracket: AgeBracket;
  learningLevel: LearningLevel;
  gender: Gender;
  last_visited_lesson_id: string;
  last_visited_section_index: number;
};

export type AuthContextValue = AuthState & {
  updateAuth: (updates: Partial<AuthState>) => void;
  resetAuth: () => void;
  isLoggedIn: boolean;
};

const initialAuthState: AuthState = {
  userId: 0,
  username: '',
  email: '',
  nativeLanguage: 'en',
  purpose: '',
  dailyGoal: 10,
  age: 0,
  ageBracket: '',
  learningLevel: '',
  gender: '',
  last_visited_lesson_id: '',
  last_visited_section_index: 0,
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<AuthState>(initialAuthState);

  const updateAuth = useCallback(
    (updates: Partial<AuthState>) => setAuth((prev) => ({ ...prev, ...updates })),
    [],
  );
  const resetAuth = useCallback(() => setAuth(initialAuthState), []);

  const value = useMemo<AuthContextValue>(
    () => ({
      ...auth,
      updateAuth,
      resetAuth,
      isLoggedIn: auth.userId > 0,
    }),
    [auth, updateAuth, resetAuth],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
