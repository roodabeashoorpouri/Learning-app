import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDatabase } from './database';

const STORAGE_KEY = '@app/registered_users_v1';
const MIGRATION_DONE_KEY = '@app/sqlite_migration_done';

type LegacyUser = {
  username: string;
  email: string;
  nativeLanguage: string;
  purpose: string;
  dailyGoal: number;
  age: number;
  ageBracket: string;
  learningLevel: string;
  gender: string;
  onboardingComplete: boolean;
  last_visited_lesson_id?: string;
  last_visited_section_index?: number;
};

/**
 * One-time migration from AsyncStorage registered_users to SQLite.
 * Migrated users get a default password hash (they'll need to set a password on next sign-in).
 */
export async function migrateFromAsyncStorage(): Promise<void> {
  const done = await AsyncStorage.getItem(MIGRATION_DONE_KEY);
  if (done === '1') return;

  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) {
    await AsyncStorage.setItem(MIGRATION_DONE_KEY, '1');
    return;
  }

  let users: LegacyUser[];
  try {
    users = JSON.parse(raw);
    if (!Array.isArray(users)) {
      await AsyncStorage.setItem(MIGRATION_DONE_KEY, '1');
      return;
    }
  } catch {
    await AsyncStorage.setItem(MIGRATION_DONE_KEY, '1');
    return;
  }

  const db = await getDatabase();

  // Placeholder hash for migrated users — they'll set a real password later
  const MIGRATED_HASH = '__migrated_no_password__';

  for (const u of users) {
    try {
      // Check if user already exists
      const existing = await db.getFirstAsync<{ id: number }>(
        'SELECT id FROM users WHERE email = ?',
        u.email.trim().toLowerCase(),
      );
      if (existing) continue;

      const result = await db.runAsync(
        `INSERT INTO users
           (username, email, password_hash, native_language, age_bracket,
            learning_level, learning_purpose, gender, daily_goal, onboarding_complete)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        u.username.trim(),
        u.email.trim().toLowerCase(),
        MIGRATED_HASH,
        u.nativeLanguage || 'en',
        u.ageBracket || '',
        u.learningLevel || '',
        u.purpose || '',
        u.gender || '',
        u.dailyGoal || 10,
        u.onboardingComplete ? 1 : 0,
      );

      // Migrate bookmark if present
      if (u.last_visited_lesson_id) {
        await db.runAsync(
          `INSERT OR REPLACE INTO user_bookmarks
             (user_id, last_lesson_id, last_section_index, updated_at)
           VALUES (?, ?, ?, datetime('now'))`,
          result.lastInsertRowId,
          u.last_visited_lesson_id,
          u.last_visited_section_index ?? 0,
        );
      }
    } catch (e) {
      console.warn('[Migration] Failed to migrate user:', u.email, e);
    }
  }

  // Also migrate the last-logged-in email to app_state
  const lastEmail = await AsyncStorage.getItem('@app/last_logged_in_email');
  if (lastEmail) {
    await db.runAsync(
      `INSERT OR REPLACE INTO app_state (key, value) VALUES (?, ?)`,
      'last_logged_in_user_id',
      lastEmail.trim().toLowerCase(),
    );
  }

  await AsyncStorage.setItem(MIGRATION_DONE_KEY, '1');
}
