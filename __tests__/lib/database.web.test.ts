import {
  webCreateUser,
  webFindUserByEmailOrUsername,
  webFindUserById,
  webIsUsernameTaken,
  webIsEmailTaken,
  webUpdateUser,
  webGetAppState,
  webSetAppState,
  webGetBookmark,
  webUpdateBookmark,
} from '../../src/lib/database.web';

// AsyncStorage is mocked in jest.setup.js

beforeEach(async () => {
  const AsyncStorage = require('@react-native-async-storage/async-storage').default;
  await AsyncStorage.clear();
});

describe('web database — users', () => {
  it('creates a user and returns it', async () => {
    const user = await webCreateUser('alice', 'alice@test.com', 'hash123');

    expect(user.id).toBe(1);
    expect(user.username).toBe('alice');
    expect(user.email).toBe('alice@test.com');
    expect(user.password_hash).toBe('hash123');
    expect(user.native_language).toBe('en');
    expect(user.onboarding_complete).toBe(0);
  });

  it('creates users with incrementing IDs', async () => {
    const user1 = await webCreateUser('alice', 'alice@test.com', 'hash1');
    const user2 = await webCreateUser('bob', 'bob@test.com', 'hash2');

    expect(user2.id).toBe(user1.id + 1);
  });

  it('finds user by email (case-insensitive)', async () => {
    await webCreateUser('alice', 'alice@test.com', 'hash');

    const found = await webFindUserByEmailOrUsername('Alice@Test.com');
    expect(found).not.toBeNull();
    expect(found!.username).toBe('alice');
  });

  it('finds user by username (case-insensitive)', async () => {
    await webCreateUser('alice', 'alice@test.com', 'hash');

    const found = await webFindUserByEmailOrUsername('Alice');
    expect(found).not.toBeNull();
    expect(found!.email).toBe('alice@test.com');
  });

  it('returns null for unknown identifier', async () => {
    const found = await webFindUserByEmailOrUsername('nobody');
    expect(found).toBeNull();
  });

  it('finds user by ID', async () => {
    const user = await webCreateUser('alice', 'alice@test.com', 'hash');
    const found = await webFindUserById(user.id);

    expect(found).not.toBeNull();
    expect(found!.username).toBe('alice');
  });

  it('returns null for unknown ID', async () => {
    const found = await webFindUserById(999);
    expect(found).toBeNull();
  });

  it('checks username taken', async () => {
    await webCreateUser('alice', 'alice@test.com', 'hash');

    expect(await webIsUsernameTaken('alice')).toBe(true);
    expect(await webIsUsernameTaken('ALICE')).toBe(true);
    expect(await webIsUsernameTaken('bob')).toBe(false);
  });

  it('checks email taken', async () => {
    await webCreateUser('alice', 'alice@test.com', 'hash');

    expect(await webIsEmailTaken('alice@test.com')).toBe(true);
    expect(await webIsEmailTaken('ALICE@TEST.COM')).toBe(true);
    expect(await webIsEmailTaken('bob@test.com')).toBe(false);
  });

  it('updates user fields', async () => {
    const user = await webCreateUser('alice', 'alice@test.com', 'hash');
    await webUpdateUser(user.id, { native_language: 'fa', onboarding_complete: 1 });

    const updated = await webFindUserById(user.id);
    expect(updated!.native_language).toBe('fa');
    expect(updated!.onboarding_complete).toBe(1);
  });
});

describe('web database — app state', () => {
  it('sets and gets app state', async () => {
    await webSetAppState('last_user', '42');
    const val = await webGetAppState('last_user');
    expect(val).toBe('42');
  });

  it('returns null for missing key', async () => {
    const val = await webGetAppState('nonexistent');
    expect(val).toBeNull();
  });

  it('overwrites existing value', async () => {
    await webSetAppState('key', 'a');
    await webSetAppState('key', 'b');
    const val = await webGetAppState('key');
    expect(val).toBe('b');
  });
});

describe('web database — bookmarks', () => {
  it('returns null when no bookmark exists', async () => {
    const bm = await webGetBookmark(1);
    expect(bm).toBeNull();
  });

  it('saves and retrieves a bookmark', async () => {
    await webUpdateBookmark(1, 'lesson-3', 2);
    const bm = await webGetBookmark(1);

    expect(bm).not.toBeNull();
    expect(bm!.last_lesson_id).toBe('lesson-3');
    expect(bm!.last_section_index).toBe(2);
  });

  it('updates existing bookmark', async () => {
    await webUpdateBookmark(1, 'lesson-1', 0);
    await webUpdateBookmark(1, 'lesson-5', 3);

    const bm = await webGetBookmark(1);
    expect(bm!.last_lesson_id).toBe('lesson-5');
    expect(bm!.last_section_index).toBe(3);
  });
});
