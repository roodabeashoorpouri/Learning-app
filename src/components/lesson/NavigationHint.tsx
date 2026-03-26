import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { NativeLanguage } from '../../context/AuthContext';

type Props = {
  nativeLanguage: NativeLanguage;
};

export function NavigationHint({ nativeLanguage }: Props) {
  const [visible, setVisible] = useState(true);
  const isPersian = nativeLanguage === 'fa';

  useEffect(() => {
    // Hide after 4 seconds
    const timer = setTimeout(() => {
      setVisible(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <View style={styles.container}>
      <Text style={[styles.hintText, isPersian && styles.rtlText]}>
        {isPersian 
          ? '← برای دیدن بخش‌های مختلف درس، به چپ و راست بکشید →'
          : '← Swipe left and right to explore lesson sections →'
        }
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(15,39,68,0.9)',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    zIndex: 1000,
  },
  hintText: {
    fontSize: 13,
    color: '#f7f4ec',
    textAlign: 'center',
    fontWeight: '600',
  },
  rtlText: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});