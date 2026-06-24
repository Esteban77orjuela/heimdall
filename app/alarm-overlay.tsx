import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAlarmStore } from '../src/store/alarmStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { NotificationService } from '../src/services/notificationService';
import * as Haptics from 'expo-haptics';

export default function AlarmOverlayScreen() {
  const { alarmId } = useLocalSearchParams<{ alarmId: string }>();
  const router = useRouter();
  const alarms = useAlarmStore(state => state.alarms);
  const toggleNote = useAlarmStore(state => state.toggleNote);
  const toggleAlarm = useAlarmStore(state => state.toggleAlarm);

  const [currentTime, setCurrentTime] = useState(new Date());

  const alarm = alarms.find(a => a.id === alarmId);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    const hapticInterval = setInterval(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }, 2000);
    return () => clearInterval(hapticInterval);
  }, []);

  if (!alarm) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>Alarma no encontrada</Text>
        <TouchableOpacity style={styles.stopButton} onPress={() => router.back()}>
          <Text style={styles.buttonText}>Cerrar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleStop = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    if (alarm.days.length === 0) {
      toggleAlarm(alarm.id);
    }
    router.replace('/');
  };

  const handleSnooze = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    NotificationService.scheduleSnooze(alarm, 5);
    router.replace('/');
  };

  const handleToggleNote = (noteId: string) => {
    Haptics.selectionAsync();
    toggleNote(alarm.id, noteId);
  };

  const allNotesCompleted = alarm.notes && alarm.notes.length > 0 && alarm.notes.every(n => n.completed);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.timeText}>
          {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
        <Text style={styles.titleText}>{alarm.title || 'Es hora!'}</Text>
      </View>

      <View style={styles.tasksContainer}>
        <Text style={styles.tasksHeader}>Tus misiones de hoy:</Text>
        <ScrollView style={styles.scrollView}>
          {alarm.notes && alarm.notes.length > 0 ? (
            alarm.notes.map(note => (
              <TouchableOpacity
                key={note.id}
                style={[styles.taskItem, note.completed && styles.taskItemCompleted]}
                onPress={() => handleToggleNote(note.id)}
              >
                <View style={styles.checkbox}>
                  {note.completed && <Ionicons name="checkmark" size={18} color="#fff" />}
                </View>
                <Text style={styles.emojiText}>{note.emoji}</Text>
                <Text style={[styles.taskText, note.completed && styles.taskTextCompleted]}>
                  {note.text}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noTasksText}>No hay tareas para esta alarma.</Text>
          )}
        </ScrollView>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.snoozeButton} onPress={handleSnooze}>
          <MaterialCommunityIcons name="sleep" size={24} color="#94A3B8" />
          <Text style={styles.snoozeButtonText}>Posponer 5 min</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.stopButton, allNotesCompleted && styles.stopButtonReady]}
          onPress={handleStop}
        >
          <Text style={styles.buttonText}>
            {allNotesCompleted ? 'Todo Listo! Apagar' : 'Apagar Alarma'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// Need to import MaterialCommunityIcons for the snooze icon
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    padding: 20,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 18,
    marginBottom: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  timeText: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontVariant: ['tabular-nums'],
  },
  titleText: {
    fontSize: 24,
    color: '#94A3B8',
    marginTop: 10,
  },
  tasksContainer: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderRadius: 24,
    padding: 20,
    marginBottom: 30,
  },
  tasksHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F8FAFC',
    marginBottom: 16,
  },
  scrollView: {
    flex: 1,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#334155',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  taskItemCompleted: {
    backgroundColor: '#1E293B',
    opacity: 0.6,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#3B82F6',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emojiText: {
    fontSize: 24,
    marginRight: 12,
  },
  taskText: {
    fontSize: 16,
    color: '#F8FAFC',
    flex: 1,
  },
  taskTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#94A3B8',
  },
  noTasksText: {
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 20,
  },
  actionsContainer: {
    gap: 16,
    marginBottom: 20,
  },
  stopButton: {
    backgroundColor: '#EF4444',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  stopButtonReady: {
    backgroundColor: '#10B981',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  snoozeButton: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: '#334155',
  },
  snoozeButtonText: {
    color: '#94A3B8',
    fontSize: 18,
    fontWeight: '600',
  },
});
