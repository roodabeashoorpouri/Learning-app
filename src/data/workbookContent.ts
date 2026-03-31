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
        title: tri('Ողջույններ', 'vogh-jouyn-ner', 'Greetings & Polite Words', 'سلام و احوالپرسی'),
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
        title: tri('Ամենօրյա Բառեր', 'a-me-nor-ya ba-rer', 'Everyday Words', 'کلمات روزمره'),
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
        title: tri('Գույներ և Ժամանակ', 'guyn-ner yev zha-ma-nak', 'Colors & Time', 'رنگ‌ها و زمان'),
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
    title: tri('Կյանք և Գործողություններ', 'kyanq yev gor-tso-ghu-tyun-ner', 'Life & Actions', 'زندگی و کارها'),
    sections: [
      // ── Section 1: Feelings & Descriptions ──
      {
        id: 'u2_s1',
        title: tri('Զգացմունքներ', 'zga-ts-munk-ner', 'Feelings & Descriptions', 'احساسات و توصیفات'),
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
        title: tri('Օգտակար Արտահայտություններ', 'og-ta-kar ar-ta-hay-tu-tyun-ner', 'Useful Phrases', 'عبارات کاربردی'),
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

  // ═══════════════════════════════════════════════════════
  // Unit 3: Numbers & Counting
  // ═══════════════════════════════════════════════════════
  {
    id: 'u3',
    title: tri('Թվեր', 'tver', 'Numbers & Counting', 'اعداد و شمارش'),
    sections: [
      {
        id: 'u3_s1',
        title: tri('Հաշվել 1-5', 'hash-vel', 'Counting 1–5', 'شمارش ۱ تا ۵'),
        description: tri('', '', 'One, Two, Three, Four, Five', 'یک، دو، سه، چهار، پنج'),
        exercises: [
          {
            type: 'multiple_choice',
            id: 'u3_s1_e1',
            prompt: {
              ...v(20),
              en: `What does "${vocabulary[20].Armenian_Script}" mean?`,
              fa: `"${vocabulary[20].Armenian_Script}" به چه معناست؟`,
            },
            options: [v(21), v(20), v(22), v(23)],
            correctIndex: 1,
          },
          {
            type: 'multiple_choice',
            id: 'u3_s1_e2',
            prompt: {
              ...v(22),
              en: `What does "${vocabulary[22].Armenian_Script}" mean?`,
              fa: `"${vocabulary[22].Armenian_Script}" به چه معناست؟`,
            },
            options: [v(20), v(24), v(22), v(21)],
            correctIndex: 2,
          },
          {
            type: 'fill_blank',
            id: 'u3_s1_e3',
            sentence: tri('', '', '"___" means "Two" in Armenian.', '"___" به ارمنی یعنی "دو".'),
            options: [v(22), v(21), v(20)],
            correctIndex: 1,
          },
          {
            type: 'match_pairs',
            id: 'u3_s1_e4',
            pairs: [
              { left: v(20), right: tri('', '', 'One', 'یک') },
              { left: v(21), right: tri('', '', 'Two', 'دو') },
              { left: v(22), right: tri('', '', 'Three', 'سه') },
              { left: v(23), right: tri('', '', 'Four', 'چهار') },
            ],
          },
          {
            type: 'listening',
            id: 'u3_s1_e5',
            armenianText: vocabulary[24].Armenian_Script,
            armenianPhonetic: vocabulary[24].Armenian_Phonetic,
            options: [
              tri('', '', 'Three', 'سه'),
              tri('', '', 'Four', 'چهار'),
              tri('', '', 'Five', 'پنج'),
            ],
            correctIndex: 2,
          },
        ],
      },
      {
        id: 'u3_s2',
        title: tri('Հաշվել 6-10', 'hash-vel', 'Counting 6–10', 'شمارش ۶ تا ۱۰'),
        description: tri('', '', 'Six, Seven, Eight, Nine, Ten', 'شش، هفت، هشت، نُه، ده'),
        exercises: [
          {
            type: 'multiple_choice',
            id: 'u3_s2_e1',
            prompt: {
              ...v(25),
              en: `What does "${vocabulary[25].Armenian_Script}" mean?`,
              fa: `"${vocabulary[25].Armenian_Script}" به چه معناست؟`,
            },
            options: [v(26), v(25), v(27), v(29)],
            correctIndex: 1,
          },
          {
            type: 'multiple_choice',
            id: 'u3_s2_e2',
            prompt: {
              ...v(29),
              en: `What does "${vocabulary[29].Armenian_Script}" mean?`,
              fa: `"${vocabulary[29].Armenian_Script}" به چه معناست؟`,
            },
            options: [v(28), v(27), v(29), v(25)],
            correctIndex: 2,
          },
          {
            type: 'fill_blank',
            id: 'u3_s2_e3',
            sentence: tri('', '', '"___" means "Eight" in Armenian.', '"___" به ارمنی یعنی "هشت".'),
            options: [v(25), v(27), v(26)],
            correctIndex: 1,
          },
          {
            type: 'match_pairs',
            id: 'u3_s2_e4',
            pairs: [
              { left: v(25), right: tri('', '', 'Six', 'شش') },
              { left: v(26), right: tri('', '', 'Seven', 'هفت') },
              { left: v(28), right: tri('', '', 'Nine', 'نُه') },
              { left: v(29), right: tri('', '', 'Ten', 'ده') },
            ],
          },
          {
            type: 'listening',
            id: 'u3_s2_e5',
            armenianText: vocabulary[26].Armenian_Script,
            armenianPhonetic: vocabulary[26].Armenian_Phonetic,
            options: [
              tri('', '', 'Six', 'شش'),
              tri('', '', 'Seven', 'هفت'),
              tri('', '', 'Eight', 'هشت'),
            ],
            correctIndex: 1,
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════
  // Unit 4: Family & People
  // ═══════════════════════════════════════════════════════
  {
    id: 'u4',
    title: tri('Ընտանիք', 'en-ta-nik', 'Family & People', 'خانواده و افراد'),
    sections: [
      {
        id: 'u4_s1',
        title: tri('Իմ Ընտանիքը', 'im en-ta-ni-ky', 'My Family', 'خانواده من'),
        description: tri('', '', 'Mother, Father, Sister, Brother, Child, Family', 'مادر، پدر، خواهر، برادر، بچه، خانواده'),
        exercises: [
          {
            type: 'multiple_choice',
            id: 'u4_s1_e1',
            prompt: {
              ...v(30),
              en: `What does "${vocabulary[30].Armenian_Script}" mean?`,
              fa: `"${vocabulary[30].Armenian_Script}" به چه معناست؟`,
            },
            options: [v(31), v(30), v(32), v(33)],
            correctIndex: 1,
          },
          {
            type: 'multiple_choice',
            id: 'u4_s1_e2',
            prompt: {
              ...v(33),
              en: `What does "${vocabulary[33].Armenian_Script}" mean?`,
              fa: `"${vocabulary[33].Armenian_Script}" به چه معناست؟`,
            },
            options: [v(32), v(34), v(33), v(30)],
            correctIndex: 2,
          },
          {
            type: 'fill_blank',
            id: 'u4_s1_e3',
            sentence: tri('', '', '"___" means "Sister" in Armenian.', '"___" به ارمنی یعنی "خواهر".'),
            options: [v(33), v(32), v(31)],
            correctIndex: 1,
          },
          {
            type: 'match_pairs',
            id: 'u4_s1_e4',
            pairs: [
              { left: v(30), right: tri('', '', 'Mother', 'مادر') },
              { left: v(31), right: tri('', '', 'Father', 'پدر') },
              { left: v(32), right: tri('', '', 'Sister', 'خواهر') },
              { left: v(33), right: tri('', '', 'Brother', 'برادر') },
            ],
          },
          {
            type: 'conversation',
            id: 'u4_s1_e5',
            dialogue: [
              {
                speaker: 'Sarah',
                armenian: vocabulary[30].Armenian_Script + ' ' + vocabulary[31].Armenian_Script,
                phonetic: 'may-rik hay-rik',
                en: 'Mother, Father',
                fa: 'مادر، پدر',
              },
              {
                speaker: 'John',
                armenian: vocabulary[35].Armenian_Script + '!',
                phonetic: 'en-ta-nik!',
                en: 'Family!',
                fa: 'خانواده!',
              },
            ],
            question: tri('', '', 'What word did John say?', 'جان چه کلمه‌ای گفت؟'),
            options: [
              tri('', '', 'Child', 'بچه'),
              tri('', '', 'Family', 'خانواده'),
              tri('', '', 'Friend', 'دوست'),
            ],
            correctIndex: 1,
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════
  // Unit 5: Food & Daily Life
  // ═══════════════════════════════════════════════════════
  {
    id: 'u5',
    title: tri('Սնունդ', 'snund', 'Food & Daily Life', 'غذا و زندگی روزانه'),
    sections: [
      {
        id: 'u5_s1',
        title: tri('Սնունդ և Ըմպելիք', 'snund yev em-pe-lik', 'Food & Drink', 'غذا و نوشیدنی'),
        description: tri('', '', 'Milk, Meat, Tea, Coffee, Cheese, Fruit', 'شیر، گوشت، چای، قهوه، پنیر، میوه'),
        exercises: [
          {
            type: 'multiple_choice',
            id: 'u5_s1_e1',
            prompt: {
              ...v(36),
              en: `What does "${vocabulary[36].Armenian_Script}" mean?`,
              fa: `"${vocabulary[36].Armenian_Script}" به چه معناست؟`,
            },
            options: [v(37), v(36), v(38), v(39)],
            correctIndex: 1,
          },
          {
            type: 'multiple_choice',
            id: 'u5_s1_e2',
            prompt: {
              ...v(39),
              en: `What does "${vocabulary[39].Armenian_Script}" mean?`,
              fa: `"${vocabulary[39].Armenian_Script}" به چه معناست؟`,
            },
            options: [v(38), v(40), v(39), v(36)],
            correctIndex: 2,
          },
          {
            type: 'fill_blank',
            id: 'u5_s1_e3',
            sentence: tri('', '', '"___" means "Cheese" in Armenian.', '"___" به ارمنی یعنی "پنیر".'),
            options: [v(38), v(40), v(41)],
            correctIndex: 1,
          },
          {
            type: 'match_pairs',
            id: 'u5_s1_e4',
            pairs: [
              { left: v(36), right: tri('', '', 'Milk', 'شیر') },
              { left: v(38), right: tri('', '', 'Tea', 'چای') },
              { left: v(39), right: tri('', '', 'Coffee', 'قهوه') },
              { left: v(40), right: tri('', '', 'Cheese', 'پنیر') },
            ],
          },
          {
            type: 'listening',
            id: 'u5_s1_e5',
            armenianText: vocabulary[38].Armenian_Script,
            armenianPhonetic: vocabulary[38].Armenian_Phonetic,
            options: [
              tri('', '', 'Milk', 'شیر'),
              tri('', '', 'Coffee', 'قهوه'),
              tri('', '', 'Tea', 'چای'),
            ],
            correctIndex: 2,
          },
        ],
      },
      {
        id: 'u5_s2',
        title: tri('Ամենօրյա Բայեր', 'a-me-nor-ya ba-yer', 'Daily Verbs', 'افعال روزانه'),
        description: tri('', '', 'To go, To come, To eat, To drink, To see, To want', 'رفتن، آمدن، خوردن، نوشیدن، دیدن، خواستن'),
        exercises: [
          {
            type: 'multiple_choice',
            id: 'u5_s2_e1',
            prompt: {
              ...v(42),
              en: `What does "${vocabulary[42].Armenian_Script}" mean?`,
              fa: `"${vocabulary[42].Armenian_Script}" به چه معناست؟`,
            },
            options: [v(43), v(42), v(44), v(45)],
            correctIndex: 1,
          },
          {
            type: 'multiple_choice',
            id: 'u5_s2_e2',
            prompt: {
              ...v(44),
              en: `What does "${vocabulary[44].Armenian_Script}" mean?`,
              fa: `"${vocabulary[44].Armenian_Script}" به چه معناست؟`,
            },
            options: [v(42), v(45), v(44), v(47)],
            correctIndex: 2,
          },
          {
            type: 'fill_blank',
            id: 'u5_s2_e3',
            sentence: tri('', '', '"___" means "To drink" in Armenian.', '"___" به ارمنی یعنی "نوشیدن".'),
            options: [v(44), v(45), v(42)],
            correctIndex: 1,
          },
          {
            type: 'match_pairs',
            id: 'u5_s2_e4',
            pairs: [
              { left: v(42), right: tri('', '', 'To go', 'رفتن') },
              { left: v(43), right: tri('', '', 'To come', 'آمدن') },
              { left: v(44), right: tri('', '', 'To eat', 'خوردن') },
              { left: v(47), right: tri('', '', 'To want', 'خواستن') },
            ],
          },
          {
            type: 'listening',
            id: 'u5_s2_e5',
            armenianText: vocabulary[46].Armenian_Script,
            armenianPhonetic: vocabulary[46].Armenian_Phonetic,
            options: [
              tri('', '', 'To eat', 'خوردن'),
              tri('', '', 'To see', 'دیدن'),
              tri('', '', 'To go', 'رفتن'),
            ],
            correctIndex: 1,
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════
  // Unit 6: Common Expressions
  // ═══════════════════════════════════════════════════════
  {
    id: 'u6',
    title: tri('Արտահայտություններ', 'ar-ta-hay-tu-tyun-ner', 'Common Expressions', 'عبارات رایج'),
    sections: [
      {
        id: 'u6_s1',
        title: tri('Հարցեր', 'har-tser', 'Question Words', 'کلمات پرسشی'),
        description: tri('', '', 'What, Where, When, Who, Why', 'چه، کجا، کِی، چه کسی، چرا'),
        exercises: [
          {
            type: 'multiple_choice',
            id: 'u6_s1_e1',
            prompt: {
              ...v(48),
              en: `What does "${vocabulary[48].Armenian_Script}" mean?`,
              fa: `"${vocabulary[48].Armenian_Script}" به چه معناست؟`,
            },
            options: [v(49), v(48), v(50), v(51)],
            correctIndex: 1,
          },
          {
            type: 'multiple_choice',
            id: 'u6_s1_e2',
            prompt: {
              ...v(49),
              en: `What does "${vocabulary[49].Armenian_Script}" mean?`,
              fa: `"${vocabulary[49].Armenian_Script}" به چه معناست؟`,
            },
            options: [v(50), v(52), v(49), v(48)],
            correctIndex: 2,
          },
          {
            type: 'fill_blank',
            id: 'u6_s1_e3',
            sentence: tri('', '', '"___" means "When" in Armenian.', '"___" به ارمنی یعنی "کِی".'),
            options: [v(49), v(50), v(48)],
            correctIndex: 1,
          },
          {
            type: 'match_pairs',
            id: 'u6_s1_e4',
            pairs: [
              { left: v(48), right: tri('', '', 'What', 'چه') },
              { left: v(49), right: tri('', '', 'Where', 'کجا') },
              { left: v(51), right: tri('', '', 'Who', 'چه کسی') },
              { left: v(52), right: tri('', '', 'Why', 'چرا') },
            ],
          },
          {
            type: 'listening',
            id: 'u6_s1_e5',
            armenianText: vocabulary[52].Armenian_Script,
            armenianPhonetic: vocabulary[52].Armenian_Phonetic,
            options: [
              tri('', '', 'What', 'چه'),
              tri('', '', 'Where', 'کجا'),
              tri('', '', 'Why', 'چرا'),
            ],
            correctIndex: 2,
          },
        ],
      },
      {
        id: 'u6_s2',
        title: tri('Նկարագրել', 'nka-ra-grel', 'Describing Things', 'توصیف اشیاء'),
        description: tri('', '', 'Big, Small, Beautiful, New, Old', 'بزرگ، کوچک، زیبا، جدید، قدیمی'),
        exercises: [
          {
            type: 'multiple_choice',
            id: 'u6_s2_e1',
            prompt: {
              ...v(53),
              en: `What does "${vocabulary[53].Armenian_Script}" mean?`,
              fa: `"${vocabulary[53].Armenian_Script}" به چه معناست؟`,
            },
            options: [v(54), v(53), v(55), v(56)],
            correctIndex: 1,
          },
          {
            type: 'multiple_choice',
            id: 'u6_s2_e2',
            prompt: {
              ...v(55),
              en: `What does "${vocabulary[55].Armenian_Script}" mean?`,
              fa: `"${vocabulary[55].Armenian_Script}" به چه معناست؟`,
            },
            options: [v(53), v(57), v(55), v(54)],
            correctIndex: 2,
          },
          {
            type: 'fill_blank',
            id: 'u6_s2_e3',
            sentence: tri('', '', '"___" means "New" in Armenian.', '"___" به ارمنی یعنی "جدید".'),
            options: [v(57), v(56), v(54)],
            correctIndex: 1,
          },
          {
            type: 'match_pairs',
            id: 'u6_s2_e4',
            pairs: [
              { left: v(53), right: tri('', '', 'Big', 'بزرگ') },
              { left: v(54), right: tri('', '', 'Small', 'کوچک') },
              { left: v(56), right: tri('', '', 'New', 'جدید') },
              { left: v(57), right: tri('', '', 'Old', 'قدیمی') },
            ],
          },
          {
            type: 'conversation',
            id: 'u6_s2_e5',
            dialogue: [
              {
                speaker: 'Sarah',
                armenian: vocabulary[53].Armenian_Script + ' ' + vocabulary[7].Armenian_Script + '!',
                phonetic: 'mets toon!',
                en: 'Big house!',
                fa: 'خانه بزرگ!',
              },
              {
                speaker: 'John',
                armenian: vocabulary[55].Armenian_Script + '!',
                phonetic: 'ge-ghe-tsik!',
                en: 'Beautiful!',
                fa: 'زیبا!',
              },
            ],
            question: tri('', '', 'What did John say about the house?', 'جان درباره خانه چه گفت؟'),
            options: [
              tri('', '', 'Big', 'بزرگ'),
              tri('', '', 'Beautiful', 'زیبا'),
              tri('', '', 'New', 'جدید'),
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
