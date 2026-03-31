# Plan 02: Authentication & Session Management

## Current Issues (from task.md)

1. **Workbook redirect bug** — redirects to Login instead of Workbook after completion
2. **Email uniqueness** — no enforcement, duplicate accounts possible
3. **No real auth** — client-side validation only, no passwords, no tokens

---

## Target Architecture

### Supabase Auth

Supabase provides a complete auth system out of the box:
- Email + password sign-up/sign-in
- Magic link (passwordless) sign-in
- OAuth providers (Google, Apple — required for App Store)
- JWT tokens with automatic refresh
- Session persistence via AsyncStorage

### Auth Flow

```
┌─────────────┐
│  App Launch  │
└──────┬──────┘
       │
       ▼
┌──────────────────┐     Yes     ┌─────────────────────┐
│ Existing session? ├────────────► Validate token        │
└───────┬──────────┘             └──────────┬───────────┘
        │ No                                │
        ▼                           ┌───────┴────────┐
┌───────────────┐                   │ Token valid?    │
│  Auth Screen  │                   └───┬────────┬───┘
│  (Landing)    │                   Yes │        │ No
└───┬───────┬───┘                      ▼        ▼
    │       │                   ┌──────────┐  ┌───────────────┐
    ▼       ▼                   │ Resume   │  │ Auth Screen   │
┌────────┐ ┌────────┐          │ Bookmark │  │ (Re-login)    │
│ Sign Up│ │Sign In │          └──────────┘  └───────────────┘
└───┬────┘ └───┬────┘
    │          │
    ▼          ▼
┌────────────────────────────┐
│ Supabase auth.signUp() or  │
│ auth.signInWithPassword()  │
└─────────────┬──────────────┘
              │
              ▼
┌─────────────────────────────┐
│ Check: onboarding_complete? │
├───────────┬─────────────────┤
│ No        │ Yes             │
▼           ▼                 │
Onboarding  Check bookmark ───┘
Flow        & resume
```

---

## Implementation Details

### 1. Sign Up

```typescript
async function signUp(email: string, password: string, username: string) {
  // 1. Create auth user
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username }  // stored in auth.users.raw_user_meta_data
    }
  });

  if (error) {
    if (error.message.includes('already registered')) {
      throw new Error('An account with this email already exists.');
    }
    throw error;
  }

  // 2. Create profile row (triggered by DB trigger or manual insert)
  // Profile creation handled by database trigger on auth.users insert

  return data;
}
```

**Email uniqueness** is enforced at the Supabase auth level — `auth.users.email` has a unique constraint. No additional work needed.

### 2. Sign In

```typescript
async function signIn(emailOrUsername: string, password: string) {
  let email = emailOrUsername;

  // If user entered a username, look up their email
  if (!emailOrUsername.includes('@')) {
    const { data } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', emailOrUsername)
      .single();

    if (!data) throw new Error('Username not found.');

    // Get email from auth.users via admin or RPC
    const { data: userData } = await supabase.rpc('get_email_by_username', {
      p_username: emailOrUsername
    });
    email = userData;
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}
```

### 3. OAuth (Required for App Store)

Apple Sign-In is **required** for iOS apps that offer any third-party login.

```typescript
// Google Sign-In
async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: 'your-app-scheme://auth/callback',
    },
  });
}

// Apple Sign-In
async function signInWithApple() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'apple',
    options: {
      redirectTo: 'your-app-scheme://auth/callback',
    },
  });
}
```

### 4. Session Persistence & Resume

```typescript
// In AuthContext.tsx — on app launch
useEffect(() => {
  // 1. Check for existing session
  supabase.auth.getSession().then(({ data: { session } }) => {
    if (session) {
      loadUserProfile(session.user.id);
      loadBookmark(session.user.id);
    }
  });

  // 2. Listen for auth state changes
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        await loadUserProfile(session.user.id);
      }
      if (event === 'SIGNED_OUT') {
        resetState();
      }
    }
  );

  return () => subscription.unsubscribe();
}, []);
```

### 5. Profile Creation Trigger

```sql
-- Automatically create a profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, native_language, age_bracket, learning_level, learning_purpose)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || LEFT(NEW.id::text, 8)),
    'en',      -- default, updated during onboarding
    '25-45',   -- default, updated during onboarding
    'beginner', -- default, updated during onboarding
    'hobby'    -- default, updated during onboarding
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

## Fix: Workbook Redirect Bug

**Root cause:** The `OnComplete` handler in the practice session flow navigates back to the auth stack instead of the workbook tab.

**Fix approach:**
1. After `PracticeResult` screen, the "Continue" button should call `navigation.navigate('MainTabNavigator', { screen: 'Workbook' })`
2. Audit `RootNavigator.tsx` to ensure the navigation state doesn't reset when returning from modal screens
3. Ensure `PracticeSession` and `PracticeResult` are presented as modals (they already are), so dismissing them returns to the underlying tab

---

## Updated AuthContext

The current `AuthContext.tsx` stores user data in React state + AsyncStorage. Replace with:

```typescript
interface AuthState {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  bookmark: Bookmark | null;
  loading: boolean;
}

// Methods exposed via context:
interface AuthContextType extends AuthState {
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signIn: (emailOrUsername: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<Profile>) => Promise<void>;
  completeOnboarding: (data: OnboardingData) => Promise<void>;
}
```

---

## Password Requirements

- Minimum 8 characters
- At least 1 letter and 1 number
- Validated client-side before sending to Supabase
- Supabase handles hashing and storage

---

## Implementation Steps

1. [ ] Enable email auth in Supabase dashboard
2. [ ] Configure Google OAuth provider
3. [ ] Configure Apple OAuth provider
4. [ ] Create profile trigger function
5. [ ] Rewrite `AuthContext.tsx` with Supabase auth
6. [ ] Update `AuthScreen.tsx` — add password field, OAuth buttons
7. [ ] Add deep link handling for OAuth callbacks
8. [ ] Fix workbook redirect bug in navigation
9. [ ] Add "Forgot Password" flow (`supabase.auth.resetPasswordForEmail()`)
10. [ ] Test: sign up → onboarding → resume flow
11. [ ] Test: sign in → bookmark resume flow
12. [ ] Test: OAuth sign in (Google + Apple)
13. [ ] Remove old `registeredUsers.ts` storage module
