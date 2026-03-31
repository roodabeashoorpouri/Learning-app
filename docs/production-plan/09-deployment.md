# Plan 09: Deployment & Distribution

## Overview

The app targets three platforms: iOS (App Store), Android (Google Play), and Web. Expo's EAS (Expo Application Services) handles builds and submissions.

---

## Pre-Deployment Checklist

### App Identity
- [ ] Choose official app name (currently "app")
- [ ] Register bundle identifier: `com.yourorg.armenianlearning` (or similar)
- [ ] Create app icon at all required sizes
- [ ] Create splash screen
- [ ] Write App Store description (English + Persian)
- [ ] Create screenshots for store listing (6.7" iPhone, 6.5" iPhone, iPad, Android phone)
- [ ] Create promotional graphics (feature graphic, banner)
- [ ] Privacy policy URL (required by both stores)
- [ ] Terms of service URL

### Technical
- [ ] Remove all `console.log` statements
- [ ] Set production environment variables
- [ ] Configure error reporting (Sentry)
- [ ] Enable Hermes JavaScript engine (already default in Expo 54)
- [ ] Test on physical devices (not just simulators)
- [ ] Test on low-end devices
- [ ] Verify deep linking works for OAuth callbacks

---

## EAS Build Setup

### Install EAS CLI
```bash
npm install -g eas-cli
eas login
```

### Configure EAS (`eas.json`)
```json
{
  "cli": {
    "version": ">= 12.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": false
      },
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "ios": {
        "autoIncrement": true
      },
      "android": {
        "autoIncrement": true,
        "buildType": "app-bundle"
      },
      "env": {
        "EXPO_PUBLIC_SUPABASE_URL": "https://your-project.supabase.co",
        "EXPO_PUBLIC_SUPABASE_ANON_KEY": "your-anon-key"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-apple-id@email.com",
        "ascAppId": "your-app-store-connect-app-id",
        "appleTeamId": "YOUR_TEAM_ID"
      },
      "android": {
        "serviceAccountKeyPath": "./google-service-account.json",
        "track": "production"
      }
    }
  }
}
```

### Update `app.json` for Production

```json
{
  "expo": {
    "name": "Armenian Learning",
    "slug": "armenian-learning",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#F8FAFC"
    },
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.yourorg.armenianlearning",
      "buildNumber": "1",
      "infoPlist": {
        "NSMicrophoneUsageDescription": "We need microphone access to check your pronunciation.",
        "NSSpeechRecognitionUsageDescription": "We use speech recognition to evaluate your Armenian pronunciation."
      }
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#F8FAFC"
      },
      "package": "com.yourorg.armenianlearning",
      "versionCode": 1,
      "permissions": ["RECORD_AUDIO"]
    },
    "web": {
      "favicon": "./assets/favicon.png",
      "bundler": "metro"
    },
    "plugins": [
      "expo-font",
      [
        "expo-av",
        {
          "microphonePermission": "Allow Armenian Learning to access your microphone for pronunciation practice."
        }
      ]
    ],
    "scheme": "armenianlearning"
  }
}
```

---

## iOS App Store

### Requirements
- Apple Developer Account ($99/year)
- Apple Sign-In implemented (required if any third-party login is offered)
- Privacy policy
- App rating questionnaire completed

### Submission Process
```bash
# Build for iOS
eas build --platform ios --profile production

# Submit to App Store Connect
eas submit --platform ios --profile production
```

### App Store Review Considerations
- Armenian language content should be clearly marked as educational
- Microphone permission must have clear usage description
- If offering subscriptions later, must use Apple's in-app purchase
- Test account credentials must be provided for reviewers

### Metadata (App Store Connect)

**Primary Category:** Education
**Secondary Category:** Reference

**Keywords:** Armenian, language learning, Hayeren, alphabet, aybuben, vocabulary, pronunciation, Persian, Farsi, bilingual

