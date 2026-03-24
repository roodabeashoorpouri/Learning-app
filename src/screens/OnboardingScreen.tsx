import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  I18nManager,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { useAuth, type Gender, type NativeLanguage } from '../context/AuthContext';

function parseIntOr(value: string, fallback: number) {
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) ? n : fallback;
}

export function OnboardingScreen() {
  const navigation = useNavigation<any>();
  const { nativeLanguage: authNativeLanguage, updateAuth } = useAuth();

  // Pager steps:
  // 0) Native language (RTL toggle)
  // 1) Purpose + daily goal
  // 2) Age
  // 3) Gender
  const stepCount = 4;
  const [stepIndex, setStepIndex] = useState(0);

  const { width } = useWindowDimensions();
  const pagerRef = useRef<ScrollView>(null);

  const [nativeLanguage, setNativeLanguage] = useState<NativeLanguage>(authNativeLanguage);
  const [purpose, setPurpose] = useState('');
  const [dailyGoalText, setDailyGoalText] = useState('10');
  const [ageText, setAgeText] = useState('0');
  const [gender, setGender] = useState<Gender>('');

  useEffect(() => {
    // Keep local step-0 language in sync with what we already stored from AuthScreen.
    setNativeLanguage(authNativeLanguage);
  }, [authNativeLanguage]);

  const isRTL = nativeLanguage === 'fa';

  useEffect(() => {
    // Crucial requirement: switch to RTL immediately when Persian is selected.
    I18nManager.allowRTL(isRTL);
    I18nManager.forceRTL(isRTL);
  }, [isRTL]);

  const dailyGoalNumber = useMemo(() => parseIntOr(dailyGoalText, 10), [dailyGoalText]);
  const ageNumber = useMemo(() => parseIntOr(ageText, 0), [ageText]);

  const canContinue = useMemo(() => {
    if (stepIndex === 0) return true;
    if (stepIndex === 1) return purpose.trim().length > 0 && dailyGoalNumber > 0;
    if (stepIndex === 2) return ageText.trim().length > 0 && ageNumber >= 0;
    if (stepIndex === 3) return gender !== '';
    return false;
  }, [ageNumber, ageText, dailyGoalNumber, gender, purpose, stepIndex]);

  const goTo = (index: number) => {
    const clamped = Math.max(0, Math.min(stepCount - 1, index));
    pagerRef.current?.scrollTo({ x: clamped * width, y: 0, animated: true });
    setStepIndex(clamped);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
    >
      <View className="flex-1 bg-slate-50 px-5 pt-6">
        <View>
          <View className="flex-row gap-2">
            {Array.from({ length: stepCount }).map((_, i) => {
              const isCompleted = i < stepIndex;
              const isCurrent = i === stepIndex;
              const barClassName = isCompleted
                ? 'bg-indigo-600'
                : isCurrent
                  ? 'bg-indigo-300'
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
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          contentContainerStyle={{ flexDirection: 'row' }}
          onMomentumScrollEnd={(e) => {
            const idx = Math.round(e.nativeEvent.contentOffset.x / width);
            setStepIndex(Math.max(0, Math.min(stepCount - 1, idx)));
          }}
          className="flex-1"
        >
          {/* Step 0: Native language */}
          <View style={{ width }} className="flex-1">
            <View className="flex-1 px-1 pt-8">
              <Text className="text-3xl font-extrabold text-slate-900">Choose your native language</Text>
              <Text className="mt-3 text-base font-medium text-slate-600">
                We’ll tailor the UI direction and later Armenian grammar examples.
              </Text>

              <View className="mt-6 gap-3">
                <Pressable
                  onPress={() => {
                    setNativeLanguage('en');
                    updateAuth({ nativeLanguage: 'en' });
                  }}
                  className={`rounded-2xl border p-4 ${
                    nativeLanguage === 'en'
                      ? 'border-indigo-600 bg-indigo-600'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <Text
                    className={`text-lg font-bold ${
                      nativeLanguage === 'en' ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    English (EN)
                  </Text>
                  <Text
                    className={`mt-1 text-sm ${nativeLanguage === 'en' ? 'text-indigo-100' : 'text-slate-600'}`}
                  >
                    Left-to-right layout
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => {
                    setNativeLanguage('fa');
                    updateAuth({ nativeLanguage: 'fa' });
                  }}
                  className={`rounded-2xl border p-4 ${
                    nativeLanguage === 'fa'
                      ? 'border-indigo-600 bg-indigo-600'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <Text
                    className={`text-lg font-bold ${
                      nativeLanguage === 'fa' ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    Persian (FA)
                  </Text>
                  <Text
                    className={`mt-1 text-sm ${nativeLanguage === 'fa' ? 'text-indigo-100' : 'text-slate-600'}`}
                  >
                    Right-to-left (RTL) layout
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>

          {/* Step 1: Purpose + daily goal */}
          <View style={{ width }} className="flex-1">
            <View className="flex-1 px-1 pt-8">
              <Text className="text-2xl font-extrabold text-slate-900">Let’s set up your plan</Text>
              <Text className="mt-2 text-base font-medium text-slate-600">
                Tell us why you’re learning Armenian so we can personalize lesson examples.
              </Text>

              <View className="mt-6 gap-3">
                <View>
                  <Text className="mb-2 text-sm font-semibold text-slate-700">Purpose</Text>
                  <TextInput
                    value={purpose}
                    onChangeText={setPurpose}
                    placeholder="e.g., travel, family, school"
                    placeholderTextColor="#64748b"
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900"
                    autoCapitalize="sentences"
                  />
                </View>

                <View>
                  <Text className="mb-2 text-sm font-semibold text-slate-700">Daily goal</Text>
                  <TextInput
                    value={dailyGoalText}
                    onChangeText={setDailyGoalText}
                    placeholder="Daily goal (lessons)"
                    placeholderTextColor="#64748b"
                    keyboardType="number-pad"
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900"
                    inputMode="numeric"
                  />
                </View>
              </View>
            </View>
          </View>

          {/* Step 2: Age */}
          <View style={{ width }} className="flex-1">
            <View className="flex-1 px-1 pt-8">
              <Text className="text-2xl font-extrabold text-slate-900">What’s your age?</Text>
              <Text className="mt-2 text-base font-medium text-slate-600">
                This helps us choose age-appropriate lesson language and examples.
              </Text>

              <View className="mt-6">
                <Text className="mb-2 text-sm font-semibold text-slate-700">Age</Text>
                <TextInput
                  value={ageText}
                  onChangeText={setAgeText}
                  placeholder="Age"
                  placeholderTextColor="#64748b"
                  keyboardType="number-pad"
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900"
                  inputMode="numeric"
                />
              </View>
            </View>
          </View>

          {/* Step 3: Gender */}
          <View style={{ width }} className="flex-1">
            <View className="flex-1 px-1 pt-8">
              <Text className="text-2xl font-extrabold text-slate-900">Select your gender</Text>
              <Text className="mt-2 text-base font-medium text-slate-600">
                We’ll personalize Armenian grammar patterns later.
              </Text>

              <View className="mt-6 gap-3">
                <Pressable
                  onPress={() => setGender('male')}
                  className={`rounded-2xl border p-4 ${
                    gender === 'male' ? 'border-indigo-600 bg-indigo-600' : 'border-slate-200 bg-white'
                  }`}
                >
                  <Text className={`text-lg font-bold ${gender === 'male' ? 'text-white' : 'text-slate-900'}`}>
                    Male
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => setGender('female')}
                  className={`rounded-2xl border p-4 ${
                    gender === 'female'
                      ? 'border-indigo-600 bg-indigo-600'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <Text
                    className={`text-lg font-bold ${gender === 'female' ? 'text-white' : 'text-slate-900'}`}
                  >
                    Female
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => setGender('other')}
                  className={`rounded-2xl border p-4 ${
                    gender === 'other' ? 'border-indigo-600 bg-indigo-600' : 'border-slate-200 bg-white'
                  }`}
                >
                  <Text className={`text-lg font-bold ${gender === 'other' ? 'text-white' : 'text-slate-900'}`}>
                    Other
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Footer actions */}
        <View className="pb-2">
          <View className="flex-row items-center gap-3">
            {stepIndex > 0 ? (
              <Pressable
                onPress={() => goTo(stepIndex - 1)}
                className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3"
              >
                <Text className="text-center text-base font-bold text-slate-900">Back</Text>
              </Pressable>
            ) : (
              <View className="flex-1" />
            )}

            <Pressable
              onPress={() => {
                if (!canContinue) return;

                if (stepIndex < stepCount - 1) {
                  goTo(stepIndex + 1);
                  return;
                }

                updateAuth({
                  nativeLanguage,
                  purpose: purpose.trim(),
                  dailyGoal: dailyGoalNumber,
                  age: ageNumber,
                  gender,
                });
                navigation.navigate('MainTabNavigator');
              }}
              className={`flex-1 rounded-2xl px-4 py-3 ${
                canContinue ? 'bg-indigo-600' : 'bg-indigo-400'
              }`}
            >
              <Text className="text-center text-base font-bold text-white">
                {stepIndex === stepCount - 1 ? 'Start Learning' : 'Next'}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

