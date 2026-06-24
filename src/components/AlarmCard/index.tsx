import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Spacing } from '../../theme/theme';
import { Alarm, DayOfWeek } from '../../domain/entities/alarm';

interface AlarmCardProps {
  alarm: Alarm;
  onToggle: (id: string) => void;
}

const DAYS: DayOfWeek[] = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

const AlarmCard: React.FC<AlarmCardProps> = ({ alarm, onToggle }) => {
  return (
    <View
      style={[
        styles.container,
        alarm.isActive && styles.containerActive,
        !alarm.isActive && styles.containerInactive,
      ]}
    >
      {/* Header: Time & Switch */}
      <View style={styles.header}>
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>{alarm.time}</Text>
          <Text style={styles.periodText}>{alarm.period}</Text>
        </View>
        <Switch
          value={alarm.isActive}
          onValueChange={() => onToggle(alarm.id)}
          trackColor={{ false: '#3e3e3e', true: Colors.primaryDull }}
          thumbColor={alarm.isActive ? Colors.primary : '#f4f3f4'}
        />
      </View>

      {/* Title */}
      <Text style={styles.titleText}>{alarm.title}</Text>

      {/* Days Selection */}
      <View style={styles.daysContainer}>
        {DAYS.map((day) => {
          const isSelected = alarm.days.includes(day);
          return (
            <View
              key={day}
              style={[
                styles.dayCircle,
                isSelected && styles.dayCircleActive,
              ]}
            >
              <Text
                style={[
                  styles.dayText,
                  isSelected && styles.dayTextActive,
                ]}
              >
                {day}
              </Text>
            </View>
          );
        })}
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Notes Section */}
      <View style={styles.notesContainer}>
        {alarm.notes.map((note) => (
          <View key={note.id} style={styles.noteItem}>
            <MaterialCommunityIcons
              name={note.completed ? "checkbox-marked-circle-outline" : "circle-outline"}
              size={20}
              color={note.completed ? Colors.primary : Colors.textMuted}
            />
            <Text style={styles.noteEmoji}>{note.emoji}</Text>
            <Text style={[styles.noteText, note.completed && styles.noteTextCompleted]}>
              {note.text}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default AlarmCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: '#333',
    width: '100%',
  },
  containerActive: {
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
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
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  timeText: {
    color: Colors.text,
    fontSize: 36,
    fontWeight: 'bold',
  },
  periodText: {
    color: Colors.primary,
    fontSize: 16,
    marginLeft: 4,
    fontWeight: '600',
  },
  titleText: {
    color: Colors.textSecondary,
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
    backgroundColor: 'transparent',
  },
  dayCircleActive: {
    backgroundColor: 'rgba(0, 229, 204, 0.2)',
  },
  dayText: {
    color: Colors.textMuted,
    fontSize: 12,
    fontWeight: 'bold',
  },
  dayTextActive: {
    color: Colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: '#333',
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
    color: Colors.textSecondary,
    fontSize: 14,
  },
  noteTextCompleted: {
    textDecorationLine: 'line-through',
    color: Colors.textMuted,
  },
});
