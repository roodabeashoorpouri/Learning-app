import React, { useState } from 'react';
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useAuth } from '../context/AuthContext';
import { removeAppState } from '../lib/api';
import type { RootStackParamList } from '../components/navigation/types';

const PAPER = '#f7f4ec';
const INK = '#0f2744';
const INK_MUTED = '#2d4a66';
const ACCENT_LINE = '#1a3d5c';
const DANGER = '#b91c1c';

function formatLearningLevel(level: string): string {
  if (!level) return '-';
  return level.charAt(0).toUpperCase() + level.slice(1);
}

export function ProfileScreen() {
  const { username, email, nativeLanguage, purpose, dailyGoal, ageBracket, learningLevel, gender, resetAuth } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [busy, setBusy] = useState(false);

  const handleSignOut = async () => {
    setBusy(true);
    try {
      await removeAppState('last_logged_in_user_id');
      resetAuth();
      navigation.reset({ index: 0, routes: [{ name: 'Auth' }] });
    } finally {
      setBusy(false);
    }
  };

  const confirmSignOut = () => {
    if (Platform.OS === 'web') {
      handleSignOut();
      return;
    }
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: handleSignOut },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.title}>Profile</Text>

      <View style={styles.card}>
        <ProfileRow label="Username" value={username} />
        <ProfileRow label="Email" value={email} />
        <ProfileRow label="Native Language" value={nativeLanguage === 'fa' ? 'Persian' : 'English'} />
        <ProfileRow label="Purpose" value={purpose} />
        <ProfileRow label="Daily Goal" value={String(dailyGoal)} />
        <ProfileRow label="Level" value={formatLearningLevel(learningLevel)} />
        <ProfileRow label="Age" value={ageBracket} />
        <ProfileRow label="Gender" value={gender ? gender.charAt(0).toUpperCase() + gender.slice(1) : '-'} />
      </View>

      <Pressable
        style={({ pressed }) => [styles.signOutButton, pressed && styles.pressed]}
        onPress={confirmSignOut}
        disabled={busy}
      >
        <Text style={styles.signOutText}>{busy ? 'Signing out...' : 'Sign Out'}</Text>
      </Pressable>
    </ScrollView>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value || '-'}</Text>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: PAPER },
  scrollContent: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 26, fontWeight: '800', color: INK, marginBottom: 14 },
  card: {
    borderWidth: 2,
    borderColor: ACCENT_LINE,
    borderRadius: 14,
    padding: 14,
    backgroundColor: '#fffefb',
    gap: 10,
  },
  rowLabel: { fontSize: 13, fontWeight: '600', color: INK_MUTED },
  rowValue: { fontSize: 16, fontWeight: '500', color: INK },
  signOutButton: {
    marginTop: 24,
    backgroundColor: DANGER,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  signOutText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.85,
  },
});
