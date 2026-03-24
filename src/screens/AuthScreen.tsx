import React, { useEffect, useMemo, useState } from 'react';
import {
  I18nManager,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useAuth, type NativeLanguage } from '../context/AuthContext';
import type { RootStackParamList } from '../components/navigation/types';
import {
  findUserByEmailOrUsername,
  isUsernameTaken,
  registerUser,
  type StoredUser,
} from '../storage/registeredUsers';

/** Workbook palette — match LessonWorkbookScreen */
const PAPER = '#f7f4ec';
const PAPER_DEEP = '#efe8dc';
const INK = '#0f2744';
const INK_MUTED = '#2d4a66';
const ACCENT_LINE = '#1a3d5c';

type EntryMode = 'landing' | 'signup' | 'signin';

/** Requires @, domain, and .com TLD (case-insensitive). */
const EMAIL_COM_REGEX = /^[^\s@]+@[^\s@]+\.com$/i;

function isValidSignupEmail(email: string): boolean {
  return EMAIL_COM_REGEX.test(email.trim());
}

function storedUserToAuthPatch(user: StoredUser) {
  return {
    username: user.username,
    email: user.email,
    nativeLanguage: user.nativeLanguage,
    purpose: user.purpose,
    dailyGoal: user.dailyGoal,
    age: user.age,
    ageBracket: user.ageBracket ?? '',
    learningLevel: user.learningLevel ?? '',
    gender: user.gender,
  };
}

