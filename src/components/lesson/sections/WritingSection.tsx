import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Pressable, TextInput } from 'react-native';
import type { NativeLanguage } from '../../../context/AuthContext';

type WritingExercise = {
  id: string;
  type: 'alphabet' | 'transcription';
  letter?: string; // for alphabet exercises
  word?: {
    armenian: string;
    phonetic: string;
    translation: string;
  }; // for transcription exercises
  strokeOrder?: string[]; // animation steps for letters
};

type WritingData = {
  exercises: WritingExercise[];
};

type Props = {
  data: WritingData;
  nativeLanguage: NativeLanguage;
};

export function WritingSection({ data, nativeLanguage }: Props) {
  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  const [inputMethods, setInputMethods] = useState<Record<string, 'trace' | 'type'>>({});
  const isPersian = nativeLanguage === 'fa';

  const handleInputChange = (exerciseId: string, value: string) => {
    setInputValues(prev => ({ ...prev, [exerciseId]: value }));
  };

  const toggleInputMethod = (exerciseId: string) => {
    setInputMethods(prev => ({
      ...prev,
      [exerciseId]: prev[exerciseId] === 'trace' ? 'type' : 'trace'
    }));
  };

  const getInputMethod = (exerciseId: string) => {
    return inputMethods[exerciseId] || 'trace';
  };

  const renderAlphabetExercise = (exercise: WritingExercise) => {
    const inputMethod = getInputMethod(exercise.id);
    const inputValue = inputValues[exercise.id] || '';

    return (
      <View style={styles.exerciseCard}>
        <Text style={styles.exerciseTitle}>
          {isPersian ? 'نوشتن حروف' : 'Letter Writing'}
        </Text>
        
        <View style={styles.letterDisplay}>
          <Text style={styles.targetLetter}>{exercise.letter}</Text>
        </View>

        {/* Input method toggle */}
        <View style={styles.methodToggle}>
          <Pressable
            style={[
              styles.methodButton,
              inputMethod === 'trace' && styles.methodButtonActive
            ]}
            onPress={() => toggleInputMethod(exercise.id)}
          >
            <Text style={styles.methodButtonText}>
              {isPersian ? 'ردیابی' : 'Trace'}
            </Text>
          </Pressable>
          
          <Pressable
            style={[
              styles.methodButton,
              inputMethod === 'type' && styles.methodButtonActive
            ]}
            onPress={() => toggleInputMethod(exercise.id)}
          >
            <Text style={styles.methodButtonText}>
              {isPersian ? 'تایپ' : 'Type'}
            </Text>
          </Pressable>
        </View>

        {/* Input area */}
        {inputMethod === 'trace' ? (
          <View style={styles.traceArea}>
            <Text style={styles.traceInstruction}>
              {isPersian 
                ? 'با انگشت خود حرف را ردیابی کنید'
                : 'Trace the letter with your finger'
              }
            </Text>
            <View style={styles.tracingCanvas}>
              <Text style={styles.tracingGuide}>{exercise.letter}</Text>
              <Text style={styles.canvasPlaceholder}>
                [TRACING CANVAS - Touch implementation needed]
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.typeArea}>
            <Text style={styles.typeInstruction}>
              {isPersian 
                ? 'حرف را با کیبورد ارمنی تایپ کنید'
                : 'Type the letter using Armenian keyboard'
              }
            </Text>
            <TextInput
              style={styles.typeInput}
              value={inputValue}
              onChangeText={(value) => handleInputChange(exercise.id, value)}
              placeholder={exercise.letter}
              placeholderTextColor="#2d4a66"
              maxLength={1}
            />
          </View>
        )}

        {/* Stroke order animation placeholder */}
        {exercise.strokeOrder && (
          <View style={styles.strokeOrderSection}>
            <Text style={styles.strokeOrderTitle}>
              {isPersian ? 'ترتیب خطوط' : 'Stroke Order'}
            </Text>
            <View style={styles.strokeOrderDemo}>
              <Text style={styles.strokeOrderPlaceholder}>
                [ANIMATED STROKE ORDER: {exercise.strokeOrder.join(' → ')}]
              </Text>
            </View>
          </View>
        )}
      </View>
    );
  };

  const renderTranscriptionExercise = (exercise: WritingExercise) => {
    const inputValue = inputValues[exercise.id] || '';
    const isCorrect = inputValue.trim() === exercise.word?.armenian;

    return (
      <View style={styles.exerciseCard}>
        <Text style={styles.exerciseTitle}>
          {isPersian ? 'رونویسی کلمات' : 'Word Transcription'}
        </Text>
        
        {exercise.word && (
          <>
            <View style={styles.wordPrompt}>
              <Text style={[styles.wordTranslation, isPersian && styles.rtlText]}>
                {exercise.word.translation}
              </Text>
              <Text style={styles.wordPhonetic}>
                [{exercise.word.phonetic}]
              </Text>
            </View>

            <TextInput
              style={[
                styles.transcriptionInput,
                isCorrect && styles.transcriptionInputCorrect
              ]}
              value={inputValue}
              onChangeText={(value) => handleInputChange(exercise.id, value)}
              placeholder={isPersian ? 'کلمه ارمنی را بنویسید...' : 'Write the Armenian word...'}
              placeholderTextColor="#2d4a66"
              multiline={false}
            />

            {isCorrect && (
              <View style={styles.correctFeedback}>
                <Text style={styles.correctIcon}>✓</Text>
                <Text style={styles.correctText}>
                  {isPersian ? 'درست!' : 'Correct!'}
                </Text>
              </View>
            )}
          </>
        )}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={[styles.sectionTitle, isPersian && styles.rtlText]}>
        {isPersian ? 'آزمایشگاه نوشتن' : 'The Writing Lab'}
      </Text>
      
      <Text style={[styles.sectionDescription, isPersian && styles.rtlText]}>
        {isPersian 
          ? 'الفبای ارمنی (آیوبوبن) و املا را یاد بگیرید'
          : 'Master the Armenian alphabet (Ayububen) and spelling'
        }
      </Text>

      {data.exercises.map((exercise) => (
        <View key={exercise.id}>
          {exercise.type === 'alphabet' 
            ? renderAlphabetExercise(exercise)
            : renderTranscriptionExercise(exercise)
          }
        </View>
      ))}
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
  exerciseTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f2744',
    textAlign: 'center',
    marginBottom: 16,
  },
  letterDisplay: {
    alignItems: 'center',
    marginBottom: 20,
  },
  targetLetter: {
    fontSize: 72,
    fontWeight: '700',
    color: '#0f2744',
  },
  methodToggle: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 8,
  },
  methodButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#1a3d5c',
    backgroundColor: '#efe8dc',
    alignItems: 'center',
  },
  methodButtonActive: {
    backgroundColor: '#0f2744',
  },
  methodButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f2744',
  },
  traceArea: {
    alignItems: 'center',
  },
  traceInstruction: {
    fontSize: 14,
    color: '#2d4a66',
    textAlign: 'center',
    marginBottom: 16,
  },
  tracingCanvas: {
    width: '100%',
    height: 200,
    backgroundColor: '#efe8dc',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#1a3d5c',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  tracingGuide: {
    fontSize: 120,
    color: 'rgba(15,39,68,0.2)',
    position: 'absolute',
  },
  canvasPlaceholder: {
    fontSize: 12,
    color: '#2d4a66',
    textAlign: 'center',
  },
  typeArea: {
    alignItems: 'center',
  },
  typeInstruction: {
    fontSize: 14,
    color: '#2d4a66',
    textAlign: 'center',
    marginBottom: 16,
  },
  typeInput: {
    width: 100,
    height: 100,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#1a3d5c',
    backgroundColor: '#efe8dc',
    fontSize: 48,
    fontWeight: '700',
    color: '#0f2744',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  strokeOrderSection: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(15,39,68,0.15)',
  },
  strokeOrderTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f2744',
    textAlign: 'center',
    marginBottom: 12,
  },
  strokeOrderDemo: {
    height: 80,
    backgroundColor: '#efe8dc',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  strokeOrderPlaceholder: {
    fontSize: 12,
    color: '#2d4a66',
    textAlign: 'center',
  },
  wordPrompt: {
    alignItems: 'center',
    marginBottom: 20,
  },
  wordTranslation: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f2744',
    marginBottom: 4,
  },
  wordPhonetic: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#2d4a66',
  },
  transcriptionInput: {
    borderWidth: 2,
    borderColor: '#1a3d5c',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 18,
    fontWeight: '600',
    color: '#0f2744',
    backgroundColor: '#efe8dc',
    textAlign: 'center',
  },
  transcriptionInputCorrect: {
    borderColor: '#58CC02',
    backgroundColor: '#e8f8e0',
  },
  correctFeedback: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    gap: 8,
  },
  correctIcon: {
    fontSize: 20,
    color: '#58CC02',
  },
  correctText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#58CC02',
  },
  rtlText: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});