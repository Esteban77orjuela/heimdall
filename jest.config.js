/**
 * CONFIGURACIÓN CENTRAL DE JEST para Heimdall
 *
 * Orden de ejecución (de arriba a abajo):
 * 1. setupFiles      → jest.pre-setup.js  (corre ANTES del framework)
 * 2. preset          → jest-expo           (configura el entorno de Expo)
 * 3. setupFilesAfterEnv → jest.setup.js   (corre DESPUÉS del framework)
 */
module.exports = {
  // Preset base de React Native para evitar los errores internos de jest-expo
  preset: 'react-native',

  // PASO 1: Polyfills que corren antes que todo (antes que jest-expo)
  setupFiles: ['./jest.pre-setup.js'],

  // PASO 3: Mocks y configuraciones que necesitan el framework activo
  setupFilesAfterEnv: ['./jest.setup.js'],

  // TRADUCTOR: Qué módulos de node_modules debe transformar con Babel
  // (Los módulos que usan JSX/TS necesitan ser traducidos a JS puro)
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|react-native-reanimated|@expo/vector-icons)',
  ],

  // REEMPLAZOS DE MÓDULOS: Cuando alguien pida estos, entregar la versión mock
  moduleNameMapper: {
    // Redirige cualquier import de vector-icons a nuestro mock
    '^@expo/vector-icons$': '<rootDir>/__mocks__/@expo/vector-icons.js',
    '^@expo/vector-icons/(.*)$': '<rootDir>/__mocks__/@expo/vector-icons.js',
  },
};
