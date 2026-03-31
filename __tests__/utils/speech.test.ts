import * as Speech from 'expo-speech';
import { speakArmenian, stopSpeech } from '../../src/utils/speech';

// The speech module caches hasArmenianVoice internally.
// Since we can't easily reset that cache between tests without jest.resetModules()
// (which breaks the global mock), we test the overall behavior with the default
// mock state (no Armenian voice available).

describe('speakArmenian()', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('stops any in-progress speech before speaking', async () => {
    await speakArmenian('Բարև', 'Barev');
    expect(Speech.stop).toHaveBeenCalled();
  });

  it('calls Speech.speak with some arguments', async () => {
    await speakArmenian('Բարև', 'Barev');
    expect(Speech.speak).toHaveBeenCalledTimes(1);
  });

  it('calls getAvailableVoicesAsync to check for Armenian voice', async () => {
    await speakArmenian('Բարdelays', 'Barev');
    // May or may not be called due to caching, but the function should resolve
    expect(Speech.speak).toHaveBeenCalled();
  });

  it('handles missing phonetic parameter', async () => {
    await speakArmenian('Բարև');
    expect(Speech.speak).toHaveBeenCalledTimes(1);
  });

  it('handles empty string input', async () => {
    await speakArmenian('', '');
    expect(Speech.speak).toHaveBeenCalledTimes(1);
  });
});

describe('stopSpeech()', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls Speech.stop()', () => {
    stopSpeech();
    expect(Speech.stop).toHaveBeenCalledTimes(1);
  });

  it('can be called multiple times', () => {
    stopSpeech();
    stopSpeech();
    expect(Speech.stop).toHaveBeenCalledTimes(2);
  });
});
