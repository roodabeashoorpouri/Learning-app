import { t, hy, hyPhonetic } from '../../src/utils/textHelpers';
import type { TrilingualText } from '../../src/data/types';

const sample: TrilingualText = {
  hy: 'Բարև',
  hyPhonetic: 'Barev',
  en: 'Hello',
  fa: 'سلام',
};

describe('t() — translation selector', () => {
  it('returns English when language is "en"', () => {
    expect(t(sample, 'en')).toBe('Hello');
  });

  it('returns Persian when language is "fa"', () => {
    expect(t(sample, 'fa')).toBe('سلام');
  });

  it('handles empty strings gracefully', () => {
    const empty: TrilingualText = { hy: '', hyPhonetic: '', en: '', fa: '' };
    expect(t(empty, 'en')).toBe('');
    expect(t(empty, 'fa')).toBe('');
  });
});

describe('hy() — Armenian script extractor', () => {
  it('returns the Armenian script', () => {
    expect(hy(sample)).toBe('Բարև');
  });

  it('returns empty string when hy is empty', () => {
    const empty: TrilingualText = { hy: '', hyPhonetic: '', en: '', fa: '' };
    expect(hy(empty)).toBe('');
  });
});

describe('hyPhonetic() — phonetic extractor', () => {
  it('returns the Armenian phonetic transcription', () => {
    expect(hyPhonetic(sample)).toBe('Barev');
  });

  it('returns empty string when hyPhonetic is empty', () => {
    const empty: TrilingualText = { hy: '', hyPhonetic: '', en: '', fa: '' };
    expect(hyPhonetic(empty)).toBe('');
  });
});
