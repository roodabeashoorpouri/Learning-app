import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  normalizeStoredEmail,
  normalizeStoredUsername,
  getRegisteredUsers,
  registerUser,
  findUserByEmailOrUsername,
  isUsernameTaken,
  isEmailTaken,
  updateStoredUser,
  saveLessonProgress,
  migrateOnboardingFlags,
} from '../../src/storage/registeredUsers';

const STORAGE_KEY = '@app/registered_users_v1';

beforeEach(async () => {
  await AsyncStorage.clear();
  jest.clearAllMocks();
});

// ─── Normalization helpers ───

describe('normalizeStoredEmail()', () => {
  it('trims and lowercases email', () => {
    expect(normalizeStoredEmail('  Test@Email.COM  ')).toBe('test@email.com');
  });

  it('handles already normalized email', () => {
    expect(normalizeStoredEmail('test@email.com')).toBe('test@email.com');
  });
});

describe('normalizeStoredUsername()', () => {
  it('trims and lowercases username', () => {
    expect(normalizeStoredUsername('  JohnDoe  ')).toBe('johndoe');
  });
});

// ─── Core CRUD ───

describe('getRegisteredUsers()', () => {
  it('returns empty array when no users stored', async () => {
    const users = await getRegisteredUsers();
    expect(users).toEqual([]);
  });

  it('returns stored users', async () => {
    const stored = [
      {
        username: 'test',
        email: 'test@test.com',
        nativeLanguage: 'en',
        purpose: '',
        dailyGoal: 10,
        age: 0,
        ageBracket: '',
        learningLevel: '',
        gender: '',
        onboardingComplete: false,
      },
    ];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    const users = await getRegisteredUsers();
    expect(users).toHaveLength(1);
    expect(users[0].username).toBe('test');
  });

  it('returns empty array for corrupted JSON', async () => {
    await AsyncStorage.setItem(STORAGE_KEY, 'not json');
    const users = await getRegisteredUsers();
    expect(users).toEqual([]);
  });

  it('returns empty array if stored value is not an array', async () => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ not: 'array' }));
    const users = await getRegisteredUsers();
    expect(users).toEqual([]);
  });
});

describe('registerUser()', () => {
  it('adds a new user to storage', async () => {
    await registerUser({ username: 'sara', email: 'sara@test.com', nativeLanguage: 'en' });
    const users = await getRegisteredUsers();
    expect(users).toHaveLength(1);
    expect(users[0].username).toBe('sara');
    expect(users[0].email).toBe('sara@test.com');
    expect(users[0].nativeLanguage).toBe('en');
    expect(users[0].onboardingComplete).toBe(false);
    expect(users[0].dailyGoal).toBe(10);
  });

  it('throws if email already registered', async () => {
    await registerUser({ username: 'sara', email: 'sara@test.com', nativeLanguage: 'en' });
    await expect(
      registerUser({ username: 'sara2', email: 'SARA@test.com', nativeLanguage: 'fa' })
    ).rejects.toThrow('EMAIL_ALREADY_REGISTERED');
  });

  it('allows different emails', async () => {
    await registerUser({ username: 'user1', email: 'a@test.com', nativeLanguage: 'en' });
    await registerUser({ username: 'user2', email: 'b@test.com', nativeLanguage: 'fa' });
    const users = await getRegisteredUsers();
    expect(users).toHaveLength(2);
  });
});

// ─── Lookup functions ───

describe('findUserByEmailOrUsername()', () => {
  beforeEach(async () => {
    await registerUser({ username: 'john', email: 'john@test.com', nativeLanguage: 'en' });
  });

  it('finds user by email (case-insensitive)', async () => {
    const user = await findUserByEmailOrUsername('JOHN@test.com');
    expect(user).not.toBeNull();
    expect(user!.username).toBe('john');
  });

  it('finds user by username (case-insensitive)', async () => {
    const user = await findUserByEmailOrUsername('JOHN');
    expect(user).not.toBeNull();
    expect(user!.email).toBe('john@test.com');
  });

  it('returns null for non-existent user', async () => {
    const user = await findUserByEmailOrUsername('nobody@test.com');
    expect(user).toBeNull();
  });

  it('returns null for empty string', async () => {
    const user = await findUserByEmailOrUsername('');
    expect(user).toBeNull();
  });

  it('returns null for whitespace-only string', async () => {
    const user = await findUserByEmailOrUsername('   ');
    expect(user).toBeNull();
  });
});

