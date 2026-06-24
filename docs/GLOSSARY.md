# Heimdall - Glosario Tecnico

Documento de referencia para memorizar todos los conceptos del proyecto.

---

## Stack Tecnologico

| Termino | Definicion | Rol en Heimdall |
|---------|-----------|-----------------|
| React Native | Framework para apps moviles nativas con JavaScript/TypeScript | Base de la app |
| Expo | Plataforma que simplifica el desarrollo React Native | Build, dev, deploy |
| Expo Router | Router basado en archivos (como Next.js) | Navegacion entre pantallas |
| Zustand | Libreria minimalista de estado global | Store de alarmas y usuario |
| AsyncStorage | Almacenamiento clave-valor persistente en RN | Cache local offline |
| Appwrite | Backend as a Service open-source | Auth + base de datos en nube |
| Groq | API de inferencia IA ultra rapida | Optimizacion de notas con LLM |
| expo-notifications | API de notificaciones locales/push de Expo | Disparar alarmas |

## Arquitectura

| Termino | Definicion |
|---------|-----------|
| Clean Architecture | Separacion del codigo en capas: Domain, Data, Features, UI |
| Domain | Entidades del negocio sin dependencias externas |
| Repository Pattern | Abstraccion entre la logica y la fuente de datos |
| Offline-first | La app funciona sin internet, la nube es secundaria |
| Overlay | Pantalla que se superpone a todo al sonar la alarma |

## Estructura de Archivos

| Ruta | Proposito |
|------|-----------|
| app/ | Pantallas y rutas (Expo Router) |
| src/domain/ | Entidades (Alarm, Note) e interfaces (IAlarmRepository) |
| src/data/ | Implementaciones de repositorios y datos mock |
| src/services/ | Servicios externos (Groq, Appwrite, notificaciones) |
| src/store/ | Estado global con Zustand |
| src/components/ | Componentes UI reutilizables (AlarmCard) |
| src/features/ | Hooks y logica por feature |
| src/theme/ | Colores, fuentes, spacings |

## Flujo de Datos

### Crear Alarma
```
1. Usuario llena formulario (create-alarm.tsx)
2. Puede escribir nota -> IA (aiService.ts) -> notas estructuradas
3. Guardar -> Zustand store (alarmStore.ts) -> AsyncStorage (local)
4. Si hay sesion -> Appwrite Database (nube)
5. Si esta activa -> expo-notifications (programar sonido)
```

### Recibir Alarma
```
1. expo-notifications dispara a la hora programada
2. _layout.tsx detecta la notificacion
3. Navega a alarm-overlay.tsx
4. Muestra reloj en vivo, tareas con checkboxes
5. Usuario marca/pospone/apaga
```

### Autenticacion
```
1. app/_layout.tsx llama a checkSession() al iniciar
2. Si no hay sesion -> redirige a /auth
3. Login/Registro -> Appwrite Auth -> userStore -> redirige a /
4. Logout -> limpia sesion
```

## Comandos Esenciales

| Comando | Que hace |
|---------|----------|
| npm start | Inicia Expo dev server |
| npm run android | Inicia en Android emulator |
| npm run ios | Inicia en iOS simulator |
| npm run web | Inicia en navegador web |
| npm test | Corre tests con Jest |
| npm run lint | Corre ESLint |
| npx expo doctor | Diagnostica problemas del proyecto |

## Colores del Tema

| Variable | Hex | Uso |
|----------|-----|-----|
| Colors.background | #0D0D0D | Fondo principal |
| Colors.surface | #171717 | Tarjetas |
| Colors.primary | #00E5CC | Color marca (cyan) |
| Colors.text | #FFFFFF | Texto principal |
| Colors.textMuted | #888888 | Texto secundario |

## Convenciones de Codigo

- **TypeScript strict mode** habilitado
- **Prefer interfaces sobre types** para objetos
- **Nombres en ingles** para codigo fuente
- **Comentarios minimos** (el codigo debe ser auto-documentado)
- **Exports nombrados** para servicios, **default exports** para componentes de pantalla
- **Zustand stores** sin middleware persist por defecto (solo alarmStore usa persist)
