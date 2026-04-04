import { Platform } from 'react-native';
import * as Crypto from 'expo-crypto';
import type {
  UserRow,
  UserProgressRow,
  UserBookmarkRow,
} from './database.types';

const isWeb = Platform.OS === 'web';

// ─── Password hashing ─────────────────────────────────────────────

async function hashPassword(password: string): Promise<string> {
  return Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    password,
  );
}

// ─── Lazy imports to avoid loading SQLite on web ──────────────────

async function getNativeDb() {
  const { getDatabase } = await import('./database');
  return getDatabase();
}

async function getWebDb() {
  return import('./database.web');
}

// ─── Users ────────────────────────────────────────────────────────

export async function createUser(
  username: string,
  email: string,
  password: string,
): Promise<UserRow> {
  const hash = await hashPassword(password);

  if (isWeb) {
    const web = await getWebDb();
    return web.webCreateUser(username, email, hash);
  }

  const db = await getNativeDb();
  const result = await db.runAsync(
    `INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)`,
    username.trim(),
    email.trim().toLowerCase(),
    hash,
  );

  const user = await db.getFirstAsync<UserRow>(
    'SELECT * FROM users WHERE id = ?',
    result.lastInsertRowId,
  );
  return user!;
}

export async function findUserByEmailOrUsername(
  identifier: string,
): Promise<UserRow | null> {
  if (isWeb) {
    const web = await getWebDb();
    return web.webFindUserByEmailOrUsername(identifier);
  }

  const db = await getNativeDb();
  const trimmed = identifier.trim();
  return db.getFirstAsync<UserRow>(
    `SELECT * FROM users WHERE email = ? OR username = ? COLLATE NOCASE`,
    trimmed.toLowerCase(),
    trimmed,
  );
}

export async function findUserById(id: number): Promise<UserRow | null> {
  if (isWeb) {
    const web = await getWebDb();
    return web.webFindUserById(id);
  }

  const db = await getNativeDb();
  return db.getFirstAsync<UserRow>('SELECT * FROM users WHERE id = ?', id);
}

export async function verifyPassword(
  user: UserRow,
  password: string,
): Promise<boolean> {
  const hash = await hashPassword(password);
  return hash === user.password_hash;
}

export async function isUsernameTaken(username: string): Promise<boolean> {
  if (isWeb) {
    const web = await getWebDb();
    return web.webIsUsernameTaken(username);
  }

  const db = await getNativeDb();
  const row = await db.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM users WHERE username = ? COLLATE NOCASE',
    username.trim(),
  );
  return (row?.count ?? 0) > 0;
}

export async function isEmailTaken(email: string): Promise<boolean> {
  if (isWeb) {
    const web = await getWebDb();
    return web.webIsEmailTaken(email);
  }

  const db = await getNativeDb();
  const row = await db.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM users WHERE email = ?',
    email.trim().toLowerCase(),
  );
  return (row?.count ?? 0) > 0;
}

