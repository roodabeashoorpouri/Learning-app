import React, { useRef, useState } from 'react';
import { Dimensions, StyleSheet, View, ScrollView } from 'react-native';

import { ConversationSection } from './sections/ConversationSection';
import { ReadingSection } from './sections/ReadingSection';
import { ListeningSection } from './sections/ListeningSection';
import { WritingSection } from './sections/WritingSection';
import { LessonHeader } from './LessonHeader';
import { SectionIndicator } from './SectionIndicator';
import { NavigationHint } from './NavigationHint';
import type { LessonData } from '../../data/types';
import type { NativeLanguage } from '../../context/AuthContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type Props = {
  lessonData: LessonData;
  nativeLanguage: NativeLanguage;
};

const SECTION_NAMES = ['Conversation', 'Reading', 'Listening', 'Writing'];

// Simple web-compatible pager using ScrollView
function SimplePager({ children, onPageSelected, style }: any) {
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentPage, setCurrentPage] = useState(0);

  const handleScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const page = Math.round(offsetX / SCREEN_WIDTH);
    
    if (page !== currentPage && page >= 0 && page < children.length) {
      setCurrentPage(page);
      onPageSelected?.({ nativeEvent: { position: page } });
    }
  };

  return (
    <ScrollView
      ref={scrollViewRef}
      style={style}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      onMomentumScrollEnd={handleScroll}
      scrollEventThrottle={16}
    >
      {children.map((child: any, index: number) => (
        <View key={index} style={{ width: SCREEN_WIDTH, flex: 1 }}>
          {child}
        </View>
      ))}
    </ScrollView>
  );
}

export function LessonPagerView({ lessonData, nativeLanguage }: Props) {
  const [currentSection, setCurrentSection] = useState(0);

  const handlePageSelected = (e: any) => {
    setCurrentSection(e.nativeEvent.position);
  };

  const sections = [
    <ConversationSection 
      key="conversation"
      data={lessonData.conversation}
      nativeLanguage={nativeLanguage}
    />,
    <ReadingSection 
      key="reading"
      data={lessonData.reading}
      nativeLanguage={nativeLanguage}
    />,
    <ListeningSection 
      key="listening"
      data={lessonData.listening}
      nativeLanguage={nativeLanguage}
    />,
    <WritingSection 
      key="writing"
      data={lessonData.writing}
      nativeLanguage={nativeLanguage}
    />
  ];

  return (
    <View style={styles.container}>
      <LessonHeader 
        title={lessonData.title}
        currentSection={currentSection}
        sectionNames={SECTION_NAMES}
        nativeLanguage={nativeLanguage}
      />
      
      <SectionIndicator 
        currentSection={currentSection}
        totalSections={4}
      />

      <SimplePager
        style={styles.pager}
        onPageSelected={handlePageSelected}
      >
        {sections}
      </SimplePager>

      {/* Show navigation hint only on first section */}
      {currentSection === 0 && (
        <NavigationHint nativeLanguage={nativeLanguage} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f4ec',
  },
  pager: {
    flex: 1,
  },
});