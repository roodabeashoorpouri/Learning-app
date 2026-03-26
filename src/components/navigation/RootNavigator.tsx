import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { I18nManager } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Root-level navigation: Auth -> Onboarding -> Main tabs.
import { AuthScreen } from '../../screens/AuthScreen';
import { OnboardingStackNavigator } from './OnboardingStackNavigator.tsx';
import { MainTabNavigator } from './MainTabNavigator.tsx';
import { PracticeSessionScreen } from '../../screens/PracticeSessionScreen';
import { PracticeResultScreen } from '../../screens/PracticeResultScreen';
import { useAuth } from '../../context/AuthContext';
import { getRegisteredUsers, migrateOnboardingFlags } from '../../storage/registeredUsers';
import type { RootStackParamList } from './types';

const RootStack = createNativeStackNavigator<RootStackParamList>();

const LAST_USER_KEY = '@app/last_logged_in_email';

export function RootNavigator() {
  const { updateAuth } = useAuth();
  const [initialRoute, setInitialRoute] = useState<keyof RootStackParamList | null>(null);

  useEffect(() => {
    async function restoreSession() {
      try {
        // Fix any corrupted onboardingComplete flags from the old upsert bug
        await migrateOnboardingFlags();

        const lastEmail = await AsyncStorage.getItem(LAST_USER_KEY);
        if (lastEmail) {
          const users = await getRegisteredUsers();
          const user = users.find(
            (u) => u.email.trim().toLowerCase() === lastEmail.trim().toLowerCase(),
          );
          if (user?.onboardingComplete) {
            const isRTL = user.nativeLanguage === 'fa';
            I18nManager.allowRTL(isRTL);
            I18nManager.forceRTL(isRTL);
            updateAuth({
              username: user.username,
              email: user.email,
              nativeLanguage: user.nativeLanguage,
              purpose: user.purpose,
              dailyGoal: user.dailyGoal,
              age: user.age,
              ageBracket: user.ageBracket ?? '',
              learningLevel: user.learningLevel ?? '',
              gender: user.gender,
              last_visited_lesson_id: user.last_visited_lesson_id ?? '',
              last_visited_section_index: user.last_visited_section_index ?? 0,
            });
            setInitialRoute('MainTabNavigator');
            return;
          }
        }
      } catch {
        // fall through to Auth
      }
      setInitialRoute('Auth');
    }
    void restoreSession();
  }, [updateAuth]);

  if (initialRoute === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f7f4ec' }}>
        <ActivityIndicator size="large" color="#0f2744" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <RootStack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="Auth" component={AuthScreen} />
        <RootStack.Screen name="OnboardingStack" component={OnboardingStackNavigator} />
        <RootStack.Screen name="MainTabNavigator" component={MainTabNavigator} />
        <RootStack.Screen
          name="PracticeSession"
          component={PracticeSessionScreen}
          options={{ presentation: 'fullScreenModal', animation: 'slide_from_bottom' }}
        />
        <RootStack.Screen
          name="PracticeResult"
          component={PracticeResultScreen}
          options={{ presentation: 'fullScreenModal', animation: 'fade' }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

