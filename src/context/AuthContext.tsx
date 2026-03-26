import React, { createContext, useContext, useMemo, useState } from 'react';

export type NativeLanguage = 'en' | 'fa';
export type Gender = 'male' | 'female' | 'other' | '';
export type AgeBracket = '' | '3-12' | '12-25' | '25-45' | '45+';
export type LearningLevel = '' | 'beginner' | 'intermediate' | 'advanced';

export type AuthState = {
  username: string;
  email: string;
  nativeLanguage: NativeLanguage;
  purpose: string;
  dailyGoal: number;
  age: number;
  ageBracket: AgeBracket;
  learningLevel: LearningLevel;
  gender: Gender;
};

export type AuthContextValue = AuthState & {
  updateAuth: (updates: Partial<AuthState>) => void;
  resetAuth: () => void;
};

const initialAuthState: AuthState = {
  username: '',
  email: '',
  nativeLanguage: 'en',
  purpose: '',
  dailyGoal: 10,
  age: 0,
  ageBracket: '',
  learningLevel: '',
  gender: '',
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<AuthState>(initialAuthState);

  const value = useMemo<AuthContextValue>(
    () => ({
      ...auth,
      updateAuth: (updates) => setAuth((prev) => ({ ...prev, ...updates })),
      resetAuth: () => setAuth(initialAuthState),
    }),
    [auth],
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

