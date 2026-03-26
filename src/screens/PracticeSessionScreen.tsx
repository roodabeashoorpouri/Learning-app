import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useAuth } from '../context/AuthContext';
import { findSection } from '../data/workbookContent';
import { t } from '../utils/textHelpers';
import { stopSpeech } from '../utils/speech';
import { usePracticeSession } from '../hooks/usePracticeSession';
import { ProgressBar } from '../components/exercises/ProgressBar';
import { CloseButton } from '../components/exercises/CloseButton';
import { CheckButton } from '../components/exercises/CheckButton';
import { FeedbackBanner } from '../components/exercises/FeedbackBanner';
import { ExerciseRenderer } from '../components/exercises/ExerciseRenderer';
import type { RootStackParamList } from '../components/navigation/types';

const PAPER = '#f7f4ec';

type Props = NativeStackScreenProps<RootStackParamList, 'PracticeSession'>;

export function PracticeSessionScreen({ route, navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { nativeLanguage } = useAuth();
  const isPersian = nativeLanguage === 'fa';

  const result = findSection(route.params.sectionId);
  const exercises = result?.section.exercises ?? [];

  const { state, actions } = usePracticeSession(exercises);
  const [selectedAnswer, setSelectedAnswer] = useState<any>(null);

  // Reset selection when moving to next exercise
  useEffect(() => {
    setSelectedAnswer(null);
  }, [state.index]);

  // Auto-complete for match_pairs: when all pairs matched, auto-check
  useEffect(() => {
    if (
      state.exercise.type === 'match_pairs' &&
      selectedAnswer === true &&
      !state.isChecked
    ) {
      actions.check(true);
    }
  }, [selectedAnswer, state.exercise.type, state.isChecked, actions]);

  // Navigate to result screen when finished
  useEffect(() => {
    if (state.isFinished) {
      navigation.replace('PracticeResult', {
        sectionId: route.params.sectionId,
        correctCount: state.correctCount,
        totalCount: state.total,
      });
    }
  }, [state.isFinished, state.correctCount, state.total, navigation, route.params.sectionId]);

  const handleCheck = useCallback(() => {
    if (selectedAnswer === null) return;

    const exercise = state.exercise;
    let isCorrect = false;

    switch (exercise.type) {
      case 'multiple_choice':
        isCorrect = selectedAnswer === exercise.correctIndex;
        break;
      case 'fill_blank':
        isCorrect = selectedAnswer === exercise.correctIndex;
        break;
      case 'listening':
        isCorrect = selectedAnswer === exercise.correctIndex;
        break;
      case 'conversation':
        isCorrect = selectedAnswer === exercise.correctIndex;
        break;
      case 'match_pairs':
        // Match pairs auto-completes, so if we reach check it's done
        isCorrect = true;
        break;
      case 'translate':
        isCorrect =
          JSON.stringify(selectedAnswer) === JSON.stringify(exercise.correctOrder);
        break;
    }

    actions.check(isCorrect);
  }, [selectedAnswer, state.exercise, actions]);

  const handleContinue = useCallback(() => {
    actions.next();
  }, [actions]);

  const handleClose = useCallback(() => {
    stopSpeech();
    navigation.goBack();
  }, [navigation]);

  // Get correct answer label for feedback
  const getCorrectLabel = () => {
    const exercise = state.exercise;
    if ('correctIndex' in exercise && 'options' in exercise) {
      return t(exercise.options[exercise.correctIndex], nativeLanguage);
    }
    return '';
  };

  if (state.isFinished) return null;

  const hasAnswer = selectedAnswer !== null;
  const isMatchPairs = state.exercise.type === 'match_pairs';

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 8, paddingBottom: insets.bottom }]}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <CloseButton onClose={handleClose} />
        <View style={styles.progressWrap}>
          <ProgressBar progress={state.progress} />
        </View>
      </View>

      {/* Exercise content */}
      <View style={styles.exerciseArea}>
        <ExerciseRenderer
          exercise={state.exercise}
          nativeLanguage={nativeLanguage}
          selectedAnswer={selectedAnswer}
          onAnswer={setSelectedAnswer}
          isChecked={state.isChecked}
        />
      </View>

      {/* Bottom: CHECK button (hidden for match_pairs and when feedback is showing) */}
      {!state.isChecked && !isMatchPairs && (
        <View style={styles.bottomBar}>
          <CheckButton
            disabled={!hasAnswer}
            label={isPersian ? 'بررسی' : 'CHECK'}
            onPress={handleCheck}
          />
        </View>
      )}

      {/* Feedback overlay */}
      {state.isChecked && state.isCorrect !== null && (
        <FeedbackBanner
          isCorrect={state.isCorrect}
          correctAnswerLabel={!state.isCorrect ? getCorrectLabel() : undefined}
          continueLabel={isPersian ? 'ادامه' : 'CONTINUE'}
          onContinue={handleContinue}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: PAPER,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 16,
  },
  progressWrap: {
    flex: 1,
  },
  exerciseArea: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  bottomBar: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
});
