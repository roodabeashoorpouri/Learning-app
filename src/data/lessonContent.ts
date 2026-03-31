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

const lesson2: LessonData = {
  "id": "lesson_2",
  "title": {
    "hy": "Երկրորդ դաս – Ընտանեկան Ընթրիք",
    "en": "Lesson 2 – Family Dinner",
    "fa": "درس ۲ – شام خانوادگی"
  },
  "conversation": {
    "characters": [
      {
        "name": "Sarah",
        "role": "mother",
        "lines": [
          {
            "armenian": "Բարև երեխաներ",
            "phonetic": "Barev yerekha-ner",
            "translation": "Hello children"
          },
          {
            "armenian": "Հաց، շնորհակալություն",
            "phonetic": "Hats, shnorhakalutyun",
            "translation": "Bread, thank you"
          }
        ]
      },
      {
        "name": "John",
        "role": "child",
        "lines": [
          {
            "armenian": "Բարև Մայրիկ",
            "phonetic": "Barev Mayrik",
            "translation": "Hello Mother"
          },
          {
            "armenian": "Ինչ կասես",
            "phonetic": "Inch ka-ses?",
            "translation": "What would you like?"
          }
        ]
      }
    ],
    "setting": {
      "description": "A family seated around a dinner table with Armenian food",
      "illustration": "family_dinner.jpg"
    }
  },
  "reading": {
    "wideAngleScene": {
      "description": "Wide view of a cozy Armenian family kitchen with a set table",
      "illustration": "family_kitchen.jpg"
    },
    "vocabularyHotspots": [
      {
        "id": "mother",
        "armenian": "Մայրիկ",
        "phonetic": "Mayrik",
        "translation": "Mother",
        "xPercent": 25,
        "yPercent": 40
      },
      {
        "id": "father",
        "armenian": "Հայրիկ",
        "phonetic": "Hayrik",
        "translation": "Father",
        "xPercent": 70,
        "yPercent": 40
      },
      {
        "id": "bread",
        "armenian": "Հաց",
        "phonetic": "Hats",
        "translation": "Bread",
        "xPercent": 50,
        "yPercent": 65
      },
      {
        "id": "cheese",
        "armenian": "Պանիր",
        "phonetic": "Panir",
        "translation": "Cheese",
        "xPercent": 40,
        "yPercent": 60
      },
      {
        "id": "table",
        "armenian": "Սեղան",
        "phonetic": "Seghan",
        "translation": "Table",
        "xPercent": 50,
        "yPercent": 80
      }
    ],
    "narrativeText": {
      "armenian": "Ընտանիքը սեղանի շուրջը նստած է. Մայրիկը հաց և պանիր է պատրաստել.",
      "phonetic": "En-ta-ni-ky se-gha-ni shur-jy nsta-tse. May-ri-ky hats yev pa-nir e pa-tras-tel.",
      "translation": "The family is seated around the table. Mother has prepared bread and cheese."
    }
  },
  "listening": {
    "exercises": [
      {
        "id": "listen_l2_1",
        "armenian": "Մայրիկ",
        "phonetic": "Mayrik",
        "instruction": {
          "en": "Listen and repeat \"Mother\" in Armenian",
          "fa": "گوش دهید و \"مادر\" را به ارمنی تکرار کنید"
        },
        "feedback": {
          "en": "Well done! \"Mayrik\" is how Armenians say mother.",
          "fa": "آفرین! \"مایریک\" به معنی مادر در ارمنی است."
        }
      },
      {
        "id": "listen_l2_2",
        "armenian": "Հայրիկ",
        "phonetic": "Hayrik",
        "instruction": {
          "en": "Now practice saying \"Father\"",
          "fa": "حالا \"پدر\" را تمرین کنید"
        },
        "feedback": {
          "en": "Great! \"Hayrik\" sounds natural.",
          "fa": "عالی! \"هایریک\" طبیعی به نظر می‌رسد."
        }
      },
      {
        "id": "listen_l2_3",
        "armenian": "Հաց",
        "phonetic": "Hats",
        "instruction": {
          "en": "Practice the word for \"Bread\"",
          "fa": "کلمه \"نان\" را تمرین کنید"
        },
        "feedback": {
          "en": "Perfect! Armenian bread (hats) is central to every meal.",
          "fa": "عالی! نان ارمنی بخش مهمی از هر وعده غذایی است."
        }
      }
    ]
  },
  "writing": {
    "exercises": [
      {
        "id": "write_l2_1",
        "type": "alphabet",
        "letter": "Մ",
        "strokeOrder": [
          "vertical line down",
          "diagonal down right",
          "diagonal up right",
          "vertical line down"
        ]
      },
      {
        "id": "write_l2_2",
        "type": "alphabet",
        "letter": "Հ",
        "strokeOrder": [
          "vertical line down",
          "horizontal right",
          "vertical line down"
        ]
      },
      {
        "id": "write_l2_3",
        "type": "alphabet",
        "letter": "Պ",
        "strokeOrder": [
          "vertical line down",
          "circle at top"
        ]
      },
      {
        "id": "write_l2_4",
        "type": "transcription",
        "word": {
          "armenian": "Մայրիկ",
          "phonetic": "Mayrik",
          "translation": "Mother"
        }
      },
      {
        "id": "write_l2_5",
        "type": "transcription",
        "word": {
          "armenian": "Հայրիկ",
          "phonetic": "Hayrik",
          "translation": "Father"
        }
      },
      {
        "id": "write_l2_6",
        "type": "transcription",
        "word": {
          "armenian": "Հաց",
          "phonetic": "Hats",
          "translation": "Bread"
        }
      }
    ]
  }
};

