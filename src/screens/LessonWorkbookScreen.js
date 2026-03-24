import React, { useCallback, useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  Vazirmatn_400Regular,
  Vazirmatn_700Bold,
  useFonts,
} from '@expo-google-fonts/vazirmatn';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/** Cream paper + dark blue ink workbook palette */
const PAPER = '#f7f4ec';
const PAPER_DEEP = '#efe8dc';
const INK = '#0f2744';
const INK_MUTED = '#2d4a66';
const ACCENT_LINE = '#1a3d5c';

/** Sample content — replace with lesson props / CMS later */
const SAMPLE_DIALOGUE = [
  {
    speaker: 'Sarah',
    role: 'shopper',
    armenian: 'Ջոն, սա կարմիր խնձոր է։',
    phonetic: 'Jon, sa karmir khngor e.',
    english: 'John, this is a red apple.',
    persian: 'جان، این یک سیب قرمز است.',
  },
  {
    speaker: 'John',
    role: 'friend',
    armenian: 'Իսկ այս գազարը կանաչ է։',
    phonetic: 'Isk ays gazarë kanach e.',
    english: 'And this carrot is green.',
    persian: 'و این هویج سبز است.',
  },
];

const VOCAB_HOTSPOTS = [
  {
    id: 'apple',
    label: { hy: 'խնձոր', en: 'apple', fa: 'سیب' },
    xPct: 0.22,
    yPct: 0.38,
  },
  {
    id: 'carrot',
    label: { hy: 'գազար', en: 'carrot', fa: 'هویج' },
    xPct: 0.72,
    yPct: 0.52,
  },
  {
    id: 'basket',
    label: { hy: 'տոպրակ', en: 'basket', fa: 'سبد' },
    xPct: 0.48,
    yPct: 0.72,
  },
];

const LISTENING_COPY = {
  english: `Sarah says: "Point to the green one."`,
  persian: 'سارا می‌گوید: «به چیز سبز اشاره کن.»',
};

const FILL_BLANK = {
  promptLtr: 'Sarah has a red ',
  blankHint: '────────',
  correctHy: 'խնձոր',
  options: ['խնձոր', 'գազար', 'տոպրակ'],
};

function SectionTitle({ children, n }) {
  return (
    <View style={styles.sectionTitleRow}>
      <View style={styles.sectionNumCircle}>
        <Text style={styles.sectionNumText}>{n}</Text>
      </View>
      <Text style={styles.sectionTitle}>{children}</Text>
    </View>
  );
}

function DialogueTurn({ line, isRight, persianFont }) {
  const align = isRight ? 'flex-end' : 'flex-start';
  return (
    <View style={[styles.turnWrap, { alignItems: align }]}>
      <View style={[styles.turnCard, isRight && styles.turnCardRight]}>
        <Text style={styles.turnSpeaker}>
          {line.speaker}
          <Text style={styles.turnRole}> · {line.role}</Text>
        </Text>
        <Text style={styles.lineArmenian}>{line.armenian}</Text>
        <Text style={styles.linePhonetic}>{line.phonetic}</Text>
        <View style={styles.dividerThin} />
        <Text style={styles.lineEnglish}>{line.english}</Text>
        <View style={[styles.persianBlock, { alignSelf: 'stretch' }]}>
          <Text
            style={[
              styles.linePersian,
              persianFont ? { fontFamily: persianFont } : null,
            ]}
          >
            {line.persian}
          </Text>
        </View>
      </View>
    </View>
  );
}

/**
 * Full-lesson workbook layout: conversation, vocabulary hotspots, listening stub, fill-in-blank.
 * Placeholder frames stand in for final illustrations and audio assets.
 */
