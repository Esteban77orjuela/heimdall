import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, KeyboardAvoidingView,
  Platform, ScrollView, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useUserStore } from '../src/store/userStore';
import { SafeAreaView } from 'react-native-safe-area-context';

type Mode = 'login' | 'register';

export default function AuthScreen() {
  const router = useRouter();
  const { login, register, isLoading } = useUserStore();

  const [mode, setMode] = useState<Mode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Completa email y contrasena.');
      return;
    }
    if (mode === 'register' && !name) {
      Alert.alert('Error', 'Ingresa tu nombre.');
      return;
    }

    try {
      if (mode === 'login') {
        await login(email.trim(), password);
      } else {
        await register(email.trim(), password, name.trim());
      }
      router.replace('/');
    } catch (error: any) {
      Alert.alert('Oops', error.message || 'Algo salio mal. Intentelo de nuevo.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">

          <View style={styles.header}>
            <Text style={styles.logo}>HS</Text>
            <Text style={styles.appName}>Heimdall</Text>
            <Text style={styles.tagline}>
              {mode === 'login' ? 'Bienvenido de vuelta' : 'Crea tu cuenta'}
            </Text>
          </View>

          <View style={styles.form}>
            {mode === 'register' && (
              <View style={styles.inputWrapper}>
                <Text style={styles.label}>Tu nombre</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Esteban Orjuela"
                  placeholderTextColor="#475569"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>
            )}

            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Correo electronico</Text>
              <TextInput
                style={styles.input}
                placeholder="tu@correo.com"
                placeholderTextColor="#475569"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Contrasena</Text>
              <TextInput
                style={styles.input}
                placeholder="Minimo 8 caracteres"
                placeholderTextColor="#475569"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>
                  {mode === 'login' ? 'Iniciar Sesion' : 'Crear Cuenta'}
                </Text>
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.switchMode}
            onPress={() => setMode(mode === 'login' ? 'register' : 'login')}
          >
            <Text style={styles.switchText}>
              {mode === 'login'
                ? 'No tienes cuenta? Registrate gratis'
                : 'Ya tienes cuenta? Inicia sesion'}
            </Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logo: {
    fontSize: 72,
    marginBottom: 12,
    color: '#00E5CC',
    fontWeight: 'bold',
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#F8FAFC',
    letterSpacing: 2,
  },
  tagline: {
    fontSize: 16,
    color: '#94A3B8',
    marginTop: 8,
  },
  form: {
    gap: 20,
  },
  inputWrapper: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    color: '#CBD5E1',
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#1E293B',
    borderRadius: 14,
    padding: 16,
    fontSize: 16,
    color: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#334155',
  },
  button: {
    backgroundColor: '#3B82F6',
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  switchMode: {
    marginTop: 32,
    alignItems: 'center',
  },
  switchText: {
    color: '#3B82F6',
    fontSize: 15,
  },
});
