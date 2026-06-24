# Heimdall - Developer Log

This document records all implementations, fixes, and progress made on the Heimdall project.

---

## [2026-06-24] - Phase 4 Completion & Phase 5 Pivot

### Sprint 4 - Alarm Overlay Screen
- Created alarm-overlay.tsx as FullScreenModal triggered when alarm rings.
- Shows real-time clock, AI-generated tasks with checkboxes.
- Haptic feedback (vibration) on wake and task completion.
- Snooze and Stop buttons.
- Added notification listeners in _layout.tsx for foreground and background.
- Fixed expo-notifications crash in Expo Go via dynamic import.

### Phase 5 - Database Cloud (PIVOT: Firebase -> Appwrite)
- Firebase was discarded (account limit reached).
- Selected Appwrite Cloud: 100% free, open-source, no account limits.
- Project ID: 6a1f572a000ea0980cbb | Region: Frankfurt (fra).
- Removed firebase SDK, installed appwrite SDK.
- Created appwriteConfig.ts (Client, Account, Databases).
- Created authService.ts with login, register, logout, getCurrentUser.
- Created userStore.ts (Zustand) for auth session management.
- Created auth.tsx screen with login/register UI.
- Updated _layout.tsx to check session and redirect to auth.

### Bug Fixes
- Fixed duplicate store definition in alarmStore.ts (two versions were concatenated).
- Fixed import paths pointing to empty src/types/ directory.
- Added Spacing.xxl to theme.ts.
- Renamed firebaseConfig.ts to appwriteConfig.ts (reflected actual service).
- Removed verbose AI-generated comments across all source files.

### Documentation
- Created docs/SDLC_PHASES.md (13-phase enterprise framework).
- Created docs/PROJECT_VISION.md (business vision document).
- Created docs/GLOSSARY.md (technical glossary for memorization).
- Updated README.md with real project description.
- Updated implementation_plan.md.

---

## [2026-05-28] - Phase 4: Persistence & Code Audit

### Sprint 1 - State Persistence
- Configured Zustand with persist middleware and AsyncStorage.
- Alarms now persist to device storage across app restarts.

### Sprint 2 & 3 - Code Audit
- Verified aiService.ts is implemented and connected to Groq API (llama-3.1-8b-instant).
- Verified notificationService.ts is implemented with expo-notifications.

### Next Steps
- Create alarms collection in Appwrite Console.
- Sync alarmStore with Appwrite Database.
- Implement snooze logic in notificationService.
