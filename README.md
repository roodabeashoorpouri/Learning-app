# Learning app

A cross-platform language-learning app built with [Expo](https://expo.dev/) and [React Native](https://reactnative.dev/). It guides users through sign-up, onboarding, and main study areas: student book content, workbook practice, and profile settings.

## Features

- **Authentication screen** — Collects , , and learning preferences (stored in app state via React context).
- **Onboarding** — Stack flow after auth before entering the main app.
- **Main tabs**
  - **Student Book** — Lesson and reading content.
  - **Workbook** — Exercises and vocabulary (`src/data/vocabulary.js`).
  - **Profile** — User-facing profile area.
- **Styling** — [NativeWind v4](https://www.nativewind.dev/) (Tailwind-style utilities) with `global.css`.

## Tech stack

| Area        | Choice |
|------------|--------|
| Runtime    | Expo SDK ~55 |
| UI         | React 19, React Native |
| Navigation | React Navigation (native stack + bottom tabs) |
| Styling    | NativeWind 4, Tailwind CSS 3 |
| Language   | TypeScript (some `.js` screens/data) |

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- [npm](https://www.npmjs.com/) (comes with Node)
- For devices: [Expo Go](https://expo.dev/go) on a phone, or [Android Studio](https://developer.android.com/studio) / [Xcode](https://developer.apple.com/xcode/) for emulators

## Getting started

```bash
git clone https://github.com/roodabeashoorpouri/Learning-app.git
cd Learning-app
npm install
npm start
```

Then press **a** (Android), **i** (iOS simulator), or scan the QR code with Expo Go.

### npm scripts

| Script      | Description              |
|------------|--------------------------|
| `npm start` | Start the Expo dev server |
| `npm run android` | Start with Android target |
| `npm run ios`     | Start with iOS target     |
| `npm run web`     | Start for web             |

## Project structure

```
app/
├── App.tsx                 # Root: providers + RootNavigator
├── global.css              # NativeWind / Tailwind entry
├── src/
│   ├── components/navigation/  # Root, onboarding, tab navigators
│   ├── context/               # AuthContext (user / prefs)
│   ├── data/                  # e.g. vocabulary
│   └── screens/               # Auth, onboarding, tabs
├── assets/                 # Icons, splash (Expo)
├── app.json                # Expo config
├── tailwind.config.js
├── metro.config.js
└── babel.config.js
```

## Configuration notes

- **Expo** settings live in `app.json` (name, slug, icons, splash).
- **NativeWind** requires `babel.config.js`, `metro.config.js`, and `tailwind.config.js` as already set in this repo.

## License

Private project unless you add an explicit license file.
# Learning-app
# 📚 The Armenian Workbook: A Trilingual Academic Course
### A Structured Educational System for English and Persian Scholars

**The Armenian Workbook** is a professional-grade digital textbook designed for the rigorous study of the Armenian language. Moving away from "gamified" trends, this platform provides a **traditional academic environment**, combining the structured methodology of a physical classroom with the accessibility of a modern mobile application.

---

## 🌍 Open Access & Release
**Coming Soon to the Google Play Store.** This project is committed to supporting the Armenian Diaspora and language learners worldwide. Upon official release, **The Armenian Workbook will be available as a free download** for all Android users. We believe that high-quality academic resources should be accessible to everyone, everywhere.

## 🏛️ Educational Philosophy
This app is built on a **Pedagogical Framework** adapted for a digital "Student & Workbook" format:

* **Academic Continuity:** Lessons are structured as chapters in a physical book, moving logically from phonetics to complex syntax.
* **The "Sarah & John" Instruction:** Two consistent academic guides (Sarah and John) provide linguistic context, grammar rules, and cultural nuances in the student's native tongue.
* **Dual-Track Native Support:** A sophisticated UI engine that fully localizes the academic experience for either **English** or **Persian (RTL)** speakers.
* **Active Application:** Every lesson concludes with a "Workbook Section" requiring fill-in-the-blank exercises and reading comprehension, rather than simple matching games.

## 📖 Module Structure (The 4-Pillar Lesson)
Each academic unit is divided into four rigorous sections:
1.  **Direct Dialogue:** A formal conversation between Sarah and John with trilingual transcriptions.
2.  **Lexical Exploration:** High-fidelity scene illustrations where students identify vocabulary in a situational context (e.g., The Marketplace, The Library).
3.  **Auditory Comprehension:** Focused listening tasks centered on instructor prompts.
4.  **The Workbook:** A summative assessment phase involving written input and grammatical application.

## 🛠️ Technical Architecture
* **Engine:** [React Native](https://reactnative.dev/) via [Expo](https://expo.dev/)
* **Target Platform:** Android (Google Play Store Optimized)
* **UI System:** Custom "Analog-Digital" design system (Paper-textured backgrounds, Ink-wash typography).
* **Logic:** * **Validated Enrollment:** Secure email/username authentication with input sanitization.
    * **Profile-Based Localization:** Conditional rendering logic that adapts the entire syllabus to the student’s chosen native language.
    * **State Persistence:** `AsyncStorage` for tracking academic progress.

## 🚀 Installation (For Developers)
1.  **Clone:** `git clone https://github.com/yourusername/armenian-workbook.git`
2.  **Install:** `npm install`
3.  **Execute:** `npx expo start --android`

---

**"Bridging the Diaspora through Academic Excellence."**