export async function updateUser(
  userId: number,
  updates: Partial<
    Pick<
      UserRow,
      | 'username'
      | 'native_language'
      | 'age_bracket'
      | 'learning_level'
      | 'learning_purpose'
      | 'gender'
      | 'daily_goal'
      | 'onboarding_complete'
    >
  >,
): Promise<void> {
  if (isWeb) {
    const web = await getWebDb();
    return web.webUpdateUser(userId, updates as Partial<UserRow>);
  }

  const db = await getNativeDb();
  const fields: string[] = [];
  const values: (string | number | null)[] = [];

  for (const [key, value] of Object.entries(updates)) {
    fields.push(`${key} = ?`);
    values.push(value);
  }

  if (fields.length === 0) return;

  fields.push(`updated_at = datetime('now')`);
  values.push(userId);

  await db.runAsync(
    `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
    ...values,
  );
}

// ─── App State (replaces AsyncStorage for session tracking) ───────

export async function getAppState(key: string): Promise<string | null> {
  if (isWeb) {
    const web = await getWebDb();
    return web.webGetAppState(key);
  }

  const db = await getNativeDb();
  const row = await db.getFirstAsync<{ value: string }>(
    'SELECT value FROM app_state WHERE key = ?',
    key,
  );
  return row?.value ?? null;
}

export async function setAppState(key: string, value: string): Promise<void> {
  if (isWeb) {
    const web = await getWebDb();
    return web.webSetAppState(key, value);
  }

  const db = await getNativeDb();
  await db.runAsync(
    `INSERT OR REPLACE INTO app_state (key, value) VALUES (?, ?)`,
    key,
    value,
  );
}

export async function removeAppState(key: string): Promise<void> {
  if (isWeb) {
    // Not critical for web fallback
    return;
  }

  const db = await getNativeDb();
  await db.runAsync('DELETE FROM app_state WHERE key = ?', key);
}

// ─── Bookmarks ────────────────────────────────────────────────────

export async function getBookmark(
  userId: number,
): Promise<UserBookmarkRow | null> {
  if (isWeb) {
    const web = await getWebDb();
    return web.webGetBookmark(userId);
  }

  const db = await getNativeDb();
  return db.getFirstAsync<UserBookmarkRow>(
    'SELECT * FROM user_bookmarks WHERE user_id = ?',
    userId,
  );
}

export async function updateBookmark(
  userId: number,
  lessonId: string,
  sectionIndex: number,
): Promise<void> {
  if (isWeb) {
    const web = await getWebDb();
    return web.webUpdateBookmark(userId, lessonId, sectionIndex);
  }

  const db = await getNativeDb();
  await db.runAsync(
    `INSERT OR REPLACE INTO user_bookmarks (user_id, last_lesson_id, last_section_index, updated_at)
     VALUES (?, ?, ?, datetime('now'))`,
    userId,
    lessonId,
    sectionIndex,
  );
}

// ─── Progress ─────────────────────────────────────────────────────

export async function getProgress(
  userId: number,
): Promise<UserProgressRow[]> {
  if (isWeb) return []; // Simplified for web

  const db = await getNativeDb();
  return db.getAllAsync<UserProgressRow>(
    'SELECT * FROM user_progress WHERE user_id = ?',
    userId,
  );
}

export async function saveProgress(
  userId: number,
  lessonId: string,
  sectionIndex: number,
  score?: number,
): Promise<void> {
  if (isWeb) return; // Simplified for web

  const db = await getNativeDb();
  await db.runAsync(
    `INSERT OR REPLACE INTO user_progress
       (user_id, lesson_id, section_index, completed, score, completed_at)
     VALUES (?, ?, ?, 1, ?, datetime('now'))`,
    userId,
    lessonId,
    sectionIndex,
    score ?? null,
  );
}

// ─── Exercise Attempts ────────────────────────────────────────────

export async function recordAttempt(
  userId: number,
  lessonId: string,
  sectionId: string,
  exerciseIndex: number,
  exerciseType: string,
  isCorrect: boolean,
  userAnswer?: unknown,
  timeSpentSeconds?: number,
): Promise<void> {
  if (isWeb) return; // Simplified for web

  const db = await getNativeDb();
  await db.runAsync(
    `INSERT INTO exercise_attempts
       (user_id, lesson_id, section_id, exercise_index, exercise_type, is_correct, user_answer, time_spent_seconds)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    userId,
    lessonId,
    sectionId,
    exerciseIndex,
    exerciseType,
    isCorrect ? 1 : 0,
    userAnswer ? JSON.stringify(userAnswer) : null,
    timeSpentSeconds ?? null,
  );
}

// ─── Migration from AsyncStorage ──────────────────────────────────

export async function migrateFromAsyncStorage(): Promise<void> {
  if (isWeb) return; // No migration needed on web
  const { migrateFromAsyncStorage: migrate } = await import('./migrate');
  return migrate();
}
