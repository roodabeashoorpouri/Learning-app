import React, { useMemo, useState } from 'react';
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

import { useAuth } from '../context/AuthContext';
import type { RootStackParamList } from '../components/navigation/types';
import {
  createUser,
  findUserByEmailOrUsername,
  isUsernameTaken,
  isEmailTaken,
  verifyPassword,
  getBookmark,
  setAppState,
} from '../lib/api';
import { userRowToAuth } from '../lib/authHelpers';

const PAPER = '#f7f4ec';
const PAPER_DEEP = '#efe8dc';
const INK = '#0f2744';
const INK_MUTED = '#2d4a66';
const ACCENT_LINE = '#1a3d5c';

type EntryMode = 'landing' | 'signup' | 'signin';

/** Requires @, domain, and .com TLD (case-insensitive). */
const EMAIL_COM_REGEX = /^[^\s@]+@[^\s@]+\.com$/i;

/** Username: alphanumeric + underscore, 3-20 chars. */
const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;

/** Password: at least 8 chars, at least one letter and one number. */
const PASSWORD_REGEX = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/;

function isValidSignupEmail(email: string): boolean {
  return EMAIL_COM_REGEX.test(email.trim());
}

function isValidUsername(username: string): boolean {
  return USERNAME_REGEX.test(username.trim());
}

function isStrongPassword(password: string): boolean {
  return PASSWORD_REGEX.test(password);
}

export function AuthScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Auth'>>();
  const { updateAuth } = useAuth();

  const [mode, setMode] = useState<EntryMode>('landing');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signInIdentifier, setSignInIdentifier] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const canSignUp = useMemo(
    () =>
      username.trim().length > 0 &&
      email.trim().length > 0 &&
      password.length >= 8 &&
      !busy,
    [busy, email, username, password],
  );

  const canSignIn = useMemo(
    () => signInIdentifier.trim().length > 0 && signInPassword.length > 0 && !busy,
    [busy, signInIdentifier, signInPassword],
  );

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
            <Text style={styles.subtitle}>Choose how you'd like to enter class.</Text>

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
            <Text style={styles.subtitle}>Create your account to start learning.</Text>

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
              placeholder="3-20 chars, letters/numbers/underscore"
              autoCapitalize="none"
              style={styles.input}
              placeholderTextColor={INK_MUTED}
              editable={!busy}
              maxLength={20}
            />

            <Text style={styles.fieldLabel}>Password</Text>
            <TextInput
              value={password}
              onChangeText={(t) => {
                resetFormErrors();
                setPassword(t);
              }}
              placeholder="At least 8 characters"
              secureTextEntry
              style={styles.input}
              placeholderTextColor={INK_MUTED}
              editable={!busy}
            />

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
                if (!isValidUsername(username)) {
                  setErrorMessage('Username must be 3-20 characters: letters, numbers, or underscore.');
                  return;
                }
                if (!isStrongPassword(password)) {
                  setErrorMessage('Password must be at least 8 characters with at least one letter and one number.');
                  return;
                }
                setBusy(true);
                try {
                  const taken = await isUsernameTaken(username);
                  if (taken) {
                    setErrorMessage('This username is already taken.');
                    return;
                  }
                  const emailUsed = await isEmailTaken(email);
                  if (emailUsed) {
                    setErrorMessage('An account with this email already exists. Try signing in instead.');
                    return;
                  }

                  const user = await createUser(username, email, password);
                  await setAppState('last_logged_in_user_id', String(user.id));
                  updateAuth(userRowToAuth(user));
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
            <Text style={styles.subtitle}>Sign in with your email or username.</Text>

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

            <Text style={styles.fieldLabel}>Password</Text>
            <TextInput
              value={signInPassword}
              onChangeText={(t) => {
                resetFormErrors();
                setSignInPassword(t);
              }}
              placeholder="Your password"
              secureTextEntry
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
                    setErrorMessage('No account matches that email or username.');
                    return;
                  }

                  // Allow migrated users (no password set) to sign in and set a password later
                  const isMigrated = user.password_hash === '__migrated_no_password__';
                  if (!isMigrated) {
                    const valid = await verifyPassword(user, signInPassword);
                    if (!valid) {
                      setErrorMessage('Incorrect password.');
                      return;
                    }
                  }

                  const bookmark = await getBookmark(user.id);
                  updateAuth(userRowToAuth(user, bookmark));
                  await setAppState('last_logged_in_user_id', String(user.id));

                  const isRTL = user.native_language === 'fa';
                  I18nManager.allowRTL(isRTL);
                  I18nManager.forceRTL(isRTL);

                  if (user.onboarding_complete) {
                    navigation.navigate('MainTabNavigator', {
                      resumeLessonId: bookmark?.last_lesson_id,
                      resumeSectionIndex: bookmark?.last_section_index,
                    });
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
