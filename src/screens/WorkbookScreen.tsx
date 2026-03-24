import React from 'react';
import { StyleSheet, View } from 'react-native';

import { LessonScreen } from './LessonScreen';

export function WorkbookScreen() {
  return (
    <View style={styles.container}>
      <LessonScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});

