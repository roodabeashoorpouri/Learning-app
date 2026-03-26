import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  Vazirmatn_400Regular,
  Vazirmatn_700Bold,
  useFonts,
} from '@expo-google-fonts/vazirmatn';

import { useAuth } from '../context/AuthContext';
import { workbookUnits } from '../data/workbookContent';
import { t } from '../utils/textHelpers';
import type { RootStackParamList } from '../components/navigation/types';
import type { PracticeSection, WorkbookUnit } from '../data/types';

const PAPER = '#f7f4ec';
const PAPER_DEEP = '#efe8dc';
const INK = '#0f2744';
const INK_MUTED = '#2d4a66';
const ACCENT_LINE = '#1a3d5c';

type Nav = NativeStackNavigationProp<RootStackParamList>;

function SectionCard({
  section,
  nativeLanguage,
  persianFont,
  onPress,
}: {
  section: PracticeSection;
  nativeLanguage: 'en' | 'fa';
  persianFont: string | undefined;
  onPress: () => void;
}) {
  const isPersian = nativeLanguage === 'fa';
  const titleText = t(section.title, nativeLanguage);
  const descText = t(section.description, nativeLanguage);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <View style={styles.cardHeader}>
        <Text
          style={[
            styles.cardTitle,
            isPersian && styles.rtlText,
            isPersian && persianFont ? { fontFamily: persianFont } : null,
          ]}
        >
          {titleText}
        </Text>
        <View style={styles.exerciseCount}>
          <Text style={styles.exerciseCountText}>{section.exercises.length}</Text>
        </View>
      </View>
      {section.title.hy ? (
        <Text style={styles.cardArmenian}>{section.title.hy}</Text>
      ) : null}
      {descText ? (
        <Text
          style={[
            styles.cardDesc,
            isPersian && styles.rtlText,
            isPersian && persianFont ? { fontFamily: persianFont } : null,
          ]}
        >
          {descText}
        </Text>
      ) : null}
      <View style={styles.startRow}>
        <Text style={styles.startText}>
          {isPersian ? 'شروع تمرین' : 'Start Practice'}
        </Text>
        <Text style={styles.startArrow}>→</Text>
      </View>
    </Pressable>
  );
}

function UnitBlock({
  unit,
  nativeLanguage,
  persianFont,
  onSectionPress,
}: {
  unit: WorkbookUnit;
  nativeLanguage: 'en' | 'fa';
  persianFont: string | undefined;
  onSectionPress: (sectionId: string) => void;
}) {
  const isPersian = nativeLanguage === 'fa';
  const unitTitle = t(unit.title, nativeLanguage);

  return (
    <View style={styles.unitBlock}>
      <View style={styles.unitHeader}>
        <View style={styles.unitLine} />
        <Text
          style={[
            styles.unitTitle,
            isPersian && styles.rtlText,
            isPersian && persianFont ? { fontFamily: persianFont } : null,
          ]}
        >
          {unitTitle}
        </Text>
        <View style={styles.unitLine} />
      </View>
      {unit.title.hy ? (
        <Text style={styles.unitArmenian}>{unit.title.hy}</Text>
      ) : null}
      {unit.sections.map((section) => (
        <SectionCard
          key={section.id}
          section={section}
          nativeLanguage={nativeLanguage}
          persianFont={persianFont}
          onPress={() => onSectionPress(section.id)}
        />
      ))}
    </View>
  );
}

export function WorkbookScreen() {
  const insets = useSafeAreaInsets();
  const { nativeLanguage } = useAuth();
  const navigation = useNavigation<Nav>();
  const isPersian = nativeLanguage === 'fa';
  const [fontsLoaded] = useFonts({ Vazirmatn_400Regular, Vazirmatn_700Bold });
  const persianFont = fontsLoaded ? 'Vazirmatn_700Bold' : undefined;

  const handleSectionPress = (sectionId: string) => {
    navigation.navigate('PracticeSession', { sectionId });
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: Math.max(insets.bottom, 28) }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.headerSub}>
            {isPersian ? 'دفتر تمرین ارمنی ما' : 'Our Armenian Workbook'}
          </Text>
          <Text
            style={[
              styles.headerTitle,
              isPersian && styles.rtlText,
              isPersian && persianFont ? { fontFamily: persianFont } : null,
            ]}
          >
            {isPersian ? 'تمرین' : 'Practice'}
          </Text>
          <View style={styles.headerRule} />
          <Text
            style={[
              styles.headerHint,
              isPersian && styles.rtlText,
              isPersian && persianFont ? { fontFamily: 'Vazirmatn_400Regular' } : null,
            ]}
          >
            {isPersian
              ? 'یک بخش را انتخاب کنید تا تمرین را شروع کنید.'
              : 'Choose a section to start practicing.'}
          </Text>
        </View>

        {workbookUnits.map((unit) => (
          <UnitBlock
            key={unit.id}
            unit={unit}
            nativeLanguage={nativeLanguage}
            persianFont={persianFont}
            onSectionPress={handleSectionPress}
          />
        ))}
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
  header: {
    marginTop: 8,
    marginBottom: 4,
  },
  headerSub: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.4,
    color: INK_MUTED,
    textTransform: 'uppercase',
  },
  headerTitle: {
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
  headerHint: {
    marginTop: 12,
    fontSize: 14,
    color: INK_MUTED,
    lineHeight: 20,
  },
  unitBlock: {
    marginTop: 24,
  },
  unitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 4,
  },
  unitLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(15,39,68,0.15)',
  },
  unitTitle: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: INK,
    textTransform: 'uppercase',
  },
  unitArmenian: {
    fontSize: 13,
    fontWeight: '600',
    color: INK_MUTED,
    textAlign: 'center',
    marginBottom: 12,
  },
  card: {
    marginTop: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: INK,
    backgroundColor: '#fffefb',
    shadowColor: INK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  cardPressed: {
    backgroundColor: PAPER_DEEP,
    transform: [{ scale: 0.98 }],
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: '800',
    color: INK,
  },
  exerciseCount: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: INK,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  exerciseCountText: {
    color: PAPER,
    fontSize: 13,
    fontWeight: '800',
  },
  cardArmenian: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: '600',
    color: INK_MUTED,
  },
  cardDesc: {
    marginTop: 8,
    fontSize: 13,
    color: INK_MUTED,
    lineHeight: 19,
  },
  startRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 12,
    gap: 6,
  },
  startText: {
    fontSize: 13,
    fontWeight: '700',
    color: ACCENT_LINE,
  },
  startArrow: {
    fontSize: 16,
    fontWeight: '700',
    color: ACCENT_LINE,
  },
  rtlText: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});
