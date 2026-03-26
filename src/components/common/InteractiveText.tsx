import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { speakArmenian } from '../../utils/speech';

type Props = {
  armenian: string;
  phonetic?: string;
  translation: string;
  showSpeaker?: boolean;
  style?: any;
  translationStyle?: any;
  onPress?: () => void;
  nativeLanguage?: 'en' | 'fa';
};

/**
 * Global "Interactive Text" component that handles:
 * - Hidden translation (tap to toggle)
 * - Audio playback via speaker icon
 * - Consistent styling across all sections
 * - RTL support for Persian
 */
export function InteractiveText({
  armenian,
  phonetic,
  translation,
  showSpeaker = true,
  style,
  translationStyle,
  onPress,
  nativeLanguage = 'en',
}: Props) {
  const [showTranslation, setShowTranslation] = useState(false);
  const isPersian = nativeLanguage === 'fa';

  const handleTextPress = () => {
    setShowTranslation(!showTranslation);
    onPress?.();
  };

  const handleSpeakerPress = () => {
    speakArmenian(armenian, phonetic || '');
  };

  return (
    <View style={styles.container}>
      <View style={styles.textRow}>
        <Pressable onPress={handleTextPress} style={[styles.textContainer, style]}>
          <Text style={styles.armenian}>{armenian}</Text>
          {phonetic && <Text style={styles.phonetic}>{phonetic}</Text>}
          {showTranslation && (
            <Text style={[
              styles.translation, 
              translationStyle,
              isPersian && styles.rtlText
            ]}>
              {translation}
            </Text>
          )}
        </Pressable>
        
        {showSpeaker && (
          <Pressable onPress={handleSpeakerPress} style={styles.speakerButton}>
            <Text style={styles.speakerIcon}>🔊</Text>
          </Pressable>
        )}
      </View>
      
      {!showTranslation && (
        <Text style={[styles.tapHint, isPersian && styles.rtlText]}>
          {isPersian ? 'برای دیدن ترجمه ضربه بزنید' : 'Tap to reveal translation'}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
  },
  textRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  textContainer: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(15,39,68,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(15,39,68,0.1)',
  },
  armenian: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f2744',
    lineHeight: 24,
  },
  phonetic: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#2d4a66',
    marginTop: 2,
  },
  translation: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a3d5c',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(15,39,68,0.15)',
    lineHeight: 20,
  },
  speakerButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#0f2744',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 36,
    minHeight: 36,
  },
  speakerIcon: {
    fontSize: 16,
    color: '#f7f4ec',
  },
  tapHint: {
    fontSize: 11,
    color: '#2d4a66',
    fontStyle: 'italic',
    marginTop: 4,
    textAlign: 'center',
  },
  rtlText: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});