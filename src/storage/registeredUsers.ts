import AsyncStorage from '@react-native-async-storage/async-storage';

import type { AgeBracket, Gender, LearningLevel, NativeLanguage } from '../context/AuthContext';

const STORAGE_KEY = '@app/registered_users_v1';

export type StoredUser = {
  username: string;
  email: string;
  nativeLanguage: NativeLanguage;
  purpose: string;
  dailyGoal: number;
  age: number;
  ageBracket: AgeBracket;
  learningLevel: LearningLevel;
  gender: Gender;
  onboardingComplete: boolean;
};

export function normalizeStoredEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function normalizeStoredUsername(username: string): string {
  return username.trim().toLowerCase();
}

function withUserDefaults(u: StoredUser): StoredUser {
  return {
    ...u,
    ageBracket: u.ageBracket ?? '',
    learningLevel: u.learningLevel ?? '',
  };
}

export async function getRegisteredUsers(): Promise<StoredUser[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as StoredUser[];
    if (!Array.isArray(parsed)) return [];
    return parsed.map(withUserDefaults);
  } catch {
    return [];
  }
}

async function setRegisteredUsers(users: StoredUser[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

export async function findUserByEmailOrUsername(identifier: string): Promise<StoredUser | null> {
  const needle = identifier.trim();
  if (!needle) return null;
  const lower = needle.toLowerCase();
  const users = await getRegisteredUsers();
  return (
    users.find(
      (u) => normalizeStoredEmail(u.email) === lower || normalizeStoredUsername(u.username) === lower,
    ) ?? null
  );
}

export async function isUsernameTaken(username: string): Promise<boolean> {
  const nu = normalizeStoredUsername(username);
  if (!nu) return false;
  const users = await getRegisteredUsers();
  return users.some((u) => normalizeStoredUsername(u.username) === nu);
}

export async function registerUser(
  partial: Pick<StoredUser, 'username' | 'email' | 'nativeLanguage'>,
): Promise<void> {
  const users = await getRegisteredUsers();
  const emailNorm = normalizeStoredEmail(partial.email);
  const newUser: StoredUser = {
    username: partial.username.trim(),
    email: partial.email.trim(),
    nativeLanguage: partial.nativeLanguage,
    purpose: '',
    dailyGoal: 10,
    age: 0,
    ageBracket: '',
    learningLevel: '',
    gender: '',
    onboardingComplete: false,
  };
  const filtered = users.filter((u) => normalizeStoredEmail(u.email) !== emailNorm);
  filtered.push(newUser);
  await setRegisteredUsers(filtered);
}

export async function updateStoredUser(email: string, updates: Partial<StoredUser>): Promise<void> {
  const users = await getRegisteredUsers();
  const emailNorm = normalizeStoredEmail(email);
  const idx = users.findIndex((u) => normalizeStoredEmail(u.email) === emailNorm);
  if (idx === -1) return;
  users[idx] = { ...users[idx], ...updates };
  await setRegisteredUsers(users);
}
