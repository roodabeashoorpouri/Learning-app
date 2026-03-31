import React, { useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeOut } from 'react-native-reanimated';

import type { NativeLanguage } from '../../context/AuthContext';
import type { MatchPairsExercise as MPExercise } from '../../data/types';
import { t, hy } from '../../utils/textHelpers';

const INK = '#0f2744';
const INK_MUTED = '#2d4a66';
const GREEN = '#58CC02';
const RED = '#FF4B4B';

type Props = {
  exercise: MPExercise;
  nativeLanguage: NativeLanguage;
  selectedAnswer: any;
  onAnswer: (answer: any) => void;
  isChecked: boolean;
};

export function MatchPairsExerciseView({
  exercise,
  nativeLanguage,
  onAnswer,
}: Props) {
  // Shuffle right-side options (one-time init per exercise via lazy state)
  const [shuffledRightIndices] = useState(() => {
    const indices = exercise.pairs.map((_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    return indices;
  });

  const [matchedIndices, setMatchedIndices] = useState<Set<number>>(new Set());
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [selectedRight, setSelectedRight] = useState<number | null>(null);
  const [flashWrong, setFlashWrong] = useState<{ left: number; right: number } | null>(null);

  const checkMatch = useCallback((left: number, rightShuffled: number) => {
    const realRight = shuffledRightIndices[rightShuffled];
    if (left === realRight) {
      setMatchedIndices((prev) => {
        const next = new Set(prev);
        next.add(left);
        return next;
      });
      setSelectedLeft(null);
      setSelectedRight(null);
    } else {
      setFlashWrong({ left, right: rightShuffled });
      setTimeout(() => {
        setFlashWrong(null);
        setSelectedLeft(null);
        setSelectedRight(null);
      }, 600);
    }
  }, [shuffledRightIndices]);

  const handleLeftPress = useCallback((idx: number) => {
    if (matchedIndices.has(idx)) return;
    setSelectedLeft((prev) => {
      const newLeft = prev === idx ? null : idx;
      // If right is already selected, check match immediately
      setSelectedRight((currentRight) => {
        if (newLeft !== null && currentRight !== null) {
          setTimeout(() => checkMatch(newLeft, currentRight), 0);
        }
        return currentRight;
      });
      return newLeft;
    });
  }, [matchedIndices, checkMatch]);

  const handleRightPress = useCallback((shuffledIdx: number) => {
    const realIdx = shuffledRightIndices[shuffledIdx];
    if (matchedIndices.has(realIdx)) return;
    setSelectedRight((prev) => {
      const newRight = prev === shuffledIdx ? null : shuffledIdx;
      // If left is already selected, check match immediately
      setSelectedLeft((currentLeft) => {
        if (currentLeft !== null && newRight !== null) {
          setTimeout(() => checkMatch(currentLeft, newRight), 0);
        }
        return currentLeft;
      });
      return newRight;
    });
  }, [matchedIndices, shuffledRightIndices, checkMatch]);

  // Signal completion when all pairs matched
  useEffect(() => {
    if (matchedIndices.size === exercise.pairs.length && exercise.pairs.length > 0) {
      onAnswer(true);
    }
  }, [matchedIndices.size, exercise.pairs.length, onAnswer]);

  return (
    <View style={styles.container}>
      <Text style={styles.instruction}>
        {nativeLanguage === 'fa' ? 'جفت‌های مناسب را پیدا کنید' : 'Match the pairs'}
      </Text>

      <View style={styles.columns}>
        {/* Left column: Armenian */}
        <View style={styles.column}>
          {exercise.pairs.map((pair, idx) => {
            const matched = matchedIndices.has(idx);
            const isSelected = selectedLeft === idx;
            const isWrong = flashWrong?.left === idx;

            if (matched) {
              return (
                <Animated.View key={`l-${idx}`} exiting={FadeOut.duration(300)} style={[styles.item, styles.itemMatched]}>
                  <Text style={styles.itemArmenian}>{hy(pair.left)}</Text>
                </Animated.View>
              );
            }

            return (
              <Pressable
                key={`l-${idx}`}
                onPress={() => handleLeftPress(idx)}
                style={[
                  styles.item,
                  isSelected && styles.itemSelected,
                  isWrong && styles.itemWrong,
                ]}
              >
                <Text style={styles.itemArmenian}>{hy(pair.left)}</Text>
                <Text style={styles.itemPhonetic}>{pair.left.hyPhonetic}</Text>
              </Pressable>
            );
          })}
        </View>

        {/* Right column: Native language */}
        <View style={styles.column}>
          {shuffledRightIndices.map((realIdx, shuffledIdx) => {
            const pair = exercise.pairs[realIdx];
            const matched = matchedIndices.has(realIdx);
            const isSelected = selectedRight === shuffledIdx;
            const isWrong = flashWrong?.right === shuffledIdx;

            if (matched) {
              return (
                <Animated.View key={`r-${shuffledIdx}`} exiting={FadeOut.duration(300)} style={[styles.item, styles.itemMatched]}>
                  <Text style={styles.itemNative}>{t(pair.right, nativeLanguage)}</Text>
                </Animated.View>
              );
            }

            return (
              <Pressable
                key={`r-${shuffledIdx}`}
                onPress={() => handleRightPress(shuffledIdx)}
                style={[
                  styles.item,
                  isSelected && styles.itemSelected,
                  isWrong && styles.itemWrong,
                ]}
              >
                <Text style={styles.itemNative}>{t(pair.right, nativeLanguage)}</Text>
              </Pressable>
            );
          })}
        </View>
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
    marginBottom: 24,
    textAlign: 'center',
  },
  columns: {
    flexDirection: 'row',
    gap: 12,
  },
  column: {
    flex: 1,
    gap: 10,
  },
  item: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'rgba(15,39,68,0.18)',
    backgroundColor: '#fffefb',
    alignItems: 'center',
    minHeight: 56,
    justifyContent: 'center',
  },
  itemSelected: {
    borderColor: INK,
    backgroundColor: '#eef0f5',
  },
  itemMatched: {
    borderColor: GREEN,
    backgroundColor: '#e8f8e0',
    opacity: 0.6,
  },
  itemWrong: {
    borderColor: RED,
    backgroundColor: '#fde8e8',
  },
  itemArmenian: {
    fontSize: 18,
    fontWeight: '700',
    color: INK,
    textAlign: 'center',
  },
  itemPhonetic: {
    fontSize: 12,
    fontStyle: 'italic',
    color: INK_MUTED,
    marginTop: 2,
  },
  itemNative: {
    fontSize: 16,
    fontWeight: '600',
    color: INK,
    textAlign: 'center',
  },
});
