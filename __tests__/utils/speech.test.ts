import * as Speech from 'expo-speech';
import { speakArmenian, stopSpeech } from '../../src/utils/speech';

describe('speakArmenian()', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset the cached voice check
    // The module caches hasArmenianVoice, so we re-import fresh
  });

  it('stops any in-progress speech before speaking', async () => {
    await speakArmenian('Բարև', 'Barev');
    expect(Speech.stop).toHaveBeenCalled();
  });

  it('falls back to phonetic with English voice when no Armenian voice exists', async () => {
    (Speech.getAvailableVoicesAsync as jest.Mock).mockResolvedValueOnce([]);

    // Need a fresh module to reset the cached voice check
    jest.resetModules();
    const speech = require('../../src/utils/speech');
    await speech.speakArmenian('Բարև', 'Barev');

    expect(Speech.speak).toHaveBeenCalledWith('Barev', { language: 'en', rate: 0.75 });
  });

  it('falls back to Armenian text with English voice when no phonetic provided and no Armenian voice', async () => {
    (Speech.getAvailableVoicesAsync as jest.Mock).mockResolvedValueOnce([]);

    jest.resetModules();
    const speech = require('../../src/utils/speech');
    await speech.speakArmenian('Բարև');

    expect(Speech.speak).toHaveBeenCalledWith('Բարև', { language: 'en', rate: 0.75 });
  });

  it('uses Armenian voice when available', async () => {
    (Speech.getAvailableVoicesAsync as jest.Mock).mockResolvedValueOnce([
      { language: 'hy-AM', identifier: 'hy', name: 'Armenian', quality: 'default' },
    ]);

    jest.resetModules();
    const speech = require('../../src/utils/speech');
    await speech.speakArmenian('Բարև', 'Barev');

    expect(Speech.speak).toHaveBeenCalledWith('Բարև', { language: 'hy', rate: 0.85 });
  });
});

describe('stopSpeech()', () => {
  it('calls Speech.stop()', () => {
    stopSpeech();
    expect(Speech.stop).toHaveBeenCalled();
  });
});
