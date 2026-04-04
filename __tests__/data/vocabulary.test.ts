import { vocabulary } from '../../src/data/vocabulary';

describe('vocabulary — data integrity', () => {
  it('has 20 entries', () => {
    expect(vocabulary).toHaveLength(20);
  });

  it('every entry has all required fields', () => {
    for (let i = 0; i < vocabulary.length; i++) {
      const entry = vocabulary[i];
      expect(entry.Armenian_Script).toBeTruthy();
      expect(entry.Armenian_Phonetic).toBeTruthy();
      expect(entry.English_Mean).toBeTruthy();
      expect(entry.Persian_Mean).toBeTruthy();
      expect(entry.Persian_Phonetic).toBeTruthy();
    }
  });

  it('no duplicate Armenian scripts', () => {
    const scripts = vocabulary.map((v: any) => v.Armenian_Script);
    expect(new Set(scripts).size).toBe(scripts.length);
  });

  it('no duplicate English meanings', () => {
    const meanings = vocabulary.map((v: any) => v.English_Mean);
    expect(new Set(meanings).size).toBe(meanings.length);
  });

  it('contains expected entries (spot check)', () => {
    const scripts = vocabulary.map((v: any) => v.Armenian_Script);
    expect(scripts).toContain('Բարև');   // Hello
    expect(scripts).toContain('Այո');    // Yes
    expect(scripts).toContain('Ոչ');     // No
    expect(scripts).toContain('Ջուր');   // Water
  });
});
