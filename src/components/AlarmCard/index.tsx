import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../../theme/ThemeContext';
import { Spacing } from '../../theme/theme';
import { Alarm, DayOfWeek } from '../../domain/entities/alarm';
import { useAlarmStore } from '../../store/alarmStore';

interface AlarmCardProps {
  alarm: Alarm;
  onToggle: (id: string) => void;
}

const DAYS: DayOfWeek[] = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

const AlarmCard: React.FC<AlarmCardProps> = ({ alarm, onToggle }) => {
  const { theme } = useTheme();
  const router = useRouter();
  const deleteAlarm = useAlarmStore((state) => state.deleteAlarm);

  const handleDelete = () => {
    Alert.alert(
      'Eliminar alarma',
      `Seguro que quieres eliminar "${alarm.title}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => deleteAlarm(alarm.id),
        },
      ]
    );
  };

  const handleEdit = () => {
    router.push({ pathname: '/create-alarm', params: { editAlarmId: alarm.id } });
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={handleEdit}
      onLongPress={handleDelete}
      style={[
        styles.container,
        {
          backgroundColor: theme.surface,
          borderColor: alarm.isActive ? theme.primary : '#333',
          shadowColor: alarm.isActive ? theme.primary : 'transparent',
        },
        !alarm.isActive && styles.containerInactive,
      ]}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={handleDelete} style={styles.deleteBtn}>
          <MaterialCommunityIcons name="delete-outline" size={20} color={theme.textMuted} />
        </TouchableOpacity>
        <View style={styles.timeContainer}>
          <Text style={[styles.timeText, { color: theme.text }]}>{alarm.time}</Text>
          <Text style={[styles.periodText, { color: theme.primary }]}>{alarm.period}</Text>
        </View>
        <Switch
          value={alarm.isActive}
          onValueChange={() => onToggle(alarm.id)}
          trackColor={{ false: '#3e3e3e', true: theme.primaryDull }}
          thumbColor={alarm.isActive ? theme.primary : '#f4f3f4'}
        />
      </View>

      <Text style={[styles.titleText, { color: theme.textSecondary }]}>{alarm.title}</Text>

      <View style={styles.daysContainer}>
        {DAYS.map((day) => {
          const isSelected = alarm.days.includes(day);
          return (
            <View
              key={day}
              style={[
                styles.dayCircle,
                isSelected && { backgroundColor: theme.primary + '33', borderColor: theme.primary },
              ]}
            >
              <Text
                style={[
                  styles.dayText,
                  { color: isSelected ? theme.primary : theme.textMuted },
                ]}
              >
                {day}
              </Text>
            </View>
          );
        })}
      </View>

      <View style={[styles.divider, { backgroundColor: '#333' }]} />

      <View style={styles.notesContainer}>
        {alarm.notes.map((note) => (
          <View key={note.id} style={styles.noteItem}>
            <MaterialCommunityIcons
              name={note.completed ? 'checkbox-marked-circle-outline' : 'circle-outline'}
              size={20}
              color={note.completed ? theme.primary : theme.textMuted}
            />
            <Text style={styles.noteEmoji}>{note.emoji}</Text>
            <Text
              style={[
                styles.noteText,
                { color: theme.textSecondary },
                note.completed && { textDecorationLine: 'line-through', color: theme.textMuted },
              ]}
            >
              {note.text}
            </Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );
};

export default AlarmCard;

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    width: '100%',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  containerInactive: {
    opacity: 0.55,
    borderColor: '#2a2a2a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  deleteBtn: {
    padding: 4,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    flex: 1,
    marginLeft: Spacing.sm,
  },
  timeText: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  periodText: {
    fontSize: 16,
    marginLeft: 4,
    fontWeight: '600',
  },
  titleText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: Spacing.md,
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  dayCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  dayText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    marginVertical: Spacing.md,
  },
  notesContainer: {
    gap: Spacing.sm,
  },
  noteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  noteEmoji: {
    fontSize: 16,
    marginLeft: 4,
  },
  noteText: {
    fontSize: 14,
  },
});
