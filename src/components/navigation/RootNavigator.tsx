import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Root-level navigation: Auth -> Onboarding -> Main tabs.
import { AuthScreen } from '../../screens/AuthScreen';
import { OnboardingStackNavigator } from './OnboardingStackNavigator.tsx';
import { MainTabNavigator } from './MainTabNavigator.tsx';
import type { RootStackParamList } from './types';

const RootStack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <NavigationContainer>
      <RootStack.Navigator initialRouteName="Auth" screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="Auth" component={AuthScreen} />
        <RootStack.Screen name="OnboardingStack" component={OnboardingStackNavigator} />
        <RootStack.Screen name="MainTabNavigator" component={MainTabNavigator} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

