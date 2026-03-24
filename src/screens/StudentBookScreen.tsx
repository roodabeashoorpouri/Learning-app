import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export function StudentBookScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Student Book</Text>
      <Text style={styles.body}>Your lessons will appear here.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  title: { fontSize: 26, fontWeight: '800', marginBottom: 8 },
  body: { color: '#444', textAlign: 'center' },
});

