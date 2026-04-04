# Plan 01: Backend & Database

## Decision: Supabase

**Why Supabase over alternatives:**
- Built-in auth (email, OAuth, magic links) — saves building auth from scratch
- PostgreSQL — relational, strong for structured curriculum data
- Row-Level Security (RLS) — user data isolation without custom middleware
- Real-time subscriptions — future collaboration features
- Storage buckets — host audio files and illustrations
- Free tier generous enough for MVP launch
- React Native SDK (`@supabase/supabase-js`) with good Expo support

---

## Database Schema

### Tables

#### `profiles`
Extends Supabase auth.users with app-specific data.

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  native_language TEXT NOT NULL CHECK (native_language IN ('en', 'fa')),
  age_bracket TEXT NOT NULL CHECK (age_bracket IN ('3-12', '12-25', '25-45', '45+')),
  learning_level TEXT NOT NULL CHECK (learning_level IN ('beginner', 'intermediate', 'advanced')),
  learning_purpose TEXT NOT NULL,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  daily_goal INTEGER NOT NULL DEFAULT 10,
  onboarding_complete BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS: users can only read/update their own profile
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
```

#### `user_progress`
Tracks lesson and section completion per user.

```sql
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id TEXT NOT NULL,
  section_index INTEGER NOT NULL CHECK (section_index BETWEEN 0 AND 3),
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  score NUMERIC(5,2),  -- percentage score if applicable
  time_spent_seconds INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(user_id, lesson_id, section_index)
);

ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own progress" ON user_progress
  FOR ALL USING (auth.uid() = user_id);
```

#### `user_bookmarks`
Resume-from-bookmark functionality.

```sql
CREATE TABLE user_bookmarks (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  last_lesson_id TEXT NOT NULL,
  last_section_index INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE user_bookmarks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own bookmark" ON user_bookmarks
  FOR ALL USING (auth.uid() = user_id);
```

#### `exercise_attempts`
Detailed exercise-level tracking for analytics.

```sql
CREATE TABLE exercise_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id TEXT NOT NULL,
  section_id TEXT NOT NULL,
  exercise_index INTEGER NOT NULL,
  exercise_type TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  user_answer JSONB,  -- flexible storage for different exercise types
  time_spent_seconds INTEGER,
  attempted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE exercise_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own attempts" ON exercise_attempts
  FOR ALL USING (auth.uid() = user_id);

-- Index for querying user performance
CREATE INDEX idx_exercise_attempts_user ON exercise_attempts(user_id, lesson_id);
```

#### `pronunciation_scores`
Speech recognition results.

```sql
CREATE TABLE pronunciation_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id TEXT NOT NULL,
  phrase_armenian TEXT NOT NULL,
  score NUMERIC(5,2) NOT NULL,  -- 0-100
  feedback JSONB,  -- detailed phonetic feedback
  audio_url TEXT,  -- stored in Supabase Storage
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE pronunciation_scores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own scores" ON pronunciation_scores
  FOR ALL USING (auth.uid() = user_id);
```

#### `lessons` (Content table — admin managed)
```sql
CREATE TABLE lessons (
  id TEXT PRIMARY KEY,  -- e.g., 'lesson-1', 'lesson-2'
  level INTEGER NOT NULL CHECK (level BETWEEN 1 AND 4),
  sort_order INTEGER NOT NULL,
  title_hy TEXT NOT NULL,
  title_hy_phonetic TEXT NOT NULL,
  title_en TEXT NOT NULL,
  title_fa TEXT NOT NULL,
  setting_en TEXT NOT NULL,
  setting_fa TEXT NOT NULL,
  content JSONB NOT NULL,  -- full lesson data (conversation, reading, listening, writing)
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Public read access for published lessons
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read published lessons" ON lessons
  FOR SELECT USING (is_published = TRUE);
```

#### `workbook_units` (Exercise content — admin managed)
```sql
CREATE TABLE workbook_units (
  id TEXT PRIMARY KEY,
  lesson_id TEXT NOT NULL REFERENCES lessons(id),
  title_en TEXT NOT NULL,
  title_fa TEXT NOT NULL,
  sort_order INTEGER NOT NULL,
  sections JSONB NOT NULL,  -- array of sections with exercises
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE workbook_units ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read published units" ON workbook_units
  FOR SELECT USING (is_published = TRUE);
```

---

## Supabase Storage Buckets

| Bucket | Purpose | Access |
|--------|---------|--------|
| `lesson-illustrations` | Scene images for Conversation & Reading sections | Public read |
| `lesson-audio` | Native Armenian audio clips | Public read |
| `user-recordings` | User pronunciation recordings | Private (owner only) |
| `app-assets` | Logo, icons, character art | Public read |

---

## API Layer in the App

### New Dependencies
```bash
npx expo install @supabase/supabase-js @react-native-async-storage/async-storage
```

### Client Setup (`src/lib/supabase.ts`)
```typescript
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,  // important for React Native
  },
});
```

### Data Access Functions (`src/lib/api.ts`)
```typescript
// Lesson fetching with caching
export async function fetchLessons(level?: number) { ... }
export async function fetchLesson(id: string) { ... }

// Progress tracking
export async function saveProgress(lessonId: string, sectionIndex: number, score?: number) { ... }
export async function getProgress(userId: string) { ... }

// Bookmark management
export async function updateBookmark(lessonId: string, sectionIndex: number) { ... }
export async function getBookmark() { ... }

// Exercise attempts
export async function recordAttempt(data: ExerciseAttemptInput) { ... }

// Pronunciation
export async function savePronunciationScore(data: PronunciationInput) { ... }
```

---

## Migration Strategy (AsyncStorage → Supabase)

1. **Keep AsyncStorage as offline cache** — don't remove it
2. **Add Supabase as source of truth** — sync on app open
3. **Migration on first login:**
   - If user has local data but no Supabase account → create account + upload local data
   - If user has both → merge (Supabase wins on conflicts, preserve local progress)
4. **Remove raw AsyncStorage user management** after migration period

---

## Implementation Steps

1. [ ] Create Supabase project
2. [ ] Run schema migrations (SQL above)
3. [ ] Configure Storage buckets
4. [ ] Add `@supabase/supabase-js` to project
5. [ ] Create `src/lib/supabase.ts` client
6. [ ] Create `src/lib/api.ts` data layer
7. [ ] Update `AuthContext.tsx` to use Supabase auth
8. [ ] Add `.env` with `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY`
9. [ ] Migrate existing screens to use API layer
10. [ ] Set up RLS policies
11. [ ] Test offline → online sync
