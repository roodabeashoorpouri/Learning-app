import * as Speech from 'expo-speech';

let hasArmenianVoice: boolean | null = null;

/** Check once whether the device has an Armenian TTS voice. */
async function checkArmenianVoice(): Promise<boolean> {
  if (hasArmenianVoice !== null) return hasArmenianVoice;
  try {
    const voices = await Speech.getAvailableVoicesAsync();
    hasArmenianVoice = voices.some((v) => v.language.startsWith('hy'));
  } catch {
    hasArmenianVoice = false;
  }
  return hasArmenianVoice;
}

/**
 * Speak Armenian text. If the device has an Armenian voice, uses it directly.
 * Otherwise falls back to speaking the phonetic (romanized) text with an English voice.
 */
export async function speakArmenian(text: string, phonetic?: string) {
  Speech.stop();
  const canSpeakArmenian = await checkArmenianVoice();

  if (canSpeakArmenian) {
    Speech.speak(text, { language: 'hy', rate: 0.85 });
  } else if (phonetic) {
    Speech.speak(phonetic, { language: 'en', rate: 0.75 });
  } else {
    // Last resort: try Armenian text with English voice
    Speech.speak(text, { language: 'en', rate: 0.75 });
  }
}

/** Stop any in-progress speech. */
export function stopSpeech() {
  Speech.stop();
}
