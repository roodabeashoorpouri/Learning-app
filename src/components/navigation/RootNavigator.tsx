import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { I18nManager } from 'react-native';

import { AuthScreen } from '../../screens/AuthScreen';
import { OnboardingStackNavigator } from './OnboardingStackNavigator.tsx';
import { MainTabNavigator } from './MainTabNavigator.tsx';
import { PracticeSessionScreen } from '../../screens/PracticeSessionScreen';
import { PracticeResultScreen } from '../../screens/PracticeResultScreen';
import { useAuth } from '../../context/AuthContext';
import { getAppState, findUserById, getBookmark, migrateFromAsyncStorage } from '../../lib/api';
import { userRowToAuth } from '../../lib/authHelpers';
import type { RootStackParamList } from './types';

const RootStack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { updateAuth } = useAuth();
  const [initialRoute, setInitialRoute] = useState<keyof RootStackParamList | null>(null);

  useEffect(() => {
    async function restoreSession() {
      try {
        // Migrate legacy AsyncStorage data on first launch
        await migrateFromAsyncStorage();

        const lastUserId = await getAppState('last_logged_in_user_id');
        if (lastUserId) {
          const user = await findUserById(Number(lastUserId));
          if (user?.onboarding_complete) {
            const isRTL = user.native_language === 'fa';
            I18nManager.allowRTL(isRTL);
            I18nManager.forceRTL(isRTL);

            const bookmark = await getBookmark(user.id);
            updateAuth(userRowToAuth(user, bookmark));
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
