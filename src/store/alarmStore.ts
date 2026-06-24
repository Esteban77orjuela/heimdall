import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alarm, Note } from '../domain/entities/alarm';
import { NotificationService } from '../services/notificationService';
import { AlarmDatabaseService } from '../services/alarmDatabaseService';

interface AlarmState {
  alarms: Alarm[];
  isSyncing: boolean;
  addAlarm: (alarm: Alarm, userId?: string) => void;
  toggleAlarm: (id: string, userId?: string) => void;
  deleteAlarm: (id: string) => void;
  updateAlarm: (id: string, updatedAlarm: Partial<Alarm>, userId?: string) => void;
  toggleNote: (alarmId: string, noteId: string) => void;
  addNoteToAlarm: (alarmId: string, note: Note) => void;
  loadFromCloud: (userId: string) => Promise<void>;
  syncToCloud: (userId: string) => Promise<void>;
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
      isSyncing: false,

      addAlarm: (alarm, userId) => {
        set((state) => ({ alarms: [alarm, ...state.alarms] }));
        if (alarm.isActive) NotificationService.scheduleAlarm(alarm);
        if (userId) {
          AlarmDatabaseService.upsertAlarm(userId, alarm).catch(console.error);
        }
      },

      toggleAlarm: (id, userId) => {
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
          if (userId) {
            AlarmDatabaseService.upsertAlarm(userId, updatedAlarm).catch(console.error);
          }
        }
      },

      deleteAlarm: (id) => {
        set((state) => ({
          alarms: state.alarms.filter((alarm) => alarm.id !== id),
        }));
        NotificationService.cancelAlarm(id);
        AlarmDatabaseService.deleteAlarm(id).catch(console.error);
      },

      updateAlarm: (id, updatedFields, userId) => {
        set((state) => ({
          alarms: state.alarms.map((alarm) =>
            alarm.id === id ? { ...alarm, ...updatedFields } : alarm
          ),
        }));
        const updatedAlarm = get().alarms.find((a) => a.id === id);
        if (updatedAlarm) {
          if (updatedAlarm.isActive) NotificationService.scheduleAlarm(updatedAlarm);
          if (userId) {
            AlarmDatabaseService.upsertAlarm(userId, updatedAlarm).catch(console.error);
          }
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

      loadFromCloud: async (userId) => {
        set({ isSyncing: true });
        try {
          const cloudAlarms = await AlarmDatabaseService.getAlarms(userId);
          if (cloudAlarms.length > 0) {
            set({ alarms: cloudAlarms });
          }
        } catch (error) {
          console.error('[AlarmStore] Error cargando desde la nube:', error);
        } finally {
          set({ isSyncing: false });
        }
      },

      syncToCloud: async (userId) => {
        set({ isSyncing: true });
        try {
          const { alarms } = get();
          await AlarmDatabaseService.syncAlarms(userId, alarms);
        } catch (error) {
          console.error('[AlarmStore] Error sincronizando con la nube:', error);
        } finally {
          set({ isSyncing: false });
        }
      },
    }),
    {
      name: 'heimdall-alarm-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
