# Heimdall - Architecture

## Layers

| Layer | Folder | Responsibility |
|-------|--------|----------------|
| Domain | src/domain | Business entities and contracts (interfaces). No UI/framework dependencies. |
| Data | src/data | Repository implementations, mocks, persistence. |
| Features | src/features | Screen logic (hooks, use cases). |
| UI | src/components, app | Visual components and routes (Expo Router). |

## Current Flow

```
app/index.tsx -> useAlarms hook OR alarmStore -> IAlarmRepository / Appwrite / AsyncStorage
```

## Data Flow

### Create Alarm
```
create-alarm.tsx -> AIService.optimizeNotes (Groq) -> alarmStore.addAlarm -> AsyncStorage + Appwrite
```

### Receive Alarm
```
expo-notifications trigger -> _layout.tsx listener -> router.push(/alarm-overlay) -> alarmStore data
```

### Auth Flow
```
_layout.tsx -> userStore.checkSession -> Appwrite Auth -> redirect (/ or /auth)
```

## Future Phases

1. Complete Appwrite Database sync (alarms collection).
2. Implement snooze logic in notificationService.
3. Settings screen with user preferences.
4. CI/CD with EAS Build for APK/IPA generation.
5. Observability with Sentry.
