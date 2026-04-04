import { sampleLesson, lessons } from '../../src/data/lessonContent';

describe('sampleLesson — structure validation', () => {
  it('has a valid id', () => {
    expect(sampleLesson.id).toBeTruthy();
    expect(typeof sampleLesson.id).toBe('string');
  });

  it('has trilingual title', () => {
    expect(sampleLesson.title.hy).toBeTruthy();
    expect(sampleLesson.title.en).toBeTruthy();
    expect(sampleLesson.title.fa).toBeTruthy();
  });

  // ─── Conversation Section ───
  describe('conversation', () => {
    it('has at least one character', () => {
      expect(sampleLesson.conversation.characters.length).toBeGreaterThanOrEqual(1);
    });

    it('every character has a name, role, and lines', () => {
      for (const char of sampleLesson.conversation.characters) {
        expect(char.name).toBeTruthy();
        expect(char.role).toBeTruthy();
        expect(char.lines.length).toBeGreaterThanOrEqual(1);
      }
    });

    it('every dialogue line has armenian, phonetic, and translation', () => {
      for (const char of sampleLesson.conversation.characters) {
        for (const line of char.lines) {
          expect(line.armenian).toBeTruthy();
          expect(line.phonetic).toBeTruthy();
          expect(line.translation).toBeTruthy();
        }
      }
    });

    it('has a setting description', () => {
      expect(sampleLesson.conversation.setting.description).toBeTruthy();
    });
  });

  // ─── Reading Section ───
  describe('reading', () => {
    it('has a wide-angle scene description', () => {
      expect(sampleLesson.reading.wideAngleScene.description).toBeTruthy();
    });

    it('has at least one vocabulary hotspot', () => {
      expect(sampleLesson.reading.vocabularyHotspots.length).toBeGreaterThanOrEqual(1);
    });

    it('every hotspot has required fields', () => {
      for (const hotspot of sampleLesson.reading.vocabularyHotspots) {
        expect(hotspot.id).toBeTruthy();
        expect(hotspot.armenian).toBeTruthy();
        expect(hotspot.phonetic).toBeTruthy();
        expect(hotspot.translation).toBeTruthy();
        expect(hotspot.xPercent).toBeGreaterThanOrEqual(0);
        expect(hotspot.xPercent).toBeLessThanOrEqual(100);
        expect(hotspot.yPercent).toBeGreaterThanOrEqual(0);
        expect(hotspot.yPercent).toBeLessThanOrEqual(100);
      }
    });

    it('hotspots have unique ids', () => {
      const ids = sampleLesson.reading.vocabularyHotspots.map((h) => h.id);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it('has narrative text with all fields', () => {
      expect(sampleLesson.reading.narrativeText).toBeDefined();
      expect(sampleLesson.reading.narrativeText!.armenian).toBeTruthy();
      expect(sampleLesson.reading.narrativeText!.phonetic).toBeTruthy();
      expect(sampleLesson.reading.narrativeText!.translation).toBeTruthy();
    });
  });

  // ─── Listening Section ───
  describe('listening', () => {
    it('has at least one exercise', () => {
      expect(sampleLesson.listening.exercises.length).toBeGreaterThanOrEqual(1);
    });

    it('every exercise has required fields', () => {
      for (const ex of sampleLesson.listening.exercises) {
        expect(ex.id).toBeTruthy();
        expect(ex.armenian).toBeTruthy();
        expect(ex.phonetic).toBeTruthy();
        expect(ex.instruction.en).toBeTruthy();
        expect(ex.instruction.fa).toBeTruthy();
      }
    });

    it('listening exercises have unique ids', () => {
      const ids = sampleLesson.listening.exercises.map((e) => e.id);
      expect(new Set(ids).size).toBe(ids.length);
    });
  });

  // ─── Writing Section ───
  describe('writing', () => {
    it('has at least one exercise', () => {
      expect(sampleLesson.writing.exercises.length).toBeGreaterThanOrEqual(1);
    });

    it('alphabet exercises have a letter', () => {
      const alphabetExercises = sampleLesson.writing.exercises.filter(
        (e) => e.type === 'alphabet'
      );
      for (const ex of alphabetExercises) {
        expect(ex.letter).toBeTruthy();
      }
    });

    it('transcription exercises have a word', () => {
      const transcriptionExercises = sampleLesson.writing.exercises.filter(
        (e) => e.type === 'transcription'
      );
      for (const ex of transcriptionExercises) {
        expect(ex.word).toBeDefined();
        expect(ex.word!.armenian).toBeTruthy();
        expect(ex.word!.phonetic).toBeTruthy();
        expect(ex.word!.translation).toBeTruthy();
      }
    });

    it('writing exercises have unique ids', () => {
      const ids = sampleLesson.writing.exercises.map((e) => e.id);
      expect(new Set(ids).size).toBe(ids.length);
    });
  });
});

describe('lessons array', () => {
  it('exports an array containing the sample lesson', () => {
    expect(lessons).toBeInstanceOf(Array);
    expect(lessons).toContain(sampleLesson);
  });

  it('all lessons have unique ids', () => {
    const ids = lessons.map((l) => l.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
