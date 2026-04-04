import React from 'react';
import { Alert, Platform, Pressable, StyleSheet, Text } from 'react-native';

const INK_MUTED = '#2d4a66';

type Props = {
  onClose: () => void;
};

export function CloseButton({ onClose }: Props) {
  const handlePress = () => {
    if (Platform.OS === 'web') {
      if (window.confirm('Leave practice?\nYour progress in this section will not be saved.')) {
        onClose();
      }
      return;
    }
    Alert.alert(
      'Leave practice?',
      'Your progress in this section will not be saved.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Leave', style: 'destructive', onPress: onClose },
      ],
    );
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      hitSlop={12}
    >
      <Text style={styles.x}>✕</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(15,39,68,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    backgroundColor: 'rgba(15,39,68,0.18)',
  },
  x: {
    fontSize: 16,
    fontWeight: '700',
    color: INK_MUTED,
  },
});
