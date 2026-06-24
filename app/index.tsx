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
import { Link } from 'expo-router';
import AlarmCard from '../src/components/AlarmCard';
import { useAlarmStore } from '../src/store/alarmStore';
import { Colors, Spacing } from '../src/theme/theme';

export default function Index() {
  const { alarms, toggleAlarm } = useAlarmStore();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.brandTitle}>Heimdall</Text>
            <View style={styles.aiBadge}>
              <MaterialCommunityIcons name="creation" size={14} color={Colors.primary} />
              <Text style={styles.aiText}>IA Activa</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.settingsBtn} accessibilityLabel="Ajustes">
            <MaterialCommunityIcons name="cog-outline" size={24} color={Colors.textMuted} />
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {alarms.map((alarm) => (
            <AlarmCard key={alarm.id} alarm={alarm} onToggle={toggleAlarm} />
          ))}
        </ScrollView>

        <Link href="/create-alarm" asChild>
          <TouchableOpacity style={styles.fab} accessibilityLabel="Nueva alarma">
            <MaterialCommunityIcons name="plus" size={32} color={Colors.black} />
          </TouchableOpacity>
        </Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
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
    color: Colors.text,
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  aiText: {
    color: Colors.textMuted,
    fontSize: 14,
    fontWeight: '500',
  },
  settingsBtn: {
    backgroundColor: Colors.surface,
    padding: 10,
    borderRadius: 50,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    backgroundColor: Colors.primary,
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});
