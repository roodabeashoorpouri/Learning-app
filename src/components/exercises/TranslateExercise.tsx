import React, { useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { NativeLanguage } from '../../context/AuthContext';
import type { TranslateExercise as TExercise } from '../../data/types';
import { t, hy } from '../../utils/textHelpers';

const INK = '#0f2744';
const INK_MUTED = '#2d4a66';
const ACCENT = '#1a3d5c';
const GREEN = '#58CC02';
const RED = '#FF4B4B';

type Props = {
  exercise: TExercise;
  nativeLanguage: NativeLanguage;
  selectedAnswer: number[] | null;
  onAnswer: (answer: number[]) => void;
  isChecked: boolean;
};

export function TranslateExerciseView({
  exercise,
  nativeLanguage,
  selectedAnswer,
  onAnswer,
  isChecked,
}: Props) {
  const placed = selectedAnswer ?? [];
  const isToArmenian = exercise.direction === 'toArmenian';

  const promptText = isToArmenian
    ? t(exercise.prompt, nativeLanguage)
    : hy(exercise.prompt);

  const handleTapWord = useCallback(
    (wordIdx: number) => {
      if (isChecked) return;
      if (placed.includes(wordIdx)) return;
      onAnswer([...placed, wordIdx]);
    },
    [placed, onAnswer, isChecked],
  );

  const handleRemoveWord = useCallback(
    (positionIdx: number) => {
      if (isChecked) return;
      const next = [...placed];
      next.splice(positionIdx, 1);
      onAnswer(next);
    },
    [placed, onAnswer, isChecked],
  );

  const getWordLabel = (wordIdx: number) => {
    const word = exercise.wordBank[wordIdx];
    return isToArmenian ? hy(word) : t(word, nativeLanguage);
  };

  const isCorrect =
    isChecked && JSON.stringify(placed) === JSON.stringify(exercise.correctOrder);

  return (
    <View style={styles.container}>
      <Text style={styles.instruction}>
        {nativeLanguage === 'fa' ? 'ترجمه کنید' : 'Translate this sentence'}
      </Text>

      <Text style={styles.prompt}>{promptText}</Text>
      {exercise.prompt.hyPhonetic && isToArmenian ? null : (
        exercise.prompt.hyPhonetic ? (
          <Text style={styles.phonetic}>{exercise.prompt.hyPhonetic}</Text>
        ) : null
      )}

      {/* Answer area */}
      <View style={[styles.answerArea, isChecked && isCorrect && styles.answerCorrect, isChecked && !isCorrect && styles.answerWrong]}>
        {placed.length === 0 ? (
          <Text style={styles.answerPlaceholder}>
            {nativeLanguage === 'fa' ? 'کلمات را اینجا بچینید' : 'Tap words to build your answer'}
          </Text>
        ) : (
          <View style={styles.answerWords}>
            {placed.map((wordIdx, posIdx) => (
              <Pressable
                key={`placed-${posIdx}`}
                onPress={() => handleRemoveWord(posIdx)}
                style={styles.placedChip}
                disabled={isChecked}
              >
                <Text style={styles.placedChipText}>{getWordLabel(wordIdx)}</Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>

      {/* Word bank */}
      <View style={styles.wordBank}>
        {exercise.wordBank.map((word, idx) => {
          const isUsed = placed.includes(idx);
          return (
            <Pressable
              key={`bank-${idx}`}
              onPress={() => handleTapWord(idx)}
              style={[styles.bankChip, isUsed && styles.bankChipUsed]}
              disabled={isChecked || isUsed}
            >
              <Text style={[styles.bankChipText, isUsed && styles.bankChipTextUsed]}>
                {getWordLabel(idx)}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 4,
  },
  instruction: {
    fontSize: 14,
    fontWeight: '700',
    color: INK_MUTED,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 20,
    textAlign: 'center',
  },
  prompt: {
    fontSize: 22,
    fontWeight: '700',
    color: INK,
    textAlign: 'center',
    lineHeight: 32,
  },
  phonetic: {
    fontSize: 14,
    fontStyle: 'italic',
    color: INK_MUTED,
    textAlign: 'center',
    marginTop: 4,
  },
  answerArea: {
    marginTop: 24,
    minHeight: 70,
    padding: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: ACCENT,
    borderStyle: 'dashed',
    backgroundColor: '#fffefb',
    justifyContent: 'center',
  },
  answerCorrect: {
    borderColor: GREEN,
    borderStyle: 'solid',
    backgroundColor: '#e8f8e0',
  },
  answerWrong: {
    borderColor: RED,
    borderStyle: 'solid',
    backgroundColor: '#fde8e8',
  },
  answerPlaceholder: {
    fontSize: 14,
    color: INK_MUTED,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  answerWords: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  placedChip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: INK,
  },
  placedChipText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  wordBank: {
    marginTop: 24,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  bankChip: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(15,39,68,0.18)',
    backgroundColor: '#fffefb',
  },
  bankChipUsed: {
    opacity: 0.3,
  },
  bankChipText: {
    fontSize: 16,
    fontWeight: '600',
    color: INK,
  },
  bankChipTextUsed: {
    color: INK_MUTED,
  },
});
