# Heimdall - Clase de Memorizacion

## IDEA GENERAL (para explicar a un jefe o cliente)

Heimdall es una aplicacion movil de alarmas inteligentes. A diferencia de un reloj despertador normal, Heimdall no solo suena: cuando despiertas, te muestra en pantalla completa las tareas que tienes que hacer hoy, organizadas con emojis y prioridades. El usuario escribe sus pendientes en texto libre, y una inteligencia artificial (Groq) los convierte en tareas estructuradas.

**El problema que resuelve:** La gente apaga la alarma y en 5 segundos ya olvido lo que tenia que hacer. Heimdall te lo muestra justo cuando abres los ojos.

**Usuario tipico:** Profesional, estudiante, cualquier persona con rutinas matutinas.

**Valor principal:** Productividad desde el momento en que suena la alarma.

---

## MAPA DEL PROYECTO (estructura de carpetas)

```
heimdall/
  app/                    <-- Pantallas de la app (cada archivo = una ruta)
    _layout.tsx           Configuracion de navegacion y listeners de notificaciones
    index.tsx             Pantalla principal: lista de alarmas
    create-alarm.tsx      Pantalla para crear nueva alarma (modal)
    alarm-overlay.tsx     Pantalla que aparece cuando suena la alarma

  src/
    domain/               Capa de negocio (sin tecnologia)
      entities/alarm.ts   Definiciones: Alarm, Note, DayOfWeek, Priority
      repositories/       Interfaces (contratos)

    data/                 Implementaciones concretas
      repositories/       InMemoryAlarmRepository (ejemplo)
      mock/               Datos de prueba

    services/             Conexiones a servicios externos
      notificationService.ts  Programar alarmas en el sistema nativo
      aiService.ts            Llamar a Groq API para optimizar notas

    store/                Estado global
      alarmStore.ts       Store de alarmas con persistencia local

    components/           Componentes UI reutilizables
      AlarmCard/          Tarjeta que muestra una alarma

    theme/                Sistema de diseno
      theme.ts            Colores, espaciados

  docs/                   Documentacion
    SDLC_PHASES.md        Las 13 fases del desarrollo
    PROJECT_VISION.md     Vision del producto
    GLOSSARY.md           Glosario tecnico
    ARCHITECTURE.md       Diagrama de arquitectura
    CLASE_MEMORIZACION.md  <-- Este archivo
```

---

## FLUJO COMPLETO (de principio a fin)

### 1. Abrir la app
```
app/_layout.tsx -> Stack Navigator -> pantalla index.tsx
```
- No hay login, entra directo.
- alarmStore carga las alarmas desde AsyncStorage (persistencia local).
- Se muestran las alarmas guardadas como tarjetas (AlarmCard).

### 2. Crear una alarma
```
Usuario toca boton "+" -> Link a /create-alarm (modal)
  - Elige hora (HH:MM), periodo (AM/PM)
  - Escribe titulo
  - Selecciona dias de la semana (L M X J V S D)
  - Opcional: escribe nota en texto libre
    -> Toca "Optimizar con IA"
    -> aiService.ts envia texto a Groq API
    -> Groq devuelve JSON con {text, emoji, priority}
    -> Se muestran las notas estructuradas
  - Toca "Guardar Alarma"
    -> alarmStore.addAlarm()
    -> Se guarda en AsyncStorage
    -> notificationService.scheduleAlarm() programa en sistema nativo
```

### 3. Recibir la alarma
```
Llega la hora programada:
  -> expo-notifications dispara notificacion
  -> _layout.tsx la detecta (listener)
  -> Navega a /alarm-overlay?alarmId=...
  -> Muestra:
     - Reloj en vivo
     - Titulo de la alarma
     - Lista de tareas con checkboxes
     - Boton "Posponer" y "Apagar"
  -> Usuario marca tareas como completadas (toggleNote)
  -> Apaga la alarma -> vuelve al inicio
```

---

## TECNOLOGIAS (para que suenes como senior)

| Tecnologia | Para que sirve | Por que la usamos |
|------------|---------------|-------------------|
| React Native | Crear apps nativas (Android/iOS) con JavaScript | Multiplataforma con un solo codigo |
| Expo | Plataforma sobre React Native | Simplifica builds, dev, y despliegue |
| Expo Router | Navegacion basada en archivos | Similar a Next.js, intuitivo |
| Zustand | Manejo de estado global | Minimalista, sin boilerplate |
| AsyncStorage | Persistencia local clave-valor | Guardar alarmas en el disco del telefono |
| Groq API | Inferencia de inteligencia artificial | Convertir texto a tareas estructuradas |
| expo-notifications | Notificaciones locales | Programar el sonido de la alarma |
| TypeScript | JavaScript con tipos | Prevenir errores, mejor IDE support |