export function AuthScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Auth'>>();
  const { updateAuth } = useAuth();

  const [mode, setMode] = useState<EntryMode>('landing');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [signInIdentifier, setSignInIdentifier] = useState('');
  const [nativeLanguage, setNativeLanguage] = useState<NativeLanguage>('en');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const isRTL = nativeLanguage === 'fa';
    I18nManager.allowRTL(isRTL);
    I18nManager.forceRTL(isRTL);
  }, [nativeLanguage]);

  const canSignUp = useMemo(
    () => username.trim().length > 0 && email.trim().length > 0 && !busy,
    [busy, email, username],
  );

  const canSignIn = useMemo(() => signInIdentifier.trim().length > 0 && !busy, [busy, signInIdentifier]);

  const resetFormErrors = () => setErrorMessage(null);

  const goLanding = () => {
    resetFormErrors();
    setMode('landing');
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {mode === 'landing' && (
          <>
            <Text style={styles.title}>Welcome</Text>
            <Text style={styles.subtitle}>Choose how you’d like to enter class.</Text>

            <Pressable
              style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
              onPress={() => {
                resetFormErrors();
                setMode('signup');
              }}
            >
              <Text style={styles.primaryButtonText}>Join the Class</Text>
              <Text style={styles.primaryHint}>New here — create your spot</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}
              onPress={() => {
                resetFormErrors();
                setMode('signin');
              }}
            >
              <Text style={styles.secondaryButtonText}>Continue Learning</Text>
              <Text style={styles.secondaryHint}>Sign in with email or username</Text>
            </Pressable>
          </>
        )}

        {mode === 'signup' && (
          <>
            <Pressable onPress={goLanding} style={styles.backLink}>
              <Text style={styles.backLinkText}>← Back</Text>
            </Pressable>
            <Text style={styles.title}>Join the Class</Text>
            <Text style={styles.subtitle}>Tell us who you are. We’ll save this on your device.</Text>

            {errorMessage ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            ) : null}

            <Text style={styles.fieldLabel}>Email</Text>
            <TextInput
              value={email}
              onChangeText={(t) => {
                resetFormErrors();
                setEmail(t);
              }}
              placeholder="you@example.com"
              autoCapitalize="none"
              keyboardType="email-address"
              style={styles.input}
              placeholderTextColor={INK_MUTED}
              editable={!busy}
            />
            <Text style={styles.fieldHint}>Use a valid address with @ and a .com domain.</Text>

            <Text style={styles.fieldLabel}>Username</Text>
            <TextInput
              value={username}
              onChangeText={(t) => {
                resetFormErrors();
                setUsername(t);
              }}
              placeholder="Pick a unique name"
              autoCapitalize="none"
              style={styles.input}
              placeholderTextColor={INK_MUTED}
              editable={!busy}
            />

            <Text style={styles.fieldLabel}>Native language</Text>
            <View style={styles.langRow}>
              <Pressable
                onPress={() => setNativeLanguage('en')}
                style={[styles.langChip, nativeLanguage === 'en' && styles.langChipActive]}
              >
                <Text style={[styles.langChipText, nativeLanguage === 'en' && styles.langChipTextActive]}>EN</Text>
              </Pressable>
              <Pressable
                onPress={() => setNativeLanguage('fa')}
                style={[styles.langChip, nativeLanguage === 'fa' && styles.langChipActive]}
              >
                <Text style={[styles.langChipText, nativeLanguage === 'fa' && styles.langChipTextActive]}>Persian</Text>
              </Pressable>
            </View>

            <Pressable
              style={[styles.submitPrimary, !canSignUp && styles.submitDisabled]}
              disabled={!canSignUp}
              onPress={async () => {
                if (!canSignUp) return;
                resetFormErrors();
                if (!isValidSignupEmail(email)) {
                  setErrorMessage('Enter a valid email (needs @ and a .com address).');
                  return;
                }
                setBusy(true);
                try {
                  const taken = await isUsernameTaken(username);
                  if (taken) {
                    setErrorMessage('John says: This name is already taken!');
                    return;
                  }
                  const trimmedUser = username.trim();
                  const trimmedEmail = email.trim();
                  await registerUser({
                    username: trimmedUser,
                    email: trimmedEmail,
                    nativeLanguage,
                  });
                  updateAuth({
                    username: trimmedUser,
                    email: trimmedEmail,
                    nativeLanguage,
                    purpose: '',
                    dailyGoal: 10,
                    age: 0,
                    ageBracket: '',
                    learningLevel: '',
                    gender: '',
                  });
                  navigation.navigate('OnboardingStack');
                } finally {
                  setBusy(false);
                }
              }}
            >
              <Text style={styles.submitPrimaryText}>{busy ? 'Saving…' : 'Start onboarding'}</Text>
            </Pressable>
          </>
        )}

        {mode === 'signin' && (
          <>
            <Pressable onPress={goLanding} style={styles.backLink}>
              <Text style={styles.backLinkText}>← Back</Text>
            </Pressable>
            <Text style={styles.title}>Continue Learning</Text>
            <Text style={styles.subtitle}>Type the email or username you used when you joined.</Text>

            {errorMessage ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            ) : null}

            <Text style={styles.fieldLabel}>Email or username</Text>
            <TextInput
              value={signInIdentifier}
              onChangeText={(t) => {
                resetFormErrors();
                setSignInIdentifier(t);
              }}
              placeholder="Email or username"
              autoCapitalize="none"
              style={styles.input}
              placeholderTextColor={INK_MUTED}
              editable={!busy}
            />

            <Pressable
              style={[styles.submitPrimary, !canSignIn && styles.submitDisabled]}
              disabled={!canSignIn}
              onPress={async () => {
                if (!canSignIn) return;
                resetFormErrors();
                setBusy(true);
                try {
                  const user = await findUserByEmailOrUsername(signInIdentifier);
                  if (!user) {
                    setErrorMessage('No account matches that email or username on this device.');
                    return;
                  }
                  updateAuth(storedUserToAuthPatch(user));
                  const isRTL = user.nativeLanguage === 'fa';
                  I18nManager.allowRTL(isRTL);
                  I18nManager.forceRTL(isRTL);
                  if (user.onboardingComplete) {
                    navigation.navigate('MainTabNavigator');
                  } else {
                    navigation.navigate('OnboardingStack');
                  }
                } finally {
                  setBusy(false);
                }
              }}
            >
              <Text style={styles.submitPrimaryText}>{busy ? 'Checking…' : 'Enter class'}</Text>
            </Pressable>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: PAPER,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    paddingTop: Platform.select({ ios: 56, default: 40 }),
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: INK,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: INK_MUTED,
    marginBottom: 8,
    lineHeight: 22,
  },
  errorBox: {
    backgroundColor: PAPER_DEEP,
    borderWidth: 1,
    borderColor: ACCENT_LINE,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  errorText: {
    color: INK,
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 22,
  },
  primaryButton: {
    backgroundColor: INK,
    borderRadius: 14,
    paddingVertical: 18,
    paddingHorizontal: 16,
    marginTop: 8,
  },
  primaryHint: {
    marginTop: 6,
    fontSize: 13,
    color: 'rgba(247, 244, 236, 0.85)',
  },
  primaryButtonText: {
    color: PAPER,
    fontSize: 18,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: PAPER_DEEP,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: ACCENT_LINE,
    paddingVertical: 18,
    paddingHorizontal: 16,
  },
  secondaryHint: {
    marginTop: 6,
    fontSize: 13,
    color: INK_MUTED,
  },
  secondaryButtonText: {
    color: INK,
    fontSize: 18,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.92,
  },
  backLink: {
    alignSelf: 'flex-start',
    marginBottom: 4,
    paddingVertical: 4,
  },
  backLinkText: {
    color: ACCENT_LINE,
    fontSize: 16,
    fontWeight: '600',
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: INK,
    marginTop: 6,
  },
  fieldHint: {
    fontSize: 12,
    color: INK_MUTED,
    marginTop: -4,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: ACCENT_LINE,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: INK,
    backgroundColor: '#fdfcfa',
  },
  langRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
    marginBottom: 8,
  },
  langChip: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: ACCENT_LINE,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#fdfcfa',
  },
  langChipActive: {
    backgroundColor: INK,
  },
  langChipText: {
    fontSize: 16,
    fontWeight: '700',
    color: INK,
  },
  langChipTextActive: {
    color: PAPER,
  },
  submitPrimary: {
    marginTop: 16,
    backgroundColor: INK,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitDisabled: {
    opacity: 0.45,
  },
  submitPrimaryText: {
    color: PAPER,
    fontSize: 17,
    fontWeight: '700',
  },
});
