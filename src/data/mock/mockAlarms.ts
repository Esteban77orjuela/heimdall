import type { Alarm } from '../../domain/entities/alarm';

export const MOCK_ALARMS: Alarm[] = [
  {
    id: '1',
    time: '06:30',
    period: 'AM',
    title: 'Entrenamiento Matutino',
    isActive: true,
    days: ['L', 'M', 'X', 'J', 'V'],
    notes: [
      { id: 'n1', text: 'Tomar pre-entreno', completed: false, emoji: '🥤', priority: 'medium' },
      { id: 'n2', text: 'Día de pierna', completed: false, emoji: '🦵', priority: 'high' },
    ],
  },
  {
    id: '2',
    time: '08:45',
    period: 'AM',
    title: 'Reunión Daily (Zoom)',
    isActive: true,
    days: ['L', 'M', 'X', 'J', 'V'],
    notes: [
      { id: 'n3', text: 'Revisar métricas de ayer', completed: true, emoji: '📊', priority: 'medium' },
      { id: 'n4', text: 'Mencionar el bloqueo con la API', completed: false, emoji: '⚠️', priority: 'high' },
    ],
  },
  {
    id: '3',
    time: '10:00',
    period: 'PM',
    title: 'Rutina de Noche',
    isActive: false,
    days: [],
    notes: [
      { id: 'n5', text: 'Leer 20 páginas', completed: false, emoji: '📚', priority: 'low' },
      { id: 'n6', text: 'Meditar 10 min', completed: false, emoji: '🧘', priority: 'medium' },
    ],
  },
];
