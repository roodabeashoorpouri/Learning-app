import React, { useCallback, useEffect, useRef, useState } from 'react';
import { I18nManager, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import {
  useAuth,
  type AgeBracket,
  type Gender,
  type LearningLevel,
  type NativeLanguage,
} from '../context/AuthContext';
import { updateStoredUser } from '../storage/registeredUsers';

const ACCENT_SELECTED = 'border-blue-600 bg-blue-600';
const ACCENT_UNSELECTED = 'border-slate-200 bg-white';

const PURPOSE_OPTIONS = ['Family/Heritage', 'Travel', 'Business', 'Hobby'] as const;
const AGE_OPTIONS = ['3-12', '12-25', '25-45', '45+'] as const;
const LEVEL_OPTIONS: { label: string; value: LearningLevel }[] = [
  { label: 'Beginner', value: 'beginner' },
  { label: 'Intermediate', value: 'intermediate' },
  { label: 'Advanced', value: 'advanced' },
];

const STEP_COACHING: { en: string; fa: string }[] = [
  {
    en: 'Pick your native language — we align layout and examples with it.',
    fa: 'زبان مادری‌ات رو انتخاب کن — چیدمان و مثال‌ها رو باهاش هماهنگ می‌کنیم.',
  },
  {
    en: 'Tap your age range — we keep wording and tone age-appropriate.',
    fa: 'محدوده سنت رو انتخاب کن — لحن و واژگان با سنِ تو مناسب می‌شه.',
  },
  {
    en: 'Choose why you’re learning Armenian — we’ll shape lesson examples around it.',
    fa: 'هدفت از یادگیری ارمنی رو بزن — مثال‌های درس رو دورش شخصی‌سازی می‌کنیم.',
  },
  {
    en: 'How much Armenian do you already know?',
    fa: 'سطحت رو مشخص کن — مبتدی، متوسط یا پیشرفته.',
  },
  {
    en: 'This helps Armenian grammar (like verb agreement) fit you better later.',
    fa: 'برای گرامر ارمنی بعداً بهتر تطبیق می‌دیم — مثل هماهنگی افعال.',
  },
];

function ageBracketToNumber(bracket: AgeBracket): number {
  switch (bracket) {
    case '3-12':
      return 8;
    case '12-25':
      return 18;
    case '25-45':
      return 35;
    case '45+':
      return 55;
    default:
      return 0;
  }
}

function CoachBanner({ english, persian }: { english: string; persian: string }) {
  return (
    <View style={coachStyles.wrap}>
      <View style={coachStyles.row}>
        <View style={coachStyles.badge}>
          <Text style={coachStyles.badgeText}>S</Text>
        </View>
        <View style={coachStyles.speech}>
          <Text style={coachStyles.name}>Sarah</Text>
          <Text style={coachStyles.role}>English</Text>
          <Text style={coachStyles.bodyEn}>{english}</Text>
        </View>
      </View>

      <View style={[coachStyles.row, coachStyles.rowRtl]}>
        <View style={[coachStyles.badge, coachStyles.badgeRtl]}>
          <Text style={coachStyles.badgeText}>J</Text>
        </View>
        <View style={[coachStyles.speech, coachStyles.speechRtl]}>
          <Text style={coachStyles.name}>John</Text>
          <Text style={coachStyles.role}>فارسی</Text>
          <Text style={coachStyles.bodyFa}>{persian}</Text>
        </View>
      </View>
    </View>
  );
}

const coachStyles = StyleSheet.create({
  wrap: { gap: 10, marginBottom: 16 },
  row: { flexDirection: 'row', alignItems: 'flex-start' },
  rowRtl: { flexDirection: 'row-reverse' },
  badge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e8dfd4',
    borderWidth: 2,
    borderColor: '#2c241c',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  badgeRtl: {
    backgroundColor: '#d4e0e8',
    marginRight: 0,
    marginLeft: 10,
  },
  badgeText: { fontSize: 16, fontWeight: '800', color: '#2c241c' },
  speech: {
    flex: 1,
    backgroundColor: '#faf8f5',
    borderWidth: 2,
    borderColor: '#2c241c',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  speechRtl: { backgroundColor: '#f3f8fb' },
  name: { fontSize: 14, fontWeight: '800', color: '#2c241c' },
  role: { fontSize: 11, color: '#6b5d4f', marginBottom: 4 },
  bodyEn: { fontSize: 14, fontWeight: '500', color: '#2c241c', lineHeight: 20 },
  bodyFa: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1e3a4c',
    lineHeight: 22,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});

export function OnboardingScreen() {
  const navigation = useNavigation<any>();
  const { nativeLanguage: authNativeLanguage, updateAuth, email: authEmail } = useAuth();

  /** 0 language, 1 age, 2 purpose, 3 level, 4 gender */
  const stepCount = 5;
  const [stepIndex, setStepIndex] = useState(0);
  const { width } = useWindowDimensions();
  const pagerRef = useRef<ScrollView>(null);
  const advanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savingRef = useRef(false);

  const [nativeLanguage, setNativeLanguage] = useState<NativeLanguage>(authNativeLanguage);
  const [purpose, setPurpose] = useState('');
  const [ageBracket, setAgeBracket] = useState<AgeBracket>('');
  const [learningLevel, setLearningLevel] = useState<LearningLevel>('');
  const [gender, setGender] = useState<Gender>('');

  useEffect(() => {
    setNativeLanguage(authNativeLanguage);
  }, [authNativeLanguage]);

  const isRTL = nativeLanguage === 'fa';

  useEffect(() => {
    I18nManager.allowRTL(isRTL);
    I18nManager.forceRTL(isRTL);
  }, [isRTL]);

  const clearAdvanceTimer = useCallback(() => {
    if (advanceTimerRef.current) {
      clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => clearAdvanceTimer();
  }, [clearAdvanceTimer]);

  useEffect(() => {
    clearAdvanceTimer();
  }, [stepIndex, clearAdvanceTimer]);

  const goTo = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(stepCount - 1, index));
      pagerRef.current?.scrollTo({ x: clamped * width, y: 0, animated: true });
      setStepIndex(clamped);
    },
    [stepCount, width],
  );

  const completeOnboarding = useCallback(
    async (finalGender: Gender) => {
      if (savingRef.current) return;
      savingRef.current = true;
      const ageNum = ageBracketToNumber(ageBracket);
      const authPatch = {
        nativeLanguage,
        purpose,
        dailyGoal: 10,
        age: ageNum,
        ageBracket,
        learningLevel,
        gender: finalGender,
      };
      try {
        updateAuth(authPatch);
        await updateStoredUser(authEmail, {
          ...authPatch,
          onboardingComplete: true,
        });
        navigation.navigate('MainTabNavigator');
      } finally {
        savingRef.current = false;
      }
    },
    [ageBracket, authEmail, learningLevel, nativeLanguage, navigation, purpose, updateAuth],
  );

  const scheduleAdvanceFromStep = useCallback(
    (fromStep: number, isFinal?: boolean, finalGender?: Gender) => {
      clearAdvanceTimer();
      advanceTimerRef.current = setTimeout(() => {
        advanceTimerRef.current = null;
        if (isFinal && finalGender) {
          void completeOnboarding(finalGender);
        } else {
          goTo(fromStep + 1);
        }
      }, 500);
    },
    [clearAdvanceTimer, completeOnboarding, goTo],
  );

  const coaching = STEP_COACHING[stepIndex] ?? STEP_COACHING[0];

  return (
    <View className="flex-1 bg-slate-50 px-5 pt-6">
      <View>
        <View className="flex-row gap-2">
          {Array.from({ length: stepCount }).map((_, i) => {
            const isCompleted = i < stepIndex;
            const isCurrent = i === stepIndex;
            const barClassName = isCompleted
              ? 'bg-blue-600'
              : isCurrent
                ? 'bg-blue-300'
                : 'bg-slate-200';
            return <View key={i} className={`h-2 flex-1 rounded-full ${barClassName}`} />;
          })}
        </View>

        <Text className="mt-3 text-center text-xs font-semibold text-slate-600">
          Step {stepIndex + 1} of {stepCount}
        </Text>
      </View>

      <ScrollView
        ref={pagerRef}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ flexDirection: 'row' }}
        className="flex-1"
      >
        {/* Step 0: Native language */}
        <View style={{ width }} className="flex-1">
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            <View className="flex-1 px-1 pt-6 pb-8">
              <CoachBanner english={STEP_COACHING[0].en} persian={STEP_COACHING[0].fa} />
              <Text className="text-2xl font-extrabold text-slate-900">Native language</Text>

              <View className="mt-5 gap-3">
                <Pressable
                  onPress={() => {
                    setNativeLanguage('en');
                    updateAuth({ nativeLanguage: 'en' });
                    void updateStoredUser(authEmail, { nativeLanguage: 'en' });
                    scheduleAdvanceFromStep(0);
                  }}
                  className={`rounded-2xl border p-4 ${
                    nativeLanguage === 'en' ? ACCENT_SELECTED : ACCENT_UNSELECTED
                  }`}
                >
                  <Text
                    className={`text-lg font-bold ${
                      nativeLanguage === 'en' ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    English
                  </Text>
                  <Text
                    className={`mt-1 text-sm ${nativeLanguage === 'en' ? 'text-blue-100' : 'text-slate-600'}`}
                  >
                    Left-to-right layout
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => {
                    setNativeLanguage('fa');
                    updateAuth({ nativeLanguage: 'fa' });
                    void updateStoredUser(authEmail, { nativeLanguage: 'fa' });
                    scheduleAdvanceFromStep(0);
                  }}
                  className={`rounded-2xl border p-4 ${
                    nativeLanguage === 'fa' ? ACCENT_SELECTED : ACCENT_UNSELECTED
                  }`}
                >
                  <Text
                    className={`text-lg font-bold ${nativeLanguage === 'fa' ? 'text-white' : 'text-slate-900'}`}
                  >
                    Persian
                  </Text>
                  <Text
                    className={`mt-1 text-sm ${nativeLanguage === 'fa' ? 'text-blue-100' : 'text-slate-600'}`}
                  >
                    Right-to-left (RTL) layout
                  </Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </View>

        {/* Step 1: Age */}
        <View style={{ width }} className="flex-1">
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            <View className="flex-1 px-1 pt-6 pb-8">
              <CoachBanner english={STEP_COACHING[1].en} persian={STEP_COACHING[1].fa} />
              <Text className="text-2xl font-extrabold text-slate-900">Age range</Text>

              <View className="mt-5 gap-3">
                <View className="flex-row gap-3">
                  {AGE_OPTIONS.slice(0, 2).map((opt) => (
                    <Pressable
                      key={opt}
                      onPress={() => {
                        setAgeBracket(opt);
                        scheduleAdvanceFromStep(1);
                      }}
                      className={`min-h-[88px] flex-1 rounded-2xl border p-4 ${
                        ageBracket === opt ? ACCENT_SELECTED : ACCENT_UNSELECTED
                      }`}
                    >
                      <Text
                        className={`text-center text-xl font-bold ${
                          ageBracket === opt ? 'text-white' : 'text-slate-900'
                        }`}
                      >
                        {opt}
                      </Text>
                    </Pressable>
                  ))}
                </View>
                <View className="flex-row gap-3">
                  {AGE_OPTIONS.slice(2, 4).map((opt) => (
                    <Pressable
                      key={opt}
                      onPress={() => {
                        setAgeBracket(opt);
                        scheduleAdvanceFromStep(1);
                      }}
                      className={`min-h-[88px] flex-1 rounded-2xl border p-4 ${
                        ageBracket === opt ? ACCENT_SELECTED : ACCENT_UNSELECTED
                      }`}
                    >
                      <Text
                        className={`text-center text-xl font-bold ${
                          ageBracket === opt ? 'text-white' : 'text-slate-900'
                        }`}
                      >
                        {opt}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            </View>
          </ScrollView>
        </View>

        {/* Step 2: Purpose */}
        <View style={{ width }} className="flex-1">
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            <View className="flex-1 px-1 pt-6 pb-8">
              <CoachBanner english={STEP_COACHING[2].en} persian={STEP_COACHING[2].fa} />
              <Text className="text-2xl font-extrabold text-slate-900">Your purpose</Text>

              <View className="mt-5 gap-3">
                <View className="flex-row gap-3">
                  {PURPOSE_OPTIONS.slice(0, 2).map((opt) => (
                    <Pressable
                      key={opt}
                      onPress={() => {
                        setPurpose(opt);
                        scheduleAdvanceFromStep(2);
                      }}
                      className={`min-h-[88px] flex-1 rounded-2xl border p-4 ${
                        purpose === opt ? ACCENT_SELECTED : ACCENT_UNSELECTED
                      }`}
                    >
                      <Text
                        className={`text-center text-base font-bold ${
                          purpose === opt ? 'text-white' : 'text-slate-900'
                        }`}
                      >
                        {opt}
                      </Text>
                    </Pressable>
                  ))}
                </View>
                <View className="flex-row gap-3">
                  {PURPOSE_OPTIONS.slice(2, 4).map((opt) => (
                    <Pressable
                      key={opt}
                      onPress={() => {
                        setPurpose(opt);
                        scheduleAdvanceFromStep(2);
                      }}
                      className={`min-h-[88px] flex-1 rounded-2xl border p-4 ${
                        purpose === opt ? ACCENT_SELECTED : ACCENT_UNSELECTED
                      }`}
                    >
                      <Text
                        className={`text-center text-base font-bold ${
                          purpose === opt ? 'text-white' : 'text-slate-900'
                        }`}
                      >
                        {opt}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            </View>
          </ScrollView>
        </View>

        {/* Step 3: Level */}
        <View style={{ width }} className="flex-1">
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            <View className="flex-1 px-1 pt-6 pb-8">
              <CoachBanner english={STEP_COACHING[3].en} persian={STEP_COACHING[3].fa} />
              <Text className="text-2xl font-extrabold text-slate-900">My level</Text>

              <View className="mt-5 gap-3">
                {LEVEL_OPTIONS.map(({ label, value }) => (
                  <Pressable
                    key={value}
                    onPress={() => {
                      setLearningLevel(value);
                      scheduleAdvanceFromStep(3);
                    }}
                    className={`rounded-2xl border p-4 ${
                      learningLevel === value ? ACCENT_SELECTED : ACCENT_UNSELECTED
                    }`}
                  >
                    <Text
                      className={`text-center text-lg font-bold ${
                        learningLevel === value ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </ScrollView>
        </View>

        {/* Step 4: Gender */}
        <View style={{ width }} className="flex-1">
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            <View className="flex-1 px-1 pt-6 pb-8">
              <CoachBanner english={STEP_COACHING[4].en} persian={STEP_COACHING[4].fa} />
              <Text className="text-2xl font-extrabold text-slate-900">Gender</Text>

              <View className="mt-5 gap-3">
                <Pressable
                  onPress={() => {
                    setGender('male');
                    scheduleAdvanceFromStep(4, true, 'male');
                  }}
                  className={`rounded-2xl border p-4 ${
                    gender === 'male' ? ACCENT_SELECTED : ACCENT_UNSELECTED
                  }`}
                >
                  <Text className={`text-lg font-bold ${gender === 'male' ? 'text-white' : 'text-slate-900'}`}>
                    Male
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => {
                    setGender('female');
                    scheduleAdvanceFromStep(4, true, 'female');
                  }}
                  className={`rounded-2xl border p-4 ${
                    gender === 'female' ? ACCENT_SELECTED : ACCENT_UNSELECTED
                  }`}
                >
                  <Text className={`text-lg font-bold ${gender === 'female' ? 'text-white' : 'text-slate-900'}`}>
                    Female
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => {
                    setGender('other');
                    scheduleAdvanceFromStep(4, true, 'other');
                  }}
                  className={`rounded-2xl border p-4 ${
                    gender === 'other' ? ACCENT_SELECTED : ACCENT_UNSELECTED
                  }`}
                >
                  <Text className={`text-lg font-bold ${gender === 'other' ? 'text-white' : 'text-slate-900'}`}>
                    Other
                  </Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </View>
      </ScrollView>

      <View className="pb-2">
        {stepIndex > 0 ? (
          <Pressable
            onPress={() => goTo(stepIndex - 1)}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3"
          >
            <Text className="text-center text-base font-bold text-slate-900">Back</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
