# Plan 03: Full Content & Curriculum

## Curriculum Structure

**40 lessons** organized into **4 levels** of 10 lessons each, following the existing 4-section format (Conversation → Reading → Listening → Writing).

---

## Level 1: Foundations (Lessons 1-10)
**Theme:** Everyday life, introductions, basic survival phrases.
**Writing Focus:** Armenian alphabet (Aybuben) — individual letters.
**Vocabulary per lesson:** 8-12 new words.

| # | Lesson Title (EN) | Title (HY) | Setting | Key Vocabulary |
|---|-------------------|-------------|---------|----------------|
| 1 | Meeting at the Market | Շուկայում հանdelays | Vegetable market | Greetings, fruits, vegetables, numbers 1-5 |
| 2 | At the Bus Stop | Կdelays կայարանում | City bus stop | Transportation, directions (left/right), colors |
| 3 | In the Café | Սurroundings | Corner café | Drinks, food, "please"/"thank you", numbers 6-10 |
| 4 | My Family | Իdrag ընdragdelays | Living room at home | Family members, possessives ("my", "your") |
| 5 | At the Doctor | Բdelay մdelays | Doctor's clinic | Body parts, feelings ("I feel"), basic adjectives |
| 6 | The Weather Today | Այdelays delays | Park with bench | Weather words, seasons, days of the week |
| 7 | Shopping for Clothes | Հdelay delays | Clothing store | Clothing items, sizes, colors (expanded) |
| 8 | At School | Դdelay | Classroom | School supplies, "where is?", classroom objects |
| 9 | Cooking Together | Միdelay | Kitchen | Kitchen items, action verbs (cut, mix, cook) |
| 10 | Review: A Day in the City | | City panorama | Comprehensive review of Level 1 vocabulary |