---

## CONCEPTOS CLAVE (para entender el codigo)

### Clean Architecture adaptada
El codigo se separa en capas que NO se conocen entre si:

```
domain/ (entidades puras) <-- data/ (implementaciones) <-- features/ (logica) <-- app/ (UI)
```

La regla de oro: **domain/ no sabe que existe React Native ni Appwrite ni nada externo.**

### Zustand Store
Es como un "compartimiento" global donde vive el estado:
```typescript
// Asi se crea un store
export const useAlarmStore = create<AlarmState>()(
  persist(                    <-- middleware que guarda automaticamente
    (set, get) => ({
      alarms: [],
      addAlarm: (alarm) => set((state) => ({ alarms: [alarm, ...state.alarms] }))
    }),
    { name: 'heimdall-alarm-storage', storage: createJSONStorage(() => AsyncStorage) }
  )
);

// Asi se usa en cualquier componente
const { alarms, addAlarm } = useAlarmStore();
```

### Notificaciones nativas
```typescript
expone-notifications.scheduleNotificationAsync({
  content: { title, body, data: { alarmId } },
  trigger: { type: WEEKLY, weekday, hour, minute }
});
```

### IA con Groq
```typescript
fetch('https://api.groq.com/openai/v1/chat/completions', {
  method: 'POST',
  headers: { Authorization: 'Bearer ' + apiKey },
  body: JSON.stringify({
    model: 'llama-3.1-8b-instant',
    messages: [
      { role: 'system', content: 'Eres un asistente que convierte texto en tareas JSON...' },
      { role: 'user', content: rawText }
    ]
  })
});
```

---

## COMANDOS ESENCIALES

```bash
npm start              # Iniciar servidor de desarrollo Expo
npm run android        # Iniciar en Android
npm run ios            # Iniciar en iOS
npm run web            # Iniciar en navegador
npm test               # Correr tests (Jest)
npm run lint           # Correr ESLint
npx tsc --noEmit       # Verificar TypeScript sin compilar
npx expo doctor        # Diagnostico del proyecto
npx expo build:android # Generar APK (requiere EAS)
```

---

## LAS 13 FASES SDLC (resumen para entrevista)

| Fase | Que significa | En Heimdall |
|------|---------------|-------------|
| 0. Vision | Por que hacemos esto | Alarma + IA para productividad |
| 1. Requisitos | Que debe hacer | Crear alarma, notas IA, overlay |
| 2. Arquitectura | Como se conecta todo | Clean Architecture + Expo + Groq |
| 3. Diseno Tecnico | Estructura de codigo | Carpetas domain/data/services/store |
| 4. Desarrollo | Escribir codigo | Sprints cumplidos |
| 5. Base de Datos | Persistencia | AsyncStorage (local) |
| 6. Testing | Pruebas | Jest + RNTL |
| 7. Seguridad | Proteccion | .env para API keys |
| 8. Docker | Contenedores | No aplica (app movil) |
| 9. CI/CD | Automatizacion | GitHub Actions (lint + test) |
| 10. Cloud | Nube | Sin nube por ahora |
| 11. Observabilidad | Monitoreo | Pendiente |
| 12. Escalabilidad | Crecimiento | Offline-first |
| 13. Mantenimiento | Evolucion | Continua |

---

## TIPS DE MEMORIZACION

1. **NOMBRE:** Heimdall = el dios nordico que vigila el puente Bifrost. La app "vigila" tu sueno y despertar.
2. **TRES CAPAS:** Domain (que es una alarma) -> Data (donde se guarda) -> UI (como se ve).
3. **FLUJO:** Crear -> Guardar -> Programar -> Sonar -> Mostrar tareas.
4. **STACK:** Expo (carcasa) + Zustand (memoria) + Groq (cerebro) + AsyncStorage (disco).
5. **NO HAY LOGIN:** La app es 100% local. No necesita internet excepto para la IA.

---

## PREGUNTAS FRECUENTES

**P: Por que Zustand y no Redux?**
R: Zustand es mas simple, menos codigo, y con persist ya incluida. Para una app de alarmas es perfecto.

**P: Por que Groq y no OpenAI?**
R: Groq es mas rapido (respuesta en < 1 segundo) y tiene capa gratuita. OpenAI seria mejor para tareas complejas.

**P: Por que AsyncStorage y no SQLite?**
R: AsyncStorage es suficiente para guardar alarmas (datos simples). SQLite seria mejor si hubiera miles de registros.

**P: Que pasa cuando la app esta cerrada y suena la alarma?**
R: expo-notifications maneja esto: la notificacion aparece aunque la app este cerrada. Al tocarla, abre el overlay.

**P: Que pasa si no hay internet?**
R: La alarma suena igual (es local). La IA no funcionara sin internet.
