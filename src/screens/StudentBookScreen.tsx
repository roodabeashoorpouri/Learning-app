import React from 'react';
import { StyleSheet, View } from 'react-native';

import { LessonWorkbookScreen } from './LessonWorkbookScreen';

export function StudentBookScreen() {
  return (
    <View style={styles.container}>
      <LessonWorkbookScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
