import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useAuth } from '../context/AuthContext';
import { lessons } from '../data/lessonContent';
import type { RootStackParamList } from '../components/navigation/types';

const PAPER = '#f7f4ec';
const INK = '#0f2744';
const INK_MUTED = '#2d4a66';
const ACCENT_LINE = '#1a3d5c';

const sectionLabels = {
  en: ['Conversation', 'Reading', 'Listening', 'Writing'],
  fa: ['\u0645\u06A9\u0627\u0644\u0645\u0647', '\u062E\u0648\u0627\u0646\u062F\u0646', '\u0634\u0646\u06CC\u062F\u0646', '\u0646\u0648\u0634\u062A\u0646'],
};

export function StudentBookScreen() {
  const insets = useSafeAreaInsets();
  const { nativeLanguage, last_visited_lesson_id } = useAuth();
  const isPersian = nativeLanguage === 'fa';
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const hasResumed = useRef(false);

  useEffect(() => {
    if (hasResumed.current) return;
    if (last_visited_lesson_id) {
      hasResumed.current = true;
      navigation.navigate('PracticeSession', { sectionId: last_visited_lesson_id });
    }
  }, [last_visited_lesson_id, navigation]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <Text style={[styles.title, isPersian && styles.rtlText]}>
          {isPersian ? '\u06A9\u062A\u0627\u0628 \u062F\u0627\u0646\u0634\u200C\u0622\u0645\u0648\u0632 \u0627\u0631\u0645\u0646\u06CC' : 'Armenian Student Book'}
        </Text>

        {lessons.map((lesson, lessonIndex) => {
          const lessonTitle = isPersian ? lesson.title.fa : lesson.title.en;
          const labels = isPersian ? sectionLabels.fa : sectionLabels.en;

          return (
            <View key={lesson.id} style={styles.lessonBlock}>
              <Text style={[styles.subtitle, isPersian && styles.rtlText]}>
                {lessonTitle}
              </Text>
              {lesson.title.hy ? (
                <Text style={styles.armenianTitle}>{lesson.title.hy}</Text>
              ) : null}

              {labels.map((label, i) => (
                <View key={i} style={styles.sectionCard}>
                  <View style={styles.sectionNumberWrap}>
                    <Text style={styles.sectionNumber}>{i + 1}</Text>
                  </View>
                  <View style={styles.sectionInfo}>
                    <Text style={[styles.sectionTitle, isPersian && styles.rtlText]}>
                      {label}
                    </Text>
                  </View>
                </View>
              ))}

              {lessonIndex < lessons.length - 1 && <View style={styles.divider} />}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PAPER,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: INK,
    textAlign: 'center',
    marginBottom: 24,
  },
  lessonBlock: {
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: INK_MUTED,
    marginBottom: 4,
  },
  armenianTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: INK_MUTED,
    marginBottom: 12,
    opacity: 0.7,
  },
  sectionCard: {
    backgroundColor: '#fffefb',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: ACCENT_LINE,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionNumberWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: INK,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  sectionNumber: {
    color: PAPER,
    fontSize: 16,
    fontWeight: '800',
  },
  sectionInfo: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: INK,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(15,39,68,0.15)',
    marginVertical: 20,
  },
  rtlText: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});
