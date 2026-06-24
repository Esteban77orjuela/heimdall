import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alarm, Note } from '../domain/entities/alarm';
import { NotificationService } from '../services/notificationService';

interface AlarmState {
  alarms: Alarm[];
  addAlarm: (alarm: Alarm) => void;
  toggleAlarm: (id: string) => void;
  deleteAlarm: (id: string) => void;
  updateAlarm: (id: string, updatedAlarm: Partial<Alarm>) => void;
  toggleNote: (alarmId: string, noteId: string) => void;
  addNoteToAlarm: (alarmId: string, note: Note) => void;
}

const INITIAL_ALARMS: Alarm[] = [
  {
    id: '1',
    time: '06:30',
    period: 'AM',
    title: 'Entrenamiento Matutino',
    isActive: true,
    days: ['L', 'M', 'X', 'J', 'V'],
    notes: [
      { id: 'n1', text: 'Tomar pre-entreno', completed: false, emoji: '\u{1F944}', priority: 'medium' },
      { id: 'n2', text: 'Dia de pierna', completed: false, emoji: '\u{1F9B5}', priority: 'high' },
    ]
  }
];

export const useAlarmStore = create<AlarmState>()(
  persist(
    (set, get) => ({
      alarms: INITIAL_ALARMS,

      addAlarm: (alarm) => {
        set((state) => ({ alarms: [alarm, ...state.alarms] }));
        if (alarm.isActive) NotificationService.scheduleAlarm(alarm);
      },

      toggleAlarm: (id) => {
        set((state) => ({
          alarms: state.alarms.map((alarm) =>
            alarm.id === id ? { ...alarm, isActive: !alarm.isActive } : alarm
          ),
        }));
        const updatedAlarm = get().alarms.find((a) => a.id === id);
        if (updatedAlarm) {
          if (updatedAlarm.isActive) {
            NotificationService.scheduleAlarm(updatedAlarm);
          } else {
            NotificationService.cancelAlarm(id);
          }
        }
      },

      deleteAlarm: (id) => {
        set((state) => ({
          alarms: state.alarms.filter((alarm) => alarm.id !== id),
        }));
        NotificationService.cancelAlarm(id);
      },

      updateAlarm: (id, updatedFields) => {
        set((state) => ({
          alarms: state.alarms.map((alarm) =>
            alarm.id === id ? { ...alarm, ...updatedFields } : alarm
          ),
        }));
        const updatedAlarm = get().alarms.find((a) => a.id === id);
        if (updatedAlarm && updatedAlarm.isActive) {
          NotificationService.scheduleAlarm(updatedAlarm);
        }
      },

      toggleNote: (alarmId, noteId) =>
        set((state) => ({
          alarms: state.alarms.map((alarm) => {
            if (alarm.id !== alarmId) return alarm;
            return {
              ...alarm,
              notes: alarm.notes.map((note) =>
                note.id === noteId ? { ...note, completed: !note.completed } : note
              ),
            };
          }),
        })),

      addNoteToAlarm: (alarmId, note) =>
        set((state) => ({
          alarms: state.alarms.map((alarm) =>
            alarm.id === alarmId ? { ...alarm, notes: [...alarm.notes, note] } : alarm
          ),
        })),
    }),
    {
      name: 'heimdall-alarm-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
