import { renderHook, act } from '@testing-library/react-native';
import { usePracticeSession } from '../../src/hooks/usePracticeSession';
import type { Exercise } from '../../src/data/types';

const mockExercises: Exercise[] = [
  {
    type: 'multiple_choice',
    id: 'test_1',
    prompt: { hy: 'Բարև', hyPhonetic: 'Barev', en: 'Hello', fa: 'سلام' },
    options: [
      { hy: 'Բարև', hyPhonetic: 'Barev', en: 'Hello', fa: 'سلام' },
      { hy: 'Ոչ', hyPhonetic: 'Voch', en: 'No', fa: 'نه' },
    ],
    correctIndex: 0,
  },
  {
    type: 'multiple_choice',
    id: 'test_2',
    prompt: { hy: 'Այո', hyPhonetic: 'Ayo', en: 'Yes', fa: 'بله' },
    options: [
      { hy: ' Delays', hyPhonetic: 'Voch', en: 'No', fa: 'نه' },
      { hy: 'Այո', hyPhonetic: 'Ayo', en: 'Yes', fa: 'بله' },
    ],
    correctIndex: 1,
  },
  {
    type: 'multiple_choice',
    id: 'test_3',
    prompt: { hy: ' Delays', hyPhonetic: 'Jour', en: 'Water', fa: 'آب' },
    options: [
      { hy: 'Delays', hyPhonetic: 'Jour', en: 'Water', fa: 'آب' },
      { hy: 'Delays', hyPhonetic: 'Hats', en: 'Bread', fa: 'نان' },
    ],
    correctIndex: 0,
  },
];

describe('usePracticeSession', () => {
  it('initializes with correct state', () => {
    const { result } = renderHook(() => usePracticeSession(mockExercises));

    expect(result.current.state.index).toBe(0);
    expect(result.current.state.total).toBe(3);
    expect(result.current.state.isChecked).toBe(false);
    expect(result.current.state.isCorrect).toBeNull();
    expect(result.current.state.correctCount).toBe(0);
    expect(result.current.state.isFinished).toBe(false);
    expect(result.current.state.exercise.id).toBe('test_1');
  });

  it('check() marks answer as checked and correct', () => {
    const { result } = renderHook(() => usePracticeSession(mockExercises));

    act(() => {
      result.current.actions.check(true);
    });

    expect(result.current.state.isChecked).toBe(true);
    expect(result.current.state.isCorrect).toBe(true);
    expect(result.current.state.correctCount).toBe(1);
  });

  it('check() marks answer as checked and incorrect', () => {
    const { result } = renderHook(() => usePracticeSession(mockExercises));

    act(() => {
      result.current.actions.check(false);
    });

    expect(result.current.state.isChecked).toBe(true);
    expect(result.current.state.isCorrect).toBe(false);
    expect(result.current.state.correctCount).toBe(0);
  });

  it('next() advances to the next exercise and resets check state', () => {
    const { result } = renderHook(() => usePracticeSession(mockExercises));

    act(() => {
      result.current.actions.check(true);
    });
    act(() => {
      result.current.actions.next();
    });

    expect(result.current.state.index).toBe(1);
    expect(result.current.state.isChecked).toBe(false);
    expect(result.current.state.isCorrect).toBeNull();
    expect(result.current.state.exercise.id).toBe('test_2');
  });

  it('tracks correct count across multiple exercises', () => {
    const { result } = renderHook(() => usePracticeSession(mockExercises));

    // Exercise 1: correct
    act(() => result.current.actions.check(true));
    act(() => result.current.actions.next());

    // Exercise 2: incorrect
    act(() => result.current.actions.check(false));
    act(() => result.current.actions.next());

    // Exercise 3: correct
    act(() => result.current.actions.check(true));
    act(() => result.current.actions.next());

    expect(result.current.state.correctCount).toBe(2);
  });

  it('isFinished becomes true after all exercises', () => {
    const { result } = renderHook(() => usePracticeSession(mockExercises));

    // Complete all 3 exercises
    for (let i = 0; i < 3; i++) {
      act(() => result.current.actions.check(true));
      act(() => result.current.actions.next());
    }

    expect(result.current.state.isFinished).toBe(true);
    expect(result.current.state.index).toBe(3);
  });

  it('progress increases as exercises are completed', () => {
    const { result } = renderHook(() => usePracticeSession(mockExercises));

    // Before any check: 0/3
    expect(result.current.state.progress).toBe(0);

    // After checking first exercise: (0+1)/3
    act(() => result.current.actions.check(true));
    expect(result.current.state.progress).toBeCloseTo(1 / 3);

    // After moving to next: 1/3
    act(() => result.current.actions.next());
    expect(result.current.state.progress).toBeCloseTo(1 / 3);

    // After checking second: (1+1)/3
    act(() => result.current.actions.check(false));
    expect(result.current.state.progress).toBeCloseTo(2 / 3);
  });

  it('handles single exercise session', () => {
    const { result } = renderHook(() =>
      usePracticeSession([mockExercises[0]])
    );

    expect(result.current.state.total).toBe(1);

    act(() => result.current.actions.check(true));
    act(() => result.current.actions.next());

    expect(result.current.state.isFinished).toBe(true);
    expect(result.current.state.correctCount).toBe(1);
  });
});
