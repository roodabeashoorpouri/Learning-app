# Plan 10: Analytics & Learning Metrics

## Overview

Track two things:
1. **App analytics** — engagement, retention, crashes
2. **Learning analytics** — progress, accuracy, weak areas

---

## App Analytics

### Tool: Expo Analytics + Sentry

| Tool | Purpose |
|------|---------|
| Sentry (`sentry-expo`) | Crash reporting, error tracking, performance monitoring |
| Supabase (custom) | Learning-specific metrics (stored in our own tables) |
| PostHog (optional) | Product analytics, funnels, feature flags |

### Key Events to Track

| Event | When | Data |
|-------|------|------|
| `app_opened` | App launch | source (fresh, background, notification) |
| `sign_up` | Account created | method (email, google, apple) |
| `onboarding_completed` | Onboarding finished | language, level, purpose |
| `lesson_started` | Lesson opened | lesson_id, level |
| `section_viewed` | Section swiped to | lesson_id, section_index (0-3) |
| `section_completed` | Finished a section | lesson_id, section_index, time_spent |
| `exercise_answered` | Exercise submitted | exercise_type, is_correct, time_spent |
| `practice_completed` | Finished practice session | section_id, score, total_exercises |
| `pronunciation_attempted` | Used speech recording | lesson_id, score |
| `translation_revealed` | Tapped to see translation | lesson_id, section, word |
| `audio_played` | Played Armenian audio | lesson_id, content_type |
| `language_changed` | Changed secondary language | from, to |
| `app_backgrounded` | App goes to background | time_in_session |

### Sentry Integration

```bash
npx expo install sentry-expo @sentry/react-native
```

```typescript
// App.tsx
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  enableAutoSessionTracking: true,
  tracesSampleRate: 0.2,  // 20% of transactions for performance
});
```

---

## Learning Analytics

These are stored in our own Supabase tables for full control.

### Metrics Computed from `exercise_attempts` Table

#### Per User
| Metric | Calculation |
|--------|-------------|
| Overall accuracy | correct_attempts / total_attempts |
| Accuracy by exercise type | Group by exercise_type |
| Accuracy by lesson | Group by lesson_id |
| Streak (days active) | Consecutive days with >= 1 attempt |
| Daily goal progress | Exercises completed today vs daily_goal |
| Weakest exercise type | Lowest accuracy by type |
| Time per exercise | Avg time_spent by type |

#### Per Lesson
| Metric | Calculation |
|--------|-------------|
| Avg completion time | Avg time from first to last section view |
| Most failed exercises | Exercises with lowest accuracy |
| Drop-off section | Section where most users stop |
| Avg pronunciation score | From pronunciation_scores table |

### Dashboard Queries (Supabase SQL)

```sql
-- User's accuracy over time (weekly)
SELECT
  date_trunc('week', attempted_at) AS week,
  COUNT(*) FILTER (WHERE is_correct) AS correct,
  COUNT(*) AS total,
  ROUND(100.0 * COUNT(*) FILTER (WHERE is_correct) / COUNT(*), 1) AS accuracy
FROM exercise_attempts
WHERE user_id = $1
GROUP BY week
ORDER BY week;

-- User's weakest exercise types
SELECT
  exercise_type,
  COUNT(*) AS attempts,
  ROUND(100.0 * COUNT(*) FILTER (WHERE is_correct) / COUNT(*), 1) AS accuracy
FROM exercise_attempts
WHERE user_id = $1
GROUP BY exercise_type
ORDER BY accuracy ASC;

-- Lesson drop-off analysis (admin)
SELECT
  lesson_id,
  section_index,
  COUNT(DISTINCT user_id) AS users_reached
FROM user_progress
GROUP BY lesson_id, section_index
ORDER BY lesson_id, section_index;

-- Daily active users
SELECT
  DATE(attempted_at) AS day,
  COUNT(DISTINCT user_id) AS dau
FROM exercise_attempts
GROUP BY day
ORDER BY day DESC
LIMIT 30;
```

---

## User-Facing Analytics (Profile Screen)

Show users their own learning data:

```
┌──────────────────────────────┐
│  My Progress                 │
│                              │
│  🔥 7-day streak             │
│                              │
│  📊 This Week                │
│  ├── 42 exercises completed  │
│  ├── 89% accuracy            │
│  └── 3 lessons studied       │
│                              │
│  📈 Accuracy Trend           │
│  [mini bar chart: last 4 weeks] │
│                              │
│  💪 Strengths                │
│  ├── Multiple Choice: 95%    │
│  └── Listening: 88%          │
│                              │
│  🎯 Areas to Practice        │
│  ├── Translation: 62%        │
│  └── Fill in Blank: 71%      │
│                              │
│  📖 Lessons                  │
│  ├── Completed: 8/40         │
│  └── Current: Lesson 9       │
│                              │
└──────────────────────────────┘
```

### API for User Stats

```typescript
// src/lib/api.ts

export async function getUserStats(userId: string) {
  const { data } = await supabase.rpc('get_user_stats', { p_user_id: userId });
  return data;
}

// Supabase RPC function
CREATE OR REPLACE FUNCTION get_user_stats(p_user_id UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_exercises', COUNT(*),
    'correct_exercises', COUNT(*) FILTER (WHERE is_correct),
    'accuracy', ROUND(100.0 * COUNT(*) FILTER (WHERE is_correct) / NULLIF(COUNT(*), 0), 1),
    'lessons_completed', (
      SELECT COUNT(DISTINCT lesson_id) FROM user_progress
      WHERE user_id = p_user_id AND completed = true
    ),
    'current_streak', calculate_streak(p_user_id),
    'exercise_accuracy', (
      SELECT json_agg(row_to_json(t)) FROM (
        SELECT exercise_type,
               ROUND(100.0 * COUNT(*) FILTER (WHERE is_correct) / COUNT(*), 1) AS accuracy
        FROM exercise_attempts WHERE user_id = p_user_id
        GROUP BY exercise_type
      ) t
    )
  ) INTO result
  FROM exercise_attempts
  WHERE user_id = p_user_id;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## Daily Goal Tracking

Users set a daily goal (number of exercises). Track completion:

```typescript
// Check daily progress
export async function getDailyProgress(userId: string): Promise<{ done: number; goal: number }> {
  const today = new Date().toISOString().split('T')[0];

  const { count } = await supabase
    .from('exercise_attempts')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('attempted_at', `${today}T00:00:00`);

  const { data: profile } = await supabase
    .from('profiles')
    .select('daily_goal')
    .eq('id', userId)
    .single();

  return { done: count ?? 0, goal: profile?.daily_goal ?? 10 };
}
```

---

## Implementation Steps

1. [ ] Install and configure Sentry
2. [ ] Create event tracking utility (`src/lib/analytics.ts`)
3. [ ] Add event tracking to key screens and interactions
4. [ ] Create `get_user_stats` RPC function in Supabase
5. [ ] Build user-facing stats section on Profile screen
6. [ ] Add daily goal progress indicator
7. [ ] Add streak calculation
8. [ ] Create admin dashboard queries (for content team)
9. [ ] Set up Sentry alerts for crash rate spikes
10. [ ] Monitor and iterate on metrics monthly
