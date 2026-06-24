# Heimdall - Enterprise SDLC Implementation Plan

This document details the development roadmap for Heimdall following the 13-phase enterprise SDLC framework (see docs/SDLC_PHASES.md).

## FASE 0 - VISION DEL PRODUCTO

- **Problem:** People turn off their alarms and forget what they needed to do.
- **Goal:** A smart alarm app (Heimdall) that not only wakes you up but immediately shows your daily tasks, prioritized and organized using AI.
- **Value:** Productivity from second zero of the day.
- **Roles:** Product Manager / CEO and Software Architect / Lead Developer.

## FASE 1 - REQUERIMIENTOS

- **Functional:** Create alarm, write free-form notes, convert notes to tasks with AI (Groq), trigger alarm, show in-app overlay, cloud sync.
- **Non-functional:**
  - Alarm must ring offline.
  - AI conversion must take < 1 second.
  - Transparent offline-first sync.

## FASE 2 - ARQUITECTURA

- **Architecture:** Mobile client connected to Backend as a Service (BaaS) and external AI APIs.
- **Patterns:** Clean Architecture adapted for frontend (separation of UI, State, and Business Logic).
- **Tech Stack:**
  - Frontend: React Native (Expo).
  - Backend/DB: Appwrite Cloud (PostgreSQL).
  - AI: Groq API.
  - State: Zustand.

## FASE 3 - DISENO TECNICO

- **Folder Structure:**
  - /app: Routes (Expo Router).
  - /components: Reusable UI components.
  - /store: Zustand (global alarm state).
  - /services: Groq and Appwrite calls.
  - /utils: Helpers and date formatting.
- **Patterns:** Custom hooks (useAlarms), Observer (notifications).

## FASE 4 - DESARROLLO

- Sprint 1: Zustand + AsyncStorage persistence. -> COMPLETED
- Sprint 2: expo-notifications integration. -> COMPLETED
- Sprint 3: Groq AI API for note-to-task conversion. -> COMPLETED
- Sprint 4: Alarm overlay screen. -> COMPLETED

## FASE 5 - BASE DE DATOS (Current Sprint)

- **Platform:** Appwrite Cloud (PostgreSQL).
- **Goal:** Sync local alarms with cloud database.
- **Auth:** Appwrite Auth (email/password).
- **Status:** SDK installed, services written, Auth working. Pending database collection creation in Appwrite Console.

## FASE 6 - TESTING

- **Tools:** Jest + React Native Testing Library.
- **Types:** Unit tests (store), Integration tests (components).
- **Status:** Jest configured, AlarmCard tests passing.

## FASE 7 - CIBERSEGURIDAD

- .env for API keys.
- Appwrite Auth with secure sessions.
- Firestore security rules (future).

## FASE 8 - DOCKER

- Not applicable for mobile native app. EAS Build handles cloud compilation.

## FASE 9 - CI/CD

- GitHub Actions: lint + test on push/PR.

## FASE 10 - CLOUD

- Appwrite Cloud + Expo Cloud (OTA updates).

## FASE 11 - OBSERVABILIDAD

- **Planned:** Sentry (crash reporting), PostHog (analytics).

## FASE 12 - ESCALABILIDAD

- Offline-first architecture.
- AsyncStorage as local cache.
- Appwrite auto-scaling.

## FASE 13 - MANTENIMIENTO

- Continuous refactoring.
- Feature flags.
- Versioning (SemVer).

---

## Current Status

All Phase 4 sprints are complete. Current focus is Phase 5 (Database/Cloud sync). Next step: create alarms collection in Appwrite Console.
