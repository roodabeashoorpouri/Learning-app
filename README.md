# Learning app

A cross-platform language-learning app built with [Expo](https://expo.dev/) and [React Native](https://reactnative.dev/). It guides users through sign-up, onboarding, and main study areas: student book content, workbook practice, and profile settings.

## Features

- **Authentication screen** — Collects username, email, and learning preferences (stored in app state via React context).
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
