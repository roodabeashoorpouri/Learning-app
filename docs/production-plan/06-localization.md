# Plan 06: Localization & Dual-Language UI

## Overview

The app supports trilingual content (Armenian, English, Persian) with RTL for Persian. This plan addresses the task.md requirement for a **system-wide language toggle** and full localization of all UI strings.

---

## Current State

- Content data uses `TrilingualText` type: `{ hy, hyPhonetic, en, fa }`
- `textHelpers.ts` provides `t()`, `hy()`, `hyPhonetic()` functions
- Persian font (Vazirmatn) loaded via Expo Google Fonts
- RTL layout support exists in onboarding
- **Missing:** System UI strings are hardcoded in English

---

## Language Model

Every user profile has a fixed two-language setup:

```
Primary Language:    Armenian (always — this is what they're learning)
Secondary Language:  English OR Persian (user's native language, chosen in onboarding)
```

This is NOT a simple i18n toggle. The secondary language determines:
1. UI labels and navigation text
2. Translation side of all bilingual content
3. Text direction (LTR for English, RTL for Persian)
4. Font selection (system font vs Vazirmatn)

---

## UI String System

### Create a centralized string catalog

```typescript
// src/i18n/strings.ts

type StringKey = keyof typeof strings.en;

const strings = {
  en: {
    // Navigation
    'nav.studentBook': 'Student Book',
    'nav.workbook': 'Workbook',
    'nav.profile': 'Profile',

    // Auth
    'auth.welcome': 'Welcome',
    'auth.signUp': 'Sign Up',
    'auth.signIn': 'Sign In',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.username': 'Username',
    'auth.forgotPassword': 'Forgot Password?',
    'auth.alreadyHaveAccount': 'Already have an account?',
    'auth.noAccount': "Don't have an account?",

    // Onboarding
    'onboarding.selectLanguage': 'Select your language',
    'onboarding.selectAge': 'Select your age group',
    'onboarding.selectPurpose': 'Why are you learning Armenian?',
    'onboarding.selectLevel': 'What is your current level?',
    'onboarding.next': 'Next',
    'onboarding.back': 'Back',
    'onboarding.finish': 'Start Learning',

    // Lessons
    'lesson.conversation': 'Conversation',
    'lesson.reading': 'Reading',
    'lesson.listening': 'Listening',
    'lesson.writing': 'Writing',
    'lesson.tapToTranslate': 'Tap Armenian text to see translation',
    'lesson.swipeHint': 'Swipe to next section',
    'lesson.listenAndRepeat': 'Listen and repeat',
    'lesson.tapToRecord': 'Tap to record',
    'lesson.recording': 'Recording...',

    // Exercises
    'exercise.check': 'Check',
    'exercise.continue': 'Continue',
    'exercise.correct': 'Correct!',
    'exercise.incorrect': 'Not quite right',
    'exercise.tryAgain': 'Try Again',
    'exercise.selectAnswer': 'Select an answer',
    'exercise.fillBlank': 'Fill in the blank',
    'exercise.matchPairs': 'Match the pairs',
    'exercise.translate': 'Translate this phrase',

    // Profile
    'profile.title': 'My Profile',
    'profile.level': 'Level',
    'profile.dailyGoal': 'Daily Goal',
    'profile.lessonsCompleted': 'Lessons Completed',
    'profile.signOut': 'Sign Out',
    'profile.settings': 'Settings',
    'profile.language': 'Language',

    // Practice Results
    'results.title': 'Practice Complete',
    'results.score': 'Your Score',
    'results.backToWorkbook': 'Back to Workbook',

    // General
    'general.loading': 'Loading...',
    'general.error': 'Something went wrong',
    'general.retry': 'Retry',
    'general.cancel': 'Cancel',
    'general.save': 'Save',
    'general.done': 'Done',
  },

  fa: {
    // Navigation
    'nav.studentBook': 'کتاب دانش‌آموز',
    'nav.workbook': 'کتاب تمرین',
    'nav.profile': 'پروفایل',

    // Auth
    'auth.welcome': 'خوش آمدید',
    'auth.signUp': 'ثبت‌نام',
    'auth.signIn': 'ورود',
    'auth.email': 'ایمیل',
    'auth.password': 'رمز عبور',
    'auth.username': 'نام کاربری',
    'auth.forgotPassword': 'رمز عبور را فراموش کرده‌اید؟',
    'auth.alreadyHaveAccount': 'حساب کاربری دارید؟',
    'auth.noAccount': 'حساب کاربری ندارید؟',

    // Onboarding
    'onboarding.selectLanguage': 'زبان خود را انتخاب کنید',
    'onboarding.selectAge': 'گروه سنی خود را انتخاب کنید',
    'onboarding.selectPurpose': 'چرا ارمنی یاد می‌گیرید؟',
    'onboarding.selectLevel': 'سطح فعلی شما چیست؟',
    'onboarding.next': 'بعدی',
    'onboarding.back': 'قبلی',
    'onboarding.finish': 'شروع یادگیری',

    // Lessons
    'lesson.conversation': 'مکالمه',
    'lesson.reading': 'خواندن',
    'lesson.listening': 'شنیدن',
    'lesson.writing': 'نوشتن',
    'lesson.tapToTranslate': 'برای دیدن ترجمه روی متن ارمنی ضربه بزنید',
    'lesson.swipeHint': 'برای بخش بعدی بکشید',
    'lesson.listenAndRepeat': 'گوش دهید و تکرار کنید',
    'lesson.tapToRecord': 'برای ضبط ضربه بزنید',
    'lesson.recording': 'در حال ضبط...',

    // Exercises
    'exercise.check': 'بررسی',
    'exercise.continue': 'ادامه',
    'exercise.correct': 'درست!',
    'exercise.incorrect': 'کاملاً درست نبود',
    'exercise.tryAgain': 'دوباره تلاش کنید',
    'exercise.selectAnswer': 'یک پاسخ انتخاب کنید',
    'exercise.fillBlank': 'جای خالی را پر کنید',
    'exercise.matchPairs': 'جفت‌ها را مطابقت دهید',
    'exercise.translate': 'این عبارت را ترجمه کنید',

    // Profile
    'profile.title': 'پروفایل من',
    'profile.level': 'سطح',
    'profile.dailyGoal': 'هدف روزانه',
    'profile.lessonsCompleted': 'درس‌های تکمیل‌شده',
    'profile.signOut': 'خروج',
    'profile.settings': 'تنظیمات',
    'profile.language': 'زبان',

    // Practice Results
    'results.title': 'تمرین کامل شد',
    'results.score': 'امتیاز شما',
    'results.backToWorkbook': 'بازگشت به کتاب تمرین',

    // General
    'general.loading': 'در حال بارگذاری...',
    'general.error': 'مشکلی پیش آمد',
    'general.retry': 'تلاش مجدد',
    'general.cancel': 'لغو',
    'general.save': 'ذخیره',
    'general.done': 'انجام شد',
  },
};

export default strings;
```

