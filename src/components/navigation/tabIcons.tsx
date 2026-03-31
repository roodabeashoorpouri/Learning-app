import React from 'react';
import { Text, View } from 'react-native';

type TabIconProps = { color: string; size: number; focused: boolean };

export function MainTabsStudentBookIcon({ color, size }: TabIconProps) {
  const s = Math.round(size * 0.7);
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <View
        style={{
          width: s,
          height: s * 1.2,
          borderWidth: 1.5,
          borderColor: color,
          borderRadius: 3,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View style={{ width: s * 0.5, height: 1.5, backgroundColor: color, marginBottom: 3 }} />
        <View style={{ width: s * 0.5, height: 1.5, backgroundColor: color, marginBottom: 3 }} />
        <View style={{ width: s * 0.35, height: 1.5, backgroundColor: color }} />
      </View>
    </View>
  );
}

export function MainTabsWorkbookIcon({ color, size }: TabIconProps) {
  const s = Math.round(size * 0.55);
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <View
        style={{
          width: s,
          height: s,
          borderWidth: 1.5,
          borderColor: color,
          borderRadius: s / 2,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ color, fontSize: Math.round(s * 0.55), fontWeight: '800' }}>A</Text>
      </View>
    </View>
  );
}

export function MainTabsProfileIcon({ color, size }: TabIconProps) {
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

