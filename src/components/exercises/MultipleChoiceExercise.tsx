import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { NativeLanguage } from '../../context/AuthContext';
import type { MultipleChoiceExercise as MCExercise } from '../../data/types';
import { t, hy } from '../../utils/textHelpers';
import { speakArmenian } from '../../utils/speech';

const INK = '#0f2744';
const INK_MUTED = '#2d4a66';
const GREEN = '#58CC02';
const RED = '#FF4B4B';

type Props = {
  exercise: MCExercise;
  nativeLanguage: NativeLanguage;
  selectedIndex: number | null;
  onSelect: (index: number) => void;
  isChecked: boolean;
};

export function MultipleChoiceExerciseView({
  exercise,
  nativeLanguage,
  selectedIndex,
  onSelect,
  isChecked,
}: Props) {
  const promptArmenian = hy(exercise.prompt);
  const promptNative = t(exercise.prompt, nativeLanguage);

  return (
    <View style={styles.container}>
      {promptArmenian ? (
        <Pressable onPress={() => speakArmenian(promptArmenian, exercise.prompt.hyPhonetic)}>
          <Text style={styles.armenianPrompt}>{promptArmenian} 🔊</Text>
        </Pressable>
      ) : null}
      <Text style={styles.promptText}>{promptNative}</Text>

      <View style={styles.options}>
        {exercise.options.map((option, idx) => {
          const isSelected = selectedIndex === idx;
          const isCorrectOption = idx === exercise.correctIndex;

          let optionStyle = styles.option;
          let textStyle = styles.optionText;

          if (isChecked) {
            if (isCorrectOption) {
              optionStyle = { ...styles.option, ...styles.optionCorrect };
              textStyle = { ...styles.optionText, ...styles.optionTextHighlight };
            } else if (isSelected && !isCorrectOption) {
              optionStyle = { ...styles.option, ...styles.optionWrong };
              textStyle = { ...styles.optionText, ...styles.optionTextHighlight };
            }
          } else if (isSelected) {
            optionStyle = { ...styles.option, ...styles.optionSelected };
          }

          const optionLabel = t(option, nativeLanguage);
          const optionArmenian = hy(option);

          return (
            <Pressable
              key={`opt-${idx}`}
              onPress={() => !isChecked && onSelect(idx)}
              style={optionStyle}
              disabled={isChecked}
            >
              <View style={styles.optionContent}>
                {optionArmenian ? (
                  <Text style={[styles.optionArmenian, isChecked && (isCorrectOption || (isSelected && !isCorrectOption)) && styles.optionTextHighlight]}>
                    {optionArmenian}
                  </Text>
                ) : null}
                <Text style={textStyle}>{optionLabel}</Text>
              </View>
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
  armenianPrompt: {
    fontSize: 36,
    fontWeight: '700',
    color: INK,
    textAlign: 'center',
    marginBottom: 8,
  },
  promptText: {
    fontSize: 18,
    fontWeight: '600',
    color: INK_MUTED,
    textAlign: 'center',
    marginBottom: 28,
    lineHeight: 26,
  },
  options: {
    gap: 12,
  },
  option: {
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(15,39,68,0.18)',
    backgroundColor: '#fffefb',
  },
  optionSelected: {
    borderColor: INK,
    backgroundColor: '#eef0f5',
  },
  optionCorrect: {
    borderColor: GREEN,
    backgroundColor: '#e8f8e0',
  },
  optionWrong: {
    borderColor: RED,
    backgroundColor: '#fde8e8',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  optionArmenian: {
    fontSize: 18,
    fontWeight: '700',
    color: INK,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: INK,
  },
  optionTextHighlight: {
    color: '#fff',
  },
});
