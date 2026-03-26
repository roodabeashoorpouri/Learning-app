import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useAuth } from '../context/AuthContext';
import type { RootStackParamList } from '../components/navigation/types';

export function StudentBookScreen() {
  const insets = useSafeAreaInsets();
  const { nativeLanguage, last_visited_lesson_id, last_visited_section_index } = useAuth();
  const isPersian = nativeLanguage === 'fa';
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const hasResumed = useRef(false);

  useEffect(() => {
    if (hasResumed.current) return;
    if (last_visited_lesson_id) {
      hasResumed.current = true;
      navigation.navigate('PracticeSession', { sectionId: last_visited_lesson_id });
    }
  }, [last_visited_lesson_id, navigation]);
  
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <Text style={[styles.title, isPersian && styles.rtlText]}>
          {isPersian ? 'کتاب دانش‌آموز ارمنی' : 'Armenian Student Book'}
        </Text>
        
        <Text style={[styles.subtitle, isPersian && styles.rtlText]}>
          {isPersian ? 'درس ۱ - ملاقات در بازار' : 'Lesson 1 - Meeting at the Market'}
        </Text>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionNumber}>1</Text>
          <Text style={[styles.sectionTitle, isPersian && styles.rtlText]}>
            {isPersian ? 'مکالمه' : 'Conversation'}
          </Text>
          <Text style={[styles.sampleText, isPersian && styles.rtlText]}>
            {isPersian 
              ? 'سارا و جان در بازار سبزیجات ملاقات می‌کنند'
              : 'Sarah and John meet at the vegetable market'
            }
          </Text>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionNumber}>2</Text>
          <Text style={[styles.sectionTitle, isPersian && styles.rtlText]}>
            {isPersian ? 'خواندن' : 'Reading'}
          </Text>
          <Text style={[styles.sampleText, isPersian && styles.rtlText]}>
            {isPersian 
              ? 'نمای کامل بازار با واژگان تعاملی'
              : 'Wide view of the market with interactive vocabulary'
            }
          </Text>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionNumber}>3</Text>
          <Text style={[styles.sectionTitle, isPersian && styles.rtlText]}>
            {isPersian ? 'شنیدن' : 'Listening'}
          </Text>
          <Text style={[styles.sampleText, isPersian && styles.rtlText]}>
            {isPersian 
              ? 'تمرین‌های گوش دادن و تکرار'
              : 'Listen and repeat exercises'
            }
          </Text>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionNumber}>4</Text>
          <Text style={[styles.sectionTitle, isPersian && styles.rtlText]}>
            {isPersian ? 'نوشتن' : 'Writing'}
          </Text>
          <Text style={[styles.sampleText, isPersian && styles.rtlText]}>
            {isPersian 
              ? 'یادگیری الفبای ارمنی'
              : 'Learn the Armenian alphabet'
            }
          </Text>
        </View>

        <View style={styles.comingSoon}>
          <Text style={[styles.comingSoonText, isPersian && styles.rtlText]}>
            {isPersian 
              ? 'قابلیت کامل تعاملی به زودی اضافه می‌شود'
              : 'Full interactive functionality coming soon'
            }
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: '#f7f4ec',
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0f2744',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2d4a66',
    textAlign: 'center',
    marginBottom: 32,
  },
  sectionCard: {
    backgroundColor: '#fffefb',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#1a3d5c',
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0f2744',
    color: '#f7f4ec',
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
    textAlignVertical: 'center',
    marginRight: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f2744',
    marginBottom: 4,
    flex: 1,
  },
  sampleText: {
    fontSize: 14,
    color: '#2d4a66',
    lineHeight: 20,
    position: 'absolute',
    left: 76,
    right: 20,
    bottom: 20,
  },
  comingSoon: {
    marginTop: 32,
    padding: 20,
    backgroundColor: 'rgba(26,61,92,0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(26,61,92,0.2)',
  },
  comingSoonText: {
    fontSize: 16,
    color: '#1a3d5c',
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 24,
  },
  rtlText: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});