const lesson3: LessonData = {
  "id": "lesson_3",
  "title": {
    "hy": "Երրորդ դաս – Սննդի Խանութը",
    "en": "Lesson 3 – At the Store",
    "fa": "درس ۳ – در فروشگاه"
  },
  "conversation": {
    "characters": [
      {
        "name": "Sarah",
        "role": "teacher",
        "lines": [
          {
            "armenian": "Բարև աշակերտներ",
            "phonetic": "Barev ashakert-ner",
            "translation": "Hello students"
          },
          {
            "armenian": "Գիրքը",
            "phonetic": "Gir-ky",
            "translation": "The book"
          }
        ]
      },
      {
        "name": "John",
        "role": "student",
        "lines": [
          {
            "armenian": "Բարև ուսուչիչ",
            "phonetic": "Barev usuchich",
            "translation": "Hello teacher"
          },
          {
            "armenian": "Այո، ուսուչիչ",
            "phonetic": "Ayo, usuchich",
            "translation": "Yes, teacher"
          }
        ]
      }
    ],
    "setting": {
      "description": "A classroom scene with a teacher and students",
      "illustration": "classroom.jpg"
    }
  },
  "reading": {
    "wideAngleScene": {
      "description": "Wide view of an Armenian school classroom",
      "illustration": "school_wide.jpg"
    },
    "vocabularyHotspots": [
      {
        "id": "school",
        "armenian": "Դպրոց",
        "phonetic": "Dprots",
        "translation": "School",
        "xPercent": 50,
        "yPercent": 15
      },
      {
        "id": "teacher",
        "armenian": "Ուսուչիչ",
        "phonetic": "Usuchich",
        "translation": "Teacher",
        "xPercent": 30,
        "yPercent": 45
      },
      {
        "id": "book",
        "armenian": "Գիրք",
        "phonetic": "Girk",
        "translation": "Book",
        "xPercent": 60,
        "yPercent": 55
      },
      {
        "id": "student",
        "armenian": "Աշակերտ",
        "phonetic": "Ashakert",
        "translation": "Student",
        "xPercent": 70,
        "yPercent": 50
      }
    ],
    "narrativeText": {
      "armenian": "Դպրոցը մեծ է. Աշակերտները գիրքեր են կարդում.",
      "phonetic": "Dpro-tsy mets e. A-sha-kert-ne-ry gir-ker yen kar-dum.",
      "translation": "The school is big. The students are reading books."
    }
  },
  "listening": {
    "exercises": [
      {
        "id": "listen_l3_1",
        "armenian": "Դպրոց",
        "phonetic": "Dprots",
        "instruction": {
          "en": "Listen and repeat \"School\"",
          "fa": "گوش دهید و \"مدرسه\" را تکرار کنید"
        },
        "feedback": {
          "en": "Good job! \"Dprots\" means school.",
          "fa": "آفرین! \"دپروځ\" یعنی مدرسه."
        }
      },
      {
        "id": "listen_l3_2",
        "armenian": "Գիրք",
        "phonetic": "Girk",
        "instruction": {
          "en": "Practice saying \"Book\"",
          "fa": "\"کتاب\" را تمرین کنید"
        },
        "feedback": {
          "en": "Great pronunciation!",
          "fa": "تلفظ عالی!"
        }
      },
      {
        "id": "listen_l3_3",
        "armenian": "Ուսուչիչ",
        "phonetic": "Usuchich",
        "instruction": {
          "en": "Now try \"Teacher\"",
          "fa": "حالا \"معلم\" را امتحان کنید"
        },
        "feedback": {
          "en": "Excellent!",
          "fa": "عالی!"
        }
      }
    ]
  },
  "writing": {
    "exercises": [
      {
        "id": "write_l3_1",
        "type": "alphabet",
        "letter": "Դ",
        "strokeOrder": [
          "vertical line down",
          "horizontal hook left"
        ]
      },
      {
        "id": "write_l3_2",
        "type": "alphabet",
        "letter": "Ս",
        "strokeOrder": [
          "curved line",
          "small hook"
        ]
      },
      {
        "id": "write_l3_3",
        "type": "alphabet",
        "letter": "Գ",
        "strokeOrder": [
          "vertical line down",
          "horizontal curve right"
        ]
      },
      {
        "id": "write_l3_4",
        "type": "transcription",
        "word": {
          "armenian": "Դպրոց",
          "phonetic": "Dprots",
          "translation": "School"
        }
      },
      {
        "id": "write_l3_5",
        "type": "transcription",
        "word": {
          "armenian": "Գիրք",
          "phonetic": "Girk",
          "translation": "Book"
        }
      },
      {
        "id": "write_l3_6",
        "type": "transcription",
        "word": {
          "armenian": "Ուսուչիչ",
          "phonetic": "Usuchich",
          "translation": "Teacher"
        }
      }
    ]
  }
};

