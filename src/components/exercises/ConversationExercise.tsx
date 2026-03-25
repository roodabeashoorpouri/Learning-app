import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { NativeLanguage } from '../../context/AuthContext';
import type { ConversationExercise as CExercise } from '../../data/types';
import { t } from '../../utils/textHelpers';
import { speakArmenian } from '../../utils/speech';

const INK = '#0f2744';
const INK_MUTED = '#2d4a66';
const GREEN = '#58CC02';
const RED = '#FF4B4B';
const PAPER_DEEP = '#efe8dc';

type Props = {
  exercise: CExercise;
  nativeLanguage: NativeLanguage;
  selectedIndex: number | null;
  onSelect: (index: number) => void;
  isChecked: boolean;
};

export function ConversationExerciseView({
  exercise,
  nativeLanguage,
  selectedIndex,
  onSelect,
  isChecked,
}: Props) {
  const isPersian = nativeLanguage === 'fa';

  return (
    <View style={styles.container}>
      <Text style={styles.instruction}>
        {isPersian ? 'مکالمه را بخوانید و پاسخ دهید' : 'Read the conversation and answer'}
      </Text>

      {/* Dialogue bubbles */}
      <View style={styles.dialogue}>
        {exercise.dialogue.map((line, idx) => {
          const isSecondSpeaker = idx % 2 === 1;
          const nativeText = isPersian ? line.fa : line.en;

          return (
            <Pressable
              key={`dial-${idx}`}
              style={[styles.bubble, isSecondSpeaker && styles.bubbleRight]}
              onPress={() => speakArmenian(line.armenian, line.phonetic)}
            >
              <Text style={styles.speaker}>{line.speaker}</Text>
              <Text style={styles.armenian}>{line.armenian} 🔊</Text>
              <Text style={styles.phonetic}>{line.phonetic}</Text>
              <View style={styles.divider} />
              <Text style={[styles.native, isPersian && styles.rtlText]}>
                {nativeText}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Question */}
      <Text style={[styles.question, isPersian && styles.rtlText]}>
        {t(exercise.question, nativeLanguage)}
      </Text>

      {/* Options */}
      <View style={styles.options}>
        {exercise.options.map((option, idx) => {
          const isSelected = selectedIndex === idx;
          const isCorrectOption = idx === exercise.correctIndex;

          return (
            <Pressable
              key={`conv-${idx}`}
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
    marginBottom: 16,
    textAlign: 'center',
  },
  dialogue: {
    gap: 10,
    marginBottom: 20,
  },
  bubble: {
    maxWidth: '88%',
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: INK,
    backgroundColor: '#fffefb',
    alignSelf: 'flex-start',
  },
  bubbleRight: {
    alignSelf: 'flex-end',
    backgroundColor: PAPER_DEEP,
  },
  speaker: {
    fontSize: 12,
    fontWeight: '800',
    color: INK_MUTED,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  armenian: {
    fontSize: 16,
    fontWeight: '700',
    color: INK,
    lineHeight: 24,
  },
  phonetic: {
    fontSize: 12,
    fontStyle: 'italic',
    color: INK_MUTED,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(15,39,68,0.12)',
    marginVertical: 6,
  },
  native: {
    fontSize: 14,
    fontWeight: '600',
    color: INK,
  },
  question: {
    fontSize: 17,
    fontWeight: '700',
    color: INK,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 24,
  },
  options: {
    gap: 10,
  },
  option: {
    paddingVertical: 14,
    paddingHorizontal: 16,
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
    fontSize: 15,
    fontWeight: '600',
    color: INK,
    textAlign: 'center',
  },
  rtlText: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});
