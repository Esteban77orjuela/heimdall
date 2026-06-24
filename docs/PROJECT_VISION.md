# Heimdall - Project Vision

## Idea de Negocio

Heimdall es una aplicacion movil de alarmas inteligentes que no solo despierta al usuario, sino que organiza su dia desde el momento en que abre los ojos.

## Problema

Las apps de alarma tradicionales solo hacen ruido. El usuario apaga la alarma y en segundos ya olvido lo que tenia que hacer. Las tareas del dia estan dispersas en notas sueltas, calendarios, o simplemente en la cabeza.

## Solucion

Heimdall integra:
1. **Alarma clasica** - Configurable por hora, dias, titulo.
2. **Notas con IA** - El usuario escribe lo que necesita hacer, la IA (Groq) lo estructura en tareas con emojis y prioridades.
3. **Overlay inteligente** - Cuando suena la alarma, la pantalla muestra las tareas del dia con checkboxes.
4. **Sincronizacion en nube** - Las alarmas viven en Appwrite y estan disponibles en cualquier dispositivo.

## Flujo de Usuario

```
Abrir app -> Login/Registro -> Ver alarmas
  -> Crear alarma (hora, titulo, notas-IA)
  -> Alarma suena -> Overlay con tareas
  -> Marcar tareas -> Apagar alarma -> Dia productivo
```

## Diferenciacion

- **IA nativa:** No es una app de alarmas con IA anadida, es IA en el core del producto.
- **Offline-first:** Funciona sin internet (la IA requiere internet, las alarmas no).
- **Overlay in-app:** No solo una notificacion, una experiencia completa al despertar.

## Monetizacion (Futuro)

- Freemium: 5 alarmas gratis, ilimitadas en premium.
- Suscripcion mensual para funciones avanzadas (IA personalizada, historial, etc.).