const lesson4: LessonData = {
  "id": "lesson_4",
  "title": {
    "hy": "Չորրորդ դաս – Սննդարանում",
    "en": "Lesson 4 – At the Restaurant",
    "fa": "درس ۴ – در رستوران"
  },
  "conversation": {
    "characters": [
      {
        "name": "Sarah",
        "role": "waiter",
        "lines": [
          {
            "armenian": "Բարև، ինչ կուզես",
            "phonetic": "Barev, inch kuzes?",
            "translation": "Hello, what would you like?"
          },
          {
            "armenian": "Թեյ թե սուրջ",
            "phonetic": "Tey te surj?",
            "translation": "Tea or coffee?"
          }
        ]
      },
      {
        "name": "John",
        "role": "customer",
        "lines": [
          {
            "armenian": "Կաթ، խնդրեմ",
            "phonetic": "Kat, khndrem",
            "translation": "Milk, please"
          },
          {
            "armenian": "Սուրջ، խնդրեմ",
            "phonetic": "Surj, khndrem",
            "translation": "Coffee, please"
          }
        ]
      }
    ],
    "setting": {
      "description": "A cozy Armenian restaurant with a waiter and customer",
      "illustration": "restaurant.jpg"
    }
  },
  "reading": {
    "wideAngleScene": {
      "description": "Wide view of a traditional Armenian restaurant interior",
      "illustration": "restaurant_wide.jpg"
    },
    "vocabularyHotspots": [
      {
        "id": "restaurant",
        "armenian": "Սննդարան",
        "phonetic": "Snndaran",
        "translation": "Restaurant",
        "xPercent": 50,
        "yPercent": 15
      },
      {
        "id": "tea",
        "armenian": "Թեյ",
        "phonetic": "Tey",
        "translation": "Tea",
        "xPercent": 30,
        "yPercent": 55
      },
      {
        "id": "coffee",
        "armenian": "Սուրջ",
        "phonetic": "Surj",
        "translation": "Coffee",
        "xPercent": 65,
        "yPercent": 55
      },
      {
        "id": "milk",
        "armenian": "Կաթ",
        "phonetic": "Kat",
        "translation": "Milk",
        "xPercent": 45,
        "yPercent": 60
      },
      {
        "id": "menu",
        "armenian": "Ձաշացանկ",
        "phonetic": "Jashatsank",
        "translation": "Menu",
        "xPercent": 75,
        "yPercent": 35
      }
    ],
    "narrativeText": {
      "armenian": "Սննդարանը գեղեցիկ է. Սեղանին թեյ և սուրջ կա.",
      "phonetic": "Snn-da-ra-ny ge-ghe-tsik e. Se-gha-nin tey yev surj ka.",
      "translation": "The restaurant is beautiful. There is tea and coffee on the table."
    }
  },
  "listening": {
    "exercises": [
      {
        "id": "listen_l4_1",
        "armenian": "Թեյ",
        "phonetic": "Tey",
        "instruction": {
          "en": "Listen and repeat \"Tea\"",
          "fa": "گوش دهید و \"چای\" را تکرار کنید"
        },
        "feedback": {
          "en": "Perfect! Now you can order tea in Armenian.",
          "fa": "عالی! حالا می‌توانید به ارمنی چای سفارش دهید."
        }
      },
      {
        "id": "listen_l4_2",
        "armenian": "Սուրջ",
        "phonetic": "Surj",
        "instruction": {
          "en": "Now practice \"Coffee\"",
          "fa": "حالا \"قهوه\" را تمرین کنید"
        },
        "feedback": {
          "en": "Great! Armenian coffee is famous worldwide.",
          "fa": "عالی! قهوه ارمنی در جهان مشهور است."
        }
      },
      {
        "id": "listen_l4_3",
        "armenian": "Կաթ",
        "phonetic": "Kat",
        "instruction": {
          "en": "Try saying \"Milk\"",
          "fa": "\"شیر\" را بگویید"
        },
        "feedback": {
          "en": "Well done!",
          "fa": "آفرین!"
        }
      }
    ]
  },
  "writing": {
    "exercises": [
      {
        "id": "write_l4_1",
        "type": "alphabet",
        "letter": "Թ",
        "strokeOrder": [
          "circle",
          "horizontal right",
          "small tail"
        ]
      },
      {
        "id": "write_l4_2",
        "type": "alphabet",
        "letter": "Կ",
        "strokeOrder": [
          "vertical line down",
          "angled line left"
        ]
      },
      {
        "id": "write_l4_3",
        "type": "alphabet",
        "letter": "Ջ",
        "strokeOrder": [
          "vertical line down",
          "curve at bottom"
        ]
      },
      {
        "id": "write_l4_4",
        "type": "transcription",
        "word": {
          "armenian": "Թեյ",
          "phonetic": "Tey",
          "translation": "Tea"
        }
      },
      {
        "id": "write_l4_5",
        "type": "transcription",
        "word": {
          "armenian": "Սուրջ",
          "phonetic": "Surj",
          "translation": "Coffee"
        }
      },
      {
        "id": "write_l4_6",
        "type": "transcription",
        "word": {
          "armenian": "Կաթ",
          "phonetic": "Kat",
          "translation": "Milk"
        }
      }
    ]
  }
};

export const lessons: LessonData[] = [sampleLesson, lesson2, lesson3, lesson4];