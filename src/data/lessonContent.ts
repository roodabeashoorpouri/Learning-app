import type { LessonData } from './types';

export const sampleLesson: LessonData = {
  id: 'lesson_1',
  title: {
    hy: 'Առաջին դաս - Ծանոթություն',
    en: 'Lesson 1 - Meeting at the Bus Stop',
    fa: 'درس ۱ - ملاقات در ایستگاه اتوبوس'
  },
  conversation: {
    characters: [
      {
        name: 'Sarah',
        role: 'shopper',
        lines: [
          {
            armenian: 'Բարև Ջոն, ինչպե՞ս ես։',
            phonetic: 'Barev Jon, inchpes yes?',
            translation: 'Hello John, how are you?'
          },
          {
            armenian: 'Սա կարմիր խնձոր է։',
            phonetic: 'Sa karmir khndzor e.',
            translation: 'This is a red apple.'
          }
        ]
      },
      {
        name: 'John',
        role: 'friend',
        lines: [
          {
            armenian: 'Բարև Սարա, ես լավ եմ։',
            phonetic: 'Barev Sara, yes lav yem.',
            translation: 'Hello Sarah, I am well.'
          },
          {
            armenian: 'Իսկ այս գազարը կանաչ է։',
            phonetic: 'Isk ays gazary kanach e.',
            translation: 'And this carrot is green.'
          }
        ]
      }
    ],
    setting: {
      description: 'Sarah and John meeting at a vegetable market - close-up view',
      illustration: 'market_closeup.jpg'
    }
  },
  reading: {
    wideAngleScene: {
      description: 'Wide view of the bustling vegetable market with stalls, people, and colorful produce',
      illustration: 'market_wide.jpg'
    },
    vocabularyHotspots: [
      {
        id: 'apple',
        armenian: 'Խնձոր',
        phonetic: 'Khndzor',
        translation: 'Apple',
        xPercent: 22,
        yPercent: 38
      },
      {
        id: 'carrot',
        armenian: 'Գազար',
        phonetic: 'Gazar',
        translation: 'Carrot',
        xPercent: 72,
        yPercent: 52
      },
      {
        id: 'basket',
        armenian: 'Տոպրակ',
        phonetic: 'Toprak',
        translation: 'Basket',
        xPercent: 48,
        yPercent: 72
      },
      {
        id: 'vendor',
        armenian: 'Վաճառող',
        phonetic: 'Vacharogh',
        translation: 'Vendor',
        xPercent: 65,
        yPercent: 25
      },
      {
        id: 'market',
        armenian: 'Շուկա',
        phonetic: 'Shuka',
        translation: 'Market',
        xPercent: 50,
        yPercent: 15
      }
    ],
    narrativeText: {
      armenian: 'Սարան և Ջոնը շուկայում են։ Նրանք բանջարեղեն են գնում։ Շուկայում կան կարմիր խնձորներ, կանաչ գազարներ և այլ բանջարեղեններ։ Վաճառողները բարի են և օգնում են գնորդներին։',
      phonetic: 'Saran yev Jony shukayum yen. Nrank banjargheghen yen gnum. Shukayum kan karmir khndzoerner, kanach gazarner yev ayl banjargheghenner. Vacharoghery bari yen yev ognum yen gnordnerin.',
      translation: 'Sarah and John are at the market. They are buying vegetables. In the market there are red apples, green carrots and other vegetables. The vendors are kind and help the customers.'
    }
  },
  listening: {
    exercises: [
      {
        id: 'listen_1',
        armenian: 'Բարև',
        phonetic: 'Barev',
        instruction: {
          en: 'Listen to this common Armenian greeting and repeat it clearly',
          fa: 'به این سلام رایج ارمنی گوش دهید و آن را واضح تکرار کنید'
        },
        feedback: {
          en: 'Excellent! Your pronunciation of "Barev" is very natural.',
          fa: 'عالی! تلفظ شما از "بارو" بسیار طبیعی است.'
        }
      },
      {
        id: 'listen_2',
        armenian: 'Կարմիր խնձոր',
        phonetic: 'Karmir khndzor',
        instruction: {
          en: 'Practice saying "red apple" - focus on the "kh" sound',
          fa: 'تمرین گفتن "سیب قرمز" - روی صدای "خ" تمرکز کنید'
        },
        feedback: {
          en: 'Good work! Remember the "kh" sound is like clearing your throat gently.',
          fa: 'کار خوبی! به یاد داشته باشید صدای "خ" مثل پاک کردن آرام گلو است.'
        }
      },
      {
        id: 'listen_3',
        armenian: 'Ինչպե՞ս ես',
        phonetic: 'Inchpes yes',
        instruction: {
          en: 'This means "How are you?" - notice the question intonation',
          fa: 'این یعنی "حالت چطوره؟" - به آهنگ سؤالی توجه کنید'
        },
        feedback: {
          en: 'Perfect! Your question intonation sounds very Armenian.',
          fa: 'عالی! آهنگ سؤالی شما خیلی ارمنی به نظر می‌رسد.'
        }
      }
    ]
  },
  writing: {
    exercises: [
      {
        id: 'write_1',
        type: 'alphabet',
        letter: 'Բ',
        strokeOrder: ['vertical line down', 'top horizontal curve', 'bottom horizontal curve']
      },
      {
        id: 'write_2',
        type: 'alphabet',
        letter: 'ա',
        strokeOrder: ['small circle', 'vertical line down']
      },
      {
        id: 'write_3',
        type: 'alphabet',
        letter: 'ր',
        strokeOrder: ['curved line', 'small hook at bottom']
      },
      {
        id: 'write_4',
        type: 'transcription',
        word: {
          armenian: 'Բարև',
          phonetic: 'Barev',
          translation: 'Hello'
        }
      },
      {
        id: 'write_5',
        type: 'transcription',
        word: {
          armenian: 'Խնձոր',
          phonetic: 'Khndzor',
          translation: 'Apple'
        }
      },
      {
        id: 'write_6',
        type: 'transcription',
        word: {
          armenian: 'Կարմիր',
          phonetic: 'Karmir',
          translation: 'Red'
        }
      }
    ]
  }
};

export const lessons: LessonData[] = [sampleLesson];