**Description (English):**
> Master the Armenian language with a structured, academic approach. Designed for serious learners, this app mirrors traditional classroom curricula with four integrated study methods: Conversation, Reading, Listening, and Writing. Features include tap-to-translate immersion, native pronunciation audio, and AI-powered pronunciation feedback. Learn Armenian with English or Persian as your guide language.

---

## Google Play Store

### Requirements
- Google Play Developer Account ($25 one-time)
- Service account JSON key for automated submission
- Privacy policy URL
- Content rating questionnaire
- Data safety form

### Submission Process
```bash
# Build for Android
eas build --platform android --profile production

# Submit to Google Play
eas submit --platform android --profile production
```

### Data Safety Form
Declare data collection:
- Email address (for authentication)
- Name/username (for profile)
- Audio recordings (for pronunciation, stored temporarily)
- Learning progress (for personalization)
- Device info (for crash reporting)

---

## Web Deployment

### Hosting Options

**Option A: Vercel (Recommended for Expo Web)**
```bash
# Build web version
npx expo export --platform web

# Deploy to Vercel
vercel deploy dist/
```

**Option B: Netlify**
```bash
npx expo export --platform web
netlify deploy --dir=dist --prod
```

### Web-Specific Considerations
- Microphone API requires HTTPS
- Audio playback may need user interaction to start (browser autoplay policy)
- Swipe gestures need touch event polyfills for mouse users
- Test in Chrome, Safari, Firefox
- PWA manifest for installability

---

## Environment Management

### Environment Variables

| Variable | Dev | Staging | Production |
|----------|-----|---------|-----------|
| `EXPO_PUBLIC_SUPABASE_URL` | Local/dev project | Staging project | Production project |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Dev key | Staging key | Production key |
| `EXPO_PUBLIC_GOOGLE_CLOUD_KEY` | Dev key | Staging key | Production key |
| `SENTRY_DSN` | Dev DSN | Staging DSN | Production DSN |

### Separate Supabase Projects
- **Development:** Free tier, seed data, frequent resets
- **Staging:** Free tier, mirrors production schema, QA testing
- **Production:** Pro tier ($25/month), real user data, backups enabled

---

## Release Process

### Version Strategy
- **Major:** Significant new features (e.g., new level added)
- **Minor:** Feature additions, improvements
- **Patch:** Bug fixes, content corrections

### Release Checklist

```
Pre-release:
  □ All tests pass (CI green)
  □ QA tested on iOS device
  □ QA tested on Android device
  □ QA tested on web
  □ Release notes written
  □ Version bumped in app.json

Release:
  □ Create git tag (v1.0.0)
  □ EAS build iOS production
  □ EAS build Android production
  □ EAS submit iOS
  □ EAS submit Android
  □ Deploy web

Post-release:
  □ Monitor Sentry for new errors
  □ Monitor analytics for anomalies
  □ Respond to store reviews
```

---

## OTA Updates

Expo supports Over-The-Air updates for JavaScript/asset changes (no native code changes):

```bash
# Push an OTA update
eas update --branch production --message "Fix typo in Lesson 3"
```

This allows fixing content errors and minor bugs without going through store review.

---

## Implementation Steps

1. [ ] Create Apple Developer account
2. [ ] Create Google Play Developer account
3. [ ] Register bundle identifiers
4. [ ] Install and configure EAS CLI
5. [ ] Create `eas.json` configuration
6. [ ] Update `app.json` with real app identity
7. [ ] Create development and preview builds
8. [ ] Test on physical iOS device
9. [ ] Test on physical Android device
10. [ ] Write privacy policy
11. [ ] Create store listing screenshots
12. [ ] Write store descriptions (English + Persian)
13. [ ] Submit to iOS App Store (TestFlight first)
14. [ ] Submit to Google Play (internal testing first)
15. [ ] Set up OTA update workflow
16. [ ] Deploy web version
