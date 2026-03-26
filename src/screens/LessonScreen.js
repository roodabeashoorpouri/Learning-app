import React, { useCallback, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '../context/AuthContext';
import { vocabulary } from '../data/vocabulary';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH;
/** Below this width, English and Persian stack vertically */
const STACK_BREAKPOINT = 400;

function HandDrawnNextArrow() {
  return (
    <View style={arrowStyles.wrapper} pointerEvents="none">
      <View style={arrowStyles.shaftShadow} />
      <View style={arrowStyles.shaft} />
      <View style={arrowStyles.headWrap}>
        <View style={arrowStyles.head} />
      </View>
    </View>
  );
}

const arrowStyles = StyleSheet.create({
  wrapper: {
    width: 56,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  shaft: {
    width: 30,
    height: 4,
    backgroundColor: '#1a1a1a',
    borderRadius: 2,
    transform: [{ rotate: '-2deg' }],
    marginRight: -8,
  },
  shaftShadow: {
    position: 'absolute',
    left: 4,
    width: 30,
    height: 4,
    backgroundColor: '#6a6a6a',
    opacity: 0.35,
    borderRadius: 2,
    transform: [{ rotate: '2deg' }, { translateX: 1 }, { translateY: 2 }],
  },
  headWrap: {
    transform: [{ rotate: '5deg' }],
  },
  head: {
    width: 0,
    height: 0,
    borderLeftWidth: 14,
    borderTopWidth: 10,
    borderBottomWidth: 10,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: '#1a1a1a',
  },
});

function GuideRow({ name, role, alignEnd, children }) {
  return (
    <View style={[guideStyles.row, alignEnd && guideStyles.rowRtl]}>
      <View style={[guideStyles.badge, alignEnd && guideStyles.badgeRtl]}>
        <Text style={guideStyles.badgeText}>{name[0]}</Text>
      </View>
      <View style={[guideStyles.speech, alignEnd && guideStyles.speechRtl]}>
        <Text style={guideStyles.name}>{name}</Text>
        <Text style={guideStyles.role}>{role}</Text>
        {children}
      </View>
    </View>
  );
}

const guideStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 12,
  },
  rowRtl: {
    flexDirection: 'row-reverse',
  },
  badge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e8dfd4',
    borderWidth: 2,
    borderColor: '#2c241c',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  badgeRtl: {
    backgroundColor: '#d4e0e8',
    marginRight: 0,
    marginLeft: 10,
  },
  badgeText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#2c241c',
  },
  speech: {
    flex: 1,
    backgroundColor: '#faf8f5',
    borderWidth: 2,
    borderColor: '#2c241c',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  speechRtl: {
    backgroundColor: '#f3f8fb',
  },
  name: {
    fontSize: 14,
    fontWeight: '800',
    color: '#2c241c',
  },
  role: {
    fontSize: 11,
    color: '#6b5d4f',
    marginBottom: 4,
  },
});

function Flashcard({ item, stack, nativeLanguage }) {
  const isEnglish = nativeLanguage === 'en';
  const isPersian = nativeLanguage === 'fa';

  return (
    <View style={[styles.card, { width: CARD_WIDTH }]}>
      <View style={styles.armenianBlock}>
        <Text style={styles.armenianScript}>{item.Armenian_Script}</Text>
        <Text style={styles.armenianPhonetic}>{item.Armenian_Phonetic}</Text>
      </View>

      <View style={stack ? styles.translationsStack : styles.translationsRow}>
        {isEnglish && (
          <View
            style={[
              styles.translationCol,
              stack && styles.translationColFull,
              styles.ltrCol,
            ]}
          >
            <Text style={styles.colLabel}>English</Text>
            <Text style={styles.englishText}>{item.English_Mean}</Text>
          </View>
        )}

        {isEnglish && isPersian && !stack && <View style={styles.divider} />}

        {isPersian && (
          <View
            style={[styles.translationCol, stack && styles.translationColFull]}
          >
            <Text style={[styles.colLabel, styles.labelRtl]}>فارسی</Text>
            <View style={styles.rtlInner}>
              <Text style={styles.persianMean}>{item.Persian_Mean}</Text>
              <Text style={styles.persianPhonetic}>{item.Persian_Phonetic}</Text>
            </View>
          </View>
        )}
      </View>

      <View style={styles.guides}>
        {isEnglish && (
          <GuideRow name="Sarah" role="English tip">
            <Text style={styles.tipEn}>
              Think of this as: "{item.English_Mean}" — link it to the Armenian
              sounds above.
            </Text>
          </GuideRow>
        )}
        {isPersian && (
          <GuideRow name="John" role="Persian tip" alignEnd>
            <View style={styles.rtlInner}>
              <Text style={styles.tipFa}>
                معنی: {item.Persian_Mean} — تلفظ: {item.Persian_Phonetic}
              </Text>
            </View>
          </GuideRow>
        )}
      </View>
    </View>
  );
}

