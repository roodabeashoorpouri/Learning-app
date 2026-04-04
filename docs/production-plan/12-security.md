# Plan 12: Security & Privacy

## Overview

Protect user data, comply with app store requirements, and prevent common vulnerabilities.

---

## Authentication Security

### Handled by Supabase Auth
- Password hashing (bcrypt)
- JWT token management with automatic refresh
- Rate limiting on auth endpoints
- Email confirmation
- PKCE flow for OAuth

### App-Side Responsibilities
- Never store passwords locally
- Store JWT securely via AsyncStorage (encrypted on iOS Keychain, Android Keystore via Expo SecureStore)
- Clear tokens on sign-out
- Handle token expiry gracefully

### Upgrade: Use Expo SecureStore

```bash
npx expo install expo-secure-store
```

```typescript
// Override Supabase's default AsyncStorage with SecureStore for tokens
import * as SecureStore from 'expo-secure-store';

const secureStorage = {
  getItem: (key: string) => SecureStore.getItemAsync(key),
  setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
  removeItem: (key: string) => SecureStore.deleteItemAsync(key),
};

export const supabase = createClient(url, key, {
  auth: {
    storage: secureStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
```

---

## Data Protection

### Row-Level Security (RLS)

All Supabase tables must have RLS enabled (defined in Plan 01). Users can only access their own data.

### Data Classification

| Data Type | Sensitivity | Storage | Encryption |
|-----------|-------------|---------|-----------|
| Email | PII | Supabase auth | At rest (Supabase) |
| Password | Secret | Supabase auth (hashed) | bcrypt |
| Username | PII | Supabase profiles | At rest |
| Learning progress | Personal | Supabase | At rest |
| Audio recordings | Personal | Supabase Storage | At rest |
| Pronunciation scores | Personal | Supabase | At rest |
| Session tokens | Secret | Expo SecureStore | Device keychain |

### Data Minimization
- Don't collect data you don't need
- Audio recordings for pronunciation: process and delete after scoring (don't store permanently unless user opts in)
- Analytics events: anonymize after 90 days

---

## API Security

### Environment Variables
- Never hardcode API keys in source code
- Use `EXPO_PUBLIC_` prefix for client-safe keys only
- Server-side keys (Google Cloud, Supabase service role) stay in Edge Functions only

### Supabase Anon Key
The anon key is safe to expose client-side because:
- RLS policies enforce access control
- The key only grants `anon` role permissions
- Service role key never leaves the server

### Rate Limiting
- Supabase has built-in rate limiting on auth endpoints
- Add application-level rate limiting for:
  - Pronunciation checks: 20/day per user (free tier)
  - Exercise submissions: 200/day per user
  - API calls: 100/minute per user

```sql
-- Example: Rate limit pronunciation checks via RPC
CREATE OR REPLACE FUNCTION check_pronunciation_limit(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  today_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO today_count
  FROM pronunciation_scores
  WHERE user_id = p_user_id
    AND created_at >= CURRENT_DATE;

  RETURN today_count < 20;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## Input Validation

### Client-Side
- Email format validation
- Password strength requirements (8+ chars, letter + number)
- Username: alphanumeric + underscore, 3-20 chars
- Exercise answers: sanitize before sending

### Server-Side (Supabase)
- CHECK constraints on database columns
- RLS policies validate ownership
- Edge Functions validate request bodies

---

## Privacy Policy Requirements

Both app stores require a privacy policy. Must cover:

1. **What data we collect:** Email, username, learning preferences, progress, audio recordings
2. **Why we collect it:** Authentication, personalization, pronunciation feedback, analytics
3. **How we store it:** Supabase (AWS infrastructure), encrypted at rest
4. **Third-party services:** Google Cloud Speech API (audio processing), Sentry (crash reporting)
5. **Data retention:** Account data kept until deletion requested; audio recordings processed and deleted within 24 hours
6. **User rights:** Access, export, and delete their data
7. **Children's privacy:** If targeting under-13 users, COPPA compliance required
8. **Contact:** Email for privacy inquiries

### Age Consideration

The app has an age bracket "3-12". If users under 13 can create accounts:
- **COPPA (US):** Requires verifiable parental consent
- **GDPR (EU):** Requires parental consent for under-16
- **Solution:** Either require parent's email for young users, or set minimum age to 13 for account creation (allow under-13 in offline/local mode only)

---

## Common Vulnerability Prevention

| Vulnerability | Risk | Mitigation |
|---------------|------|-----------|
| SQL Injection | Low (Supabase parameterized queries) | Use Supabase client, never raw SQL in app |
| XSS | Low (React Native, not web DOM) | Sanitize any web view content |
| Insecure Storage | Medium | Use SecureStore for tokens |
| Man-in-the-Middle | Low | Supabase uses HTTPS, enforce SSL pinning |
| Broken Auth | Medium | Supabase handles JWT, add session timeout |
| Excessive Data Exposure | Medium | RLS policies, select only needed columns |

### Session Timeout
```typescript
// Auto-logout after 30 days of inactivity
const SESSION_TIMEOUT = 30 * 24 * 60 * 60 * 1000; // 30 days

function checkSessionExpiry() {
  const lastActive = await SecureStore.getItemAsync('last_active');
  if (lastActive && Date.now() - parseInt(lastActive) > SESSION_TIMEOUT) {
    await supabase.auth.signOut();
  }
  await SecureStore.setItemAsync('last_active', Date.now().toString());
}
```

---

## Data Export & Deletion

Users must be able to request their data (GDPR right):

```sql
-- Export all user data
CREATE OR REPLACE FUNCTION export_user_data(p_user_id UUID)
RETURNS JSON AS $$
BEGIN
  RETURN json_build_object(
    'profile', (SELECT row_to_json(p) FROM profiles p WHERE id = p_user_id),
    'progress', (SELECT json_agg(row_to_json(up)) FROM user_progress up WHERE user_id = p_user_id),
    'bookmarks', (SELECT row_to_json(b) FROM user_bookmarks b WHERE user_id = p_user_id),
    'exercise_attempts', (SELECT json_agg(row_to_json(ea)) FROM exercise_attempts ea WHERE user_id = p_user_id),
    'pronunciation_scores', (SELECT json_agg(row_to_json(ps)) FROM pronunciation_scores ps WHERE user_id = p_user_id)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Delete all user data (cascading from profiles)
-- Just delete the Supabase auth user — CASCADE handles the rest
```

---

## Implementation Steps

1. [ ] Install `expo-secure-store`
2. [ ] Configure Supabase client to use SecureStore for tokens
3. [ ] Verify RLS policies on all tables
4. [ ] Add input validation to all forms
5. [ ] Implement session timeout
6. [ ] Write privacy policy document
7. [ ] Create data export function
8. [ ] Create account deletion flow (Profile → Settings → Delete Account)
9. [ ] Decide on age policy (COPPA compliance or 13+ requirement)
10. [ ] Security audit before launch
11. [ ] Set up Supabase database backups
