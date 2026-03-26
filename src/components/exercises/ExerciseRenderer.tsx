import React from 'react';

import type { NativeLanguage } from '../../context/AuthContext';
import type { Exercise } from '../../data/types';
import { MultipleChoiceExerciseView } from './MultipleChoiceExercise';
import { FillBlankExerciseView } from './FillBlankExercise';
import { MatchPairsExerciseView } from './MatchPairsExercise';
import { TranslateExerciseView } from './TranslateExercise';
import { ListeningExerciseView } from './ListeningExercise';
import { ConversationExerciseView } from './ConversationExercise';

type Props = {
  exercise: Exercise;
  nativeLanguage: NativeLanguage;
  selectedAnswer: any;
  onAnswer: (answer: any) => void;
  isChecked: boolean;
};

export function ExerciseRenderer({
  exercise,
  nativeLanguage,
  selectedAnswer,
  onAnswer,
  isChecked,
}: Props) {
  switch (exercise.type) {
    case 'multiple_choice':
      return (
        <MultipleChoiceExerciseView
          exercise={exercise}
          nativeLanguage={nativeLanguage}
          selectedIndex={selectedAnswer}
          onSelect={onAnswer}
          isChecked={isChecked}
        />
      );

    case 'fill_blank':
      return (
        <FillBlankExerciseView
          exercise={exercise}
          nativeLanguage={nativeLanguage}
          selectedIndex={selectedAnswer}
          onSelect={onAnswer}
          isChecked={isChecked}
        />
      );

    case 'match_pairs':
      return (
        <MatchPairsExerciseView
          exercise={exercise}
          nativeLanguage={nativeLanguage}
          selectedAnswer={selectedAnswer}
          onAnswer={onAnswer}
          isChecked={isChecked}
        />
      );

    case 'translate':
      return (
        <TranslateExerciseView
          exercise={exercise}
          nativeLanguage={nativeLanguage}
          selectedAnswer={selectedAnswer}
          onAnswer={onAnswer}
          isChecked={isChecked}
        />
      );

    case 'listening':
      return (
        <ListeningExerciseView
          exercise={exercise}
          nativeLanguage={nativeLanguage}
          selectedIndex={selectedAnswer}
          onSelect={onAnswer}
          isChecked={isChecked}
        />
      );

    case 'conversation':
      return (
        <ConversationExerciseView
          exercise={exercise}
          nativeLanguage={nativeLanguage}
          selectedIndex={selectedAnswer}
          onSelect={onAnswer}
          isChecked={isChecked}
        />
      );

    default:
      return null;
  }
}
