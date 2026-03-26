import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

const GREEN = '#58CC02';
const GREEN_DARK = '#4CAD02';
const DISABLED = '#d8d2c8';
const DISABLED_TEXT = '#9e9589';

type Props = {
  disabled: boolean;
  label: string;
  onPress: () => void;
};

export function CheckButton({ disabled, label, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        disabled && styles.buttonDisabled,
        pressed && !disabled && styles.buttonPressed,
      ]}
    >
      <Text style={[styles.text, disabled && styles.textDisabled]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: GREEN,
    alignItems: 'center',
    shadowColor: GREEN_DARK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 0,
    elevation: 4,
  },
  buttonDisabled: {
    backgroundColor: DISABLED,
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonPressed: {
    backgroundColor: GREEN_DARK,
    transform: [{ translateY: 2 }],
    shadowOffset: { width: 0, height: 2 },
  },
  text: {
    fontSize: 17,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  textDisabled: {
    color: DISABLED_TEXT,
  },
});
