# Plan 05: Speech Recognition & Pronunciation Feedback

## Overview

The Listening section (Section 3) has UI for "listen and repeat" but no actual speech recognition. This plan covers integrating pronunciation analysis to give users real feedback.

---

## Challenge: Armenian Speech Recognition

Armenian is a low-resource language for most speech APIs. Options:

| Service | Armenian Support | Quality | Cost |
|---------|-----------------|---------|------|
| Google Cloud Speech-to-Text | Yes (hy-AM) | Good | $0.006/15s |
| Azure Speech Services | Limited | Moderate | $1/audio hour |
| Whisper (OpenAI) | Yes (via multilingual model) | Good | $0.006/min |
| On-device (expo) | No | N/A | Free |

**Recommendation:** Google Cloud Speech-to-Text — best Armenian support, pay-per-use, pronunciation assessment API available.

---

## Architecture

```
┌─────────────────────────────────────────────┐
│                   Mobile App                 │
│                                             │
│  1. User taps microphone                    │
│  2. Record audio (expo-av)                  │
│  3. Upload audio to backend                 │
│                                             │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────┐
│            Supabase Edge Function            │
│                                              │
│  4. Receive audio blob                       │
│  5. Send to Google Cloud Speech-to-Text      │
│  6. Compare recognized text vs expected text │
│  7. Calculate pronunciation score            │
│  8. Return score + feedback                  │
│                                              │
└──────────────────────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────┐
│          Google Cloud Speech API             │
│                                              │
│  - Speech-to-text (hy-AM locale)            │
│  - Word-level confidence scores             │
│  - Alternative transcriptions               │
│                                              │
└──────────────────────────────────────────────┘
```

---

## Recording Implementation

### New Dependency
```bash
npx expo install expo-av
```

### Recording Component
```typescript
// src/hooks/useAudioRecorder.ts
import { Audio } from 'expo-av';

export function useAudioRecorder() {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  async function startRecording() {
    await Audio.requestPermissionsAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    const { recording } = await Audio.Recording.createAsync(
      Audio.RecordingOptionsPresets.HIGH_QUALITY
    );
    setRecording(recording);
    setIsRecording(true);
  }

  async function stopRecording(): Promise<string> {
    if (!recording) throw new Error('No active recording');
    setIsRecording(false);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI()!;
    setRecording(null);
    return uri;
  }

  return { startRecording, stopRecording, isRecording };
}
```

---

## Pronunciation Scoring

### Scoring Algorithm (Edge Function)

```typescript
// supabase/functions/check-pronunciation/index.ts

interface PronunciationResult {
  overallScore: number;       // 0-100
  recognizedText: string;     // what was understood
  expectedText: string;       // what should have been said
  wordScores: WordScore[];    // per-word breakdown
  feedback: string;           // human-readable feedback
}

interface WordScore {
  word: string;
  confidence: number;      // 0-1 from speech API
  isCorrect: boolean;
  suggestion?: string;     // pronunciation tip
}

function calculateScore(expected: string, recognized: string, wordConfidences: number[]): number {
  // 1. Exact match bonus
  const exactMatch = expected.trim() === recognized.trim();
  if (exactMatch) return Math.max(85, avg(wordConfidences) * 100);

  // 2. Word-level comparison
  const expectedWords = expected.split(/\s+/);
  const recognizedWords = recognized.split(/\s+/);

  let matchedWords = 0;
  for (const word of expectedWords) {
    if (recognizedWords.includes(word)) matchedWords++;
  }

  const wordAccuracy = matchedWords / expectedWords.length;
  const confidenceAvg = avg(wordConfidences);

  // Weighted score: 60% word accuracy, 40% confidence
  return Math.round(wordAccuracy * 60 + confidenceAvg * 40);
}
```

### Score Thresholds & Feedback

| Score | Rating | Visual | Feedback |
|-------|--------|--------|----------|
| 90-100 | Excellent | Green circle + checkmark | "Excellent pronunciation!" |
| 70-89 | Good | Yellow circle | "Good! Try emphasizing [word] more." |
| 50-69 | Needs Work | Orange circle | "Keep practicing. Listen again and focus on [word]." |
| 0-49 | Try Again | Red circle | "Let's try again. Tap the speaker to hear it first." |

---

## UI Integration

Update `ListeningSection.tsx` to use real recording:

```
┌──────────────────────────────┐
│                              │
│    🔊 Բարև ձdelays          │  ← Tap speaker to hear
│    "Barev dzez"              │
│                              │
│         ┌──────┐             │
│         │  🎤  │             │  ← Hold to record
│         └──────┘             │
│                              │
│    ┌─────────────────────┐   │
│    │  Score: 85/100      │   │  ← Feedback card
│    │  ✅ Բdelays ✅ ձdelays │   │
│    │  "Good! Clear        │   │
│    │   pronunciation."    │   │
│    └─────────────────────┘   │
│                              │
│    [Try Again]  [Next →]     │
│                              │
└──────────────────────────────┘
```

### Recording UX Flow
1. User taps speaker icon → hears native pronunciation
2. User presses and holds microphone → recording starts
3. Visual indicator: pulsing red circle, waveform animation
4. User releases → recording stops
5. Loading spinner while API processes
6. Score + feedback card appears
7. User can "Try Again" or "Next"

---

## Offline Fallback

When offline, pronunciation practice still works but without scoring:
- Recording still functions (saved locally)
- Display message: "Pronunciation scoring available when online"
- When back online, optionally batch-process saved recordings

---

## Cost Estimation

| Usage Level | Monthly Recordings | Google Cloud Cost |
|------------|-------------------|-------------------|
| 100 users, 5 exercises/day | ~15,000 | ~$6/month |
| 1,000 users, 5 exercises/day | ~150,000 | ~$60/month |
| 10,000 users, 5 exercises/day | ~1,500,000 | ~$600/month |

Manageable at scale. Can add rate limiting (e.g., 20 pronunciation checks per day per user on free tier).

---

## Implementation Steps

1. [ ] Install `expo-av` for audio recording
2. [ ] Create `useAudioRecorder` hook
3. [ ] Set up Google Cloud project + enable Speech-to-Text API
4. [ ] Create Supabase Edge Function `check-pronunciation`
5. [ ] Implement pronunciation scoring algorithm
6. [ ] Update `ListeningSection.tsx` with real recording UI
7. [ ] Add score feedback card component
8. [ ] Store pronunciation scores in `pronunciation_scores` table
9. [ ] Add waveform animation during recording
10. [ ] Test with Armenian speech samples
11. [ ] Add offline fallback behavior
12. [ ] Add daily rate limiting
