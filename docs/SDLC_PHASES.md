# SDLC Professional Framework - Heimdall

Este documento define las 13 fases del ciclo de vida de desarrollo de software (SDLC) empresarial que rigen el proyecto Heimdall. Cada fase tiene entregables, herramientas y responsables.

---

## FASE 0 — VISION DEL PRODUCTO

**Proposito:** Definir el "por que" del proyecto antes de escribir codigo.

- **Problema:** La gente apaga sus alarmas y olvida lo que tenia que hacer.
- **Solucion:** App de alarmas inteligente que despierta y muestra tareas del dia organizadas por IA.
- **Usuarios:** Profesionales, estudiantes, cualquier persona con rutinas matutinas.
- **Valor:** Productividad desde el segundo cero del dia.
- **Riesgos:** Dependencia de API de IA (Groq), sincronizacion offline-first, notificaciones en segundo plano.
- **Responsable:** Product Manager / Software Architect.

## FASE 1 — REQUERIMIENTOS

**Proposito:** Capturar y documentar lo que el sistema debe hacer.

**Funcionales:**
- Crear alarma con hora, periodo (AM/PM), titulo, dias de repeticion.
- Escribir nota libre y que la IA la convierta en tareas estructuradas.
- Disparar alarma en hora programada (incluso offline).
- Mostrar overlay con tareas al sonar la alarma.
- Marcar tareas como completadas.
- Autenticacion de usuarios (email + password).
- Sincronizar alarmas entre dispositivos via nube.

**No Funcionales:**
- La alarma debe sonar sin conexion a internet.
- Conversion IA debe responder en < 1 segundo.
- Sincronizacion offline-first (escribe local, replica en nube).
- Tiempo de respuesta UI < 200ms.
- Uptime del backend: 99.9%.

## FASE 2 — ARQUITECTURA

**Proposito:** Definir la estructura de alto nivel del sistema.

- **Estilo:** Cliente movil (React Native) + Backend as a Service (Appwrite).
- **Patron:** Clean Architecture adaptada a frontend (separacion Domain, Data, Features, UI).
- **Principios:** SOLID, DRY, Separation of Concerns.
- **Frontend:** React Native 0.81 + Expo 54.
- **Estado:** Zustand con persistencia AsyncStorage.
- **Backend/DB:** Appwrite Cloud (PostgreSQL subyacente).
- **IA:** Groq API (LLaMA 3.1 8B).
- **Notificaciones:** expo-notifications (sistema nativo).
- **Diagramas:** Ver docs/ARCHITECTURE.md para diagrama de capas.

## FASE 3 — DISENO TECNICO

**Proposito:** Definir estructura de carpetas, patrones, contratos y APIs.

**Estructura:**
```
src/
  domain/entities/     - Entidades del negocio (Alarm, Note)
  domain/repositories/ - Contratos/Interfaces
  data/repositories/   - Implementaciones concretas
  data/mock/           - Datos de prueba
  features/alarms/     - Hooks y casos de uso
  services/            - Llamadas a servicios externos (Groq, Appwrite, Notifications)
  store/               - Estado global (Zustand)
  components/          - Componentes UI reutilizables
  theme/               - Diseno system (colores, espaciado)
app/                   - Rutas (Expo Router)
```

**Patrones:**
- Repository Pattern (IAlarmRepository)
- Custom Hooks (useAlarms)
- State Management via Zustand stores
- Observer via expo-notifications listeners

## FASE 4 — DESARROLLO

**Proposito:** Implementar el codigo siguiendo estandares profesionales.

**Estandares:**
- TypeScript strict mode.
- ESLint + Prettier (configurado via expo lint).
- Conventional commits.
- Metodologia: Scrum / Agile (sprints de 1-2 semanas).

**Herramientas:**
- Expo (desarrollo y build).
- TypeScript 5.9.
- Zustand para estado.
- Appwrite SDK para backend.

## FASE 5 — BASE DE DATOS

**Proposito:** Disenar e implementar la capa de persistencia.

