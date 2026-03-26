import React from 'react';
import { Text, View } from 'react-native';

export function MainTabsProfileIcon({
  color,
  size,
}: {
  color: string;
  size: number;
  focused: boolean;
}) {
  const fontSize = Math.max(10, Math.round(size * 0.45));
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: 1,
        borderColor: color,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ color, fontSize, fontWeight: '700' }}>P</Text>
    </View>
  );
}

