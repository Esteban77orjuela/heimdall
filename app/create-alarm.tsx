import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Spacing } from '../src/theme/theme';
import { useAlarmStore } from '../src/store/alarmStore';
import { DayOfWeek, Note } from '../src/domain/entities/alarm';
import { AIService } from '../src/services/aiService';

const DAYS: DayOfWeek[] = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

export default function CreateAlarmScreen() {
  const router = useRouter();
  const addAlarm = useAlarmStore((state) => state.addAlarm);

  const [time, setTime] = useState('07:00');
  const [period, setPeriod] = useState<'AM' | 'PM'>('AM');
  const [title, setTitle] = useState('');
  const [selectedDays, setSelectedDays] = useState<DayOfWeek[]>(['L', 'M', 'X', 'J', 'V']);
  const [rawNoteText, setRawNoteText] = useState('');
  const [optimizedNotes, setOptimizedNotes] = useState<Note[]>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);

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
      setOptimizedNotes(result);
      setRawNoteText('');
    } catch {
      alert('Error al conectar con la IA. Revisa tu consola para mas detalles.');
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleSave = () => {
    const newAlarm = {
      id: Date.now().toString(),
      time,
      period,
      title: title.trim() || 'Alarma',
      isActive: true,
      days: selectedDays,
      notes: optimizedNotes,
    };

    addAlarm(newAlarm);
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Nueva Alarma</Text>
        <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Cerrar">
          <MaterialCommunityIcons name="close" size={28} color={Colors.textMuted} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        <View style={styles.timeSection}>
          <TextInput
            style={styles.timeInput}
            value={time}
            onChangeText={setTime}
            keyboardType="numeric"
            maxLength={5}
          />
          <View style={styles.periodSelector}>
            <TouchableOpacity
              style={[styles.periodBtn, period === 'AM' && styles.periodBtnActive]}
              onPress={() => setPeriod('AM')}
            >
              <Text style={[styles.periodText, period === 'AM' && styles.periodTextActive]}>AM</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.periodBtn, period === 'PM' && styles.periodBtnActive]}
              onPress={() => setPeriod('PM')}
            >
              <Text style={[styles.periodText, period === 'PM' && styles.periodTextActive]}>PM</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputSection}>
          <Text style={styles.label}>Nombre de la alarma</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Ej: Entrenamiento, Despertar..."
            placeholderTextColor={Colors.textMuted}
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <View style={styles.inputSection}>
          <Text style={styles.label}>Repetir</Text>
          <View style={styles.daysContainer}>
            {DAYS.map((day) => {
              const isSelected = selectedDays.includes(day);
              return (
                <TouchableOpacity
                  key={day}
                  style={[styles.dayCircle, isSelected && styles.dayCircleActive]}
                  onPress={() => toggleDay(day)}
                >
                  <Text style={[styles.dayText, isSelected && styles.dayTextActive]}>
                    {day}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.aiSection}>
          <View style={styles.aiHeader}>
            <MaterialCommunityIcons name="robot-outline" size={20} color={Colors.primary} />
            <Text style={styles.aiTitle}>Asistente de Notas (IA)</Text>
          </View>

          <TextInput
            style={[styles.textInput, styles.textArea]}
            placeholder="Escribe todo lo que tienes que hacer. La IA lo ordenara por ti..."
            placeholderTextColor={Colors.textMuted}
            value={rawNoteText}
            onChangeText={setRawNoteText}
            multiline
            numberOfLines={3}
          />

          <TouchableOpacity
            style={[styles.aiButton, isOptimizing && styles.aiButtonDisabled]}
            onPress={handleOptimize}
            disabled={isOptimizing || !rawNoteText.trim()}
          >
            {isOptimizing ? (
              <ActivityIndicator color={Colors.black} size="small" />
            ) : (
              <>
                <MaterialCommunityIcons name="creation" size={20} color={Colors.black} />
                <Text style={styles.aiButtonText}>Optimizar con IA</Text>
              </>
            )}
          </TouchableOpacity>

          {optimizedNotes.length > 0 && (
            <View style={styles.generatedNotes}>
              <Text style={styles.label}>Notas Optimizadas:</Text>
              {optimizedNotes.map((note) => (
                <View key={note.id} style={styles.noteItem}>
                  <Text style={styles.noteEmoji}>{note.emoji}</Text>
                  <Text style={styles.noteText}>{note.text}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Guardar Alarma</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
  },
  scrollContent: {
    paddingBottom: Spacing.xxl,
  },
  timeSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
    gap: Spacing.md,
  },
  timeInput: {
    fontSize: 64,
    fontWeight: 'bold',
    color: Colors.primary,
    borderBottomWidth: 2,
    borderBottomColor: Colors.primaryDull,
    paddingHorizontal: Spacing.md,
  },
  periodSelector: {
    backgroundColor: Colors.surfaceLight,
    borderRadius: 12,
    overflow: 'hidden',
  },
  periodBtn: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  periodBtnActive: {
    backgroundColor: Colors.primary,
  },
  periodText: {
    color: Colors.textMuted,
    fontSize: 16,
    fontWeight: 'bold',
  },
  periodTextActive: {
    color: Colors.black,
  },
  inputSection: {
    marginBottom: Spacing.xl,
  },
  label: {
    color: Colors.textSecondary,
    fontSize: 16,
    marginBottom: Spacing.sm,
    fontWeight: '500',
  },
  textInput: {
    backgroundColor: Colors.surfaceLight,
    color: Colors.text,
    fontSize: 16,
    padding: Spacing.md,
    borderRadius: 12,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.sm,
  },
  dayCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.surfaceLight,
  },
  dayCircleActive: {
    backgroundColor: 'rgba(0, 229, 204, 0.2)',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  dayText: {
    color: Colors.textMuted,
    fontSize: 14,
    fontWeight: 'bold',
  },
  dayTextActive: {
    color: Colors.primary,
  },
  aiSection: {
    backgroundColor: 'rgba(0, 229, 204, 0.05)',
    padding: Spacing.md,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 204, 0.2)',
    marginBottom: Spacing.xl,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  aiTitle: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  aiButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.md,
    borderRadius: 12,
    marginTop: Spacing.md,
    gap: Spacing.sm,
  },
  aiButtonDisabled: {
    opacity: 0.5,
  },
  aiButtonText: {
    color: Colors.black,
    fontSize: 16,
    fontWeight: 'bold',
  },
  generatedNotes: {
    marginTop: Spacing.lg,
  },
  noteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceLight,
    padding: Spacing.md,
    borderRadius: 8,
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  noteEmoji: {
    fontSize: 20,
  },
  noteText: {
    color: Colors.text,
    fontSize: 16,
  },
  footer: {
    marginTop: 'auto',
    marginBottom: Spacing.lg,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    padding: Spacing.lg,
    borderRadius: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    color: Colors.black,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