- **Local:** AsyncStorage (persistencia offline con Zustand).
- **Nube:** Appwrite Databases (coleccion `alarms`).
- **Estructura del documento:**
  ```
  userId, time, period, title, isActive, days (JSON), notes (JSON)
  ```
- **Indices:** userId (query principal).

## FASE 6 — TESTING

**Proposito:** Garantizar calidad mediante pruebas automatizadas.

- **Unit Testing:** Jest + React Native Testing Library.
- **Mocking:** @expo/vector-icons mock, Reanimated mock.
- **Cobertura:** > 80% en modulos core (store, services).
- **Ejecucion:** `npm test` (local y en CI).

## FASE 7 — CIBERSEGURIDAD (DEVSECOPS)

**Proposito:** Integrar seguridad en todo el ciclo de vida.

- **Secretos:** Variables de entorno (.env) para API keys.
- **Autenticacion:** Appwrite Auth con sesiones seguras.
- **Datos locales:** Solo datos del usuario en AsyncStorage.
- **OWASP:** Validacion de inputs, proteccion contra XSS en notas.
- **Rate Limiting:** Manejado por Appwrite y Groq.

## FASE 8 — DOCKER Y CONTENEDORES

**Proposito:** Estandarizar entornos de desarrollo y despliegue.

- **App movil:** No requiere Docker. Se usa EAS Build para compilacion en nube.
- **Despliegue:** EAS Build + EAS Submit para stores.

## FASE 9 — CI/CD

**Proposito:** Automatizar integracion y despliegue continuo.

**Pipeline (GitHub Actions):**
```
Push -> npm ci -> npm run lint -> npm test (--ci --coverage) -> [future: EAS Build]
```

**Estrategia:** Trunk-based development (rama main + feature branches).

## FASE 10 — CLOUD

**Proposito:** Infraestructura en la nube para servicios backend.

- **Appwrite Cloud:** Region Frankfurt (fra). Auth + Databases.
- **Expo Cloud:** Distribucion OTA via EAS Update.
- **Groq Cloud:** Inferencia de IA.

## FASE 11 — OBSERVABILIDAD

**Proposito:** Monitorear la aplicacion en produccion.

- **Logs:** console.log estructurado con prefijos.
- **Errores:** capturados via try/catch y registrados.
- **Futuro:** Sentry para crash reporting, PostHog para analitica.

## FASE 12 — ESCALABILIDAD

**Proposito:** Disenar para crecimiento sin degradacion.

- **Caching:** AsyncStorage como cache local.
- **Offline-first:** Toda la app funciona sin internet.
- **Backend:** Appwrite escala automaticamente (plan gratuito).
- **IA:** Groq maneja concurrencia de llamadas.

## FASE 13 — MANTENIMIENTO Y EVOLUCION

**Proposito:** El software nunca termina.

- **Refactoring:** Revision continua de deuda tecnica.
- **Feature Flags:** Para activar/desactivar funciones.
- **Versionado:** Semver (major.minor.patch).
- **Documentacion:** Este SDLC se actualiza con cada cambio significativo.
- **Incident Response:** Log de errores y revision post-mortem.

---

## Mapa de Fases vs Estado Actual

| Fase | Estado |
|------|--------|
| 0 - Vision | Completado |
| 1 - Requerimientos | Completado |
| 2 - Arquitectura | Completado |
| 3 - Diseno Tecnico | Completado |
| 4 - Desarrollo | En progreso (Sprint actual) |
| 5 - Base de Datos | Parcial (Appwrite conectado, falta definir coleccion) |
| 6 - Testing | Basico (Jest configurado, tests de AlarmCard) |
| 7 - Seguridad | Basico (.env para secrets) |
| 8 - Docker | No aplica (app movil nativa) |
| 9 - CI/CD | Configurado (GitHub Actions) |
| 10 - Cloud | Appwrite + Expo Cloud |
| 11 - Observabilidad | Pendiente (plan: Sentry) |
| 12 - Escalabilidad | Pendiente (plan: cache + offline) |
| 13 - Mantenimiento | Continuo |
