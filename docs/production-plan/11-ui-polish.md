# Plan 11: UI Polish & Animations

## Overview

Bring the UI from functional prototype to production quality. Align all screens with the LinguaJoy design system from `design-style.md`.

---

## Design System Implementation

### 1. Tailwind Config Update

Update `tailwind.config.js` with brand colors:

```javascript
module.exports = {
  // ...
  theme: {
    extend: {
      colors: {
        // Primary
        'learning-blue': '#4299E1',
        'vibrant-coral': '#F56565',
        // Secondary
        'success-green': '#48BB78',
        'action-orange': '#ED8936',
        'reward-yellow': '#ECC94B',
        // Neutrals
        'canvas-white': '#FFFFFF',
        'cloud-blue': '#F8FAFC',
        'blob-accent': '#EBF8FF',
        'ink-dark': '#2D3748',
      },
      fontFamily: {
        nunito: ['Nunito'],
        vazirmatn: ['Vazirmatn_400Regular'],
      },
      boxShadow: {
        'soft': '0px 8px 24px rgba(0, 0, 0, 0.08)',
        'card': '0px 4px 12px rgba(0, 0, 0, 0.06)',
      },
      borderRadius: {
        'pill': '999px',
      },
    },
  },
};
```

### 2. Typography System

```typescript
// src/styles/typography.ts
export const typography = {
  h1: 'font-nunito text-2xl font-extrabold text-ink-dark',   // 22-32px, 800 weight
  h2: 'font-nunito text-xl font-bold text-ink-dark',          // 20px, 700 weight
  button: 'font-nunito text-base font-bold text-white',       // 16-20px, 700 weight
  body: 'font-nunito text-sm font-normal text-ink-dark',      // 14-16px, 400 weight
  caption: 'font-nunito text-xs font-normal text-gray-500',   // 12px, 400 weight
};
```

**New dependency:** Nunito font via `@expo-google-fonts/nunito`

### 3. Common Component Styles

```typescript
// Speech bubbles
const speechBubble = 'bg-white rounded-pill px-4 py-3 shadow-soft';

// Cards
const card = 'bg-white rounded-lg p-4 shadow-card';

// Primary button
const primaryButton = 'bg-learning-blue rounded-pill px-6 py-3 shadow-soft';

// Coral accent button
const accentButton = 'bg-vibrant-coral rounded-pill px-6 py-3 shadow-soft';
```

---

## Screen-by-Screen Polish

