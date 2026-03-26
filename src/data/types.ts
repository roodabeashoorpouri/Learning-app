/** Trilingual text used across the app (Armenian target + English/Persian native) */
export type TrilingualText = {
  hy: string;
  hyPhonetic: string;
  en: string;
  fa: string;
};

// ─── Exercise types (discriminated union) ───────────────────────────

export type MultipleChoiceExercise = {
  type: 'multiple_choice';
  id: string;
  prompt: TrilingualText;
  options: TrilingualText[];
  correctIndex: number;
};

export type FillBlankExercise = {
  type: 'fill_blank';
  id: string;
  /** Sentence with "___" as placeholder */
  sentence: TrilingualText;
  options: TrilingualText[];
  correctIndex: number;
};

export type MatchPairsExercise = {
  type: 'match_pairs';
  id: string;
  pairs: { left: TrilingualText; right: TrilingualText }[];
};

export type TranslateExercise = {
  type: 'translate';
  id: string;
  prompt: TrilingualText;
  direction: 'toArmenian' | 'fromArmenian';
  wordBank: TrilingualText[];
  correctOrder: number[];
};

export type ListeningExercise = {
  type: 'listening';
  id: string;
  /** Armenian text that would be spoken (visual fallback until audio exists) */
  armenianText: string;
  armenianPhonetic: string;
  options: TrilingualText[];
  correctIndex: number;
};

export type ConversationExercise = {
  type: 'conversation';
  id: string;
  dialogue: {
    speaker: string;
    armenian: string;
    phonetic: string;
    en: string;
    fa: string;
  }[];
  question: TrilingualText;
  options: TrilingualText[];
  correctIndex: number;
};

export type Exercise =
  | MultipleChoiceExercise
  | FillBlankExercise
  | MatchPairsExercise
  | TranslateExercise
  | ListeningExercise
  | ConversationExercise;

// ─── Curriculum structure ───────────────────────────────────────────

export type PracticeSection = {
  id: string;
  title: TrilingualText;
  description: TrilingualText;
  exercises: Exercise[];
};

export type WorkbookUnit = {
  id: string;
  title: TrilingualText;
  sections: PracticeSection[];
};

// ─── New Lesson Structure for Student Book ─────────────────────────

export type LessonData = {
  id: string;
  title: { hy: string; en: string; fa: string };
  conversation: {
    characters: Array<{
      name: string;
      role: string;
      lines: Array<{
        armenian: string;
        phonetic: string;
        translation: string;
      }>;
    }>;
    setting: {
      description: string;
      illustration?: string;
    };
  };
  reading: {
    wideAngleScene: {
      description: string;
      illustration?: string;
    };
    vocabularyHotspots: Array<{
      id: string;
      armenian: string;
      phonetic: string;
      translation: string;
      xPercent: number;
      yPercent: number;
    }>;
    narrativeText?: {
      armenian: string;
      phonetic: string;
      translation: string;
    };
  };
  listening: {
    exercises: Array<{
      id: string;
      armenian: string;
      phonetic: string;
      instruction: { en: string; fa: string };
      feedback?: { en: string; fa: string };
    }>;
  };
  writing: {
    exercises: Array<{
      id: string;
      type: 'alphabet' | 'transcription';
      letter?: string;
      word?: {
        armenian: string;
        phonetic: string;
        translation: string;
      };
      strokeOrder?: string[];
    }>;
  };
};
