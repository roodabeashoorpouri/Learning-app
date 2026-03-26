import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { NativeLanguage } from '../../context/AuthContext';
import type { ListeningExercise as LExercise } from '../../data/types';
import { t } from '../../utils/textHelpers';
import { speakArmenian } from '../../utils/speech';

const INK = '#0f2744';
const INK_MUTED = '#2d4a66';
const GREEN = '#58CC02';
const RED = '#FF4B4B';

type Props = {
  exercise: LExercise;
  nativeLanguage: NativeLanguage;
  selectedIndex: number | null;
  onSelect: (index: number) => void;
  isChecked: boolean;
};

export function ListeningExerciseView({
  exercise,
  nativeLanguage,
  selectedIndex,
  onSelect,
  isChecked,
}: Props) {
  const isPersian = nativeLanguage === 'fa';

  // Auto-play when the exercise appears
  useEffect(() => {
    speakArmenian(exercise.armenianText, exercise.armenianPhonetic);
  }, [exercise.armenianText, exercise.armenianPhonetic]);

  return (
    <View style={styles.container}>
      <Text style={styles.instruction}>
        {isPersian ? 'چه چیزی می‌شنوید؟' : 'What do you hear?'}
      </Text>

      {/* Speaker / audio area – tap to replay */}
      <Pressable
        style={styles.audioArea}
        onPress={() => speakArmenian(exercise.armenianText, exercise.armenianPhonetic)}
      >
        <View style={styles.speakerIcon}>
          <Text style={styles.speakerGlyph}>♪</Text>
        </View>
        <Text style={styles.hint}>
          {isPersian ? 'برای شنیدن دوباره لمس کنید' : 'Tap to listen again'}
        </Text>
      </Pressable>

      {/* Options */}
      <View style={styles.options}>
        {exercise.options.map((option, idx) => {
          const isSelected = selectedIndex === idx;
          const isCorrectOption = idx === exercise.correctIndex;

          return (
            <Pressable
              key={`listen-${idx}`}
              onPress={() => !isChecked && onSelect(idx)}
              style={[
                styles.option,
                isSelected && !isChecked && styles.optionSelected,
                isChecked && isCorrectOption && styles.optionCorrect,
                isChecked && isSelected && !isCorrectOption && styles.optionWrong,
              ]}
              disabled={isChecked}
            >
              <Text style={styles.optionText}>{t(option, nativeLanguage)}</Text>
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
  audioArea: {
    alignItems: 'center',
    padding: 24,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: INK,
    backgroundColor: '#fffefb',
    marginBottom: 28,
  },
  speakerIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: INK,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  speakerGlyph: {
    fontSize: 24,
    color: '#f7f4ec',
    fontWeight: '800',
  },
  hint: {
    marginTop: 8,
    fontSize: 13,
    color: INK_MUTED,
    textAlign: 'center',
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
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: INK,
    textAlign: 'center',
  },
});
