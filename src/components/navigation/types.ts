export type RootStackParamList = {
  Auth: undefined;
  OnboardingStack: undefined;
  MainTabNavigator: { resumeLessonId?: string; resumeSectionIndex?: number } | undefined;
  PracticeSession: { sectionId: string };
  PracticeResult: { sectionId: string; correctCount: number; totalCount: number };
};

export type OnboardingStackParamList = {
  Onboarding: undefined;
};

export type MainTabParamList = {
  StudentBook: undefined;
  Workbook: undefined;
  Profile: undefined;
};

