import React from 'react';
import { render } from '@testing-library/react-native';
import AlarmCard from '../index';
import { Alarm } from '../../../domain/entities/alarm';

const mockAlarm: Alarm = {
  id: '1',
  time: '06:30',
  period: 'AM',
  title: 'Test Alarm',
  isActive: true,
  days: ['L', 'M'],
  notes: [
    { id: 'n1', text: 'Note 1', completed: false, emoji: '⚡', priority: 'medium' }
  ]
};

describe('AlarmCard', () => {
  it('renders the alarm time and title correctly', () => {
    const { getByText } = render(
      <AlarmCard alarm={mockAlarm} onToggle={() => {}} />
    );

    expect(getByText('06:30')).toBeTruthy();
    expect(getByText('AM')).toBeTruthy();
    expect(getByText('Test Alarm')).toBeTruthy();
  });

  it('renders the alarm notes', () => {
    const { getByText } = render(
      <AlarmCard alarm={mockAlarm} onToggle={() => {}} />
    );

    expect(getByText('Note 1')).toBeTruthy();
    expect(getByText('⚡')).toBeTruthy();
  });
});
