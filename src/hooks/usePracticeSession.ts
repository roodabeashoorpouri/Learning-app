import { useCallback, useMemo, useState } from 'react';
import type { Exercise } from '../data/types';

export type SessionState = {
  /** Current exercise index */
  index: number;
  /** Total exercises in this session */
  total: number;
  /** The current exercise */
  exercise: Exercise;
  /** Whether the user has checked their answer */
  isChecked: boolean;
  /** Whether the checked answer was correct (null = not yet checked) */
  isCorrect: boolean | null;
  /** Number of correct answers so far */
  correctCount: number;
  /** Whether the session is finished */
  isFinished: boolean;
  /** Progress as a fraction 0-1 */
  progress: number;
};

export type SessionActions = {
  /** Called when the user taps CHECK */
  check: (isCorrect: boolean) => void;
  /** Called when the user taps CONTINUE after feedback */
  next: () => void;
};

export function usePracticeSession(exercises: Exercise[]) {
  const [index, setIndex] = useState(0);
  const [isChecked, setIsChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [correctCount, setCorrectCount] = useState(0);

  const total = exercises.length;
  const isFinished = index >= total;

  const check = useCallback(
    (correct: boolean) => {
      setIsChecked(true);
      setIsCorrect(correct);
      if (correct) {
        setCorrectCount((c) => c + 1);
      }
    },
    [],
  );

  const next = useCallback(() => {
    setIsChecked(false);
    setIsCorrect(null);
    setIndex((i) => i + 1);
  }, []);

  const state: SessionState = useMemo(
    () => ({
      index,
      total,
      exercise: exercises[Math.min(index, total - 1)],
      isChecked,
      isCorrect,
      correctCount,
      isFinished,
      progress: total > 0 ? (index + (isChecked ? 1 : 0)) / total : 0,
    }),
    [index, total, exercises, isChecked, isCorrect, correctCount, isFinished],
  );

  const actions: SessionActions = useMemo(() => ({ check, next }), [check, next]);

  return { state, actions };
}