export function LessonWorkbookScreen() {
  const insets = useSafeAreaInsets();
  const [fontsLoaded] = useFonts({
    Vazirmatn_400Regular,
    Vazirmatn_700Bold,
  });
  const persianBody = fontsLoaded ? 'Vazirmatn_400Regular' : undefined;
  const persianBold = fontsLoaded ? 'Vazirmatn_700Bold' : undefined;

  const [activeHotspotId, setActiveHotspotId] = useState(null);
  const activeHotspot = useMemo(
    () => VOCAB_HOTSPOTS.find((h) => h.id === activeHotspotId) ?? null,
    [activeHotspotId],
  );

  const [fillText, setFillText] = useState('');
  const [pickedOption, setPickedOption] = useState(null);
  const [audioReady] = useState(false); // flip when audio URI is wired

  const onToggleHotspot = useCallback((id) => {
    setActiveHotspotId((prev) => (prev === id ? null : id));
  }, []);

  const playListeningPlaceholder = useCallback(() => {
    // Wire: const s = new Audio.Sound(); await s.loadAsync({ uri: lessonAudioUri }); await s.playAsync();
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.log('[LessonWorkbook] Listening Lab: audio placeholder — load file here.');
    }
  }, []);

  const fillSolved =
    fillText.trim() === FILL_BLANK.correctHy || pickedOption === FILL_BLANK.correctHy;

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 28) },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.bookHeader}>
          <Text style={styles.bookSubtitle}>Our Armenian Workbook</Text>
          <Text style={styles.bookTitle}>Lesson template</Text>
          <View style={styles.headerRule} />
        </View>

        {/* Section 1 — Conversation */}
        <View style={styles.section}>
          <SectionTitle n={1}>The Conversation (Sarah & John)</SectionTitle>
          <View
            style={[
              styles.illustrationPlaceholder,
              { height: 160, marginBottom: 16 },
            ]}
          >
            <Text style={styles.placeholderLabel}>[SARAH & JOHN ILLUSTRATION]</Text>
          </View>
          {SAMPLE_DIALOGUE.map((line, i) => (
            <DialogueTurn
              key={`${line.speaker}-${i}`}
              line={line}
              isRight={line.speaker === 'John'}
              persianFont={persianBody}
            />
          ))}
        </View>

        {/* Section 2 — Vocabulary spotlight */}
        <View style={styles.section}>
          <SectionTitle n={2}>The Vocabulary Spotlight (Point & Learn)</SectionTitle>
          <Text style={styles.sectionHint}>
            Tap a dot on the scene to see the word in Armenian, English, and Persian.
          </Text>
          <View style={styles.sceneFrame}>
            <View style={[styles.illustrationPlaceholder, styles.scenePlaceholder]}>
              <Text style={styles.placeholderLabel}>
                [INSERT SHOP PICTURE — Sarah & John in a vegetable shop]
              </Text>
            </View>
            {VOCAB_HOTSPOTS.map((h) => (
              <Pressable
                key={h.id}
                onPress={() => onToggleHotspot(h.id)}
                style={[
                  styles.hotspot,
                  {
                    left: `${h.xPct * 100}%`,
                    top: `${h.yPct * 100}%`,
                  },
                  activeHotspotId === h.id && styles.hotspotActive,
                ]}
                accessibilityRole="button"
                accessibilityLabel={`Hotspot ${h.id}`}
              />
            ))}
          </View>
          {activeHotspot ? (
            <View style={styles.hotspotCard}>
              <Text style={styles.hotspotHy}>{activeHotspot.label.hy}</Text>
              <Text style={styles.hotspotEn}>{activeHotspot.label.en}</Text>
              <Text
                style={[
                  styles.hotspotFa,
                  persianBold ? { fontFamily: persianBold } : null,
                ]}
              >
                {activeHotspot.label.fa}
              </Text>
            </View>
          ) : (
            <Text style={styles.hotspotHintMuted}>Tap a colored dot on the picture.</Text>
          )}
        </View>

        {/* Section 3 — Listening lab */}
        <View style={styles.section}>
          <SectionTitle n={3}>The Listening Lab</SectionTitle>
          <View style={styles.listeningCard}>
            <Pressable
              onPress={playListeningPlaceholder}
              style={({ pressed }) => [
                styles.playButton,
                pressed && styles.playButtonPressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Play listening exercise"
            >
              <Text style={styles.playGlyph}>▶</Text>
            </Pressable>
            <View style={styles.listeningCopyCol}>
              <Text style={styles.listeningLabel}>Instruction (English)</Text>
              <Text style={styles.listeningEn}>{LISTENING_COPY.english}</Text>
              <Text style={[styles.listeningLabel, styles.listeningLabelFa]}>
                دستور (فارسی)
              </Text>
              <Text
                style={[
                  styles.listeningFa,
                  persianBody ? { fontFamily: persianBody } : null,
                ]}
              >
                {LISTENING_COPY.persian}
              </Text>
              <Text style={styles.audioStub}>
                {audioReady ? 'Audio loaded.' : 'Audio file: connect URI in code (placeholder).'}
              </Text>
            </View>
          </View>
        </View>

        {/* Section 4 — Workbook activity */}
        <View style={styles.section}>
          <SectionTitle n={4}>The Workbook Activity (Fill the Blanks)</SectionTitle>
          <Text style={styles.activityLead}>
            Complete the sentence using a word from the conversation or the vocabulary scene.
          </Text>
          <View style={styles.exerciseCard}>
            <Text style={styles.exercisePrompt}>
              {FILL_BLANK.promptLtr}
              <Text style={styles.exerciseBlank}>{FILL_BLANK.blankHint}</Text>.
            </Text>
            <TextInput
              style={styles.textInput}
              placeholder="Type the Armenian word…"
              placeholderTextColor={INK_MUTED}
              value={fillText}
              onChangeText={setFillText}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Text style={styles.optionsLabel}>Or choose:</Text>
            <View style={styles.optionsRow}>
              {FILL_BLANK.options.map((opt) => {
                const selected = pickedOption === opt;
                return (
                  <Pressable
                    key={opt}
                    onPress={() => setPickedOption(selected ? null : opt)}
                    style={[
                      styles.optionChip,
                      selected && styles.optionChipSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.optionChipText,
                        selected && styles.optionChipTextSelected,
                      ]}
                    >
                      {opt}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            {fillSolved ? (
              <Text style={styles.feedbackOk}>Well done — խնձոր fits the sentence.</Text>
            ) : null}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: PAPER,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  bookHeader: {
    marginTop: 8,
    marginBottom: 8,
  },
  bookSubtitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.4,
    color: INK_MUTED,
    textTransform: 'uppercase',
  },
  bookTitle: {
    marginTop: 4,
    fontSize: 26,
    fontWeight: '800',
    color: INK,
  },
  headerRule: {
    marginTop: 12,
    height: 3,
    backgroundColor: ACCENT_LINE,
    opacity: 0.85,
    borderRadius: 2,
  },
  section: {
    marginTop: 28,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(15,39,68,0.12)',
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  sectionNumCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: INK,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionNumText: {
    color: PAPER,
    fontSize: 14,
    fontWeight: '800',
  },
  sectionTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: '800',
    color: INK,
  },
  sectionHint: {
    fontSize: 13,
    lineHeight: 19,
    color: INK_MUTED,
    marginBottom: 12,
  },
  illustrationPlaceholder: {
    backgroundColor: '#d8d2c8',
    borderWidth: 2,
    borderColor: ACCENT_LINE,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  placeholderLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: INK_MUTED,
    textAlign: 'center',
    paddingHorizontal: 12,
  },
  turnWrap: {
    width: '100%',
    marginBottom: 12,
  },
  turnCard: {
    maxWidth: '92%',
    backgroundColor: '#fffefb',
    borderWidth: 2,
    borderColor: INK,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    shadowColor: INK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  turnCardRight: {
    backgroundColor: PAPER_DEEP,
  },
  turnSpeaker: {
    fontSize: 13,
    fontWeight: '800',
    color: INK,
    marginBottom: 8,
  },
  turnRole: {
    fontWeight: '600',
    color: INK_MUTED,
    textTransform: 'lowercase',
  },
  lineArmenian: {
    fontSize: 18,
    fontWeight: '700',
    color: INK,
    lineHeight: 26,
  },
  linePhonetic: {
    marginTop: 4,
    fontSize: 14,
    fontStyle: 'italic',
    color: INK_MUTED,
  },
  dividerThin: {
    height: 1,
    backgroundColor: 'rgba(15,39,68,0.15)',
    marginVertical: 10,
  },
  lineEnglish: {
    fontSize: 15,
    fontWeight: '600',
    color: INK,
    textAlign: 'left',
    writingDirection: 'ltr',
  },
  persianBlock: {
    marginTop: 10,
    direction: 'rtl',
  },
  linePersian: {
    fontSize: 17,
    fontWeight: '700',
    color: INK,
    textAlign: 'right',
    writingDirection: 'rtl',
    lineHeight: 26,
  },
  sceneFrame: {
    position: 'relative',
    width: '100%',
    marginTop: 4,
  },
  scenePlaceholder: {
    height: 260,
    width: '100%',
  },
  hotspot: {
    position: 'absolute',
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(218, 80, 80, 0.95)',
    borderWidth: 2,
    borderColor: '#fff',
    marginLeft: -11,
    marginTop: -11,
  },
  hotspotActive: {
    backgroundColor: INK,
    transform: [{ scale: 1.15 }],
  },
  hotspotCard: {
    marginTop: 14,
    padding: 14,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: ACCENT_LINE,
    backgroundColor: '#fffefb',
  },
  hotspotHy: {
    fontSize: 22,
    fontWeight: '800',
    color: INK,
  },
  hotspotEn: {
    marginTop: 6,
    fontSize: 16,
    fontWeight: '700',
    color: INK,
  },
  hotspotFa: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '700',
    color: INK,
    textAlign: 'right',
    writingDirection: 'rtl',
    direction: 'rtl',
  },
  hotspotHintMuted: {
    marginTop: 12,
    fontSize: 13,
    color: INK_MUTED,
    fontStyle: 'italic',
  },
  listeningCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    marginTop: 8,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: INK,
    backgroundColor: '#fffefb',
  },
  playButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: INK,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: ACCENT_LINE,
  },
  playButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.97 }],
  },
  playGlyph: {
    color: PAPER,
    fontSize: 28,
    marginLeft: 4,
    fontWeight: '800',
  },
  listeningCopyCol: {
    flex: 1,
    minWidth: 0,
  },
  listeningLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.6,
    color: INK_MUTED,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  listeningLabelFa: {
    marginTop: 10,
    textAlign: 'right',
    writingDirection: 'rtl',
    alignSelf: 'stretch',
  },
  listeningEn: {
    fontSize: 15,
    fontWeight: '600',
    color: INK,
    lineHeight: 22,
  },
  listeningFa: {
    fontSize: 16,
    fontWeight: '600',
    color: INK,
    textAlign: 'right',
    writingDirection: 'rtl',
    lineHeight: 24,
    direction: 'rtl',
  },
  audioStub: {
    marginTop: 12,
    fontSize: 12,
    color: INK_MUTED,
    fontStyle: 'italic',
  },
  activityLead: {
    fontSize: 14,
    color: INK_MUTED,
    lineHeight: 20,
    marginBottom: 12,
  },
  exerciseCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: INK,
    backgroundColor: PAPER_DEEP,
  },
  exercisePrompt: {
    fontSize: 17,
    fontWeight: '700',
    color: INK,
    lineHeight: 26,
  },
  exerciseBlank: {
    borderBottomWidth: 2,
    borderBottomColor: INK,
    color: INK_MUTED,
  },
  textInput: {
    marginTop: 14,
    borderWidth: 2,
    borderColor: ACCENT_LINE,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 17,
    fontWeight: '600',
    color: INK,
    backgroundColor: '#fffefb',
  },
  optionsLabel: {
    marginTop: 16,
    fontSize: 12,
    fontWeight: '800',
    color: INK_MUTED,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  optionChip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: INK,
    backgroundColor: '#fffefb',
  },
  optionChipSelected: {
    backgroundColor: INK,
  },
  optionChipText: {
    fontSize: 16,
    fontWeight: '700',
    color: INK,
  },
  optionChipTextSelected: {
    color: PAPER,
  },
  feedbackOk: {
    marginTop: 14,
    fontSize: 14,
    fontWeight: '700',
    color: ACCENT_LINE,
  },
});
