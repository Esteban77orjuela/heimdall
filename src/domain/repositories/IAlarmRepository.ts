import type { Alarm } from '../entities/alarm';

export interface IAlarmRepository {
  getAll(): Promise<Alarm[]>;
  toggleActive(id: string): Promise<Alarm[]>;
}
