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
  last_visited_lesson_id?: string;
  last_visited_section_index?: number;
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

  // Guard: never overwrite an existing account
  const existing = users.find((u) => normalizeStoredEmail(u.email) === emailNorm);
  if (existing) {
    throw new Error('EMAIL_ALREADY_REGISTERED');
  }

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
  users.push(newUser);
  await setRegisteredUsers(users);
}

export async function updateStoredUser(email: string, updates: Partial<StoredUser>): Promise<void> {
  const users = await getRegisteredUsers();
  const emailNorm = normalizeStoredEmail(email);
  const idx = users.findIndex((u) => normalizeStoredEmail(u.email) === emailNorm);
  if (idx === -1) return;
  users[idx] = { ...users[idx], ...updates };
  await setRegisteredUsers(users);
}

export async function saveLessonProgress(
  email: string,
  lessonId: string,
  sectionIndex: number,
): Promise<void> {
  await updateStoredUser(email, {
    last_visited_lesson_id: lessonId,
    last_visited_section_index: sectionIndex,
  });
}

export async function isEmailTaken(email: string): Promise<boolean> {
  const ne = normalizeStoredEmail(email);
  if (!ne) return false;
  const users = await getRegisteredUsers();
  return users.some((u) => normalizeStoredEmail(u.email) === ne);
}

/**
 * Migration: any user who has filled-in profile data but onboardingComplete=false
 * was corrupted by the old upsert bug. Mark them complete so they skip onboarding.
 */
export async function migrateOnboardingFlags(): Promise<void> {
  const users = await getRegisteredUsers();
  let changed = false;
  const fixed = users.map((u) => {
    if (!u.onboardingComplete && u.ageBracket && u.learningLevel && u.gender && u.purpose) {
      changed = true;
      return { ...u, onboardingComplete: true };
    }
    return u;
  });
  if (changed) {
    await setRegisteredUsers(fixed);
  }
}

/** Dev helper — logs all stored users to console */
export async function debugDumpUsers(): Promise<void> {
  const users = await getRegisteredUsers();
  console.log('[Storage] Registered users:', JSON.stringify(users, null, 2));
}
