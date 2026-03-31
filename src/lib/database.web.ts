/**
 * Web fallback for database operations.
 * Uses AsyncStorage (localStorage on web) to provide basic persistence.
 * This is a simplified adapter — the real SQLite database is used on native.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { UserRow, UserBookmarkRow } from './database.types';

const USERS_KEY = '@db/users';
const BOOKMARKS_KEY = '@db/bookmarks';
const APP_STATE_KEY = '@db/app_state';

let nextId = 1;

async function getUsers(): Promise<UserRow[]> {
  const raw = await AsyncStorage.getItem(USERS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function saveUsers(users: UserRow[]): Promise<void> {
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
}

async function getBookmarks(): Promise<Record<string, UserBookmarkRow>> {
  const raw = await AsyncStorage.getItem(BOOKMARKS_KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

async function saveBookmarks(bookmarks: Record<string, UserBookmarkRow>): Promise<void> {
  await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
}

async function getAppStateStore(): Promise<Record<string, string>> {
  const raw = await AsyncStorage.getItem(APP_STATE_KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

async function saveAppStateStore(state: Record<string, string>): Promise<void> {
  await AsyncStorage.setItem(APP_STATE_KEY, JSON.stringify(state));
}

// Initialize nextId from existing users
async function ensureNextId(): Promise<void> {
  const users = await getUsers();
  if (users.length > 0) {
    nextId = Math.max(...users.map((u) => u.id)) + 1;
  }
}

// ─── Exported functions matching api.ts interface ────────────────

export async function webCreateUser(
  username: string,
  email: string,
  passwordHash: string,
): Promise<UserRow> {
  await ensureNextId();
  const users = await getUsers();
  const now = new Date().toISOString();
  const user: UserRow = {
    id: nextId++,
    username: username.trim(),
    email: email.trim().toLowerCase(),
    password_hash: passwordHash,
    native_language: 'en',
    age_bracket: '',
    learning_level: '',
    learning_purpose: '',
    gender: '',
    daily_goal: 10,
    onboarding_complete: 0,
    created_at: now,
    updated_at: now,
  };
  users.push(user);
  await saveUsers(users);
  return user;
}

export async function webFindUserByEmailOrUsername(
  identifier: string,
): Promise<UserRow | null> {
  const users = await getUsers();
  const trimmed = identifier.trim().toLowerCase();
  return (
    users.find(
      (u) => u.email === trimmed || u.username.toLowerCase() === trimmed,
    ) ?? null
  );
}

export async function webFindUserById(id: number): Promise<UserRow | null> {
  const users = await getUsers();
  return users.find((u) => u.id === id) ?? null;
}

export async function webIsUsernameTaken(username: string): Promise<boolean> {
  const users = await getUsers();
  const lower = username.trim().toLowerCase();
  return users.some((u) => u.username.toLowerCase() === lower);
}

export async function webIsEmailTaken(email: string): Promise<boolean> {
  const users = await getUsers();
  const lower = email.trim().toLowerCase();
  return users.some((u) => u.email === lower);
}

export async function webUpdateUser(
  userId: number,
  updates: Partial<UserRow>,
): Promise<void> {
  const users = await getUsers();
  const idx = users.findIndex((u) => u.id === userId);
  if (idx === -1) return;
  users[idx] = { ...users[idx], ...updates, updated_at: new Date().toISOString() };
  await saveUsers(users);
}

export async function webGetAppState(key: string): Promise<string | null> {
  const state = await getAppStateStore();
  return state[key] ?? null;
}

export async function webSetAppState(key: string, value: string): Promise<void> {
  const state = await getAppStateStore();
  state[key] = value;
  await saveAppStateStore(state);
}

export async function webGetBookmark(userId: number): Promise<UserBookmarkRow | null> {
  const bookmarks = await getBookmarks();
  return bookmarks[String(userId)] ?? null;
}

export async function webUpdateBookmark(
  userId: number,
  lessonId: string,
  sectionIndex: number,
): Promise<void> {
  const bookmarks = await getBookmarks();
  bookmarks[String(userId)] = {
    user_id: userId,
    last_lesson_id: lessonId,
    last_section_index: sectionIndex,
    updated_at: new Date().toISOString(),
  };
  await saveBookmarks(bookmarks);
}
