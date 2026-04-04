import { workbookUnits, findSection } from '../../src/data/workbookContent';
import type { Exercise, TrilingualText } from '../../src/data/types';

describe('workbookUnits — content integrity', () => {
  it('has at least one unit', () => {
    expect(workbookUnits.length).toBeGreaterThanOrEqual(1);
  });

  it('every unit has a unique id', () => {
    const ids = workbookUnits.map((u) => u.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every unit has at least one section', () => {
    for (const unit of workbookUnits) {
      expect(unit.sections.length).toBeGreaterThanOrEqual(1);
    }
  });

  it('every section has a unique id across all units', () => {
    const ids = workbookUnits.flatMap((u) => u.sections.map((s) => s.id));
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every section has at least one exercise', () => {
    for (const unit of workbookUnits) {
      for (const section of unit.sections) {
        expect(section.exercises.length).toBeGreaterThanOrEqual(1);
      }
    }
  });

  it('every exercise has a unique id across all sections', () => {
    const ids = workbookUnits.flatMap((u) =>
      u.sections.flatMap((s) => s.exercises.map((e) => e.id))
    );
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('exercise correctness validation', () => {
  const allExercises: Exercise[] = workbookUnits.flatMap((u) =>
    u.sections.flatMap((s) => s.exercises)
  );

  it('multiple_choice exercises have valid correctIndex', () => {
    const mcExercises = allExercises.filter((e) => e.type === 'multiple_choice');
    for (const ex of mcExercises) {
      if (ex.type !== 'multiple_choice') continue;
      expect(ex.correctIndex).toBeGreaterThanOrEqual(0);
      expect(ex.correctIndex).toBeLessThan(ex.options.length);
    }
  });

  it('fill_blank exercises have valid correctIndex', () => {
    const fbExercises = allExercises.filter((e) => e.type === 'fill_blank');
    for (const ex of fbExercises) {
      if (ex.type !== 'fill_blank') continue;
      expect(ex.correctIndex).toBeGreaterThanOrEqual(0);
      expect(ex.correctIndex).toBeLessThan(ex.options.length);
    }
  });

  it('match_pairs exercises have at least 2 pairs', () => {
    const mpExercises = allExercises.filter((e) => e.type === 'match_pairs');
    for (const ex of mpExercises) {
      if (ex.type !== 'match_pairs') continue;
      expect(ex.pairs.length).toBeGreaterThanOrEqual(2);
    }
  });

  it('listening exercises have valid correctIndex', () => {
    const listenExercises = allExercises.filter((e) => e.type === 'listening');
    for (const ex of listenExercises) {
      if (ex.type !== 'listening') continue;
      expect(ex.correctIndex).toBeGreaterThanOrEqual(0);
      expect(ex.correctIndex).toBeLessThan(ex.options.length);
    }
  });

  it('conversation exercises have valid correctIndex and dialogue', () => {
    const convExercises = allExercises.filter((e) => e.type === 'conversation');
    for (const ex of convExercises) {
      if (ex.type !== 'conversation') continue;
      expect(ex.correctIndex).toBeGreaterThanOrEqual(0);
      expect(ex.correctIndex).toBeLessThan(ex.options.length);
      expect(ex.dialogue.length).toBeGreaterThanOrEqual(1);
    }
  });

  it('every exercise has a non-empty type', () => {
    const validTypes = ['multiple_choice', 'fill_blank', 'match_pairs', 'translate', 'listening', 'conversation'];
    for (const ex of allExercises) {
      expect(validTypes).toContain(ex.type);
    }
  });
});

describe('findSection()', () => {
  it('finds an existing section by id', () => {
    const result = findSection('u1_s1');
    expect(result).not.toBeNull();
    expect(result!.section.id).toBe('u1_s1');
    expect(result!.unit.id).toBe('u1');
  });

  it('returns null for non-existent section', () => {
    const result = findSection('does_not_exist');
    expect(result).toBeNull();
  });

  it('finds sections in different units', () => {
    const result = findSection('u2_s1');
    expect(result).not.toBeNull();
    expect(result!.unit.id).toBe('u2');
  });
});
