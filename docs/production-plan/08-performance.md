# Plan 08: Performance & Offline Support

## Performance Goals

| Metric | Target |
|--------|--------|
| Cold start (mid-range device) | < 3 seconds |
| Screen transition | < 300ms |
| Lesson load (cached) | < 500ms |
| Lesson load (network) | < 2 seconds |
| Audio playback start | < 200ms |
| App size (iOS) | < 80MB |
| App size (Android) | < 60MB |
| Memory usage | < 200MB active |

---

## Optimization Areas

### 1. Bundle Size

**Current risks:**
- All lesson content bundled statically → grows linearly with lessons
- Large font files (Vazirmatn has many weights)

**Solutions:**
- Move lesson content to Supabase (fetch on demand)
- Bundle only Level 1 content; download Levels 2-4 on demand
- Tree-shake unused font weights
- Use `expo-asset` for lazy loading illustrations

```typescript
// Only load the font weight we actually use
import { Vazirmatn_400Regular } from '@expo-google-fonts/vazirmatn';
// Remove: Vazirmatn_700Bold, etc. if not used
```

### 2. Image Optimization

| Strategy | Implementation |
|----------|---------------|
| SVG for illustrations | Smaller than PNG, scalable |
| Progressive loading | Show blurred placeholder → load full image |
| Correct sizing | Don't load 1200px image for 400px container |
| CDN caching | Supabase Storage has built-in CDN |

```typescript
// Use expo-image for optimized loading
import { Image } from 'expo-image';

<Image
  source={{ uri: illustrationUrl }}
  placeholder={blurhash}
  contentFit="contain"
  transition={200}
/>
```

**New dependency:** `expo-image` (better than React Native's Image for caching).

### 3. Audio Preloading

Pre-download all audio for a lesson when the user opens it:

```typescript
// src/hooks/useLessonPreload.ts
export function useLessonPreload(lessonId: string) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function preload() {
      const lesson = await fetchLesson(lessonId);
      const audioUrls = extractAllAudioUrls(lesson);

      // Download all audio files in parallel
      await Promise.all(
        audioUrls.map(url =>
          FileSystem.downloadAsync(url, getCacheFilePath(url))
        )
      );
      setReady(true);
    }
    preload();
  }, [lessonId]);

  return ready;
}
```

### 4. Navigation Performance

- Use `react-native-screens` (already installed) — native screen containers
- Lazy load tab screens with `React.lazy()`:

```typescript
const StudentBookScreen = React.lazy(() => import('../screens/StudentBookScreen'));
const WorkbookScreen = React.lazy(() => import('../screens/WorkbookScreen'));
const ProfileScreen = React.lazy(() => import('../screens/ProfileScreen'));
```

- Keep lesson pager view lightweight — only render current + adjacent sections

### 5. List Virtualization

For screens with long lists (workbook units, vocabulary):
```typescript
import { FlashList } from '@shopify/flash-list';

// Replace FlatList with FlashList for better scroll performance
<FlashList
  data={exercises}
  renderItem={renderExercise}
  estimatedItemSize={120}
/>
```

**New dependency:** `@shopify/flash-list`

---

## Offline Support

### Strategy: Offline-First with Background Sync

Users should be able to:
- Study downloaded lessons without internet
- Complete exercises offline (results saved locally)
- Have their progress sync when back online

### Implementation

#### Layer 1: Content Caching

```typescript
// src/lib/offlineStorage.ts
import * as FileSystem from 'expo-file-system';

const CACHE_DIR = `${FileSystem.documentDirectory}lesson-cache/`;

export async function cacheLessonContent(lessonId: string, content: LessonData) {
  const path = `${CACHE_DIR}${lessonId}.json`;
  await FileSystem.writeAsStringAsync(path, JSON.stringify(content));
}

export async function getCachedLesson(lessonId: string): Promise<LessonData | null> {
  const path = `${CACHE_DIR}${lessonId}.json`;
  const info = await FileSystem.getInfoAsync(path);
  if (!info.exists) return null;
  const raw = await FileSystem.readAsStringAsync(path);
  return JSON.parse(raw);
}
```

#### Layer 2: Progress Queue

When offline, exercise results and progress updates go into a local queue:

```typescript
// src/lib/syncQueue.ts
const QUEUE_KEY = '@app/sync_queue';

interface QueueItem {
  type: 'progress' | 'exercise_attempt' | 'bookmark' | 'pronunciation';
  payload: any;
  timestamp: number;
}

export async function enqueue(item: Omit<QueueItem, 'timestamp'>) {
  const queue = await getQueue();
  queue.push({ ...item, timestamp: Date.now() });
  await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
}

export async function processQueue() {
  const queue = await getQueue();
  if (queue.length === 0) return;

  for (const item of queue) {
    try {
      await syncItem(item);
    } catch (e) {
      // Stop processing — will retry later
      break;
    }
  }

  // Remove processed items
  const remaining = queue.slice(processedCount);
  await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(remaining));
}
```

#### Layer 3: Network Detection

```typescript
// src/hooks/useOnlineStatus.ts
import NetInfo from '@react-native-community/netinfo';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected ?? false);
    });
    return unsubscribe;
  }, []);

  // Process sync queue when coming back online
  useEffect(() => {
    if (isOnline) {
      processQueue();
    }
  }, [isOnline]);

  return isOnline;
}
```

**New dependency:** `@react-native-community/netinfo`

### Download Manager

Users can download entire levels for offline use:

```
┌──────────────────────────────┐
│  Download for Offline        │
│                              │
│  ✅ Level 1 (24 MB)         │
│     10 lessons downloaded    │
│                              │
│  ⬇️ Level 2 (32 MB)         │
│     [Download]               │
│                              │
│  🔒 Level 3 (38 MB)         │
│     Complete Level 2 first   │
│                              │
│  🔒 Level 4 (45 MB)         │
│     Complete Level 3 first   │
│                              │
└──────────────────────────────┘
```

---

## Memory Management

- Unload audio resources when leaving a lesson (`sound.unloadAsync()`)
- Clear image cache for lessons not accessed in 30 days
- Monitor memory usage in production via analytics

---

## Implementation Steps

1. [ ] Install `expo-image`, `@shopify/flash-list`, `expo-file-system`, `@react-native-community/netinfo`
2. [ ] Create lesson content caching system
3. [ ] Create offline sync queue
4. [ ] Create `useOnlineStatus` hook
5. [ ] Implement audio preloading for lessons
6. [ ] Replace `Image` with `expo-image` across the app
7. [ ] Replace `FlatList` with `FlashList` where applicable
8. [ ] Add lazy loading for tab screens
9. [ ] Build download manager UI for offline levels
10. [ ] Profile app startup time and optimize
11. [ ] Profile memory usage per lesson and optimize
12. [ ] Set up performance monitoring (see Plan 10: Analytics)
