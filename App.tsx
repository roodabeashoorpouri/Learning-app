import './global.css';
import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider } from './src/context/AuthContext';
import { RootNavigator } from './src/components/navigation/RootNavigator.tsx';

// Only enable screens on native platforms
if (Platform.OS !== 'web') {
  const { enableScreens } = require('react-native-screens');
  enableScreens();
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <RootNavigator />
        </AuthProvider>
        <StatusBar style='auto' />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
