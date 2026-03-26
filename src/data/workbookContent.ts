import type { WorkbookUnit } from './types';
import { vocabulary } from './vocabulary';

// Helper to build a TrilingualText from a vocabulary entry
function v(index: number) {
  const item = vocabulary[index];
  return {
    hy: item.Armenian_Script,
    hyPhonetic: item.Armenian_Phonetic,
    en: item.English_Mean,
    fa: item.Persian_Mean,
  };
}

// Quick trilingual text builder
function tri(hy: string, hyPhonetic: string, en: string, fa: string) {
  return { hy, hyPhonetic, en, fa };
}

/**
 * Vocabulary index reference:
 *  0: Hello      1: Thank you   2: Yes        3: No
 *  4: Water      5: Bread       6: Book       7: House
 *  8: Friend     9: Day        10: Night     11: Good/kind
 * 12: Love      13: Green      14: Red       15: Door
 * 16: Game      17: Help       18: Problem   19: Wait
 */

export const workbookUnits: WorkbookUnit[] = [
  {
    id: 'u1',
    title: tri('Հիմունքներ', 'hee-moonk-ner', 'Basics', 'مقدماتی'),
    sections: [
      // ── Section 1: Greetings & Polite Words ──
      {
        id: 'u1_s1',
        title: tri('Ողջdelays', 'vogh-jouyn-ner', 'Greetings & Polite Words', 'سلام و احوالپرسی'),
        description: tri('', '', 'Hello, Thank you, Yes, No', 'سلام، متشکرم، بله، نه'),
        exercises: [
          {
            type: 'multiple_choice',
            id: 'u1_s1_e1',
            prompt: {
              ...v(0),
              en: `What does "${vocabulary[0].Armenian_Script}" mean?`,
              fa: `"${vocabulary[0].Armenian_Script}" به چه معناست؟`,
            },
            options: [
              v(0), // Hello ✓
              v(1), // Thank you
              v(3), // No
              v(4), // Water
            ],
            correctIndex: 0,
          },
          {
            type: 'multiple_choice',
            id: 'u1_s1_e2',
            prompt: {
              ...v(1),
              en: `What does "${vocabulary[1].Armenian_Script}" mean?`,
              fa: `"${vocabulary[1].Armenian_Script}" به چه معناست؟`,
            },
            options: [
              v(2), // Yes
              v(3), // No
              v(1), // Thank you ✓
              v(4), // Water
            ],
            correctIndex: 2,
          },
          {
            type: 'fill_blank',
            id: 'u1_s1_e3',
            sentence: tri('', '', '"___" means "Yes" in Armenian.', '"___" به ارمنی یعنی "بله".'),
            options: [
              v(3), // No
              v(2), // Yes ✓
              v(0), // Hello
            ],
            correctIndex: 1,
          },
          {
            type: 'match_pairs',
            id: 'u1_s1_e4',
            pairs: [
              { left: v(0), right: tri('', '', 'Hello', 'سلام') },
              { left: v(2), right: tri('', '', 'Yes', 'بله') },
              { left: v(3), right: tri('', '', 'No', 'نه') },
              { left: v(1), right: tri('', '', 'Thank you', 'متشکرم') },
            ],
          },
          {
            type: 'listening',
            id: 'u1_s1_e5',
            armenianText: vocabulary[0].Armenian_Script,
            armenianPhonetic: vocabulary[0].Armenian_Phonetic,
            options: [
              tri('', '', 'Hello', 'سلام'),    // ✓
              tri('', '', 'No', 'نه'),
              tri('', '', 'Water', 'آب'),
            ],
            correctIndex: 0,
          },
        ],
      },

      // ── Section 2: Everyday Words ──
      {
        id: 'u1_s2',
        title: tri('', '', 'Everyday Words', 'کلمات روزمره'),
        description: tri('', '', 'Water, Bread, Book, House, Friend', 'آب، نان، کتاب، خانه، دوست'),
        exercises: [
          {
            type: 'multiple_choice',
            id: 'u1_s2_e1',
            prompt: {
              ...v(4),
              en: `What does "${vocabulary[4].Armenian_Script}" mean?`,
              fa: `"${vocabulary[4].Armenian_Script}" به چه معناست؟`,
            },
            options: [
              v(5), // Bread
              v(4), // Water ✓
              v(6), // Book
              v(7), // House
            ],
            correctIndex: 1,
          },
          {
            type: 'multiple_choice',
            id: 'u1_s2_e2',
            prompt: {
              ...v(5),
              en: `What does "${vocabulary[5].Armenian_Script}" mean?`,
              fa: `"${vocabulary[5].Armenian_Script}" به چه معناست؟`,
            },
            options: [
              v(8), // Friend
              v(15), // Door
              v(5), // Bread ✓
              v(9), // Day
            ],
            correctIndex: 2,
          },
          {
            type: 'fill_blank',
            id: 'u1_s2_e3',
            sentence: tri('', '', '"___" means "House" in Armenian.', '"___" به ارمنی یعنی "خانه".'),
            options: [
              v(6), // Book
              v(7), // House ✓
              v(4), // Water
            ],
            correctIndex: 1,
          },
          {
            type: 'match_pairs',
            id: 'u1_s2_e4',
            pairs: [
              { left: v(4), right: tri('', '', 'Water', 'آب') },
              { left: v(5), right: tri('', '', 'Bread', 'نان') },
              { left: v(6), right: tri('', '', 'Book', 'کتاب') },
              { left: v(8), right: tri('', '', 'Friend', 'دوست') },
            ],
          },
          {
            type: 'listening',
            id: 'u1_s2_e5',
            armenianText: vocabulary[5].Armenian_Script,
            armenianPhonetic: vocabulary[5].Armenian_Phonetic,
            options: [
              tri('', '', 'Water', 'آب'),
              tri('', '', 'Bread', 'نان'),     // ✓
              tri('', '', 'Friend', 'دوست'),
            ],
            correctIndex: 1,
          },
        ],
      },

      // ── Section 3: Colors & Time ──
      {
        id: 'u1_s3',
        title: tri('', '', 'Colors & Time', 'رنگ‌ها و زمان'),
        description: tri('', '', 'Green, Red, Day, Night, Good', 'سبز، قرمز، روز، شب، خوب'),
        exercises: [
          {
            type: 'multiple_choice',
            id: 'u1_s3_e1',
            prompt: {
              ...v(13),
              en: `What does "${vocabulary[13].Armenian_Script}" mean?`,
              fa: `"${vocabulary[13].Armenian_Script}" به چه معناست؟`,
            },
            options: [
              v(14), // Red
              v(13), // Green ✓
              v(10), // Night
              v(11), // Good
            ],
            correctIndex: 1,
          },
          {
            type: 'multiple_choice',
            id: 'u1_s3_e2',
            prompt: {
              ...v(10),
              en: `What does "${vocabulary[10].Armenian_Script}" mean?`,
              fa: `"${vocabulary[10].Armenian_Script}" به چه معناست؟`,
            },
            options: [
              v(9),  // Day
              v(11), // Good
              v(10), // Night ✓
              v(12), // Love
            ],
            correctIndex: 2,
          },
          {
            type: 'fill_blank',
            id: 'u1_s3_e3',
            sentence: tri('', '', '"___" means "Red" in Armenian.', '"___" به ارمنی یعنی "قرمز".'),
            options: [
              v(13), // Green
              v(14), // Red ✓
              v(11), // Good
            ],
            correctIndex: 1,
          },
          {
            type: 'match_pairs',
            id: 'u1_s3_e4',
            pairs: [
              { left: v(9), right: tri('', '', 'Day', 'روز') },
              { left: v(10), right: tri('', '', 'Night', 'شب') },
              { left: v(14), right: tri('', '', 'Red', 'قرمز') },
              { left: v(13), right: tri('', '', 'Green', 'سبز') },
            ],
          },
          {
            type: 'listening',
            id: 'u1_s3_e5',
            armenianText: vocabulary[14].Armenian_Script,
            armenianPhonetic: vocabulary[14].Armenian_Phonetic,
            options: [
              tri('', '', 'Green', 'سبز'),
              tri('', '', 'Night', 'شب'),
              tri('', '', 'Red', 'قرمز'),     // ✓
            ],
            correctIndex: 2,
          },
        ],
      },
    ],
  },
  {
    id: 'u2',
    title: tri('', '', 'Life & Actions', 'زندگی و کارها'),
    sections: [
      // ── Section 1: Feelings & Descriptions ──
      {
        id: 'u2_s1',
        title: tri('', '', 'Feelings & Descriptions', 'احساسات و توصیفات'),
        description: tri('', '', 'Good, Love, Door, Game', 'خوب، عشق، در، بازی'),
        exercises: [
          {
            type: 'multiple_choice',
            id: 'u2_s1_e1',
            prompt: {
              ...v(11),
              en: `What does "${vocabulary[11].Armenian_Script}" mean?`,
              fa: `"${vocabulary[11].Armenian_Script}" به چه معناست؟`,
            },
            options: [
              v(12), // Love
              v(11), // Good ✓
              v(16), // Game
              v(0),  // Hello
            ],
            correctIndex: 1,
          },
          {
            type: 'multiple_choice',
            id: 'u2_s1_e2',
            prompt: {
              ...v(12),
              en: `What does "${vocabulary[12].Armenian_Script}" mean?`,
              fa: `"${vocabulary[12].Armenian_Script}" به چه معناست؟`,
            },
            options: [
              v(11), // Good
              v(15), // Door
              v(12), // Love ✓
              v(17), // Help
            ],
            correctIndex: 2,
          },
          {
            type: 'fill_blank',
            id: 'u2_s1_e3',
            sentence: tri('', '', '"___" means "Door" in Armenian.', '"___" به ارمنی یعنی "در".'),
            options: [
              v(16), // Game
              v(15), // Door ✓
              v(12), // Love
            ],
            correctIndex: 1,
          },
          {
            type: 'match_pairs',
            id: 'u2_s1_e4',
            pairs: [
              { left: v(11), right: tri('', '', 'Good / kind', 'خوب / مهربان') },
              { left: v(12), right: tri('', '', 'Love', 'عشق') },
              { left: v(15), right: tri('', '', 'Door', 'در') },
              { left: v(16), right: tri('', '', 'Game / play', 'بازی') },
            ],
          },
          {
            type: 'conversation',
            id: 'u2_s1_e5',
            dialogue: [
              {
                speaker: 'Sarah',
                armenian: vocabulary[0].Armenian_Script + '!',
                phonetic: 'bah-rev!',
                en: 'Hello!',
                fa: '!سلام',
              },
              {
                speaker: 'John',
                armenian: vocabulary[0].Armenian_Script + '! ' + vocabulary[11].Armenian_Script + ' ' + vocabulary[9].Armenian_Script + '!',
                phonetic: 'bah-rev! bah-ree or!',
                en: 'Hello! Good day!',
                fa: '!سلام! روز بخیر',
              },
            ],
            question: tri('', '', 'What did John wish Sarah?', 'جان برای سارا چه آرزو کرد؟'),
            options: [
              tri('', '', 'Good night', 'شب بخیر'),
              tri('', '', 'Good day', 'روز بخیر'),
              tri('', '', 'Thank you', 'متشکرم'),
            ],
            correctIndex: 1,
          },
        ],
      },

      // ── Section 2: Useful Phrases ──
      {
        id: 'u2_s2',
        title: tri('', '', 'Useful Phrases', 'عبارات کاربردی'),
        description: tri('', '', 'Help, Problem, Wait', 'کمک، مشکل، صبر کن'),
        exercises: [
          {
            type: 'multiple_choice',
            id: 'u2_s2_e1',
            prompt: {
              ...v(17),
              en: `What does "${vocabulary[17].Armenian_Script}" mean?`,
              fa: `"${vocabulary[17].Armenian_Script}" به چه معناست؟`,
            },
            options: [
              v(19), // Wait
              v(17), // Help ✓
              v(18), // Problem
              v(16), // Game
            ],
            correctIndex: 1,
          },
          {
            type: 'fill_blank',
            id: 'u2_s2_e2',
            sentence: tri('', '', '"___" means "Wait" in Armenian.', '"___" به ارمنی یعنی "صبر کن".'),
            options: [
              v(17), // Help
              v(18), // Problem
              v(19), // Wait ✓
            ],
            correctIndex: 2,
          },
          {
            type: 'match_pairs',
            id: 'u2_s2_e3',
            pairs: [
              { left: v(17), right: tri('', '', 'Help', 'کمک') },
              { left: v(18), right: tri('', '', 'Problem / question', 'مشکل / سؤال') },
              { left: v(19), right: tri('', '', 'Wait (you)', 'صبر کن') },
            ],
          },
          {
            type: 'listening',
            id: 'u2_s2_e4',
            armenianText: vocabulary[17].Armenian_Script,
            armenianPhonetic: vocabulary[17].Armenian_Phonetic,
            options: [
              tri('', '', 'Problem', 'مشکل'),
              tri('', '', 'Help', 'کمک'),    // ✓
              tri('', '', 'Wait', 'صبر کن'),
            ],
            correctIndex: 1,
          },
          {
            type: 'conversation',
            id: 'u2_s2_e5',
            dialogue: [
              {
                speaker: 'Sarah',
                armenian: vocabulary[17].Armenian_Script + '!',
                phonetic: 'og-nu-tyun!',
                en: 'Help!',
                fa: '!کمک',
              },
              {
                speaker: 'John',
                armenian: vocabulary[19].Armenian_Script + '!',
                phonetic: 'spa-seer!',
                en: 'Wait!',
                fa: '!صبر کن',
              },
            ],
            question: tri('', '', 'What did John tell Sarah to do?', 'جان به سارا چه گفت؟'),
            options: [
              tri('', '', 'Help', 'کمک'),
              tri('', '', 'Wait', 'صبر کن'),
              tri('', '', 'Run', 'بدو'),
            ],
            correctIndex: 1,
          },
        ],
      },
    ],
  },
];

/** Flat lookup: find a section by id across all units */
export function findSection(sectionId: string) {
  for (const unit of workbookUnits) {
    const section = unit.sections.find((s) => s.id === sectionId);
    if (section) return { unit, section };
  }
  return null;
}
