import { userRowToAuth } from '../../src/lib/authHelpers';
import type { UserRow, UserBookmarkRow } from '../../src/lib/database.types';

const baseUser: UserRow = {
  id: 1,
  username: 'testuser',
  email: 'test@example.com',
  password_hash: 'abc123',
  native_language: 'en',
  age_bracket: '25-45',
  learning_level: 'beginner',
  learning_purpose: 'Hobby',
  gender: 'male',
  daily_goal: 10,
  onboarding_complete: 1,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

describe('userRowToAuth()', () => {
  it('converts a user row to auth state', () => {
    const result = userRowToAuth(baseUser);

    expect(result.userId).toBe(1);
    expect(result.username).toBe('testuser');
    expect(result.email).toBe('test@example.com');
    expect(result.nativeLanguage).toBe('en');
    expect(result.purpose).toBe('Hobby');
    expect(result.dailyGoal).toBe(10);
    expect(result.ageBracket).toBe('25-45');
    expect(result.learningLevel).toBe('beginner');
    expect(result.gender).toBe('male');
  });

  it('defaults bookmark fields to empty when no bookmark provided', () => {
    const result = userRowToAuth(baseUser);

    expect(result.last_visited_lesson_id).toBe('');
    expect(result.last_visited_section_index).toBe(0);
  });

  it('includes bookmark data when provided', () => {
    const bookmark: UserBookmarkRow = {
      user_id: 1,
      last_lesson_id: 'lesson-3',
      last_section_index: 2,
      updated_at: '2024-01-01T00:00:00Z',
    };

    const result = userRowToAuth(baseUser, bookmark);

    expect(result.last_visited_lesson_id).toBe('lesson-3');
    expect(result.last_visited_section_index).toBe(2);
  });

  it('handles empty string fields gracefully', () => {
    const user: UserRow = {
      ...baseUser,
      age_bracket: '',
      learning_level: '',
      gender: '',
    };

    const result = userRowToAuth(user);

    expect(result.ageBracket).toBe('');
    expect(result.learningLevel).toBe('');
    expect(result.gender).toBe('');
  });

  it('handles Persian native language', () => {
    const user: UserRow = { ...baseUser, native_language: 'fa' };
    const result = userRowToAuth(user);
    expect(result.nativeLanguage).toBe('fa');
  });
});