### Auth Screen
- [ ] Add character illustrations (Sarah & John waving)
- [ ] Organic blob background shapes (#EBF8FF)
- [ ] Rounded input fields with soft shadows
- [ ] Animated transition between landing/signup/signin modes
- [ ] Google and Apple sign-in buttons with proper brand styling
- [ ] Loading state with skeleton or spinner

### Onboarding Screen
- [ ] Animated page transitions (slide or fade)
- [ ] Progress bar across the top
- [ ] Selection cards with soft press animation (scale down on press)
- [ ] Character illustrations reacting to choices
- [ ] Smooth transition to main app after completion

### Student Book Screen
- [ ] Lesson card grid/list with illustrations preview
- [ ] Level badges with brand colors
- [ ] Locked/unlocked lesson states
- [ ] Progress indicator per lesson (sections completed)
- [ ] Pull-to-refresh for new content

### Lesson Sections

**Conversation Section:**
- [ ] Real character illustrations (not placeholders)
- [ ] Speech bubbles with triangle tails pointing at speakers
- [ ] Animated bubble appearance (fade in + slide up)
- [ ] Speaker icon with ripple animation when playing audio
- [ ] Translation slides in smoothly on tap (not instant toggle)

**Reading Section:**
- [ ] Wide-angle illustration with hotspot markers
- [ ] Hotspot labels appear with spring animation
- [ ] Narrative text with proper paragraph spacing
- [ ] Smooth zoom/transition from Conversation illustration

**Listening Section:**
- [ ] Card-based exercise layout with clear visual hierarchy
- [ ] Microphone button: pulsing animation when recording
- [ ] Waveform visualization during recording
- [ ] Score feedback: animated circle fill-up
- [ ] Color-coded word-by-word feedback

**Writing Section:**
- [ ] Stroke order: animated SVG path drawing
- [ ] Trace mode: finger trail with ink-like rendering
- [ ] Type mode: Armenian keyboard layout or system keyboard
- [ ] Letter guide: ghost letter outline to trace over
- [ ] Completion celebration: subtle confetti or checkmark animation

### Workbook Screen
- [ ] Unit cards with progress rings
- [ ] Section list with completion checkmarks
- [ ] Smooth modal presentation for practice sessions

### Profile Screen (from task.md: "UI Enhancement")
- [ ] User avatar (placeholder with initials or character)
- [ ] Clean card layout for user info
- [ ] Stats dashboard (from Plan 10)
- [ ] Settings section with proper toggle/picker components
- [ ] Streak and daily goal visual indicators

### Practice Session
- [ ] Animated progress bar advancement
- [ ] Smooth transitions between exercises
- [ ] Correct answer: green glow + checkmark animation
- [ ] Incorrect answer: gentle shake + red highlight
- [ ] Score counter in header

### Practice Results
- [ ] Animated score circle (count up from 0)
- [ ] Star rating based on percentage
- [ ] Performance breakdown by exercise type
- [ ] "Continue Learning" and "Retry" buttons

---

## Animations

### Library: React Native Reanimated (already installed)

### Key Animations

| Animation | Where | Implementation |
|-----------|-------|---------------|
| Page transitions | Navigation | `react-native-screens` native transitions |
| Speech bubble appear | Conversation | `FadeInUp` with spring |
| Translation reveal | InteractiveText | `Layout.springify()` height animation |
| Audio ripple | Speaker icon | Repeating scale + opacity animation |
| Recording pulse | Microphone | `withRepeat(withSequence(scale))` |
| Score fill | Results screen | `withTiming` on circle stroke-dashoffset |
| Progress bar | Exercises | `withTiming` on width |
| Card press | All tappable cards | `withSpring` on scale (0.97 → 1.0) |
| Correct answer | Exercise check | Green background fade + checkmark draw |
| Incorrect shake | Exercise check | `withSequence(translateX)` shake |
| Section indicator | Lesson pager | `withSpring` on dot scale/color |
| Swipe hint | NavigationHint | Fade in → pause → fade out |

### Example: Audio Ripple

```typescript
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
} from 'react-native-reanimated';

function AudioRipple({ isPlaying }: { isPlaying: boolean }) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (isPlaying) {
      scale.value = withRepeat(
        withSequence(
          withTiming(1.5, { duration: 600 }),
          withTiming(1, { duration: 0 })
        ),
        -1
      );
      opacity.value = withRepeat(
        withSequence(
          withTiming(0.4, { duration: 0 }),
          withTiming(0, { duration: 600 })
        ),
        -1
      );
    } else {
      scale.value = 1;
      opacity.value = 0;
    }
  }, [isPlaying]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return <Animated.View style={[styles.ripple, animatedStyle]} />;
}
```

### Stroke Order Animation

For the Writing section alphabet exercises:

```typescript
// Use react-native-svg + reanimated for animated path drawing
import Svg, { Path } from 'react-native-svg';
import Animated from 'react-native-reanimated';

const AnimatedPath = Animated.createAnimatedComponent(Path);

function StrokeOrderAnimation({ pathData, duration = 2000 }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(1, { duration });
  }, []);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: pathLength * (1 - progress.value),
  }));

  return (
    <Svg>
      <AnimatedPath
        d={pathData}
        stroke="#4299E1"
        strokeWidth={4}
        strokeLinecap="round"
        strokeDasharray={pathLength}
        animatedProps={animatedProps}
        fill="none"
      />
    </Svg>
  );
}
```

**New dependency:** `react-native-svg`

---

## Micro-Interactions

Small touches that make the app feel polished:

| Interaction | Detail |
|------------|--------|
| Button press | Scale to 0.97 with spring physics |
| Tab switch | Cross-fade with 200ms duration |
| Scroll-to-top | Tap tab icon when already on that tab |
| Haptic feedback | Light impact on correct answer, error on incorrect |
| Skeleton loading | Content placeholder while fetching lessons |

**New dependency:** `expo-haptics`

---

## Implementation Steps

1. [ ] Install Nunito font (`@expo-google-fonts/nunito`)
2. [ ] Install `react-native-svg`, `expo-haptics`
3. [ ] Update `tailwind.config.js` with brand colors
4. [ ] Create typography style constants
5. [ ] Polish Auth screen
6. [ ] Polish Onboarding screen
7. [ ] Polish Student Book screen
8. [ ] Polish Conversation section (bubbles, illustrations)
9. [ ] Polish Reading section (hotspots, labels)
10. [ ] Polish Listening section (recording UI, feedback)
11. [ ] Polish Writing section (stroke animations, trace)
12. [ ] Polish Profile screen (stats, cards)
13. [ ] Polish Workbook + exercises
14. [ ] Add all animations (ripple, shake, fill, transitions)
15. [ ] Add haptic feedback
16. [ ] Final visual QA on iOS + Android
