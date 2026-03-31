# Plan 07: Testing Strategy & CI/CD

## Current State

Zero tests. No test framework configured.

---

## Testing Stack

| Tool | Purpose |
|------|---------|
| Jest | Test runner (already bundled with Expo) |
| React Native Testing Library | Component rendering & interaction tests |
| MSW (Mock Service Worker) | API mocking for integration tests |
| Detox | End-to-end tests on real devices/simulators |

### New Dependencies
```bash
npm install --save-dev @testing-library/react-native @testing-library/jest-native jest-expo msw
```

---

## Test Categories

### 1. Unit Tests

Target: Pure functions, hooks, utilities.

| File | Tests |
|------|-------|
| `src/utils/textHelpers.ts` | `t()` returns correct language, `hy()` extracts Armenian |
| `src/utils/speech.ts` | Calls expo-speech with correct params |
| `src/i18n/strings.ts` | All keys exist in both `en` and `fa` |
| `src/hooks/usePracticeSession.ts` | State transitions: answer → check → feedback → next |
| `src/lib/api.ts` | Correct Supabase queries constructed |
| Pronunciation scoring | Score calculation accuracy |

**Example:**
```typescript
// __tests__/utils/textHelpers.test.ts
describe('t()', () => {
  it('returns English text when language is en', () => {
    const text = { hy: 'Բdelay', hyPhonetic: 'Barev', en: 'Hello', fa: 'سلام' };
    expect(t(text, 'en')).toBe('Hello');
  });

  it('returns Persian text when language is fa', () => {
    const text = { hy: 'Բdelay', hyPhonetic: 'Barev', en: 'Hello', fa: 'سلام' };
    expect(t(text, 'fa')).toBe('سلام');
  });
});
```

### 2. Component Tests

Target: UI components render correctly and respond to interactions.

| Component | Tests |
|-----------|-------|
| `InteractiveText` | Renders Armenian, tap reveals translation, tap plays audio |
| `ExerciseRenderer` | Dispatches to correct exercise type component |
| `MultipleChoiceExercise` | Renders options, selection updates state, check validates |
| `FillBlankExercise` | Tapping word fills blank, check validates |
| `MatchPairsExercise` | Pair selection, match validation |
| `ConversationSection` | Renders dialogue lines, speaker icons |
| `LessonPagerView` | Swipe triggers section change |
| `SectionIndicator` | Correct dot highlighted |
| `CloseButton` | Triggers navigation on press |
| `ProgressBar` | Width matches progress percentage |

**Example:**
```typescript
// __tests__/components/InteractiveText.test.tsx
describe('InteractiveText', () => {
  const text = { hy: 'Բdelay', hyPhonetic: 'Barev', en: 'Hello', fa: 'سلام' };

  it('shows Armenian text by default', () => {
    const { getByText } = render(<InteractiveText text={text} language="en" />);
    expect(getByText('Բdelay')).toBeTruthy();
  });

  it('reveals translation on tap', () => {
    const { getByText, queryByText } = render(<InteractiveText text={text} language="en" />);
    expect(queryByText('Hello')).toBeNull();
    fireEvent.press(getByText('Բdelay'));
    expect(getByText('Hello')).toBeTruthy();
  });
});
```

### 3. Screen Tests

Target: Full screen rendering and navigation.

| Screen | Tests |
|--------|-------|
| `AuthScreen` | Renders landing, switches to signup/signin, validates input |
| `OnboardingScreen` | Steps advance, data collected, completes |
| `StudentBookScreen` | Lesson list renders, tap navigates to lesson |
| `WorkbookScreen` | Units render, sections expand, start practice |
| `ProfileScreen` | User data displayed, sign out works |

### 4. Integration Tests

Target: Data flow from UI through API to state.

| Flow | Tests |
|------|-------|
| Sign up | Form → Supabase auth → profile created → onboarding |
| Sign in + resume | Auth → fetch bookmark → navigate to correct lesson/section |
| Complete exercise | Answer → check → record attempt → advance progress |
| Lesson navigation | Load lesson → swipe sections → bookmark updated |

### 5. End-to-End Tests (Detox)

Target: Critical user journeys on real devices.

| Journey | Steps |
|---------|-------|
| New user flow | Launch → Sign up → Onboarding → First lesson |
| Returning user | Launch → Auto sign in → Resume at bookmark |
| Complete a practice | Workbook → Start session → Answer all → See results |
| Language switch | Profile → Settings → Change to Persian → Verify RTL |

---

## Test Directory Structure

```
__tests__/
├── unit/
│   ├── textHelpers.test.ts
│   ├── speech.test.ts
│   ├── strings.test.ts
│   └── usePracticeSession.test.ts
├── components/
│   ├── InteractiveText.test.tsx
│   ├── ExerciseRenderer.test.tsx
│   ├── MultipleChoice.test.tsx
│   ├── FillBlank.test.tsx
│   ├── MatchPairs.test.tsx
│   ├── ConversationSection.test.tsx
│   └── LessonPagerView.test.tsx
├── screens/
│   ├── AuthScreen.test.tsx
│   ├── OnboardingScreen.test.tsx
│   ├── StudentBookScreen.test.tsx
│   └── WorkbookScreen.test.tsx
├── integration/
│   ├── authFlow.test.ts
│   ├── lessonNavigation.test.ts
│   └── exerciseCompletion.test.ts
└── e2e/
    ├── newUser.e2e.ts
    ├── returningUser.e2e.ts
    └── practiceSession.e2e.ts
```

---

## CI/CD Pipeline

### GitHub Actions Workflow

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, master]
  pull_request:
    branches: [main, master]

jobs:
  lint-and-type-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npx tsc --noEmit
      - run: npx eslint src/ --ext .ts,.tsx

  unit-tests:
    runs-on: ubuntu-latest
    needs: lint-and-type-check
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npx jest --coverage --ci
      - uses: codecov/codecov-action@v4

  build-ios:
    runs-on: macos-latest
    needs: unit-tests
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - uses: expo/expo-github-action@v8
        with:
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}
      - run: eas build --platform ios --profile production --non-interactive

  build-android:
    runs-on: ubuntu-latest
    needs: unit-tests
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - uses: expo/expo-github-action@v8
        with:
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}
      - run: eas build --platform android --profile production --non-interactive
```

---

## Coverage Targets

| Category | Target |
|----------|--------|
| Unit tests | 80%+ |
| Component tests | 70%+ (key components) |
| Screen tests | Cover all 7 screens |
| Integration | Cover 3 critical flows |
| E2E | Cover 3 critical journeys |

---

## Jest Configuration

```javascript
// jest.config.js
module.exports = {
  preset: 'jest-expo',
  setupFilesAfterSetup: ['@testing-library/jest-native/extend-expect'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@supabase/.*|nativewind)',
  ],
  moduleNameMapper: {
    '\\.css$': 'identity-obj-proxy',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/data/**',
  ],
};
```

---

## Implementation Steps

1. [ ] Install testing dependencies
2. [ ] Create `jest.config.js`
3. [ ] Write unit tests for `textHelpers.ts`
4. [ ] Write unit tests for `usePracticeSession.ts`
5. [ ] Write component tests for `InteractiveText`
6. [ ] Write component tests for exercise components
7. [ ] Write screen tests for `AuthScreen`
8. [ ] Add ESLint configuration
9. [ ] Set up GitHub Actions CI workflow
10. [ ] Add Detox for E2E testing (post-MVP)
11. [ ] Achieve 70%+ coverage on core modules
