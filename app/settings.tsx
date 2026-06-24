import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../src/theme/ThemeContext';
import { Spacing } from '../src/theme/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SNOOZE_STORAGE_KEY = 'heimdall-snooze-minutes';

export default function SettingsScreen() {
  const { theme, mode, toggleTheme } = useTheme();
  const router = useRouter();
  const [snoozeMinutes, setSnoozeMinutes] = useState(5);

  const snoozeOptions = [3, 5, 10, 15];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Volver">
          <MaterialCommunityIcons name="arrow-left" size={28} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>Ajustes</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.section, { backgroundColor: theme.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>APARIENCIA</Text>

          <TouchableOpacity style={styles.row} onPress={toggleTheme}>
            <View style={styles.rowLeft}>
              <MaterialCommunityIcons
                name={mode === 'dark' ? 'weather-night' : 'weather-sunny'}
                size={24}
                color={theme.primary}
              />
              <Text style={[styles.rowText, { color: theme.text }]}>Modo Oscuro</Text>
            </View>
            <Switch
              value={mode === 'dark'}
              onValueChange={toggleTheme}
              trackColor={{ false: '#3e3e3e', true: theme.primaryDull }}
              thumbColor={mode === 'dark' ? theme.primary : '#f4f3f4'}
            />
          </TouchableOpacity>
        </View>

        <View style={[styles.section, { backgroundColor: theme.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>ALARMA</Text>

          <Text style={[styles.rowSubtitle, { color: theme.textMuted, paddingHorizontal: Spacing.md }]}>
            Duracion de posposicion
          </Text>
          <View style={styles.snoozeOptions}>
            {snoozeOptions.map((mins) => (
              <TouchableOpacity
                key={mins}
                style={[
                  styles.snoozeChip,
                  {
                    backgroundColor: snoozeMinutes === mins ? theme.primary : theme.surfaceLight,
                  },
                ]}
                onPress={() => {
                  setSnoozeMinutes(mins);
                  AsyncStorage.setItem(SNOOZE_STORAGE_KEY, String(mins));
                }}
              >
                <Text
                  style={[
                    styles.snoozeChipText,
                    { color: snoozeMinutes === mins ? theme.black : theme.text },
                  ]}
                >
                  {mins} min
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: theme.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>INFORMACION</Text>

          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <MaterialCommunityIcons name="information-outline" size={24} color={theme.primary} />
              <View>
                <Text style={[styles.rowText, { color: theme.text }]}>Heimdall</Text>
                <Text style={[styles.rowSubtitle, { color: theme.textMuted }]}>Version 1.0.0</Text>
              </View>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <MaterialCommunityIcons name="robot" size={24} color={theme.primary} />
              <View>
                <Text style={[styles.rowText, { color: theme.text }]}>IA: Groq LLaMA 3.1</Text>
                <Text style={[styles.rowSubtitle, { color: theme.textMuted }]}>
                  Optimizacion de notas
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  title: { fontSize: 24, fontWeight: 'bold' },
  section: {
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.lg,
    borderRadius: 16,
    paddingVertical: Spacing.md,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  rowText: { fontSize: 16, fontWeight: '500' },
  rowSubtitle: { fontSize: 13, marginTop: 2 },
  snoozeOptions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
  },
  snoozeChip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
  },
  snoozeChipText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
