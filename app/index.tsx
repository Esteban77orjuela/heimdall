import React from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import AlarmCard from '../src/components/AlarmCard';
import { useAlarmStore } from '../src/store/alarmStore';
import { useTheme } from '../src/theme/ThemeContext';
import { Spacing } from '../src/theme/theme';

export default function Index() {
  const { theme, mode } = useTheme();
  const router = useRouter();
  const { alarms, toggleAlarm } = useAlarmStore();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={mode === 'dark' ? 'light-content' : 'dark-content'} />
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.brandTitle, { color: theme.text }]}>Heimdall</Text>
            <View style={styles.aiBadge}>
              <MaterialCommunityIcons name="creation" size={14} color={theme.primary} />
              <Text style={[styles.aiText, { color: theme.textMuted }]}>IA Activa</Text>
            </View>
          </View>
          <TouchableOpacity
            style={[styles.iconBtn, { backgroundColor: theme.surface }]}
            onPress={() => router.push('/settings')}
            accessibilityLabel="Ajustes"
          >
            <MaterialCommunityIcons name="cog-outline" size={24} color={theme.textMuted} />
          </TouchableOpacity>
        </View>

        {alarms.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="alarm-off" size={80} color={theme.textMuted} />
            <Text style={[styles.emptyTitle, { color: theme.text }]}>Sin alarmas</Text>
            <Text style={[styles.emptySubtitle, { color: theme.textMuted }]}>
              Toca el boton + para crear tu primera alarma inteligente
            </Text>
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {alarms.map((alarm) => (
              <AlarmCard key={alarm.id} alarm={alarm} onToggle={toggleAlarm} />
            ))}
          </ScrollView>
        )}

        <Link href="/create-alarm" asChild>
          <TouchableOpacity
            style={[styles.fab, { backgroundColor: theme.primary }]}
            accessibilityLabel="Nueva alarma"
          >
            <MaterialCommunityIcons name="plus" size={32} color={theme.black} />
          </TouchableOpacity>
        </Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  brandTitle: {
    fontSize: 32,
    fontWeight: '900',
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  aiText: {
    fontSize: 14,
    fontWeight: '500',
  },
  iconBtn: {
    padding: 10,
    borderRadius: 50,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    paddingBottom: 100,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 24,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});
