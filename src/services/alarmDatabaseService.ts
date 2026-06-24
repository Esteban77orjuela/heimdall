import { Query } from 'appwrite';
import { databases, DB_ID, ALARMS_COLLECTION_ID } from './appwriteConfig';
import { Alarm } from '../domain/entities/alarm';

export const AlarmDatabaseService = {
  async syncAlarms(userId: string, alarms: Alarm[]): Promise<void> {
    for (const alarm of alarms) {
      await this.upsertAlarm(userId, alarm);
    }
  },

  async upsertAlarm(userId: string, alarm: Alarm): Promise<void> {
    const data = {
      userId,
      time: alarm.time,
      period: alarm.period,
      title: alarm.title,
      isActive: alarm.isActive,
      days: JSON.stringify(alarm.days),
      notes: JSON.stringify(alarm.notes),
    };

    try {
      await databases.updateDocument(DB_ID, ALARMS_COLLECTION_ID, alarm.id, data);
    } catch {
      await databases.createDocument(DB_ID, ALARMS_COLLECTION_ID, alarm.id, data);
    }
  },

  async getAlarms(userId: string): Promise<Alarm[]> {
    const response = await databases.listDocuments(DB_ID, ALARMS_COLLECTION_ID, [
      Query.equal('userId', userId),
      Query.orderDesc('$createdAt'),
    ]);

    return response.documents.map((doc: any) => ({
      id: doc.$id,
      time: doc.time,
      period: doc.period,
      title: doc.title,
      isActive: doc.isActive,
      days: JSON.parse(doc.days || '[]'),
      notes: JSON.parse(doc.notes || '[]'),
    }));
  },

  async deleteAlarm(alarmId: string): Promise<void> {
    try {
      await databases.deleteDocument(DB_ID, ALARMS_COLLECTION_ID, alarmId);
    } catch {
      console.warn(`[DB] Alarma ${alarmId} no encontrada en la nube.`);
    }
  },
};