**Alphabet Coverage (Writing Section):**
| Lesson | Letters Introduced |
|--------|-------------------|
| 1 | Ա ա (A), Բ բ (B), Գ գ (G) |
| 2 | Դ դ (D), Ե delays (Ye), Զ զ (Z) |
| 3 | Է է (E), Ը ը (Ə), Թ թ (T') |
| 4 | Ժ ժ (Zh), Ի delays (I), Լ լ (L) |
| 5 | Խ խ (Kh), Ծ ծ (Ts), Կ կ (K) |
| 6 | Հ հ (H), Ձ ձ (Dz), Ղ ղ (Gh) |
| 7 | Ճ chwith (Tch), Մ մ (M), Յ յ (Y) |
| 8 | Ն rants (N), Շ շ (Sh), Ո rants (Vo) |
| 9 | Չ չ (Ch), Պ rants (P), Ջ rant (J) |
| 10 | Ռ rant (Rr), Delays (S), Վ delimit (V), Տ delimit (T), Delays delimit (R), Delays delimit (Ts'), Uters (U), Փ delimit (P'), Ք delimit (K'), Ew (Ev), Ot (O), Fers (F) — review all 39 letters |

---

## Level 2: Conversational (Lessons 11-20)
**Theme:** Social interactions, opinions, past tense, expanded situations.
**Writing Focus:** Whole words, short phrases, spelling.
**Vocabulary per lesson:** 12-15 new words.

| # | Lesson Title (EN) | Setting | Key Grammar/Vocabulary |
|---|-------------------|---------|----------------------|
| 11 | Making Friends | Park playground | Introductions, "what's your name?", hobbies |
| 12 | At the Restaurant | Restaurant dining | Ordering food, menu items, polite requests |
| 13 | My Home | Apartment interior | Rooms, furniture, prepositions (in/on/under) |
| 14 | Weekend Plans | Phone call scene | Future tense, activities, time expressions |
| 15 | At the Library | Library interior | Books, reading, "I like/don't like" |
| 16 | A Birthday Party | Decorated room | Celebrations, gifts, numbers 11-100 |
| 17 | Going to the Movies | Cinema lobby | Entertainment, opinions ("I think...") |
| 18 | The Neighborhood | Street map view | Places in town, giving directions |
| 19 | Feeling Sick | Pharmacy counter | Health, medicine, past tense ("I was...") |
| 20 | Review: A Weekend Story | Multiple scenes | Narrative combining all Level 2 vocabulary |

---

## Level 3: Intermediate (Lessons 21-30)
**Theme:** Complex situations, abstract concepts, connected discourse.
**Writing Focus:** Full sentences, short paragraphs, dictation.
**Vocabulary per lesson:** 15-20 new words.

| # | Lesson Title (EN) | Setting | Key Grammar/Vocabulary |
|---|-------------------|---------|----------------------|
| 21 | Job Interview | Office | Professions, skills, formal language |
| 22 | Travel Plans | Travel agency | Countries, booking, conditional ("if I...") |
| 23 | Armenian Holidays | Festival scene | Traditions, customs, cultural vocabulary |
| 24 | At the Bank | Bank interior | Money, transactions, formal requests |
| 25 | The News | Living room with TV | Current events, opinions, reported speech |
| 26 | Childhood Memories | Old photograph | Past tense (expanded), emotions, "used to" |
| 27 | Environmental Issues | Nature scene | Nature, problems/solutions, "we should" |
| 28 | Technology & Social Media | Home office | Devices, internet, "how do you...?" |
| 29 | Armenian Cuisine | Kitchen/dining | Recipes, ingredients, sequential instructions |
| 30 | Review: My Armenian Journey | Reflection scene | Comprehensive narrative review |

---

## Level 4: Advanced (Lessons 31-40)
**Theme:** Fluency, nuance, literature, formal/informal register.
**Writing Focus:** Multi-paragraph composition, reading section becomes full stories.
**Vocabulary per lesson:** 20-25 new words.

| # | Lesson Title (EN) | Setting | Key Grammar/Vocabulary |
|---|-------------------|---------|----------------------|
| 31 | Armenian Literature | Bookshop | Literary vocabulary, passive voice, quote structures |
| 32 | Debate & Discussion | University hall | Argumentation, conjunctions, "although/however" |
| 33 | The History of Armenia | Museum | Historical terms, timeline expressions, narrative past |
| 34 | Business Meeting | Conference room | Professional language, presentations, polite disagreement |
| 35 | Armenian Music & Art | Gallery/concert | Arts vocabulary, describing aesthetics, comparatives/superlatives |
| 36 | Healthcare System | Hospital | Medical terminology, explaining symptoms in detail |
| 37 | Law & Government | Government building | Civic vocabulary, rights, formal register |
| 38 | Armenian Diaspora | World map scene | Migration, identity, complex emotions, subjunctive mood |
| 39 | Philosophy & Ethics | Café discussion | Abstract concepts, conditional perfect, debate |
| 40 | Graduation: My Armenian Voice | Celebration scene | Free expression, self-evaluation, comprehensive review |

---

## Content Format Per Lesson

Each lesson follows the existing `LessonData` TypeScript type. Here's the structure for content creation:

### Conversation Section
```typescript
{
  dialogue: [
    {
      speaker: 'sarah' | 'john' | string,  // characters expand later
      text: { hy, hyPhonetic, en, fa },
      emotion?: 'happy' | 'curious' | 'surprised' | 'neutral'
    }
  ],
  setting: { en, fa },
  illustration: string  // URL to scene illustration
}
```

**Requirements per lesson:**
- 4-8 dialogue lines (Level 1-2), 8-12 lines (Level 3-4)
- Each line fully translated (Armenian script + phonetic + English + Persian)
- Speaker assignments alternate naturally

### Reading Section
```typescript
{
  sceneDescription: { en, fa },
  illustration: string,  // wide-angle scene URL
  hotspots: [
    {
      id: string,
      label: { hy, hyPhonetic, en, fa },
      position: { x: number, y: number }  // percentage coordinates on image
    }
  ],
  narrative: [
    { hy, hyPhonetic, en, fa }  // paragraphs, growing in length per level
  ]
}
```

**Requirements per lesson:**
- 5-8 hotspots (Level 1), 8-12 (Level 2), 10-15 (Level 3-4)
- 1-2 sentences narrative (Level 1), 1-2 paragraphs (Level 2), 3+ paragraphs (Level 3-4)

### Listening Section
```typescript
{
  exercises: [
    {
      phrase: { hy, hyPhonetic, en, fa },
      audioUrl: string,
      difficulty: 'word' | 'phrase' | 'sentence'
    }
  ]
}
```

**Requirements per lesson:**
- 5-8 exercises
- Level 1: single words → Level 4: complex sentences

### Writing Section
```typescript
{
  alphabetExercises?: [  // Level 1 only
    {
      letter: string,
      strokeOrderUrl: string,  // animation file
      exampleWord: { hy, hyPhonetic, en, fa }
    }
  ],
  transcriptionExercises: [
    {
      prompt: { hy, hyPhonetic, en, fa },
      expectedInput: string,
      inputType: 'trace' | 'type'
    }
  ]
}
```

---

## Content Creation Workflow

### Step 1: Curriculum Script (Human Expert)
An Armenian language teacher writes the raw content:
- Dialogue scripts
- Vocabulary lists with translations
- Grammar notes
- Reading passages

### Step 2: Translation & Phonetics (Human Expert)
A trilingual translator provides:
- Persian translations
- Armenian phonetic romanization
- Cultural context notes

### Step 3: Content Digitization (Developer)
Convert scripts into TypeScript data files:
- Follow the `LessonData` type structure
- Validate all trilingual fields are populated
- Map vocabulary to exercise types

### Step 4: Exercise Generation (Semi-Automated)
For each lesson's vocabulary and grammar, generate:
- 2-3 Multiple Choice exercises
- 1-2 Fill in the Blank exercises
- 1 Match Pairs exercise
- 1-2 Translation exercises
- 1-2 Listening exercises
- 1 Conversation comprehension exercise

**Total: ~8-10 exercises per workbook section, 2 sections per unit = 16-20 exercises per lesson.**

### Step 5: Review & QA
- Native speaker review for accuracy
- RTL layout check for Persian
- Audio alignment check

---

## Content Storage Strategy

### Phase 1 (Development): Local TypeScript Files
```
src/data/
├── lessons/
│   ├── level-1/
│   │   ├── lesson-01.ts
│   │   ├── lesson-02.ts
│   │   └── ...
│   ├── level-2/
│   ├── level-3/
│   └── level-4/
├── workbook/
│   ├── unit-01.ts
│   ├── unit-02.ts
│   └── ...
└── types.ts
```

### Phase 2 (Production): Supabase Database
- Migrate all lesson content to `lessons` and `workbook_units` tables
- Content served via API, cached locally
- Enables updating content without app updates
- Admin panel for content management (future)

---

## Workbook Exercise Distribution

For each lesson's workbook unit:

| Exercise Type | Count | Source Material |
|---------------|-------|-----------------|
| Multiple Choice | 3 | Vocabulary from Reading + Conversation |
| Fill in the Blank | 2 | Sentences from Conversation |
| Match Pairs | 1 | Hotspot vocabulary from Reading |
| Translation | 2 | Key phrases from Conversation |
| Listening | 2 | Phrases from Listening section |
| Conversation | 1 | Dialogue comprehension |
| **Total** | **~11** | |

---

## Character Evolution

| Lessons | Characters | Context |
|---------|-----------|---------|
| 1-10 | Sarah & John | Two friends exploring the city |
| 11-15 | + Aram (shopkeeper) | Local character, cultural guide |
| 16-20 | + Ani (student) | Younger perspective, slang |
| 21-30 | + Hasmik (grandmother) | Formal speech, stories, traditions |
| 31-40 | + Levon (professor) | Academic language, debates |

---

## Implementation Steps

1. [ ] Hire/engage Armenian language content creator
2. [ ] Hire/engage Persian translator
3. [ ] Create lesson template files (TypeScript stubs)
4. [ ] Write Lessons 1-5 content (Level 1 first half)
5. [ ] Generate workbook exercises for Lessons 1-5
6. [ ] QA review of Lessons 1-5
7. [ ] Write Lessons 6-10 (Level 1 second half)
8. [ ] Write Lessons 11-20 (Level 2)
9. [ ] Write Lessons 21-30 (Level 3)
10. [ ] Write Lessons 31-40 (Level 4)
11. [ ] Migrate content to Supabase (once backend is ready)
12. [ ] Build content validation script (ensures all trilingual fields populated)
