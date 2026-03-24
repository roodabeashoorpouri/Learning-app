import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useAuth } from '../context/AuthContext';

export function ProfileScreen() {
  const { username, email, nativeLanguage, purpose, dailyGoal, age, gender } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <View style={styles.card}>
        <Text style={styles.rowLabel}>Username</Text>
        <Text style={styles.rowValue}>{username || '-'}</Text>

        <Text style={styles.rowLabel}>Email</Text>
        <Text style={styles.rowValue}>{email || '-'}</Text>

        <Text style={styles.rowLabel}>Native Language</Text>
        <Text style={styles.rowValue}>{nativeLanguage}</Text>

        <Text style={styles.rowLabel}>Purpose</Text>
        <Text style={styles.rowValue}>{purpose || '-'}</Text>

        <Text style={styles.rowLabel}>Daily Goal</Text>
        <Text style={styles.rowValue}>{dailyGoal}</Text>

        <Text style={styles.rowLabel}>Age</Text>
        <Text style={styles.rowValue}>{age || '-'}</Text>

        <Text style={styles.rowLabel}>Gender</Text>
        <Text style={styles.rowValue}>{gender || '-'}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 26, fontWeight: '800', marginBottom: 14 },
  card: {
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 14,
    padding: 14,
    backgroundColor: '#fff',
    gap: 10,
  },
  rowLabel: { fontSize: 13, fontWeight: '600', color: '#666' },
  rowValue: { fontSize: 16, fontWeight: '500', color: '#111' },
});

