import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { NativeLanguage } from '../../context/AuthContext';
import { t } from '../../utils/textHelpers';

type Props = {
  title: { hy: string; en: string; fa: string };
  currentSection: number;
  sectionNames: string[];
  nativeLanguage: NativeLanguage;
};

const SECTION_TRANSLATIONS = {
  Conversation: { hy: 'Խոսակցություն', en: 'Conversation', fa: 'مکالمه' },
  Reading: { hy: 'Ընթերցում', en: 'Reading', fa: 'خواندن' },
  Listening: { hy: 'Լսում', en: 'Listening', fa: 'شنیدن' },
  Writing: { hy: 'Գրում', en: 'Writing', fa: 'نوشتن' },
};

export function LessonHeader({ title, currentSection, sectionNames, nativeLanguage }: Props) {
  const isPersian = nativeLanguage === 'fa';
  const currentSectionName = sectionNames[currentSection];
  const sectionTitle = SECTION_TRANSLATIONS[currentSectionName as keyof typeof SECTION_TRANSLATIONS];

  return (
    <View style={styles.container}>
      <Text style={[styles.lessonTitle, isPersian && styles.rtlText]}>
        {t(title, nativeLanguage)}
      </Text>
      <Text style={[styles.sectionTitle, isPersian && styles.rtlText]}>
        {t(sectionTitle, nativeLanguage)}
      </Text>
      <View style={styles.divider} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#f7f4ec',
  },
  lessonTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0f2744',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d4a66',
    textAlign: 'center',
    marginTop: 4,
  },
  divider: {
    height: 2,
    backgroundColor: '#1a3d5c',
    marginTop: 12,
    borderRadius: 1,
  },
  rtlText: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});