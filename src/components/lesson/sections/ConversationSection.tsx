import React from 'react';
import { ScrollView, StyleSheet, Text, View, Image } from 'react-native';
import { InteractiveText } from '../../common/InteractiveText';
import type { NativeLanguage } from '../../../context/AuthContext';

type ConversationData = {
  characters: Array<{
    name: string;
    role: string;
    lines: Array<{
      armenian: string;
      phonetic: string;
      translation: string;
    }>;
  }>;
  setting: {
    description: string;
    illustration?: string; // placeholder for now
  };
};

type Props = {
  data: ConversationData;
  nativeLanguage: NativeLanguage;
};

export function ConversationSection({ data, nativeLanguage }: Props) {
  const isPersian = nativeLanguage === 'fa';

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Close-up illustration placeholder */}
      <View style={styles.illustrationContainer}>
        <View style={styles.illustrationPlaceholder}>
          <Text style={styles.placeholderText}>
            [CLOSE-UP: {data.setting.description}]
          </Text>
        </View>
      </View>

      {/* Character dialogue */}
      <View style={styles.dialogueContainer}>
        {data.characters.map((character, charIndex) => (
          <View key={character.name} style={styles.characterSection}>
            <Text style={[styles.characterName, isPersian && styles.rtlText]}>
              {character.name} • {character.role}
            </Text>
            
            {character.lines.map((line, lineIndex) => (
              <View 
                key={`${character.name}-${lineIndex}`}
                style={[
                  styles.speechBubble,
                  charIndex % 2 === 1 && styles.speechBubbleRight
                ]}
              >
                <InteractiveText
                  armenian={line.armenian}
                  phonetic={line.phonetic}
                  translation={line.translation}
                  style={styles.speechText}
                  nativeLanguage={nativeLanguage}
                />
              </View>
            ))}
          </View>
        ))}
      </View>

      {/* Instruction text */}
      <View style={styles.instructionContainer}>
        <Text style={[styles.instruction, isPersian && styles.rtlText]}>
          {isPersian 
            ? 'روی متن ارمنی ضربه بزنید تا ترجمه را ببینید'
            : 'Tap Armenian text to reveal translation'
          }
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f4ec',
  },
  illustrationContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  illustrationPlaceholder: {
    height: 200,
    backgroundColor: '#d8d2c8',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#1a3d5c',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2d4a66',
    textAlign: 'center',
  },
  dialogueContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  characterSection: {
    marginBottom: 20,
  },
  characterName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f2744',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  speechBubble: {
    maxWidth: '85%',
    marginBottom: 12,
    padding: 16,
    backgroundColor: '#fffefb',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#0f2744',
    alignSelf: 'flex-start',
  },
  speechBubbleRight: {
    alignSelf: 'flex-end',
    backgroundColor: '#efe8dc',
  },
  speechText: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    padding: 0,
  },
  instructionContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginTop: 20,
  },
  instruction: {
    fontSize: 13,
    fontStyle: 'italic',
    color: '#2d4a66',
    textAlign: 'center',
  },
  rtlText: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});