export function LessonScreen() {
  const insets = useSafeAreaInsets();
  const { nativeLanguage } = useAuth();
  const listRef = useRef(null);
  const [index, setIndex] = useState(0);
  const stack = SCREEN_WIDTH < STACK_BREAKPOINT;

  const goNext = useCallback(() => {
    const next = (index + 1) % vocabulary.length;
    setIndex(next);
    listRef.current?.scrollToIndex({ index: next, animated: true });
  }, [index]);

  const onScrollToIndexFailed = useCallback((info) => {
    setTimeout(() => {
      listRef.current?.scrollToIndex({
        index: info.index,
        animated: true,
      });
    }, 100);
  }, []);

  const onScrollEnd = useCallback((e) => {
    const x = e.nativeEvent.contentOffset.x;
    const i = Math.round(x / CARD_WIDTH);
    const clamped = Math.max(0, Math.min(i, vocabulary.length - 1));
    setIndex(clamped);
  }, []);

  const renderItem = useCallback(
    ({ item }) => <Flashcard item={item} stack={stack} nativeLanguage={nativeLanguage} />,
    [stack, nativeLanguage],
  );

  return (
    <View style={[styles.screen, { paddingBottom: Math.max(insets.bottom, 16) }]}>
      <View style={styles.header}>
        <Text style={styles.headerLabel}>Lesson</Text>
        <Text style={styles.headerCount}>
          {index + 1} / {vocabulary.length}
        </Text>
      </View>

      <FlatList
        ref={listRef}
        style={styles.list}
        data={vocabulary}
        keyExtractor={(_, i) => `word-${i}`}
        horizontal
        pagingEnabled
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
        onMomentumScrollEnd={onScrollEnd}
        onScrollToIndexFailed={onScrollToIndexFailed}
        getItemLayout={(_, i) => ({
          length: CARD_WIDTH,
          offset: CARD_WIDTH * i,
          index: i,
        })}
      />

      <View style={styles.footer}>
        <Text style={styles.hint}>Swipe or tap the arrow for the next word</Text>
        <Pressable
          onPress={goNext}
          style={({ pressed }) => [
            styles.nextBtn,
            pressed && styles.nextBtnPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Next word"
        >
          <HandDrawnNextArrow />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f0ebe3',
  },
  list: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLabel: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: '#5c4f42',
  },
  headerCount: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2c241c',
  },
  card: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 8,
  },
  armenianBlock: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 28,
    marginBottom: 8,
  },
  armenianScript: {
    fontSize: 52,
    fontWeight: '700',
    color: '#1a1410',
    textAlign: 'center',
    lineHeight: 60,
  },
  armenianPhonetic: {
    marginTop: 10,
    fontSize: 17,
    fontStyle: 'italic',
    color: '#5c4f42',
    textAlign: 'center',
  },
  translationsRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    minHeight: 100,
    gap: 0,
  },
  translationsStack: {
    flexDirection: 'column',
    gap: 16,
  },
  translationCol: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: '#fffdf9',
    borderWidth: 2,
    borderColor: '#2c241c',
    borderRadius: 12,
  },
  translationColFull: {
    flex: 0,
    alignSelf: 'stretch',
  },
  ltrCol: {
    marginRight: 0,
  },
  rtlInner: {
    direction: 'rtl',
    alignSelf: 'stretch',
  },
  divider: {
    width: 2,
    alignSelf: 'stretch',
    backgroundColor: '#c4b5a4',
    marginHorizontal: 8,
    borderRadius: 1,
  },
  colLabel: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    color: '#8a7b6a',
    marginBottom: 6,
  },
  labelRtl: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  englishText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2c241c',
    textAlign: 'left',
    writingDirection: 'ltr',
  },
  persianMean: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1410',
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  persianPhonetic: {
    marginTop: 6,
    fontSize: 15,
    fontStyle: 'italic',
    color: '#5c4f42',
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  guides: {
    marginTop: 20,
    flex: 1,
  },
  tipEn: {
    fontSize: 14,
    lineHeight: 20,
    color: '#3d342a',
    writingDirection: 'ltr',
    textAlign: 'left',
  },
  tipFa: {
    fontSize: 15,
    lineHeight: 22,
    color: '#3d342a',
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  footer: {
    alignItems: 'center',
    paddingTop: 12,
    paddingHorizontal: 20,
  },
  hint: {
    fontSize: 12,
    color: '#6b5d4f',
    marginBottom: 10,
    textAlign: 'center',
  },
  nextBtn: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    backgroundColor: '#fffdf9',
    borderWidth: 3,
    borderColor: '#2c241c',
    borderRadius: 20,
    transform: [{ rotate: '-1deg' }],
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 0,
    elevation: 3,
  },
  nextBtnPressed: {
    opacity: 0.85,
    transform: [{ rotate: '0deg' }, { translateY: 2 }],
  },
});
