import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { speakArmenian } from '../../../utils/speech';
import type { NativeLanguage } from '../../../context/AuthContext';

type ListeningExercise = {
  id: string;
  armenian: string;
  phonetic: string;
  instruction: {
    en: string;
    fa: string;
  };
  feedback?: {
    en: string;
    fa: string;
  };
};

type ListeningData = {
  exercises: ListeningExercise[];
};

type Props = {
  data: ListeningData;
  nativeLanguage: NativeLanguage;
};

export function ListeningSection({ data, nativeLanguage }: Props) {
  const [recordingStates, setRecordingStates] = useState<Record<string, 'idle' | 'recording' | 'completed'>>({});
  const isPersian = nativeLanguage === 'fa';

  const handlePlayAudio = (exercise: ListeningExercise) => {
    speakArmenian(exercise.armenian, exercise.phonetic);
  };

  const handleStartRecording = (exerciseId: string) => {
    // Placeholder for speech recognition
    setRecordingStates(prev => ({ ...prev, [exerciseId]: 'recording' }));
    
    // Simulate recording completion after 3 seconds
    setTimeout(() => {
      setRecordingStates(prev => ({ ...prev, [exerciseId]: 'completed' }));
    }, 3000);
  };

  const getRecordingState = (exerciseId: string) => {
    return recordingStates[exerciseId] || 'idle';
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={[styles.sectionTitle, isPersian && styles.rtlText]}>
        {isPersian ? 'آزمایشگاه شنیداری' : 'The Listening Lab'}
      </Text>
      
      <Text style={[styles.sectionDescription, isPersian && styles.rtlText]}>
        {isPersian 
          ? 'گوش دهید و تکرار کنید. سیستم تلفظ شما را بررسی می‌کند.'
          : 'Listen and repeat. The system will check your pronunciation.'
        }
      </Text>

      {data.exercises.map((exercise, index) => {
        const recordingState = getRecordingState(exercise.id);
        
        return (
          <View key={exercise.id} style={styles.exerciseCard}>
            <Text style={styles.exerciseNumber}>
              {isPersian ? `تمرین ${index + 1}` : `Exercise ${index + 1}`}
            </Text>

            {/* Listen section */}
            <View style={styles.listenSection}>
              <Text style={[styles.stepTitle, isPersian && styles.rtlText]}>
                {isPersian ? '۱. گوش دهید' : '1. Listen'}
              </Text>
              
              <Pressable 
                style={styles.playButton}
                onPress={() => handlePlayAudio(exercise)}
              >
                <Text style={styles.playIcon}>▶</Text>
                <Text style={styles.playText}>
                  {isPersian ? 'پخش' : 'Play'}
                </Text>
              </Pressable>
              
              <Text style={styles.armenianText}>{exercise.armenian}</Text>
              <Text style={styles.phoneticText}>{exercise.phonetic}</Text>
            </View>

            {/* Record section */}
            <View style={styles.recordSection}>
              <Text style={[styles.stepTitle, isPersian && styles.rtlText]}>
                {isPersian ? '۲. تکرار کنید' : '2. Repeat'}
              </Text>
              
              <Text style={[styles.instruction, isPersian && styles.rtlText]}>
                {isPersian ? exercise.instruction.fa : exercise.instruction.en}
              </Text>

              <Pressable 
                style={[
                  styles.recordButton,
                  recordingState === 'recording' && styles.recordButtonActive,
                  recordingState === 'completed' && styles.recordButtonCompleted,
                ]}
                onPress={() => handleStartRecording(exercise.id)}
                disabled={recordingState === 'recording'}
              >
                <Text style={styles.recordIcon}>
                  {recordingState === 'idle' && '🎤'}
                  {recordingState === 'recording' && '⏺'}
                  {recordingState === 'completed' && '✓'}
                </Text>
                <Text style={styles.recordText}>
                  {recordingState === 'idle' && (isPersian ? 'ضبط' : 'Record')}
                  {recordingState === 'recording' && (isPersian ? 'در حال ضبط...' : 'Recording...')}
                  {recordingState === 'completed' && (isPersian ? 'تکمیل شد' : 'Completed')}
                </Text>
              </Pressable>

              {/* AI Feedback placeholder */}
              {recordingState === 'completed' && exercise.feedback && (
                <View style={styles.feedbackCard}>
                  <Text style={styles.feedbackIcon}>🎯</Text>
                  <Text style={[styles.feedbackText, isPersian && styles.rtlText]}>
                    {isPersian ? exercise.feedback.fa : exercise.feedback.en}
                  </Text>
                </View>
              )}
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f4ec',
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f2744',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#2d4a66',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  exerciseCard: {
    backgroundColor: '#fffefb',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#1a3d5c',
    padding: 20,
    marginBottom: 20,
  },
  exerciseNumber: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f2744',
    marginBottom: 16,
    textAlign: 'center',
  },
  listenSection: {
    marginBottom: 24,
  },
  recordSection: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(15,39,68,0.15)',
    paddingTop: 20,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f2744',
    marginBottom: 12,
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0f2744',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 12,
    gap: 8,
  },
  playIcon: {
    fontSize: 16,
    color: '#f7f4ec',
  },
  playText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f7f4ec',
  },
  armenianText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f2744',
    textAlign: 'center',
    marginBottom: 4,
  },
  phoneticText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#2d4a66',
    textAlign: 'center',
  },
  instruction: {
    fontSize: 14,
    color: '#2d4a66',
    marginBottom: 16,
    lineHeight: 20,
  },
  recordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#efe8dc',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#1a3d5c',
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 8,
  },
  recordButtonActive: {
    backgroundColor: '#FF4B4B',
    borderColor: '#FF4B4B',
  },
  recordButtonCompleted: {
    backgroundColor: '#58CC02',
    borderColor: '#58CC02',
  },
  recordIcon: {
    fontSize: 20,
  },
  recordText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f2744',
  },
  feedbackCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f8e0',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
    gap: 8,
  },
  feedbackIcon: {
    fontSize: 16,
  },
  feedbackText: {
    flex: 1,
    fontSize: 14,
    color: '#0f2744',
    lineHeight: 18,
  },
  rtlText: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});