### Language Context Hook

```typescript
// src/i18n/useLanguage.ts

export function useLanguage() {
  const { profile } = useAuth();
  const lang = profile?.native_language ?? 'en';

  const t = (key: StringKey): string => {
    return strings[lang][key] ?? strings.en[key] ?? key;
  };

  const isRTL = lang === 'fa';
  const fontFamily = lang === 'fa' ? 'Vazirmatn_400Regular' : undefined;

  return { t, lang, isRTL, fontFamily };
}
```

---

## RTL Implementation

### Current Issues to Fix
- Not all screens respect RTL layout
- Some icons and arrows need mirroring
- Text alignment inconsistent in RTL mode

### Solution: Global RTL Provider

```typescript
// src/i18n/RTLProvider.tsx
import { I18nManager } from 'react-native';

export function RTLProvider({ children }: { children: React.ReactNode }) {
  const { isRTL } = useLanguage();

  useEffect(() => {
    if (I18nManager.isRTL !== isRTL) {
      I18nManager.forceRTL(isRTL);
      // On React Native, RTL change requires restart
      // Handle gracefully with a message or auto-restart
    }
  }, [isRTL]);

  return <>{children}</>;
}
```

### RTL-Aware Styles

Use Tailwind's RTL utilities with NativeWind:
```
text-left   → ltr:text-left rtl:text-right
ml-4        → ltr:ml-4 rtl:mr-4
flex-row    → ltr:flex-row rtl:flex-row-reverse
```

---

## Content Language Display

The dual-language system for lesson content:

| Element | Displayed As |
|---------|-------------|
| Armenian text (primary) | Always shown in Armenian script |
| Armenian phonetic | Shown below Armenian text (optional toggle) |
| Translation | Hidden by default, shown on tap in user's secondary language |
| UI labels | Shown in user's secondary language |
| Audio | Armenian pronunciation (native recording) |

---

## Settings Menu: Language Toggle

Location: Profile → Settings

```
┌──────────────────────────────┐
│  Settings                    │
│                              │
│  🌐 Translation Language     │
│  ┌────────┐  ┌────────────┐ │
│  │English │  │ فارسdelays  │ │
│  │ (active)│  │            │ │
│  └────────┘  └────────────┘ │
│                              │
│  Note: Changing language     │
│  will restart the app.       │
│                              │
└──────────────────────────────┘
```

Changing the language:
1. Updates `native_language` in profile (Supabase + local)
2. Triggers `I18nManager.forceRTL()` if switching to/from Persian
3. Restarts the app (required for RTL change on React Native)

---

## Implementation Steps

1. [ ] Create `src/i18n/strings.ts` with all UI strings
2. [ ] Create `useLanguage()` hook
3. [ ] Create `RTLProvider` component
4. [ ] Replace all hardcoded English strings across all screens
5. [ ] Audit and fix RTL layout issues in every screen
6. [ ] Add language toggle in Settings/Profile
7. [ ] Test full app flow in Persian mode
8. [ ] Test full app flow in English mode
9. [ ] Add Nunito font for English mode (per design-style.md)
10. [ ] Ensure tab navigator labels use translated strings