describe('isUsernameTaken()', () => {
  beforeEach(async () => {
    await registerUser({ username: 'sara', email: 'sara@test.com', nativeLanguage: 'en' });
  });

  it('returns true for taken username (case-insensitive)', async () => {
    expect(await isUsernameTaken('SARA')).toBe(true);
  });

  it('returns false for available username', async () => {
    expect(await isUsernameTaken('newuser')).toBe(false);
  });

  it('returns false for empty string', async () => {
    expect(await isUsernameTaken('')).toBe(false);
  });
});

describe('isEmailTaken()', () => {
  beforeEach(async () => {
    await registerUser({ username: 'sara', email: 'sara@test.com', nativeLanguage: 'en' });
  });

  it('returns true for taken email (case-insensitive)', async () => {
    expect(await isEmailTaken('SARA@test.com')).toBe(true);
  });

  it('returns false for available email', async () => {
    expect(await isEmailTaken('new@test.com')).toBe(false);
  });

  it('returns false for empty string', async () => {
    expect(await isEmailTaken('')).toBe(false);
  });
});

// ─── Update functions ───

describe('updateStoredUser()', () => {
  beforeEach(async () => {
    await registerUser({ username: 'john', email: 'john@test.com', nativeLanguage: 'en' });
  });

  it('updates user fields by email', async () => {
    await updateStoredUser('john@test.com', { purpose: 'travel', dailyGoal: 20 });
    const users = await getRegisteredUsers();
    expect(users[0].purpose).toBe('travel');
    expect(users[0].dailyGoal).toBe(20);
  });

  it('is case-insensitive on email', async () => {
    await updateStoredUser('JOHN@TEST.COM', { purpose: 'business' });
    const users = await getRegisteredUsers();
    expect(users[0].purpose).toBe('business');
  });

  it('does nothing for non-existent email', async () => {
    await updateStoredUser('nobody@test.com', { purpose: 'test' });
    const users = await getRegisteredUsers();
    expect(users[0].purpose).toBe('');
  });
});

describe('saveLessonProgress()', () => {
  beforeEach(async () => {
    await registerUser({ username: 'john', email: 'john@test.com', nativeLanguage: 'en' });
  });

  it('saves lesson ID and section index', async () => {
    await saveLessonProgress('john@test.com', 'lesson_1', 2);
    const users = await getRegisteredUsers();
    expect(users[0].last_visited_lesson_id).toBe('lesson_1');
    expect(users[0].last_visited_section_index).toBe(2);
  });

  it('overwrites previous progress', async () => {
    await saveLessonProgress('john@test.com', 'lesson_1', 0);
    await saveLessonProgress('john@test.com', 'lesson_2', 3);
    const users = await getRegisteredUsers();
    expect(users[0].last_visited_lesson_id).toBe('lesson_2');
    expect(users[0].last_visited_section_index).toBe(3);
  });
});

// ─── Migration ───

describe('migrateOnboardingFlags()', () => {
  it('marks users as onboarding-complete if profile data exists', async () => {
    await registerUser({ username: 'john', email: 'john@test.com', nativeLanguage: 'en' });
    await updateStoredUser('john@test.com', {
      ageBracket: '25-45',
      learningLevel: 'beginner',
      gender: 'male',
      purpose: 'hobby',
    });

    await migrateOnboardingFlags();

    const users = await getRegisteredUsers();
    expect(users[0].onboardingComplete).toBe(true);
  });

  it('does not mark incomplete profiles as complete', async () => {
    await registerUser({ username: 'john', email: 'john@test.com', nativeLanguage: 'en' });
    // purpose is empty, so onboarding should stay false

    await migrateOnboardingFlags();

    const users = await getRegisteredUsers();
    expect(users[0].onboardingComplete).toBe(false);
  });
});
