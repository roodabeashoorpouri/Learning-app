import { Platform } from 'react-native';
import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;

const SCHEMA_VERSION = 1;

const CREATE_TABLES = `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL COLLATE NOCASE,
    email TEXT UNIQUE NOT NULL COLLATE NOCASE,
    password_hash TEXT NOT NULL,
    native_language TEXT NOT NULL DEFAULT 'en' CHECK (native_language IN ('en', 'fa')),
    age_bracket TEXT NOT NULL DEFAULT '' CHECK (age_bracket IN ('', '3-12', '12-25', '25-45', '45+')),
    learning_level TEXT NOT NULL DEFAULT '' CHECK (learning_level IN ('', 'beginner', 'intermediate', 'advanced')),
    learning_purpose TEXT NOT NULL DEFAULT '',
    gender TEXT NOT NULL DEFAULT '' CHECK (gender IN ('', 'male', 'female', 'other')),
    daily_goal INTEGER NOT NULL DEFAULT 10,
    onboarding_complete INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS user_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lesson_id TEXT NOT NULL,
    section_index INTEGER NOT NULL CHECK (section_index BETWEEN 0 AND 3),
    completed INTEGER NOT NULL DEFAULT 0,
    score REAL,
    time_spent_seconds INTEGER DEFAULT 0,
    completed_at TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(user_id, lesson_id, section_index)
  );

  CREATE TABLE IF NOT EXISTS user_bookmarks (
    user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    last_lesson_id TEXT NOT NULL,
    last_section_index INTEGER NOT NULL DEFAULT 0,
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS exercise_attempts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lesson_id TEXT NOT NULL,
    section_id TEXT NOT NULL,
    exercise_index INTEGER NOT NULL,
    exercise_type TEXT NOT NULL,
    is_correct INTEGER NOT NULL,
    user_answer TEXT,
    time_spent_seconds INTEGER,
    attempted_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE INDEX IF NOT EXISTS idx_exercise_attempts_user
    ON exercise_attempts(user_id, lesson_id);

  CREATE TABLE IF NOT EXISTS app_state (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
`;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (db) return db;

  if (Platform.OS === 'web') {
    throw new Error('SQLite is not supported on web. Use native platforms.');
  }

  db = await SQLite.openDatabaseAsync('learning.db');

  // Enable WAL mode and foreign keys
  await db.execAsync('PRAGMA journal_mode = WAL;');
  await db.execAsync('PRAGMA foreign_keys = ON;');

  // Check current schema version
  await db.execAsync(
    `CREATE TABLE IF NOT EXISTS schema_version (version INTEGER NOT NULL);`,
  );
  const row = await db.getFirstAsync<{ version: number }>(
    'SELECT version FROM schema_version LIMIT 1',
  );

  if (!row || row.version < SCHEMA_VERSION) {
    await db.execAsync(CREATE_TABLES);

    if (!row) {
      await db.runAsync(
        'INSERT INTO schema_version (version) VALUES (?)',
        SCHEMA_VERSION,
      );
    } else {
      await db.runAsync(
        'UPDATE schema_version SET version = ?',
        SCHEMA_VERSION,
      );
    }
  }

  return db;
}
