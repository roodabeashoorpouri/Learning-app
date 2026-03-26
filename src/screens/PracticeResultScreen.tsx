import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useAuth } from '../context/AuthContext';
import { findSection } from '../data/workbookContent';
import { t } from '../utils/textHelpers';
import type { RootStackParamList } from '../components/navigation/types';

const PAPER = '#f7f4ec';
const INK = '#0f2744';
const INK_MUTED = '#2d4a66';
const GREEN = '#58CC02';

type Props = NativeStackScreenProps<RootStackParamList, 'PracticeResult'>;

export function PracticeResultScreen({ route, navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { nativeLanguage } = useAuth();
  const isPersian = nativeLanguage === 'fa';
  const { correctCount, totalCount, sectionId } = route.params;

  const result = findSection(sectionId);
  const sectionTitle = result ? t(result.section.title, nativeLanguage) : '';

  const perfect = correctCount === totalCount;

  return (
    <View style={[styles.screen, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.content}>
        <Text style={styles.emoji}>{perfect ? '✓' : '○'}</Text>
        <Text style={styles.title}>
          {isPersian ? 'تمرین تمام شد' : 'Practice Complete'}
        </Text>
        {sectionTitle ? (
          <Text style={styles.section}>{sectionTitle}</Text>
        ) : null}
        <View style={styles.scoreBox}>
          <Text style={styles.scoreLabel}>
            {isPersian ? 'نتیجه' : 'Result'}
          </Text>
          <Text style={[styles.scoreValue, perfect && styles.scoreValuePerfect]}>
            {correctCount} / {totalCount}
          </Text>
          <Text style={styles.scoreHint}>
            {isPersian ? 'پاسخ صحیح' : 'correct answers'}
          </Text>
        </View>
      </View>

      <View style={styles.bottomBar}>
        <Pressable
          onPress={() => navigation.popToTop()}
          style={({ pressed }) => [styles.doneButton, pressed && styles.doneButtonPressed]}
        >
          <Text style={styles.doneButtonText}>
            {isPersian ? 'پایان' : 'Done'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: PAPER,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emoji: {
    fontSize: 56,
    fontWeight: '800',
    color: GREEN,
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: INK,
    textAlign: 'center',
  },
  section: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '600',
    color: INK_MUTED,
    textAlign: 'center',
  },
  scoreBox: {
    marginTop: 32,
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: INK,
    backgroundColor: '#fffefb',
  },
  scoreLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: INK_MUTED,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  scoreValue: {
    marginTop: 8,
    fontSize: 36,
    fontWeight: '800',
    color: INK,
  },
  scoreValuePerfect: {
    color: GREEN,
  },
  scoreHint: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: '600',
    color: INK_MUTED,
  },
  bottomBar: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  doneButton: {
    paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: INK,
    alignItems: 'center',
  },
  doneButtonPressed: {
    opacity: 0.85,
  },
  doneButtonText: {
    fontSize: 17,
    fontWeight: '800',
    color: PAPER,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});
