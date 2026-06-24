# Heimdall

Smart alarm app. Wakes you up and shows your daily tasks organized by AI.

## Stack

- React Native 0.81 + Expo 54
- Expo Router (file-based navigation)
- Zustand + AsyncStorage (state persistence)
- Appwrite Cloud (auth + database)
- Groq API (LLM-powered note optimization)
- expo-notifications (native alarm scheduling)

## Getting Started

```bash
cp .env.example .env
# Edit .env and add your Groq API key

npm install
npx expo start
```

## Project Structure

```
app/              Screens and routes (Expo Router)
src/
  domain/         Business entities (Alarm, Note) and interfaces
  data/           Repository implementations and mock data
  services/       External services (Groq, Appwrite, notifications)
  store/          Global state (Zustand)
  components/     Reusable UI components
  features/       Feature-scoped hooks
  theme/          Design tokens (colors, spacing)
docs/             Architecture, SDLC phases, glossary
```

## Scripts

| Command | Description |
|---------|-------------|
| npm start | Start Expo dev server |
| npm run android | Start on Android |
| npm run ios | Start on iOS |
| npm run web | Start on web |
| npm test | Run tests (Jest) |
| npm run lint | Run ESLint |

## SDLC

This project follows a 13-phase enterprise SDLC framework documented in `docs/SDLC_PHASES.md`.
