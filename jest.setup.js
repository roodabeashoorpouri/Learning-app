// Mock expo-speech
jest.mock('expo-speech', () => ({
  speak: jest.fn(),
  stop: jest.fn(),
  getAvailableVoicesAsync: jest.fn().mockResolvedValue([]),
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => {
  const store = {};
  return {
    __esModule: true,
    default: {
      getItem: jest.fn((key) => Promise.resolve(store[key] ?? null)),
      setItem: jest.fn((key, value) => {
        store[key] = value;
        return Promise.resolve();
      }),
      removeItem: jest.fn((key) => {
        delete store[key];
        return Promise.resolve();
      }),
      clear: jest.fn(() => {
        Object.keys(store).forEach((key) => delete store[key]);
        return Promise.resolve();
      }),
      getAllKeys: jest.fn(() => Promise.resolve(Object.keys(store))),
      _store: store,
    },
  };
});

// Mock nativewind
jest.mock('nativewind', () => ({
  styled: (component) => component,
}));
