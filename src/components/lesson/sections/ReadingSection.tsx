import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { InteractiveText } from '../../common/InteractiveText';
import type { NativeLanguage } from '../../../context/AuthContext';

type VocabularyHotspot = {
  id: string;
  armenian: string;
  phonetic: string;
  translation: string;
  xPercent: number;
  yPercent: number;
};

type ReadingData = {
  wideAngleScene: {
    description: string;
    illustration?: string; // placeholder
  };
  vocabularyHotspots: VocabularyHotspot[];
  narrativeText?: {
    armenian: string;
    phonetic: string;
    translation: string;
  };
};

type Props = {
  data: ReadingData;
  nativeLanguage: NativeLanguage;
};

export function ReadingSection({ data, nativeLanguage }: Props) {
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const isPersian = nativeLanguage === 'fa';

  const handleHotspotPress = (hotspotId: string) => {
    setActiveHotspot(activeHotspot === hotspotId ? null : hotspotId);
  };

  const activeHotspotData = data.vocabularyHotspots.find(h => h.id === activeHotspot);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Wide-angle scene with hotspots */}
      <View style={styles.sceneContainer}>
        <Text style={[styles.sectionTitle, isPersian && styles.rtlText]}>
          {isPersian ? 'صحنه کامل' : 'The Full Scene'}
        </Text>
        
        <View style={styles.sceneFrame}>
          <View style={styles.scenePlaceholder}>
            <Text style={styles.placeholderText}>
              [WIDE-ANGLE: {data.wideAngleScene.description}]
            </Text>
          </View>
          
          {/* Vocabulary hotspots */}
          {data.vocabularyHotspots.map((hotspot) => (
            <Pressable
              key={hotspot.id}
              style={[
                styles.hotspot,
                {
                  left: `${hotspot.xPercent}%`,
                  top: `${hotspot.yPercent}%`,
                },
                activeHotspot === hotspot.id && styles.hotspotActive,
              ]}
              onPress={() => handleHotspotPress(hotspot.id)}
            />
          ))}
        </View>

        {/* Active hotspot display */}
        {activeHotspotData && (
          <View style={styles.hotspotCard}>
            <InteractiveText
              armenian={activeHotspotData.armenian}
              phonetic={activeHotspotData.phonetic}
              translation={activeHotspotData.translation}
              style={styles.hotspotText}
              nativeLanguage={nativeLanguage}
            />
          </View>
        )}

        {!activeHotspotData && (
          <Text style={[styles.hotspotHint, isPersian && styles.rtlText]}>
            {isPersian 
              ? 'روی نقاط قرمز ضربه بزنید تا واژگان را ببینید'
              : 'Tap the red dots to explore vocabulary'
            }
          </Text>
        )}
      </View>

      {/* Narrative text (for advanced lessons) */}
      {data.narrativeText && (
        <View style={styles.narrativeContainer}>
          <Text style={[styles.sectionTitle, isPersian && styles.rtlText]}>
            {isPersian ? 'متن داستان' : 'Story Text'}
          </Text>
          
          <View style={styles.narrativeCard}>
            <InteractiveText
              armenian={data.narrativeText.armenian}
              phonetic={data.narrativeText.phonetic}
              translation={data.narrativeText.translation}
              style={styles.narrativeText}
              nativeLanguage={nativeLanguage}
            />
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f4ec',
  },
  sceneContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f2744',
    marginBottom: 16,
    textAlign: 'center',
  },
  sceneFrame: {
    position: 'relative',
    marginBottom: 16,
  },
  scenePlaceholder: {
    height: 280,
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
    paddingHorizontal: 20,
  },
  hotspot: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FF4B4B',
    borderWidth: 2,
    borderColor: '#fff',
    marginLeft: -10,
    marginTop: -10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  hotspotActive: {
    backgroundColor: '#0f2744',
    transform: [{ scale: 1.2 }],
  },
  hotspotCard: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#fffefb',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#1a3d5c',
  },
  hotspotText: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    padding: 0,
  },
  hotspotHint: {
    marginTop: 16,
    fontSize: 13,
    fontStyle: 'italic',
    color: '#2d4a66',
    textAlign: 'center',
  },
  narrativeContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
  },
  narrativeCard: {
    padding: 16,
    backgroundColor: '#fffefb',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#1a3d5c',
  },
  narrativeText: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    padding: 0,
  },
  rtlText: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});