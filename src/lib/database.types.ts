// ─── SQLite row types ─────────────────────────────────────────────

/** User row as stored in SQLite (booleans are 0/1 integers) */
export type UserRow = {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  native_language: string;
  age_bracket: string;
  learning_level: string;
  learning_purpose: string;
  gender: string;
  daily_goal: number;
  onboarding_complete: number; // 0 or 1
  created_at: string;
  updated_at: string;
};

export type UserProgressRow = {
  id: number;
  user_id: number;
  lesson_id: string;
  section_index: number;
  completed: number;
  score: number | null;
  time_spent_seconds: number;
  completed_at: string | null;
  created_at: string;
};

export type UserBookmarkRow = {
  user_id: number;
  last_lesson_id: string;
  last_section_index: number;
  updated_at: string;
};

export type ExerciseAttemptRow = {
  id: number;
  user_id: number;
  lesson_id: string;
  section_id: string;
  exercise_index: number;
  exercise_type: string;
  is_correct: number;
  user_answer: string | null;
  time_spent_seconds: number | null;
  attempted_at: string;
};

export type AppStateRow = {
  key: string;
  value: string;
};
