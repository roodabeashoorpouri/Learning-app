# Plan 04: Media & Visual Assets

## Overview

The app needs four categories of visual/audio assets:
1. **Lesson illustrations** — scene art for Conversation and Reading sections
2. **Audio recordings** — native Armenian pronunciation for all text
3. **Character art** — Sarah, John, and expanding cast
4. **Brand assets** — logo, splash screen, app icon

---

## 1. Lesson Illustrations

### Requirements

Each lesson needs **2 illustrations**:

| Section | Type | Description |
|---------|------|-------------|
| Conversation | Close-up | Characters in the scene, speech-bubble-friendly composition |
| Reading | Wide-angle | Zoomed-out version of same scene, many labeled objects visible |

**Total: 80 illustrations** (40 lessons x 2 each)

### Style Guide (from design-style.md)

- Flat vector, corporate memphis style but cuter/more youthful
- No black outlines — tonal outlines only
- Color palette: Learning Blue (#4299E1), Vibrant Coral (#F56565), Success Green (#48BB78)
- Organic blob backgrounds (#EBF8FF)
- Minimalist faces: dot eyes, soft blush, curved-line mouths
- "Noodle" limbs with rounded ends

### Production Options

**Option A: AI-Generated + Human Polish**
- Use Midjourney/DALL-E with the prompt template from design-style.md
- Human illustrator cleans up and ensures consistency
- Cost: ~$5-15 per illustration (AI) + $20-50 polish = ~$25-65/illustration
- Total estimate: $2,000-5,200 for 80 illustrations
- Timeline: 4-6 weeks

**Option B: Professional Illustrator**
- Commission a single illustrator for the entire set (consistency guaranteed)
- Provide the design system document as a brief
- Cost: ~$50-150/illustration
- Total estimate: $4,000-12,000
- Timeline: 6-10 weeks

**Option C: Hybrid (Recommended)**
- Illustrator creates 10 base scene templates + character poses
- AI generates variations with the illustrator's assets as reference
- Developer composites final scenes in Figma
- Cost: $2,000-4,000
- Timeline: 4-6 weeks

### File Format & Delivery

| Property | Value |
|----------|-------|
| Format | SVG (preferred) or PNG @3x |
| Conversation dimensions | 800x600px (close-up, portrait-friendly) |
| Reading dimensions | 1200x800px (wide, landscape-friendly) |
| Max file size | 200KB per SVG, 500KB per PNG |
| Naming | `lesson-{XX}-conversation.svg`, `lesson-{XX}-reading.svg` |
| Storage | Supabase Storage `lesson-illustrations` bucket |

### Hotspot Positioning

For Reading section illustrations, each labeled object needs:
- Clear visual separation (objects shouldn't overlap)
- Position coordinates documented as percentages (e.g., apple at x:25%, y:60%)
- A content spreadsheet mapping: `object_id → position → trilingual_label`

---

## 2. Audio Recordings

### Requirements

Every Armenian text element needs audio:
- Dialogue lines (Conversation section)
- Vocabulary labels (Reading section hotspots)
- Listen-and-repeat phrases (Listening section)
- Individual letters (Writing section, Level 1)
- Narrative paragraphs (Reading section, Level 2+)

### Estimated Volume

| Content Type | Per Lesson | Total (40 lessons) |
|-------------|-----------|-------------------|
| Dialogue lines | 6-10 | 240-400 |
| Hotspot labels | 5-15 | 200-600 |
| Listening phrases | 5-8 | 200-320 |
| Writing letters/words | 3-5 | 120-200 |
| Narrative sentences | 2-8 | 80-320 |
| **Total** | **~21-46** | **~840-1,840 clips** |

### Production Options

**Option A: Professional Voice Actor (Recommended)**
- Hire a native Armenian speaker (Eastern Armenian dialect)
- Record in a studio or high-quality home setup
- One narrator for consistency, or male + female pair
- Cost: $500-1,500 for full recording session (batch recording)
- Timeline: 2-3 weeks (recording + editing)

**Option B: AI Text-to-Speech**
- Use Google Cloud TTS or Amazon Polly (Armenian support is limited)
- Lower quality, less natural
- Cost: ~$50-100 for all clips
- Risk: Armenian TTS quality is currently poor for educational use

**Option C: Hybrid (Recommended for MVP)**
- Level 1-2: Professional recordings (core learning, quality matters most)
- Level 3-4: High-quality TTS as placeholder, replace with recordings later
- Cost: $300-800 initially

### Audio Specifications

| Property | Value |
|----------|-------|
| Format | MP3 (128kbps) or AAC |
| Sample rate | 44.1kHz |
| Channels | Mono |
| Silence padding | 200ms before, 300ms after |
| Naming | `lesson-{XX}-conv-{line}.mp3`, `lesson-{XX}-hotspot-{id}.mp3` |
| Max file size | 500KB per clip |
| Storage | Supabase Storage `lesson-audio` bucket |

### Audio Integration

Current state: The app uses `expo-speech` (device TTS) as a fallback.

Target state:
```typescript
// src/utils/audio.ts
import { Audio } from 'expo-av';

export async function playAudio(audioUrl: string) {
  const { sound } = await Audio.Sound.createAsync({ uri: audioUrl });
  await sound.playAsync();
  // Cleanup after playback
  sound.setOnPlaybackStatusUpdate((status) => {
    if (status.isLoaded && status.didJustFinish) {
      sound.unloadAsync();
    }
  });
}

// Fallback to TTS if audio URL not available
export async function playArmenianText(text: string, audioUrl?: string) {
  if (audioUrl) {
    return playAudio(audioUrl);
  }
  // Existing expo-speech fallback
  return Speech.speak(text, { language: 'hy' });
}
```

**New dependency needed:** `expo-av` for audio playback.

---

## 3. Character Illustrations

### Main Characters

| Character | Role | Visual Theme | Introduced |
|-----------|------|-------------|-----------|
| Sarah | Primary learner (female) | Coral (#F56565) | Lesson 1 |
| John | Primary learner (male) | Blue (#4299E1) | Lesson 1 |
| Aram | Shopkeeper, cultural guide | Orange (#ED8936) | Lesson 11 |
| Ani | Young student | Green (#48BB78) | Lesson 16 |
| Hasmik | Grandmother, storyteller | Yellow (#ECC94B) | Lesson 21 |
| Levon | Professor | Dark Blue (#2B6CB0) | Lesson 31 |

### Assets Needed Per Character

| Asset | Description | Count |
|-------|-------------|-------|
| Portrait | Head/shoulders for dialogue UI | 1 |
| Full body neutral | Standing pose | 1 |
| Full body happy | Arms up / smiling | 1 |
| Full body thinking | Hand on chin | 1 |
| Full body pointing | Pointing at content | 1 |
| Sitting | For café/classroom scenes | 1 |
| **Total per character** | | **6 poses** |
| **Total all characters** | 6 characters | **36 assets** |

### Style Rules
- Follow the exact noodle-limb anatomy from design-style.md
- Each character has a consistent theme color
- Expressions through simple mouth curves and body posture (no complex facial detail)
- Characters should be diverse in age, build, and clothing

---

## 4. Brand Assets

### App Logo

**Requirements:**
- Scalable vector format (SVG master, export to PNG at all sizes)
- Must work at:
  - Full size: splash screen (1242x2688px area)
  - Medium: app icon (1024x1024px)
  - Small: favicon (32x32px, simplified)
- Incorporate Armenian script element (e.g., the letter Ա)
- Use brand colors (Learning Blue + Coral)
- Friendly, educational tone — not corporate, not childish

**Deliverables:**
| Asset | Size | Format |
|-------|------|--------|
| Logo master | Vector | SVG |
| App icon (iOS) | 1024x1024 | PNG |
| App icon (Android) | 512x512 adaptive | PNG |
| Splash screen | 1284x2778 | PNG |
| Favicon | 32x32, 16x16 | PNG/ICO |
| Social preview | 1200x630 | PNG |

### App Name
Current: "app" (placeholder in app.json). Needs a real name.
Suggestions to explore: should reflect Armenian language learning, academic seriousness, approachable tone.

---

## Asset Management Pipeline

### Storage Structure
```
supabase-storage/
├── lesson-illustrations/
│   ├── lesson-01-conversation.svg
│   ├── lesson-01-reading.svg
│   └── ...
├── lesson-audio/
│   ├── lesson-01/
│   │   ├── conv-line-1.mp3
│   │   ├── conv-line-2.mp3
│   │   ├── hotspot-apple.mp3
│   │   └── ...
│   └── ...
├── characters/
│   ├── sarah-portrait.svg
│   ├── sarah-full-neutral.svg
│   └── ...
└── app-assets/
    ├── logo.svg
    ├── icon-ios.png
    ├── splash.png
    └── ...
```

### Caching Strategy
- Illustrations: Cache on first download, refresh weekly
- Audio: Pre-download entire lesson pack when user starts a lesson
- Characters: Bundle with the app (small set, always needed)
- Logo/icons: Bundled with app

---

## Implementation Steps

1. [ ] Decide on app name
2. [ ] Commission or create logo (Option A: designer, Option B: AI + polish)
3. [ ] Update `app.json` with real name and branding
4. [ ] Create character design brief document
5. [ ] Commission Sarah & John illustrations (6 poses each)
6. [ ] Create Lesson 1-5 scene illustrations
7. [ ] Record audio for Lessons 1-5 (native speaker)
8. [ ] Install `expo-av` and build audio playback utility
9. [ ] Upload assets to Supabase Storage
10. [ ] Integrate real illustrations into lesson components
11. [ ] Replace TTS fallbacks with recorded audio
12. [ ] Commission remaining characters (Aram, Ani, Hasmik, Levon)
13. [ ] Create illustrations for Lessons 6-40 (batched)
14. [ ] Record audio for Lessons 6-40 (batched)
