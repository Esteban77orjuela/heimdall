import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../src/theme/ThemeContext';
import { Spacing } from '../src/theme/theme';
import { useAlarmStore } from '../src/store/alarmStore';
import { DayOfWeek, Note } from '../src/domain/entities/alarm';
import { AIService } from '../src/services/aiService';

const DAYS: DayOfWeek[] = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

export default function CreateAlarmScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{ editAlarmId?: string }>();
  const alarms = useAlarmStore((state) => state.alarms);
  const addAlarm = useAlarmStore((state) => state.addAlarm);
  const updateAlarm = useAlarmStore((state) => state.updateAlarm);

  const editAlarmId = params.editAlarmId;
  const isEditing = !!editAlarmId;

  const [time, setTime] = useState('07:00');
  const [period, setPeriod] = useState<'AM' | 'PM'>('AM');
  const [title, setTitle] = useState('');
  const [selectedDays, setSelectedDays] = useState<DayOfWeek[]>(['L', 'M', 'X', 'J', 'V']);
  const [rawNoteText, setRawNoteText] = useState('');
  const [optimizedNotes, setOptimizedNotes] = useState<Note[]>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);

  useEffect(() => {
    if (editAlarmId) {
      const alarm = alarms.find((a) => a.id === editAlarmId);
      if (alarm) {
        setTime(alarm.time);
        setPeriod(alarm.period);
        setTitle(alarm.title);
        setSelectedDays(alarm.days);
        setOptimizedNotes(alarm.notes);
      }
    }
  }, [editAlarmId, alarms]);

  const toggleDay = (day: DayOfWeek) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleOptimize = async () => {
    if (!rawNoteText.trim()) return;
    setIsOptimizing(true);
    try {
      const result = await AIService.optimizeNotes(rawNoteText);
      setOptimizedNotes((prev) => [...prev, ...result]);
      setRawNoteText('');
    } catch {
      alert('Error al conectar con la IA. Revisa tu consola para mas detalles.');
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleSave = () => {
    const baseAlarm = {
      time,
      period,
      title: title.trim() || 'Alarma',
      days: selectedDays,
      notes: optimizedNotes,
    };

    if (isEditing && editAlarmId) {
      updateAlarm(editAlarmId, baseAlarm);
    } else {
      addAlarm({
        id: Date.now().toString(),
        ...baseAlarm,
        isActive: true,
      });
    }
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.surface }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>
          {isEditing ? 'Editar Alarma' : 'Nueva Alarma'}
        </Text>
        <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Cerrar">
          <MaterialCommunityIcons name="close" size={28} color={theme.textMuted} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.timeSection}>
          <View style={styles.timeInputWrapper}>
            <TextInput
              style={[styles.timeInput, { color: theme.primary, borderBottomColor: theme.primaryDull }]}
              value={time}
              onChangeText={setTime}
              keyboardType="numeric"
              maxLength={5}
              placeholderTextColor={theme.textMuted}
            />
          </View>
          <View style={[styles.periodSelector, { backgroundColor: theme.surfaceLight }]}>
            <TouchableOpacity
              style={[styles.periodBtn, period === 'AM' && { backgroundColor: theme.primary }]}
              onPress={() => setPeriod('AM')}
            >
              <Text style={[styles.periodText, { color: period === 'AM' ? theme.black : theme.textMuted }]}>AM</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.periodBtn, period === 'PM' && { backgroundColor: theme.primary }]}
              onPress={() => setPeriod('PM')}
            >
              <Text style={[styles.periodText, { color: period === 'PM' ? theme.black : theme.textMuted }]}>PM</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputSection}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>Nombre de la alarma</Text>
          <TextInput
            style={[styles.textInput, { backgroundColor: theme.surfaceLight, color: theme.text }]}
            placeholder="Ej: Entrenamiento, Despertar..."
            placeholderTextColor={theme.textMuted}
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <View style={styles.inputSection}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>Repetir</Text>
          <View style={styles.daysContainer}>
            {DAYS.map((day) => {
              const isSelected = selectedDays.includes(day);
              return (
                <TouchableOpacity
                  key={day}
                  style={[
                    styles.dayCircle,
                    { backgroundColor: theme.surfaceLight },
                    isSelected && { backgroundColor: theme.primary + '33', borderColor: theme.primary },
                  ]}
                  onPress={() => toggleDay(day)}
                >
                  <Text style={[styles.dayText, { color: isSelected ? theme.primary : theme.textMuted }]}>
                    {day}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={[styles.aiSection, { borderColor: theme.primary + '33', backgroundColor: theme.primary + '0D' }]}>
          <View style={styles.aiHeader}>
            <MaterialCommunityIcons name="robot-outline" size={20} color={theme.primary} />
            <Text style={[styles.aiTitle, { color: theme.primary }]}>Asistente de Notas (IA)</Text>
          </View>

          <TextInput
            style={[styles.textInput, styles.textArea, { backgroundColor: theme.surfaceLight, color: theme.text }]}
            placeholder="Escribe lo que tienes que hacer. La IA lo ordenara..."
            placeholderTextColor={theme.textMuted}
            value={rawNoteText}
            onChangeText={setRawNoteText}
            multiline
            numberOfLines={3}
          />

          <TouchableOpacity
            style={[styles.aiButton, { backgroundColor: theme.primary }, (isOptimizing || !rawNoteText.trim()) && styles.aiButtonDisabled]}
            onPress={handleOptimize}
            disabled={isOptimizing || !rawNoteText.trim()}
          >
            {isOptimizing ? (
              <ActivityIndicator color={theme.black} size="small" />
            ) : (
              <>
                <MaterialCommunityIcons name="creation" size={20} color={theme.black} />
                <Text style={[styles.aiButtonText, { color: theme.black }]}>Optimizar con IA</Text>
              </>
            )}
          </TouchableOpacity>

          {optimizedNotes.length > 0 && (
            <View style={styles.generatedNotes}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>Notas:</Text>
              {optimizedNotes.map((note) => (
                <View key={note.id} style={[styles.noteItem, { backgroundColor: theme.surfaceLight }]}>
                  <Text style={styles.noteEmoji}>{note.emoji}</Text>
                  <Text style={[styles.noteText, { color: theme.text }]}>{note.text}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={[styles.saveButton, { backgroundColor: theme.primary }]} onPress={handleSave}>
          <Text style={[styles.saveButtonText, { color: theme.black }]}>
            {isEditing ? 'Guardar Cambios' : 'Guardar Alarma'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: Spacing.lg },
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: Spacing.xl,
  },
  title: { fontSize: 24, fontWeight: 'bold' },
  scrollContent: { paddingBottom: Spacing.xxl },
  timeSection: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', marginBottom: Spacing.xl, gap: Spacing.md,
  },
  timeInputWrapper: { alignItems: 'center' },
  timeInput: {
    fontSize: 64, fontWeight: 'bold',
    borderBottomWidth: 2, paddingHorizontal: Spacing.md,
  },
  periodSelector: { borderRadius: 12, overflow: 'hidden' },
  periodBtn: { paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md },
  periodText: { fontSize: 16, fontWeight: 'bold' },
  inputSection: { marginBottom: Spacing.xl },
  label: { fontSize: 16, marginBottom: Spacing.sm, fontWeight: '500' },
  textInput: { fontSize: 16, padding: Spacing.md, borderRadius: 12 },
  textArea: { minHeight: 80, textAlignVertical: 'top' },
  daysContainer: {
    flexDirection: 'row', justifyContent: 'space-between', marginTop: Spacing.sm,
  },
  dayCircle: {
    width: 40, height: 40, borderRadius: 20,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: 'transparent',
  },
  dayText: { fontSize: 14, fontWeight: 'bold' },
  aiSection: {
    padding: Spacing.md, borderRadius: 16,
    borderWidth: 1, marginBottom: Spacing.xl,
  },
  aiHeader: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.md,
  },
  aiTitle: { fontSize: 16, fontWeight: 'bold' },
  aiButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    padding: Spacing.md, borderRadius: 12, marginTop: Spacing.md, gap: Spacing.sm,
  },
  aiButtonDisabled: { opacity: 0.5 },
  aiButtonText: { fontSize: 16, fontWeight: 'bold' },
  generatedNotes: { marginTop: Spacing.lg },
  noteItem: {
    flexDirection: 'row', alignItems: 'center',
    padding: Spacing.md, borderRadius: 8, marginBottom: Spacing.sm, gap: Spacing.sm,
  },
  noteEmoji: { fontSize: 20 },
  noteText: { fontSize: 16 },
  footer: { marginTop: 'auto', marginBottom: Spacing.lg },
  saveButton: { padding: Spacing.lg, borderRadius: 16, alignItems: 'center' },
  saveButtonText: { fontSize: 18, fontWeight: 'bold' },
});
