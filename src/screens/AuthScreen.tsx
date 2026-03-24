import React, { useEffect, useMemo, useState } from 'react';
import { Button, I18nManager, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useAuth, type NativeLanguage } from '../context/AuthContext';
import type { RootStackParamList } from '../components/navigation/types';

export function AuthScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Auth'>>();
  const { updateAuth } = useAuth();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [nativeLanguage, setNativeLanguage] = useState<NativeLanguage>('en');

  useEffect(() => {
    // Ensure the whole app switches RTL immediately when Persian is selected.
    const isRTL = nativeLanguage === 'fa';
    I18nManager.allowRTL(isRTL);
    I18nManager.forceRTL(isRTL);
  }, [nativeLanguage]);

  const canContinue = useMemo(() => username.trim().length > 0 && email.trim().length > 0, [email, username]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
    >
      <Text style={styles.title}>Auth</Text>
      <Text style={styles.subtitle}>Welcome back to your Armenian learning journey.</Text>

      <TextInput
        value={username}
        onChangeText={setUsername}
        placeholder="Username"
        autoCapitalize="none"
        style={styles.input}
      />

      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />

      <View style={styles.section}>
        <Text style={styles.label}>Native language</Text>
        <View style={styles.langRow}>
          <View style={styles.langButton}>
            <Button title="EN" onPress={() => setNativeLanguage('en')} />
          </View>
          <View style={styles.langButton}>
            <Button title="Persian" onPress={() => setNativeLanguage('fa')} />
          </View>
        </View>
      </View>

      <View style={styles.buttonRow}>
        <Button
          title="Continue"
          disabled={!canContinue}
          onPress={() => {
            updateAuth({ username: username.trim(), email: email.trim(), nativeLanguage });
            navigation.navigate('OnboardingStack');
          }}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 12,
    justifyContent: 'center',
  },
  title: { fontSize: 28, fontWeight: '800', marginBottom: 6 },
  subtitle: { fontSize: 14, color: '#444', marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  section: { marginTop: 6 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  langRow: { flexDirection: 'row', gap: 12 },
  langButton: { flex: 1 },
  buttonRow: { marginTop: 10 },
});

