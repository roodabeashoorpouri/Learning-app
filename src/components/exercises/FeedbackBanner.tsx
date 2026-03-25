import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { SlideInDown } from 'react-native-reanimated';

const GREEN = '#58CC02';
const RED = '#FF4B4B';

type Props = {
  isCorrect: boolean;
  correctAnswerLabel?: string;
  continueLabel: string;
  onContinue: () => void;
};

export function FeedbackBanner({
  isCorrect,
  correctAnswerLabel,
  continueLabel,
  onContinue,
}: Props) {
  const bg = isCorrect ? GREEN : RED;

  return (
    <Animated.View
      entering={SlideInDown.duration(250)}
      style={[styles.container, { backgroundColor: bg }]}
    >
      <View style={styles.content}>
        <Text style={styles.icon}>{isCorrect ? '✓' : '✗'}</Text>
        <View style={styles.textCol}>
          <Text style={styles.title}>
            {isCorrect ? 'Correct!' : 'Incorrect'}
          </Text>
          {!isCorrect && correctAnswerLabel ? (
            <Text style={styles.answer}>
              Correct answer: {correctAnswerLabel}
            </Text>
          ) : null}
        </View>
      </View>
      <Pressable
        onPress={onContinue}
        style={({ pressed }) => [styles.continueBtn, pressed && styles.continueBtnPressed]}
      >
        <Text style={styles.continueText}>{continueLabel}</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 20,
    paddingBottom: 36,
    paddingHorizontal: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  icon: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
  },
  textCol: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#fff',
  },
  answer: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
  },
  continueBtn: {
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  continueBtnPressed: {
    opacity: 0.85,
  },
  continueText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#333',
    textTransform: 'uppercase',
  },
});
