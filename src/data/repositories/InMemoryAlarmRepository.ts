import type { Alarm } from '../../domain/entities/alarm';
import type { IAlarmRepository } from '../../domain/repositories/IAlarmRepository';
import { MOCK_ALARMS } from '../mock/mockAlarms';

export class InMemoryAlarmRepository implements IAlarmRepository {
  private alarms: Alarm[];

  constructor(initialAlarms: Alarm[] = MOCK_ALARMS) {
    this.alarms = initialAlarms.map((alarm) => ({ ...alarm, notes: [...alarm.notes] }));
  }

  async getAll(): Promise<Alarm[]> {
    return this.alarms.map((alarm) => ({ ...alarm, notes: [...alarm.notes] }));
  }

  async toggleActive(id: string): Promise<Alarm[]> {
    this.alarms = this.alarms.map((alarm) =>
      alarm.id === id ? { ...alarm, isActive: !alarm.isActive } : alarm,
    );
    return this.getAll();
  }
}
