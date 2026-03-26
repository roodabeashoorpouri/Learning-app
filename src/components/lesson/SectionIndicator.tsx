import React from 'react';
import { StyleSheet, View } from 'react-native';

type Props = {
  currentSection: number;
  totalSections: number;
};

export function SectionIndicator({ currentSection, totalSections }: Props) {
  return (
    <View style={styles.container}>
      {Array.from({ length: totalSections }, (_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            index === currentSection && styles.activeDot,
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(15,39,68,0.3)',
  },
  activeDot: {
    backgroundColor: '#0f2744',
    width: 24,
    borderRadius: 4,
  },
});