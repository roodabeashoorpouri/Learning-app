import React from 'react';
import { Text, Pressable } from 'react-native';
import { renderHook, act, render, fireEvent } from '@testing-library/react-native';
import { AuthProvider, useAuth } from '../../src/context/AuthContext';

function wrapper({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}

describe('useAuth', () => {
  it('throws if used outside AuthProvider', () => {
    // Suppress console.error for this test
    const spy = jest.spyOn(console, 'error').mockImplementation();
    expect(() => renderHook(() => useAuth())).toThrow(
      'useAuth must be used within an AuthProvider'
    );
    spy.mockRestore();
  });

  it('provides initial default state', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.username).toBe('');
    expect(result.current.email).toBe('');
    expect(result.current.nativeLanguage).toBe('en');
    expect(result.current.purpose).toBe('');
    expect(result.current.dailyGoal).toBe(10);
    expect(result.current.age).toBe(0);
    expect(result.current.ageBracket).toBe('');
    expect(result.current.learningLevel).toBe('');
    expect(result.current.gender).toBe('');
    expect(result.current.last_visited_lesson_id).toBe('');
    expect(result.current.last_visited_section_index).toBe(0);
  });

  it('updateAuth merges partial state', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => {
      result.current.updateAuth({ username: 'sara', email: 'sara@test.com' });
    });

    expect(result.current.username).toBe('sara');
    expect(result.current.email).toBe('sara@test.com');
    // Other fields unchanged
    expect(result.current.nativeLanguage).toBe('en');
    expect(result.current.dailyGoal).toBe(10);
  });

  it('updateAuth can be called multiple times', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => {
      result.current.updateAuth({ username: 'john' });
    });
    act(() => {
      result.current.updateAuth({ nativeLanguage: 'fa', dailyGoal: 20 });
    });

    expect(result.current.username).toBe('john');
    expect(result.current.nativeLanguage).toBe('fa');
    expect(result.current.dailyGoal).toBe(20);
  });

  it('resetAuth returns to initial state', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => {
      result.current.updateAuth({
        username: 'john',
        email: 'john@test.com',
        nativeLanguage: 'fa',
        purpose: 'travel',
        dailyGoal: 30,
      });
    });

    act(() => {
      result.current.resetAuth();
    });

    expect(result.current.username).toBe('');
    expect(result.current.email).toBe('');
    expect(result.current.nativeLanguage).toBe('en');
    expect(result.current.purpose).toBe('');
    expect(result.current.dailyGoal).toBe(10);
  });

  it('updateAuth handles bookmark fields', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => {
      result.current.updateAuth({
        last_visited_lesson_id: 'lesson_1',
        last_visited_section_index: 2,
      });
    });

    expect(result.current.last_visited_lesson_id).toBe('lesson_1');
    expect(result.current.last_visited_section_index).toBe(2);
  });
});

describe('AuthProvider — renders children', () => {
  it('provides context to children components', () => {
    function TestChild() {
      const { username, updateAuth } = useAuth();
      return (
        <>
          <Text testID="username">{username || 'none'}</Text>
          <Pressable testID="setBtn" onPress={() => updateAuth({ username: 'test' })} />
        </>
      );
    }

    const { getByTestId } = render(
      <AuthProvider>
        <TestChild />
      </AuthProvider>
    );

    expect(getByTestId('username').props.children).toBe('none');

    fireEvent.press(getByTestId('setBtn'));
    expect(getByTestId('username').props.children).toBe('test');
  });
});
