# Production Plan: Overview & Roadmap

## Executive Summary

This plan transforms the Armenian Language Learning app from a working prototype (1 sample lesson, local storage, no backend) into a production-ready application with full curriculum content, cloud infrastructure, real authentication, speech recognition, and App Store/Play Store distribution.

---

## Current State

| Area | Status |
|------|--------|
| Auth | Client-side only, AsyncStorage |
| Content | 1 sample lesson, 1 workbook unit |
| Backend | None — all local |
| Speech Recognition | UI placeholders only |
| Media | No illustrations or real audio |
| Testing | Zero tests |
| Deployment | Dev mode only (Expo Go) |
| Analytics | None |

---

## Target State

A published mobile app (iOS + Android) with:
- 40 structured lessons across 4 difficulty levels
- Cloud backend with real user accounts
- AI-powered pronunciation feedback
- Professional illustrations and native audio
- Offline-capable with cloud sync
- Analytics dashboard for learning insights

---

## Phase Breakdown

### Phase 1: Foundation (Weeks 1-4)
**Goal:** Replace local hacks with real infrastructure.

| # | Task | Plan Doc | Priority |
|---|------|----------|----------|
| 1 | Supabase backend setup + schema | [01-backend-database.md](01-backend-database.md) | CRITICAL |
| 2 | Real authentication (email + OAuth) | [02-authentication.md](02-authentication.md) | CRITICAL |
| 3 | Email uniqueness + session fixes | [02-authentication.md](02-authentication.md) | CRITICAL |
| 4 | Testing infrastructure | [07-testing.md](07-testing.md) | HIGH |
| 5 | Security hardening | [12-security.md](12-security.md) | HIGH |

### Phase 2: Content & Media (Weeks 5-10)
**Goal:** Build the full curriculum and media pipeline.

| # | Task | Plan Doc | Priority |
|---|------|----------|----------|
| 6 | Full 40-lesson curriculum | [03-content-curriculum.md](03-content-curriculum.md) | CRITICAL |
| 7 | Illustration pipeline | [04-media-assets.md](04-media-assets.md) | HIGH |
| 8 | Native audio recordings | [04-media-assets.md](04-media-assets.md) | HIGH |
| 9 | App logo + branding | [04-media-assets.md](04-media-assets.md) | MEDIUM |
| 10 | Character illustrations (Sarah & John) | [04-media-assets.md](04-media-assets.md) | MEDIUM |

### Phase 3: Intelligence & Polish (Weeks 11-14)
**Goal:** Add AI features, polish the UX, optimize performance.

| # | Task | Plan Doc | Priority |
|---|------|----------|----------|
| 11 | Speech recognition integration | [05-speech-recognition.md](05-speech-recognition.md) | HIGH |
| 12 | Trilingual system refinement | [06-localization.md](06-localization.md) | HIGH |
| 13 | UI polish + animations | [11-ui-polish.md](11-ui-polish.md) | HIGH |
| 14 | Performance + offline support | [08-performance.md](08-performance.md) | MEDIUM |
| 15 | Analytics integration | [10-analytics.md](10-analytics.md) | MEDIUM |

### Phase 4: Launch (Weeks 15-18)
**Goal:** Ship to production.

| # | Task | Plan Doc | Priority |
|---|------|----------|----------|
| 16 | App Store / Play Store submission | [09-deployment.md](09-deployment.md) | CRITICAL |
| 17 | Web deployment | [09-deployment.md](09-deployment.md) | MEDIUM |
| 18 | Final QA + beta testing | [07-testing.md](07-testing.md) | CRITICAL |

---

## Plan Documents Index

| File | Topic |
|------|-------|
| [01-backend-database.md](01-backend-database.md) | Supabase setup, database schema, API layer |
| [02-authentication.md](02-authentication.md) | Real auth, OAuth, email verification, session bugs |
| [03-content-curriculum.md](03-content-curriculum.md) | Full 40-lesson curriculum with content per lesson |
| [04-media-assets.md](04-media-assets.md) | Illustrations, audio, logo, character art |
| [05-speech-recognition.md](05-speech-recognition.md) | Pronunciation AI integration |
| [06-localization.md](06-localization.md) | Trilingual system, RTL, dual-language UI |
| [07-testing.md](07-testing.md) | Test strategy, CI/CD pipeline |
| [08-performance.md](08-performance.md) | Optimization, caching, offline mode |
| [09-deployment.md](09-deployment.md) | App Store, Play Store, web hosting |
| [10-analytics.md](10-analytics.md) | User tracking, learning metrics |
| [11-ui-polish.md](11-ui-polish.md) | Animations, design system, profile page |
| [12-security.md](12-security.md) | Data protection, privacy, compliance |

---

## Key Dependencies

```
Phase 1 (Backend) ──► Phase 2 (Content) ──► Phase 3 (Polish) ──► Phase 4 (Launch)
                  │                      │
                  └── Auth must be done   └── Speech API needs backend
                      before content          for scoring storage
                      sync works
```

## Success Criteria

- [ ] 40 lessons with all 4 sections complete
- [ ] Users can sign up, log in, and resume where they left off
- [ ] Speech recognition provides pronunciation feedback
- [ ] App works offline with sync when online
- [ ] Published on iOS App Store and Google Play Store
- [ ] 95%+ crash-free session rate
- [ ] < 3s cold start time on mid-range devices
