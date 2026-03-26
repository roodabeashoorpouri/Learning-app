import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { NativeLanguage } from '../../context/AuthContext';
import type { FillBlankExercise as FBExercise } from '../../data/types';
import { t, hy } from '../../utils/textHelpers';

const INK = '#0f2744';
const INK_MUTED = '#2d4a66';
const GREEN = '#58CC02';
const RED = '#FF4B4B';
const ACCENT = '#1a3d5c';

type Props = {
  exercise: FBExercise;
  nativeLanguage: NativeLanguage;
  selectedIndex: number | null;
  onSelect: (index: number) => void;
  isChecked: boolean;
};

export function FillBlankExerciseView({
  exercise,
  nativeLanguage,
  selectedIndex,
  onSelect,
  isChecked,
}: Props) {
  const sentenceText = t(exercise.sentence, nativeLanguage);
  const selectedOption = selectedIndex !== null ? exercise.options[selectedIndex] : null;

  // Replace ___ with the selected answer or a blank indicator
  const filledSentence = selectedOption
    ? sentenceText.replace('___', hy(selectedOption) || t(selectedOption, nativeLanguage))
    : sentenceText;

  return (
    <View style={styles.container}>
      <Text style={styles.instruction}>
        {nativeLanguage === 'fa' ? 'جای خالی را پر کنید' : 'Fill in the blank'}
      </Text>

      <View style={styles.sentenceBox}>
        <Text style={styles.sentenceText}>{filledSentence}</Text>
      </View>

      <View style={styles.options}>
        {exercise.options.map((option, idx) => {
          const isSelected = selectedIndex === idx;
          const isCorrectOption = idx === exercise.correctIndex;

          const optionStyles = [
            styles.chip,
            isSelected && !isChecked && styles.chipSelected,
            isChecked && isCorrectOption && styles.chipCorrect,
            isChecked && isSelected && !isCorrectOption && styles.chipWrong,
          ];

          const armenian = hy(option);
          const native = t(option, nativeLanguage);

          return (
            <Pressable
              key={`fb-${idx}`}
              onPress={() => !isChecked && onSelect(idx)}
              style={optionStyles}
              disabled={isChecked}
            >
              {armenian ? <Text style={styles.chipArmenian}>{armenian}</Text> : null}
              <Text style={styles.chipText}>{native}</Text>
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
  sentenceBox: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: ACCENT,
    backgroundColor: '#fffefb',
    marginBottom: 28,
  },
  sentenceText: {
    fontSize: 20,
    fontWeight: '700',
    color: INK,
    lineHeight: 30,
    textAlign: 'center',
  },
  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  chip: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(15,39,68,0.18)',
    backgroundColor: '#fffefb',
    alignItems: 'center',
  },
  chipSelected: {
    borderColor: INK,
    backgroundColor: '#eef0f5',
  },
  chipCorrect: {
    borderColor: GREEN,
    backgroundColor: '#e8f8e0',
  },
  chipWrong: {
    borderColor: RED,
    backgroundColor: '#fde8e8',
  },
  chipArmenian: {
    fontSize: 18,
    fontWeight: '700',
    color: INK,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
    color: INK_MUTED,
    marginTop: 2,
  },
});
