export type DayOfWeek = 'L' | 'M' | 'X' | 'J' | 'V' | 'S' | 'D';

export type Priority = 'low' | 'medium' | 'high';

export interface Note {
  id: string;
  text: string;
  completed: boolean;
  emoji: string;
  priority: Priority;
}

export interface Alarm {
  id: string;
  time: string;
  period: 'AM' | 'PM';
  title: string;
  isActive: boolean;
  days: DayOfWeek[];
  notes: Note[];
}
