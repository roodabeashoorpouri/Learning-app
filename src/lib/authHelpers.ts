import type { AuthState } from '../context/AuthContext';
import type { UserRow, UserBookmarkRow } from './database.types';

/** Convert a SQLite user row + optional bookmark into an AuthState patch */
export function userRowToAuth(
  user: UserRow,
  bookmark?: UserBookmarkRow | null,
): Partial<AuthState> {
  return {
    userId: user.id,
    username: user.username,
    email: user.email,
    nativeLanguage: (user.native_language as 'en' | 'fa') || 'en',
    purpose: user.learning_purpose,
    dailyGoal: user.daily_goal,
    age: 0,
    ageBracket: (user.age_bracket as AuthState['ageBracket']) || '',
    learningLevel: (user.learning_level as AuthState['learningLevel']) || '',
    gender: (user.gender as AuthState['gender']) || '',
    last_visited_lesson_id: bookmark?.last_lesson_id ?? '',
    last_visited_section_index: bookmark?.last_section_index ?? 0,
  };
}
